import { DataType } from "dilswer";
import type Gtk from "gi://Gtk";
import { Align } from "../../../g-enums";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import {
  EventHandlers,
  EventNoop,
} from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import type { AlignmentProps } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../../utils/property-maps-factories/create-alignment-prop-mapper";
import type { ExpandProps } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import { createExpandPropMapper } from "../../utils/property-maps-factories/create-expand-prop-mapper";
import type { MarginProps } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../../utils/property-maps-factories/create-margin-prop-mapper";
import type { SizeRequestProps } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import { createSizeRequestPropMapper } from "../../utils/property-maps-factories/create-size-request-prop-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { OptionsList } from "./options-list";

type SelectorPropsMixin = SizeRequestProps &
  AlignmentProps &
  MarginProps &
  ExpandProps &
  StyleProps;

export interface SelectorProps<V extends string | number | undefined = any>
  extends SelectorPropsMixin {
  options: Array<{ label: string; value?: V }>;
  selected?: number;
  /** Label to use for the unselected option. */
  noSelect?: string;
  onChange?: (
    event: SyntheticEvent<{
      /** Value of the selected option. */
      value?: V;
      /** Index of the selected option. is -1 if no option is selected. */
      index: number;
    }>
  ) => void;
}

const SelectorOptionDataType = DataType.ArrayOf(
  DataType.RecordOf({
    label: DataType.String,
    value: DataType.OneOf(DataType.String, DataType.Number),
  })
);

export class SelectorElement implements GjsElement<"SELECTOR", Gtk.ComboBox> {
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "SELECTOR";

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly optionsList = new OptionsList(this.lifecycle);
  private widget = this.optionsList.getComboBox();
  private readonly handlers = new EventHandlers<Gtk.ComboBox, SelectorProps>(
    this
  );

  private readonly propsMapper = new PropertyMapper<SelectorProps>(
    this.lifecycle,
    createSizeRequestPropMapper(this.widget),
    createAlignmentPropMapper(this.widget, { v: Align.START }),
    createMarginPropMapper(this.widget),
    createExpandPropMapper(this.widget),
    createStylePropMapper(this.widget),
    (props) =>
      props
        .options(SelectorOptionDataType, (v = []) => {
          const activeOption = this.getCurrentActiveOption();

          this.optionsList.clear();

          for (const option of v) {
            this.optionsList.add(option.label, option.value);
          }

          if (activeOption.index === -1) {
            this.widget.set_active(0);
          } else if (!(activeOption.index >= v.length)) {
            // Restore the active option
            this.widget.set_active(activeOption.index);
          } else if (v.length > 0) {
            this.widget.set_active(0);
          }
        })
        .selected(DataType.Number, (v = 0, allProps) => {
          if (allProps.options && allProps.options.length > 0)
            this.widget.set_active(v);
        })
  );

  constructor(props: DiffedProps) {
    this.handlers.bind("changed", "onChange", () => {
      const option = this.getCurrentActiveOption();

      if (option.index !== -1) return option;

      throw new EventNoop();
    });

    this.updateProps(props);

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  private getCurrentActiveOption(): { index: number; value?: any } {
    const [success, iter] = this.widget.get_active_iter();
    if (success) {
      const value = this.optionsList.getOptionForIter(iter);
      return value;
    }

    return { index: -1 };
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(): void {
    throw new Error("Selector does not support children.");
  }

  insertBefore(): void {
    throw new Error("Switch does not support children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
  }

  render() {
    this.parent?.getWidget().show_all();
  }

  // #endregion

  // #region Element internal signals

  notifyWillAppendTo(parent: GjsElement): boolean {
    this.parent = parent;
    return true;
  }

  notifyWillUnmount() {}

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

  addEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {
    return this.handlers.addListener(signal, callback);
  }

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {
    return this.handlers.removeListener(signal, callback);
  }

  setProperty(key: string, value: any) {
    this.lifecycle.emitLifecycleEventUpdate([[key, value]]);
  }

  getProperty(key: string) {
    return this.propsMapper.get(key);
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    const { options, ...rest } = newProps;
    const { options: oldOptions, ...restOldProps } = oldProps;

    if (
      typeof options !== typeof oldOptions ||
      JSON.stringify(options) !== JSON.stringify(oldOptions)
    ) {
      return diffProps(restOldProps, rest, true).concat([["options", options]]);
    }

    return diffProps(restOldProps, rest, true).concat([]);
  }

  // #endregion
}
