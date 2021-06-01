export const getImageByPreview = (
  images: Express.Multer.File[],
  previewImg: string,
): string | undefined => {
  const splitImageName = (img: Express.Multer.File) => img.filename.substr(21);

  return images.find(img => splitImageName(img) === previewImg)?.filename;
};
