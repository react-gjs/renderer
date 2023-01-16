import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import { MenuCheckButtonType } from "../../../g-enums";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../markup/text-node";

type MenuCheckButtonPropsMixin = MarginProps & ExpandProps & StyleProps;

export interface MenuCheckButtonProps extends MenuCheckButtonPropsMixin {
  /** Main text of the menu entry, displayed on the left side. */
  label?: string;
  value?: boolean;
  type?: MenuCheckButtonType;
  inconsistent?: boolean;
  onToggle?: (event: SyntheticEvent<{ value: boolean }>) => void;
}

export class MenuCheckButtonElement
  implements GjsElement<"MENU_CHECK_BUTTON", Gtk.CheckMenuItem>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "MENU_CHECK_BUTTON";
  widget = new Gtk.CheckMenuItem();

  private parent: GjsElement | null = null;

  private readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<
    Gtk.MenuItem,
    MenuCheckButtonProps
  >(this.lifecycle, this.widget);

  private readonly propsMapper = new PropertyMapper<MenuCheckButtonProps>(
    this.lifecycle,
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .label(DataType.String, (v = "") => {
          this.widget.label = v;
        })
        .value(DataType.Boolean, (v = false) => {
          this.widget.active = v;
        })
        .type(
          DataType.Enum(MenuCheckButtonType),
          (v = MenuCheckButtonType.CHECK) => {
            this.widget.draw_as_radio = v === MenuCheckButtonType.RADIO;
          }
        )
        .inconsistent(DataType.Boolean, (v = false) => {
          this.widget.inconsistent = v;
        })
  );

  constructor(props: DiffedProps) {
    this.handlers.bind("activate", "onToggle", () => {
      return {
        value: this.widget.active,
      };
    });

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    throw new Error("MenuCheckButton cannot have children.");
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    throw new Error("MenuCheckButton cannot have children.");
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

  notifyWillUnmount(child: GjsElement): void {}

  // #endregion

  // #region Utils for external use

  show() {
    this.widget.visible = true;
  }

  hide() {
    this.widget.visible = false;
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
