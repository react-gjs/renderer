import Gdk from "gi://Gdk";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

export type { ApplicationCss };

interface Style {
  loadInto(provider: Gtk.CssProvider): void;
}

class StyleFromCss implements Style {
  constructor(private css: string) {}

  loadInto(provider: Gtk.CssProvider) {
    const encoder = new TextEncoder();
    provider.load_from_data(encoder.encode(this.css));
  }
}

class StyleFromResource implements Style {
  constructor(private resource: string) {}

  loadInto(provider: Gtk.CssProvider) {
    provider.load_from_resource(this.resource);
  }
}

class StyleFromFile implements Style {
  constructor(private file: string) {}

  loadInto(provider: Gtk.CssProvider) {
    const file = Gio.File.new_for_path(this.file);
    provider.load_from_file(file);
  }
}

class ApplicationCss {
  private styles: Style[] = [];

  /**
   * Add a style to the StyleContext of this React-Gnome application.
   *
   * Styles must be added before the `render()` function is called to
   * take effect.
   */
  addStyles(style: string | { resource: string } | { file: string }) {
    if (typeof style === "string") {
      this.styles.push(new StyleFromCss(style));
    } else if ("resource" in style) {
      this.styles.push(new StyleFromResource(style.resource));
    } else if ("file" in style) {
      this.styles.push(new StyleFromFile(style.file));
    }
  }

  /** @internal */
  install() {
    const screen = Gdk.Screen.get_default();

    if (!screen) return;

    for (const stylesheet of this.styles) {
      try {
        const cssProvider = new Gtk.CssProvider();
        stylesheet.loadInto(cssProvider);

        Gtk.StyleContext.add_provider_for_screen(
          screen,
          cssProvider,
          Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        );
      } catch (e) {
        console.error(
          new Error(
            `Failed to install a stylesheet due to an error: \n${String(e)}`
          )
        );
      }
    }
  }
}

Object.defineProperty(globalThis, "applicationCss", {
  value: new ApplicationCss(),
  writable: false,
  configurable: false,
  enumerable: false,
});
