import { DataType } from "dilswer";
import type Gtk from "gi://Gtk";
import { Align } from "../../g-enums";
import { diffProps } from "../../reconciler/diff-props";
import type { GjsElement } from "../gjs-element";
import type { SyntheticEvent } from "../utils/event-handlers";
import { EventHandlers, EventNoop } from "../utils/event-handlers";
import type { DiffedProps } from "../utils/map-properties";
import { createPropMap } from "../utils/map-properties";
import type { AlignmentProps } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import { createAlignmentPropMapper } from "../utils/property-maps-factories/create-alignment-prop-mapper";
import type { MarginProps } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { createMarginPropMapper } from "../utils/property-maps-factories/create-margin-prop-mapper";
import { OptionsList } from "./options-list";

type SelectorPropsMixin = AlignmentProps & MarginProps;

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
      /**
       * Index of the selected option. is -1 if no option is
       * selected.
       */
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
  readonly kind = "SELECTOR";

  private parent: GjsElement | null = null;

  private optionsList = new OptionsList();
  widget = this.optionsList.getComboBox();

  private readonly handlers = new EventHandlers<Gtk.ComboBox, SelectorProps>(
    this.widget
  );

  private readonly propsMapper = createPropMap<SelectorProps>(
    createAlignmentPropMapper(this.widget, { v: Align.START }),
    createMarginPropMapper(this.widget),
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

  constructor(props: any) {
    this.handlers.bind("changed", "onChange", () => {
      const option = this.getCurrentActiveOption();

      if (option.index !== -1) return option;

      throw new EventNoop();
    });

    this.updateProps(props);
  }

  private getCurrentActiveOption(): { index: number; value?: any } {
    const [success, iter] = this.widget.get_active_iter();
    if (success) {
      const value = this.optionsList.getOptionForIter(iter);
      return value;
    }

    return { index: -1 };
  }

  notifyWillAppendTo(parent: GjsElement): void {
    this.parent = parent;
  }

  appendChild(): void {
    throw new Error("Selector does not support children.");
  }

  updateProps(props: DiffedProps): void {
    this.propsMapper.update(props);
    this.handlers.update(props);
  }

  notifyWillUnmount() {}

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.propsMapper.cleanupAll();
    this.handlers.unbindAll();
    this.widget.destroy();
  }

  render() {
    this.parent?.widget.show_all();
  }

  insertBefore(): void {
    throw new Error("Switch does not support children.");
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
}
