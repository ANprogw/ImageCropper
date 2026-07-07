<template>
  <div class="image-cropper">
    <v-container>
      <ImageContainer />

      <v-slider />
      <v-slider />
      <v-slider />

      <v-container>
        <v-btn color="secondary" @click="undoAction">Undo</v-btn>
        <v-btn color="secondary" @click="redoAction">Redo</v-btn>
      </v-container>

      <v-container>
        <v-btn color="primary" @click="importImage">Choose image</v-btn>
        <v-btn color="secondary" @click="exportImage">Download</v-btn>
      </v-container>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import ImageContainer from "../ImageContainer/ImageContainer.vue";

  defineOptions({ name: "ImageCropper" });

  function undoAction() {}

  function redoAction() {}

  function importImage() {}

  function exportImage() {}
</script>

<style scoped lang="scss" src="./ImageCropper.scss" />
