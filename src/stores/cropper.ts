import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useCropperStore = defineStore("cropper", () => {
  const currentImage = ref<Blob | null>(null);
  const imageHistory = ref<Blob[]>([]);

  const currentImageSrc = computed(() =>
    currentImage.value ? URL.createObjectURL(currentImage.value) : "",
  );
  const isImageHistoryEmpty = computed(() => imageHistory.value.length === 0);
  const isImageHistoryHasTwoItems = computed(
    () => imageHistory.value.length >= 2,
  );
  const currentImageIndex = computed(() =>
    imageHistory.value.findIndex((item) => item === currentImage.value),
  );
  const isResetHistoryDisabled = computed(
    () => !isImageHistoryHasTwoItems.value,
  );
  const isUndoActionDisabled = computed(
    () =>
      !isImageHistoryHasTwoItems.value ||
      currentImage.value === imageHistory.value[0],
  );
  const isRedoActionDisabled = computed(
    () =>
      !isImageHistoryHasTwoItems.value ||
      currentImage.value === imageHistory.value[imageHistory.value.length - 1],
  );

  function addToHistory(blob: Blob) {
    if (currentImageIndex.value !== imageHistory.value.length - 1) {
      imageHistory.value.splice(currentImageIndex.value + 1);
    }

    imageHistory.value.push(blob);
    currentImage.value = blob;
  }

  function resetHistory() {
    if (isResetHistoryDisabled.value) {
      return;
    }

    imageHistory.value.splice(1);
    currentImage.value = imageHistory.value[0];
  }

  function undoAction() {
    if (isUndoActionDisabled.value) {
      return;
    }

    currentImage.value = imageHistory.value[currentImageIndex.value - 1];
  }

  function redoAction() {
    if (isRedoActionDisabled.value) {
      return;
    }

    currentImage.value = imageHistory.value[currentImageIndex.value + 1];
  }

  return {
    currentImage,
    imageHistory,
    currentImageSrc,
    isImageHistoryEmpty,
    isImageHistoryHasTwoItems,
    isResetHistoryDisabled,
    isUndoActionDisabled,
    isRedoActionDisabled,
    addToHistory,
    resetHistory,
    undoAction,
    redoAction,
  };
});
