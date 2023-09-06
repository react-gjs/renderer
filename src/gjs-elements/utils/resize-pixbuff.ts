import GdkPixbuf from "gi://GdkPixbuf";

export const resizePixbuff = (
  pixbuff: GdkPixbuf.Pixbuf,
  width?: number,
  height?: number,
  preserveAspectRatio = true,
) => {
  const currentWidth = pixbuff.get_width();
  const currentHeight = pixbuff.get_height();
  const orgAspectRatio = currentWidth / currentHeight;

  let targetWidth = width;
  let targetHeight = height;

  if (targetHeight != null && targetWidth == null) {
    targetWidth = targetHeight * orgAspectRatio;
  } else if (targetWidth != null && targetHeight == null) {
    targetHeight = targetWidth / orgAspectRatio;
  } else if (preserveAspectRatio) {
    const targetRatio = targetWidth! / targetHeight!;

    if (orgAspectRatio !== targetRatio) {
      if (targetRatio > orgAspectRatio) {
        targetWidth = targetHeight! * orgAspectRatio;
      } else {
        targetHeight = targetWidth! / orgAspectRatio;
      }
    }
  }

  if (
    targetWidth === currentWidth &&
    targetHeight === currentHeight
  ) {
    return pixbuff;
  }

  return pixbuff.scale_simple(
    Math.round(targetWidth!),
    Math.round(targetHeight!),
    GdkPixbuf.InterpType.BILINEAR,
  )!;
};
