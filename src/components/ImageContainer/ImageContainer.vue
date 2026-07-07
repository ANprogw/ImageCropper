<template>
  <div class="image-container">
    <div class="image-container__canvas">
      <img ref="imageRef" :src="imageSrc" />
    </div>

    <v-container>
      <v-btn color="primary" @click="cropImage">Crop</v-btn>
      <v-btn color="primary" @click="openFilePicker"> Upload </v-btn>
      <v-btn color="primary" :disabled="!theBlob" @click="download">
        Download
      </v-btn>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        hidden
        @change="uploadImage"
      />
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from "vue";

  import Cropper from "cropperjs";

  defineOptions({ name: "ImageContainer" });

  const cropper = ref();
  const theBlob = ref<Blob | null>(null);
  const imageSrc = ref<string>("");
  const imageRef = ref<HTMLImageElement>();

  watch(imageSrc, () => {
    if (!imageSrc.value) return;

    imageRef.value!.onload = () => {
      initCropper();
    };
  });

  onMounted(() => {
    initCropper();
  });

  const fileInput = ref<HTMLInputElement>();

  function openFilePicker() {
    fileInput.value?.click();
  }

  function uploadImage(event: Event) {
    let objectUrl: string | null = null;
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }

    objectUrl = URL.createObjectURL(file);

    console.log("objectUrl", objectUrl);

    imageSrc.value = objectUrl;
  }

  function download() {
    if (!theBlob.value) return;

    const url = URL.createObjectURL(theBlob.value);

    const a = document.createElement("a");
    a.href = url;
    a.download = "cropped-image.png";
    a.click();

    URL.revokeObjectURL(url);
  }

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

    theBlob.value = await new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    if (!theBlob.value) return;

    await (imageSrc.value = URL.createObjectURL(theBlob.value));

    initCropper();
  }
</script>

<style scoped lang="scss" src="./ImageContainer.scss" />
