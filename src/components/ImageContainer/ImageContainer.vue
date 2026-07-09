<template>
  <div class="image-container">
    <div class="image-container__canvas">
      <img ref="imageRef" :src="cropperStore.currentImageSrc" />
    </div>

    <v-container>
      <v-btn
        color="primary"
        :disabled="cropperStore.isImageHistoryEmpty"
        @click="cropImage"
      >
        Crop
      </v-btn>

      <v-btn
        color="warning"
        :disabled="cropperStore.isResetActionsDisabled"
        @click="resetAction"
      >
        Reset
      </v-btn>

      <v-btn
        color="secondary"
        :disabled="cropperStore.isUndoActionDisabled"
        @click="undoAction"
      >
        Undo
      </v-btn>

      <v-btn
        color="secondary"
        :disabled="cropperStore.isRedoActionDisabled"
        @click="redoAction"
      >
        Redo
      </v-btn>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from "vue";

  import Cropper from "cropperjs";

  import { useCropperStore } from "@stores/cropper";

  defineOptions({ name: "ImageContainer" });

  const cropperStore = useCropperStore();

  const imageRef = ref<HTMLImageElement>();

  watch(
    () => cropperStore.currentImageSrc,
    () => {
      if (!cropperStore.currentImageSrc) return;

      imageRef.value!.onload = () => {
        initCropper();
      };
    },
  );

  onMounted(() => {
    initCropper();
  });

  function initCropper() {
    cropperStore.cropperInstance?.destroy();

    cropperStore.cropperInstance = new Cropper(imageRef.value!, {
      container: ".image-container__canvas",
    });
  }

  async function cropImage() {
    const selection =
      cropperStore.cropperInstance.container.querySelector("cropper-selection");

    const canvas = await selection.$toCanvas();

    const imageBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    if (!imageBlob) return;

    const imageItem = {
      id: cropperStore.imageHistory.length,
      blob: imageBlob,
      filters: { ...cropperStore.previewImageFilters },
    };

    cropperStore.addToHistory(imageItem);

    initCropper();
  }

  function resetAction() {
    cropperStore.resetActions();
  }

  function undoAction() {
    cropperStore.undoAction();
  }

  function redoAction() {
    cropperStore.redoAction();
  }
</script>

<style scoped lang="scss" src="./ImageContainer.scss" />
