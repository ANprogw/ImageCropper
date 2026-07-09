export interface IImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
}

export interface IImageItem {
  id: number;
  blob: Blob | null;
  filters: IImageFilters;
}
