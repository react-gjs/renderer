import GObject from "gi://GObject";
import Gtk from "gi://Gtk";
import type { GjsElement } from "../../gjs-element";
import { GjsElementManager } from "../../gjs-element-manager";
import { diffProps } from "../../utils/diff-props";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { WindowElement } from "../window/window";

export type ApplicationOptions = {
  /**
   * ID of the application (e.g. "org.gnome.Weather").
   *
   * If you are using `react-gnome` to build the application, you can
   * just pass the `appId` environment variable.
   *
   * @example
   *   import env from "gapp:env";
   *
   *   render(<App />, { appId: env.appId });
   */
  appId: string;
};

const getResourceBasePath = (appId: string) => {
  return `/${appId.replace(".", "/")}`;
};

export class ApplicationElement extends Gtk.Application {
  readonly kind = "APPLICATION";

  private _isAppActive = false;

  private _rootGjsElement: GjsElement | null = null;

  private _windowList: WindowElement[] = [];

  constructor(options: ApplicationOptions) {
    super({
      application_id: options.appId,
      resource_base_path: getResourceBasePath(options.appId),
    });
  }

  addWindowToApp(window: WindowElement) {
    this._windowList.push(window);
    if (this._isAppActive) {
      this.add_window(window.widget);
    }
  }

  removeWindowFromApp(window: WindowElement) {
    if (this._isAppActive && !window.isDisposed) {
      this.remove_window(window.widget);
    }

    this._windowList = this._windowList.filter((w) => w !== window);

    if (this._windowList.length === 0) {
      this.remove();
    }
  }

  notifyWillAppendTo(parent: GjsElement): void {
    throw new Error("Application element can't be appended to a container.");
  }

  appendChild(child: GjsElement): void {
    if (GjsElementManager.isGjsElementOfKind(child, WindowElement)) {
      this._rootGjsElement = child;
    } else {
      throw new Error(
        "Only Window element can be a root element of an Application."
      );
    }
  }

  updateProps(props: DiffedProps): void {
    throw new Error("Application element can't have it's props updated.");
  }

  notifyWillUnmount() {}

  remove(): void {
    this.quit();
  }

  render(): void {}

  clear() {
    this._rootGjsElement?.remove(this as any);
    this._rootGjsElement = null;
  }

  show() {}

  hide() {}

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  vfunc_activate() {
    this._isAppActive = true;
    for (const window of this._windowList) {
      this.add_window(window.widget);
    }
    this._rootGjsElement?.render();
  }
}

GObject.registerClass(ApplicationElement);
