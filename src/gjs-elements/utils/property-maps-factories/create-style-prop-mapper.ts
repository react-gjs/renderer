import { DataType } from "dilswer";
import Gtk from "gi://Gtk";
import type { PropCaseCollector } from "../element-extenders/map-properties";
import { generateName } from "../generate-uid";

export type StyleProps = { style?: Record<string, string> };

export const createStylePropMapper = (widget: Gtk.Widget) => {
  const widgetClassName = generateName(16);
  const styleContext = widget.get_style_context();
  styleContext.add_class(widgetClassName);

  return (props: PropCaseCollector<keyof StyleProps, any>) =>
    props.style(DataType.RecordOf({}), (v) => {
      if (v) {
        const css = stylesToData(v, widgetClassName);

        const provider = new Gtk.CssProvider();
        provider.load_from_data(css);

        styleContext.add_provider(
          provider,
          Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        );

        return () => styleContext.remove_provider(provider);
      }
    });
};

function pascalCaseToKebabCase(name: string): string {
  let kebabCase = "";

  // Loop through each character in the name
  for (let i = 0; i < name.length; i++) {
    // If the current character is uppercase, add a dash before it
    if (name[i] === name[i].toUpperCase()) {
      kebabCase += "-";
    }
    // Add the current character to the kebab case name
    kebabCase += name[i].toLowerCase();
  }

  return kebabCase;
}

function parseToCss(styles: Record<string, string>, className: string) {
  return `.${className} {
    ${Object.entries(styles)
      .map(([name, value]) => `${pascalCaseToKebabCase(name)}: ${value};`)
      .join("\n")}
}`;
}

function stringToUint8Array(str: string): Uint8Array {
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    arr[i] = str.charCodeAt(i);
  }
  return arr;
}

function stylesToData(styles: Record<string, string>, className: string) {
  const css = parseToCss(styles, className);
  const data = stringToUint8Array(css);
  return data;
}
