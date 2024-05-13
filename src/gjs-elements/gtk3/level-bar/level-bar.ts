import { Type } from "dilswer";
import Gtk from "gi://Gtk";
import type LevelBarMode from "../../../enums/gtk3/level-bar-mode";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ChildPropertiesProps } from "../../utils/property-maps-factories/create-child-props-mapper";
import { createChildPropsMapper } from "../../utils/property-maps-factories/create-child-props-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../text-node";

type LevelBarPropsMixin =
  & ChildPropertiesProps
  & SizeRequestProps
  & AlignmentProps
  & MarginProps
  & ExpandProps
  & StyleProps;

export interface LevelBarProps extends LevelBarPropsMixin {
  inverted?: boolean;
  minValue?: number;
  maxValue?: number;
  value?: number;
  mode?: LevelBarMode;
  offsets?: [string, number][];
}

export class LevelBarElement extends BaseElement implements GjsElement<"LEVEL_BAR", Gtk.LevelBar> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "LEVEL_BAR";
  protected widget = new Gtk.LevelBar();

  protected parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.LevelBar,
    LevelBarProps
  >(this);
  protected readonly propsMapper = new PropertyMapper<LevelBarProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    createChildPropsMapper(
      () => this.widget,
      () => this.parent,
    ),
    (props) =>
      props
        .inverted(Type.Boolean, (v = false) => {
          this.widget.inverted = v;
        })
        .value(Type.Number, (v = 0) => {
          this.widget.value = v;
        })
        .maxValue(Type.Number, (v = 1) => {
          this.widget.max_value = v;
        })
        .minValue(Type.Number, (v = 0) => {
          this.widget.min_value = v;
        })
        .mode(
          Type.Enum(Gtk.LevelBarMode),
          (v = Gtk.LevelBarMode.CONTINUOUS) => {
            this.widget.mode = v;
          },
        )
        .offsets(
          Type.ArrayOf(Type.Tuple(Type.String, Type.Number)),
          (v = []) => {
            for (let i = 0; i < v.length; i++) {
              const [name, value] = v[i];
              this.widget.add_offset_value(name, value);
            }

            return () => {
              for (let i = 0; i < v.length; i++) {
                const [name] = v[i];
                this.widget.remove_offset_value(name);
              }
            };
          },
        ),
  );

  constructor(props: DiffedProps) {
    super();
    this.updateProps(props);
    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    throw new Error("Level bar cannot have children");
  }

  insertBefore(
    newChild: GjsElement | TextNode,
    beforeChild: GjsElement,
  ): void {
    throw new Error("Level bar cannot have children");
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.widget.show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillMountTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
  }

  notifyMounted(): void {
    this.lifecycle.emitMountedEvent();
  }

  notifyChildWillUnmount(): void {}

  // #endregion

  // #region Utils for external use

  show() {
    this.widget.visible = true;
  }

  hide() {
    this.widget.visible = false;
  }

  getWidget() {
    return this.widget;
  }

  getParentElement() {
    return this.parent;
  }

  // #endregion

  static compareOffsets(prevList: any, newList: any) {
    if (prevList === newList) return false;

    if (Array.isArray(prevList) && Array.isArray(newList)) {
      if (prevList.length !== newList.length) {
        return true;
      }

      for (let i = 0; i < prevList.length; i++) {
        const prev = prevList[i];
        const newv = newList[i];

        if (Array.isArray(prev) && Array.isArray(newv)) {
          if (prev[0] !== newv[0] && prev[1] !== newv[1]) {
            return true;
          }
        } else {
          return true;
        }
      }

      return false;
    }

    return true;
  }

  static customDiffers = new Map([
    [
      "offsets",
      (prevList: any, newList: any) => LevelBarElement.compareOffsets(prevList, newList),
    ],
  ]);

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>,
  ): DiffedProps {
    return diffProps(
      oldProps,
      newProps,
      true,
      LevelBarElement.customDiffers,
    );
  }
}
