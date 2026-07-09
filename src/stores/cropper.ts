import { defineStore } from "pinia";
import { ref, computed } from "vue";

import type { IImageFilters, IImageItem } from "@/types/image";

const defaultImageFilters: IImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

export const useCropperStore = defineStore("cropper", () => {
  const currentImage = ref<IImageItem | null>(null);
  const imageHistory = ref<IImageItem[]>([]);
  const previewImageFilters = ref<IImageFilters>({ ...defaultImageFilters });

  const currentImageSrc = computed(() =>
    currentImage.value?.blob
      ? URL.createObjectURL(currentImage.value.blob)
      : "",
  );
  const currentImageIndex = computed(() =>
    imageHistory.value.findIndex((item) => item === currentImage.value),
  );
  const isImageHistoryEmpty = computed(() => imageHistory.value.length === 0);
  const isImageHistoryHasTwoItems = computed(
    () => imageHistory.value.length >= 2,
  );
  const isResetActionsDisabled = computed(
    () => !isImageHistoryHasTwoItems.value,
  );
  const isUndoActionDisabled = computed(
    () =>
      !isImageHistoryHasTwoItems.value ||
      currentImage.value?.id === imageHistory.value[0].id,
  );
  const isRedoActionDisabled = computed(
    () =>
      !isImageHistoryHasTwoItems.value ||
      currentImage.value?.id ===
        imageHistory.value[imageHistory.value.length - 1].id,
  );

  function addToHistory(item: IImageItem) {
    if (currentImageIndex.value !== imageHistory.value.length - 1) {
      imageHistory.value.splice(currentImageIndex.value + 1);
    }

    imageHistory.value.push(item);
    currentImage.value = item;
  }

  function clearHistory() {
    currentImage.value = null;
    imageHistory.value = [];
    resetFilters();
  }

  function resetFilters() {
    previewImageFilters.value = { ...defaultImageFilters };
  }

  function resetActions() {
    if (isResetActionsDisabled.value) {
      return;
    }

    currentImage.value = imageHistory.value[0];
    imageHistory.value.splice(1);
    resetFilters();
  }

  function undoAction() {
    if (isUndoActionDisabled.value) {
      return;
    }

    const newCurrentImage = imageHistory.value[currentImageIndex.value - 1];
    const newPreviewImageFilters = currentImage.value!.filters;

    currentImage.value = newCurrentImage;
    previewImageFilters.value = newPreviewImageFilters;
  }

  function redoAction() {
    if (isRedoActionDisabled.value) {
      return;
    }

    const newCurrentImage = imageHistory.value[currentImageIndex.value + 1];
    const newPreviewImageFilters = imageHistory.value[
      currentImageIndex.value + 2
    ]?.filters || { ...defaultImageFilters };

    currentImage.value = newCurrentImage;
    previewImageFilters.value = newPreviewImageFilters;
  }

  return {
    currentImage,
    imageHistory,
    defaultImageFilters,
    previewImageFilters,
    currentImageSrc,
    isImageHistoryEmpty,
    isImageHistoryHasTwoItems,
    isResetActionsDisabled,
    isUndoActionDisabled,
    isRedoActionDisabled,
    addToHistory,
    clearHistory,
    resetFilters,
    resetActions,
    undoAction,
    redoAction,
  };
});
