import Gdk from "gi://Gdk";

type MaybeSpace = " " | "";

export type ColorString =
  | `#${string}`
  | `rgb(${MaybeSpace}${number}${MaybeSpace},${MaybeSpace}${number}${MaybeSpace},${MaybeSpace}${number}${MaybeSpace})`
  | `rgba(${MaybeSpace}${number}${MaybeSpace},${MaybeSpace}${number}${MaybeSpace},${MaybeSpace}${number}${MaybeSpace})`;

export class Color {
  constructor(
    /** Red value (0-255). */
    public r: number,
    /** Green value (0-255). */
    public g: number,
    /** Blue value (0-255). */
    public b: number,
    /** Alpha value (0-1). */
    public a: number = 1,
  ) {}

  toRgba() {
    const rgba = new Gdk.RGBA();
    // rgba.parse(`rgba(${this.r},${this.g},${this.b},${this.a})`);
    rgba.red = this.r / 255;
    rgba.green = this.g / 255;
    rgba.blue = this.b / 255;
    rgba.alpha = this.a;
    return rgba;
  }
}

const hexToNum = (hex: string) => parseInt(hex, 16);

export const parseColor = (color: ColorString): Color => {
  if (color.startsWith("rgb(")) {
    const rgb = color.slice(4, -1).split(",");
    return new Color(
      Number(rgb[0]!),
      Number(rgb[1]!),
      Number(rgb[2]!),
    );
  } else if (color.startsWith("rgba(")) {
    const rgb = color.slice(5, -1).split(",");
    return new Color(
      Number(rgb[0]!),
      Number(rgb[1]!),
      Number(rgb[2]!),
      Number(rgb[3]!),
    );
  } else if (color.startsWith("#") && color.length >= 6) {
    const rgb = color.slice(1).split("");

    const alpha = rgb.length >= 8
      ? Math.floor(hexToNum(rgb[6]!) + hexToNum(rgb[7]!) / 255)
      : undefined;

    return new Color(
      hexToNum(rgb[0]!) + hexToNum(rgb[1]!),
      hexToNum(rgb[2]!) + hexToNum(rgb[3]!),
      hexToNum(rgb[4]!) + hexToNum(rgb[5]!),
      alpha,
    );
  }

  throw new Error("Invalid color argument.");
};
