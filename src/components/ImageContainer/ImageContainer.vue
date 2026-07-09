<template>
  <div class="image-container">
    <div ref="imageContainerRef" class="image-container__canvas">
      <img ref="imageRef" :src="cropperStore.currentImageSrc" />
    </div>

    <v-container>
      <v-btn
        color="primary"
        :disabled="cropperStore.isImageHistoryEmpty"
        @click="applyCrop"
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

  import useCropper from "@composables/useCropper";

  import { useCropperStore } from "@stores/cropper";

  defineOptions({ name: "ImageContainer" });

  const { initCropper, cropImage } = useCropper();
  const cropperStore = useCropperStore();

  const imageRef = ref<HTMLImageElement>();
  const imageContainerRef = ref<HTMLElement>();

  watch(
    () => cropperStore.currentImageSrc,
    () => {
      if (!cropperStore.currentImageSrc) return;

      imageRef.value!.onload = () => {
        initCropper({
          imageRef: imageRef.value!,
          imageContainerClassName: imageContainerRef.value!.className,
        });
      };
    },
  );

  onMounted(() => {
    console.log(imageContainerRef.value!.className);
    initCropper({
      imageRef: imageRef.value!,
      imageContainerClassName: imageContainerRef.value!.className,
    });
  });

  function applyCrop() {
    cropImage({
      imageRef: imageRef.value!,
      imageContainerClassName: imageContainerRef.value!.className,
    });
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
