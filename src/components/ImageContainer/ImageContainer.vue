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
        :disabled="cropperStore.isResetHistoryDisabled"
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

  import { useCropperStore } from "@stores/cropper.ts";

  defineOptions({ name: "ImageContainer" });

  const cropperStore = useCropperStore();

  const cropper = ref();
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
    cropper.value?.destroy();

    cropper.value = new Cropper(imageRef.value!, {
      container: ".image-container__canvas",
    });
  }

  async function cropImage() {
    const selection =
      cropper.value.container.querySelector("cropper-selection");

    const canvas = await selection.$toCanvas();

    const imageBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    if (!imageBlob) return;

    cropperStore.addToHistory(imageBlob);

    initCropper();
  }

  function resetAction() {
    cropperStore.resetHistory();
  }

  function undoAction() {
    cropperStore.undoAction();
  }

  function redoAction() {
    cropperStore.redoAction();
  }
</script>

<style scoped lang="scss" src="./ImageContainer.scss" />
