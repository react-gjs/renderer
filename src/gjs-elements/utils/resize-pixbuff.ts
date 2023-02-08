import GdkPixbuf from "gi://GdkPixbuf";

export const resizePixbuff = (
  pixbuff: GdkPixbuf.Pixbuf,
  width?: number,
  height?: number,
  preserveAspectRatio = true
) => {
  const currentWidth = pixbuff.get_width();
  const currentHeight = pixbuff.get_height();

  let targetWidth = width ?? currentWidth;
  let targetHeight = height ?? currentHeight;

  if (preserveAspectRatio) {
    const aspectRatio = currentWidth / currentHeight;

    if (width && height) {
      if (width / height > aspectRatio) {
        targetWidth = height * aspectRatio;
      } else {
        targetHeight = width / aspectRatio;
      }
    } else if (width && !height) {
      targetHeight = width / aspectRatio;
    } else if (height && !width) {
      targetWidth = height * aspectRatio;
    }
  }

  if (targetWidth === currentWidth && targetHeight === currentHeight) {
    return pixbuff;
  }

  return pixbuff.scale_simple(
    targetWidth,
    targetHeight,
    GdkPixbuf.InterpType.BILINEAR
  )!;
};
