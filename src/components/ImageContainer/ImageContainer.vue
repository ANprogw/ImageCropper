<template>
  <v-container class="image-container">
    <v-row>
      <v-col col="12">
        <div ref="imageContainerRef" class="image-container__canvas">
          <img ref="imageRef" :src="cropperStore.currentImageSrc" />
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col col="3">
        <v-btn
          block
          color="primary"
          size="large"
          :disabled="cropperStore.isImageHistoryEmpty"
          @click="applyCrop"
        >
          Crop
        </v-btn>
      </v-col>

      <v-col col="3">
        <v-btn
          block
          color="warning"
          size="large"
          :disabled="cropperStore.isResetActionsDisabled"
          @click="resetAction"
        >
          Reset
        </v-btn>
      </v-col>

      <v-col col="3">
        <v-btn
          block
          color="secondary"
          size="large"
          :disabled="cropperStore.isUndoActionDisabled"
          @click="undoAction"
        >
          Undo
        </v-btn>
      </v-col>

      <v-col col="3">
        <v-btn
          block
          color="secondary"
          size="large"
          :disabled="cropperStore.isRedoActionDisabled"
          @click="redoAction"
        >
          Redo
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
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
