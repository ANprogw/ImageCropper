<template>
  <div class="image-cropper">
    <v-container>
      <ImageContainer />
      <ImageFilters />

      <v-container>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          hidden
          @change="uploadImage"
        />

        <v-btn color="primary" @click="openFilePicker">Choose image</v-btn>
        <v-btn
          color="primary"
          :disabled="!cropperStore.currentImage"
          @click="downloadImage"
        >
          Download
        </v-btn>
      </v-container>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  import { useCropperStore } from "@stores/cropper";

  import ImageContainer from "@components/ImageContainer/ImageContainer.vue";
  import ImageFilters from "@components/ImageFilters/ImageFilters.vue";

  defineOptions({ name: "ImageCropper" });

  const cropperStore = useCropperStore();

  const fileInput = ref<HTMLInputElement>();

  function openFilePicker() {
    fileInput.value?.click();
  }

  function uploadImage(event: Event) {
    cropperStore.clearHistory();

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const imageBlob = input.files[0];

    const imageItem = {
      id: 0,
      blob: imageBlob,
      filters: { ...cropperStore.previewImageFilters },
    };

    cropperStore.addToHistory(imageItem);
  }

  async function downloadImage() {
    if (!cropperStore.currentImage?.blob) return;

    const url = URL.createObjectURL(cropperStore.currentImage.blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "edited-image.png";
    a.click();

    URL.revokeObjectURL(url);
  }
</script>

<style scoped lang="scss" src="./ImageCropper.scss" />
