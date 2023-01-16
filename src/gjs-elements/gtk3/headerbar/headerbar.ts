import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { ControlButton } from "../../../g-enums";
import { Align } from "../../../g-enums";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { compareArraysShallow, diffProps } from "../../utils/diff-props";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../markup/text-node";

type HeaderBarPropsMixin = AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export interface HeaderBarProps extends HeaderBarPropsMixin {
  spacing?: number;
  title?: string;
  subtitle?: string;
  canHaveSubtitle?: boolean;
  showControlButtons?: boolean;
  rightControlButtons?: Array<ControlButton>;
  leftControlButtons?: Array<ControlButton>;
}

export class HeaderBarElement
  implements GjsElement<"HEADER_BAR", Gtk.HeaderBar>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "HEADER_BAR";
  widget = new Gtk.HeaderBar();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly children = new ChildOrderController(
    this.lifecycle,
    this.widget
  );
  private readonly propsMapper = new PropertyMapper<HeaderBarProps>(
    this.lifecycle,
    createAlignmentPropMapper(this.widget, { h: Align.FILL }),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .canHaveSubtitle(DataType.Boolean, (v = false) => {
          this.widget.set_has_subtitle(v);
        })
        .spacing(DataType.Number, (v = 0) => {
          this.widget.spacing = v;
        })
        .title(DataType.String, (v = "") => {
          this.widget.title = v;
          this.widget.show;
        })
        .subtitle(DataType.String, (v = "") => {
          this.widget.subtitle = v;
        })
        .showControlButtons(DataType.Boolean, (v = false, allProps) => {
          this.widget.show_close_button = v;

          if (v) {
            const rightBtns = allProps.rightControlButtons ?? [];
            const leftBtns = allProps.leftControlButtons ?? [];

            if (rightBtns.length === 0 && leftBtns.length === 0) {
              return;
            }

            this.widget.set_decoration_layout(
              `${leftBtns.join(",")}:${rightBtns.join(",")}`
            );
            return () => {
              this.widget.set_decoration_layout(null);
            };
          }
        })
        .leftControlButtons(
          DataType.ArrayOf(DataType.String),
          (_, __, { instead }) => {
            instead("showControlButtons");
          }
        )
        .rightControlButtons(
          DataType.ArrayOf(DataType.String),
          (_, __, { instead }) => {
            instead("showControlButtons");
          }
        )
  );

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    const shouldAppend = child.notifyWillAppendTo(this);
    this.children.addChild(child, !shouldAppend);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    ensureNotText(newChild);

    const shouldAppend = newChild.notifyWillAppendTo(this);
    this.children.insertBefore(newChild, beforeChild, !shouldAppend);
    this.widget.show_all();
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.parent?.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
  }

  notifyWillUnmount(child: GjsElement): void {
    this.children.removeChild(child);
  }

  // #endregion

  // #region Utils for external use

  show() {
    this.widget.visible = true;
  }

  hide() {
    this.widget.visible = false;
  }

  static controlBtnDiffers = new Map<
    string,
    (oldProp: any, newProp: any) => boolean
  >([
    ["leftControlButtons", compareArraysShallow],
    ["rightControlButtons", compareArraysShallow],
  ]);

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(
      oldProps,
      newProps,
      true,
      HeaderBarElement.controlBtnDiffers
    );
  }

  // #endregion
}
