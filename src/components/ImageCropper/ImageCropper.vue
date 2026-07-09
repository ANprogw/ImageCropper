<template>
  <v-container class="image-cropper">
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      hidden
      @change="uploadImage"
    />

    <v-row>
      <v-col>
        <v-btn block color="primary" size="x-large" @click="openFilePicker">
          Choose image
        </v-btn>
      </v-col>

      <v-col>
        <v-btn
          block
          color="primary"
          size="x-large"
          :disabled="!cropperStore.currentImage"
          @click="downloadImage"
        >
          Download
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="8">
        <ImageContainer />
      </v-col>

      <v-col cols="4">
        <ImageFilters />
      </v-col>
    </v-row>
  </v-container>
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
