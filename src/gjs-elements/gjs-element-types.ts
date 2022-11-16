export interface GjsElementTypeRegistry {
  BOX: "BOX";
  BUTTON: "BUTTON";
  CHECK_BUTTON: "CHECK_BUTTON";
  FLOW_BOX_ENTRY: "FLOW_BOX_ENTRY";
  FLOW_BOX: "FLOW_BOX";
  GRID: "GRID";
  GRID_ITEM: "GRID_ITEM";
  LABEL: "LABEL";
  LINK_BUTTON: "LINK_BUTTON";
  SWITCH: "SWITCH";
  TEXT_AREA: "TEXT_AREA";
  TEXT_ENTRY: "TEXT_ENTRY";
  WINDOW: "WINDOW";
}

export type GjsElementTypes = keyof GjsElementTypeRegistry;
