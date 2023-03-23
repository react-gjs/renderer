import { DataType } from "dilswer";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import type { PropCaseCollector } from "../element-extenders/map-properties";
import { getKeyCodeFromName } from "../get-keycode-from-name";

export type WidgetWithAccelerators = {
  add_accelerator(
    accel_signal: string | null,
    accel_group: Gtk.AccelGroup,
    accel_key: number,
    accel_mods: Gdk.ModifierType,
    accel_flags: Gtk.AccelFlags
  ): void;
  remove_accelerator(
    accel_group: Gtk.AccelGroup,
    accel_key: number,
    accel_mods: Gdk.ModifierType
  ): boolean;
};

export type AccelProps = {
  /**
   * The keyboard key that triggers this accelerator. Can be a single
   * key name or a comma- separated list of key names.
   */
  accelKey?: string;
  /**
   * The modifier keys that must be held down for this accelerator to
   * trigger.
   *
   * Can be an `AccelModifier` or a bitwise combination of multiple
   * `AccelModifier`s, for example for a combination Ctrl+Shift:
   *
   * @example
   *   const accelModifier =
   *     AccelModifier.CONTROL_MASK | AccelModifier.SHIFT_MASK;
   */
  accelModifier?: number;
};

export const createAccelPropMapper = (
  widget: WidgetWithAccelerators,
  signal = "clicked"
) => {
  return (mapper: PropCaseCollector<keyof AccelProps, any>) =>
    mapper
      .accelKey(DataType.String, (accelKey, allProps) => {
        if (accelKey) {
          const window = allProps.__rg_parent_window;
          const modifier = allProps.accelModifier!;

          if (window) {
            const cleanups: Function[] = [];

            const accelGroup = new Gtk.AccelGroup();
            window.getWidget().add_accel_group(accelGroup);

            const keys = accelKey.split(",");

            for (const key of keys) {
              const keyCode = getKeyCodeFromName(key);

              if (keyCode === Gdk.KEY_VoidSymbol) {
                console.error(`Invalid key name: ${key}`);
                continue;
              }

              widget.add_accelerator(
                signal,
                accelGroup,
                keyCode,
                modifier,
                Gtk.AccelFlags.VISIBLE
              );

              cleanups.push(() => {
                widget.remove_accelerator(accelGroup, keyCode, modifier);
              });
            }

            return () => {
              for (const cleanup of cleanups) {
                cleanup();
              }
              window.getWidget().remove_accel_group(accelGroup);
            };
          }
        }
      })
      .accelModifier(DataType.Number, (_, __, { instead }) => {
        instead("accelKey");
      });
};
