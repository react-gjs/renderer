import type Gdk from "gi://Gdk";

export type PointerData = {
  coords: {
    x: number;
    y: number;
    rootX: number;
    rootY: number;
  };
};

export const parseCrossingEvent = (
  e: Gdk.Event & Gdk.EventCrossing
): PointerData => {
  const coords = e.get_coords();
  const rootCoords = e.get_root_coords();

  return {
    coords: {
      x: coords[1]!,
      y: coords[2]!,
      rootX: rootCoords[1]!,
      rootY: rootCoords[2]!,
    },
  };
};
