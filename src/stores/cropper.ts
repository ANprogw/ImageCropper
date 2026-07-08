import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
}

// interface ImageItem {
//   id: number;
//   blob: Blob;
//   filters: ImageFilters;
// }

export const useCropperStore = defineStore("cropper", () => {
  const cropperInstance = ref();

  const currentImage = ref<Blob | null>(null);
  const imageHistory = ref<Blob[]>([]);
  const previewImageFilters = ref<ImageFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });

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

  function resetFilters() {
    previewImageFilters.value = {
      brightness: 100,
      contrast: 100,
      saturation: 100,
    };
  }

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

    currentImage.value = imageHistory.value[0];
    imageHistory.value.splice(1);
    resetFilters();
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
    cropperInstance,
    currentImage,
    imageHistory,
    previewImageFilters,
    currentImageSrc,
    isImageHistoryEmpty,
    isImageHistoryHasTwoItems,
    isResetHistoryDisabled,
    isUndoActionDisabled,
    isRedoActionDisabled,
    resetFilters,
    addToHistory,
    resetHistory,
    undoAction,
    redoAction,
  };
});
