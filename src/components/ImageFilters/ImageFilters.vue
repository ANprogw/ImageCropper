<template>
  <div class="image-filters">
    <v-slider
      v-model="cropperStore.previewImageFilters.brightness"
      label="Brightness"
      :step="1"
      :max="200"
      thumb-label
    />

    <v-slider
      v-model="cropperStore.previewImageFilters.contrast"
      label="Contrast"
      :step="1"
      :max="200"
      thumb-label
    />

    <v-slider
      v-model="cropperStore.previewImageFilters.saturation"
      label="Saturation"
      :step="1"
      :max="200"
      thumb-label
    />

    <v-btn
      color="primary"
      :disabled="isApplyingFiltersDisabled"
      @click="applyFilters"
    >
      Apply Filters
    </v-btn>

    <v-btn
      color="secondary"
      :disabled="isResettingFiltersDisabled"
      @click="resetFilters"
    >
      Reset Filters
    </v-btn>
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from "vue";

  import type { IImageFilters } from "@/types/image";

  import { useCropperStore } from "@stores/cropper";
  import { deepEqual } from "@helpers/utils/helpers.util";

  defineOptions({ name: "ImageFilters" });

  const cropperStore = useCropperStore();

  const isApplyingFiltersDisabled = computed(() => {
    if (!cropperStore.currentImage) return true;

    return deepEqual(
      cropperStore.defaultImageFilters,
      cropperStore.previewImageFilters,
    );
  });

  const isResettingFiltersDisabled = computed(() => {
    return deepEqual(
      cropperStore.defaultImageFilters,
      cropperStore.previewImageFilters,
    );
  });

  watch(
    [
      () => cropperStore.previewImageFilters.brightness,
      () => cropperStore.previewImageFilters.contrast,
      () => cropperStore.previewImageFilters.saturation,
      () => cropperStore.cropperInstance,
    ],
    () => {
      previewFilters();
    },
  );

  function previewFilters() {
    const img =
      cropperStore.cropperInstance.container.querySelector("cropper-image");

    if (img) {
      img.style.filter = `
        brightness(${cropperStore.previewImageFilters.brightness}%)
        contrast(${cropperStore.previewImageFilters.contrast}%)
        saturate(${cropperStore.previewImageFilters.saturation}%)
      `;
    }
  }

  async function generateFilteredBlob(
    blob: Blob,
    filters: IImageFilters,
  ): Promise<Blob | null> {
    const imageUrl = URL.createObjectURL(blob);

    try {
      const img = new Image();
      img.src = imageUrl;

      await img.decode();

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      if (!ctx) return null;

      ctx.filter = `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturation}%)
      `;

      ctx.drawImage(img, 0, 0);

      return await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  }

  async function applyFilters() {
    if (!cropperStore.currentImage?.blob) return;

    const filteredBlob = await generateFilteredBlob(
      cropperStore.currentImage.blob,
      cropperStore.previewImageFilters,
    );

    const imageItem = {
      id: cropperStore.imageHistory.length,
      blob: filteredBlob,
      filters: { ...cropperStore.previewImageFilters },
    };

    cropperStore.addToHistory(imageItem);
    resetFilters();
  }

  function resetFilters() {
    cropperStore.resetFilters();
  }
</script>

<style scoped lang="scss" src="./ImageFilters.scss" />
