import type Gdk from "gi://Gdk?version=3.0";
import type { MouseButton } from "../../../enums/custom";

export type MouseButtonPressEvent = {
  button: MouseButton;
  count: number;
  coords: {
    x: number;
    y: number;
    rootX: number;
    rootY: number;
  };
};

export const parseMouseButtonPressEvent = (
  e: Gdk.Event & Gdk.EventButton,
): MouseButtonPressEvent => {
  const coords = e.get_coords();
  const rootCoords = e.get_root_coords();

  return {
    button: e.get_button()[1]!,
    count: e.get_click_count()[1]!,
    coords: {
      x: coords[1]!,
      y: coords[2]!,
      rootX: rootCoords[1]!,
      rootY: rootCoords[2]!,
    },
  };
};
