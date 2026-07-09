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
      >Reset Filters</v-btn
    >
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from "vue";

  import { useCropperStore } from "@stores/cropper";
  import { deepEqual } from "@helpers/utils/helpers.util";

  defineOptions({ name: "ImageFilters" });

  const cropperStore = useCropperStore();

  const isApplyingFiltersDisabled = computed(() => {
    if (!cropperStore.currentImage) return true;

    return deepEqual(
      cropperStore.currentImage.filters,
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

  function applyFilters() {
    if (!cropperStore.currentImage) return;

    const imageItem = {
      id: cropperStore.imageHistory.length,
      blob: cropperStore.currentImage.blob,
      filters: { ...cropperStore.previewImageFilters },
    };

    cropperStore.addToHistory(imageItem);
  }

  function resetFilters() {
    cropperStore.resetFilters();
  }
</script>

<style scoped lang="scss" src="./ImageFilters.scss" />
