import Cropper, { CropperSelection, CropperImage } from "cropperjs";
import { shallowRef } from "vue";

import { useCropperStore } from "@stores/cropper";

const cropperInstance = shallowRef<Cropper | null>(null);

export default function useCropper() {
  const cropperStore = useCropperStore();

  const getCropperImage = () => {
    return cropperInstance.value!.container.querySelector<CropperImage>(
      "cropper-image",
    );
  };

  const initCropper = ({
    imageRef,
    imageContainerClassName,
  }: {
    imageRef: HTMLImageElement;
    imageContainerClassName: string;
  }) => {
    cropperInstance.value?.destroy();

    cropperInstance.value = new Cropper(imageRef, {
      container: `.${imageContainerClassName}`,
    });
  };

  async function cropImage({
    imageRef,
    imageContainerClassName,
  }: {
    imageRef: HTMLImageElement;
    imageContainerClassName: string;
  }) {
    const cropperSelection =
      cropperInstance.value!.container.querySelector<CropperSelection>(
        "cropper-selection",
      );

    const canvas = await cropperSelection!.$toCanvas();

    const imageBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });

    if (!imageBlob) return;

    const imageItem = {
      id: cropperStore.imageHistory.length,
      blob: imageBlob,
      filters: { ...cropperStore.defaultImageFilters },
    };

    cropperStore.addToHistory(imageItem);

    initCropper({ imageRef, imageContainerClassName });
  }

  return {
    cropperInstance,
    getCropperImage,
    initCropper,
    cropImage,
  };
}
