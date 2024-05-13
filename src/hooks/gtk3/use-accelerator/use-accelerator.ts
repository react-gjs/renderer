import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk";
import React from "react";
import { getKeyCodeFromName } from "../../../gjs-elements/utils/get-keycode-from-name";
import { useWindow } from "../use-window/use-window";

type AcceleratorKey =
  | string
  | {
    key: string;
    /**
     * The modifier keys that must be held down for this accelerator
     * to trigger.
     *
     * Can be an `AccelModifier` or a bitwise combination of
     * multiple `AccelModifier`s, for example for a combination
     * Ctrl+Shift:
     *
     * @example
     *   const accelModifier =
     *     AccelModifier.CONTROL_MASK | AccelModifier.SHIFT_MASK;
     */
    modifier?: number;
  };

export const useAccelerator = (
  key: AcceleratorKey,
  callback: (...args: any[]) => void,
) => {
  const window = useWindow();
  const [accelGroup] = React.useState(() => {
    const g = new Gtk.AccelGroup();
    window?.getWidget()?.add_accel_group(g);
    return g;
  });

  const keyName = typeof key === "string" ? key : key.key;
  const modifier = typeof key === "string" ? null : key.modifier;

  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  React.useEffect(() => {
    if (!window) {
      return;
    }

    const cleanups: Function[] = [];

    const keys = keyName.split(",");

    for (const key of keys) {
      const keyCode = getKeyCodeFromName(key);

      if (keyCode === Gdk.KEY_VoidSymbol) {
        console.error(`Invalid key name: ${key}`);
        continue;
      }

      accelGroup.connect(
        keyCode,
        modifier!,
        null as any,
        (...args: any[]) => callbackRef.current(...args),
      );

      cleanups.push(() => {
        accelGroup.disconnect_key(
          keyCode,
          modifier as Gdk.ModifierType,
        );
      });
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, [window, keyName, modifier]);

  React.useEffect(() => {
    return () => {
      window?.getWidget()?.remove_accel_group(accelGroup);
    };
  }, []);
};
