import type Gtk from "gi://Gtk";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { diffProps } from "../../utils/diff-props";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import type { TextNode } from "../text-node";

export interface ICustomWidget<P extends object> {
  /**
   * Should return a Gtk Widget that can be attached to a Container
   * and displayed.
   *
   * The root widget should not have any parent set.
   */
  getRootWidget(): Gtk.Widget;
  /**
   * This function ic called whenever any of the props passed to
   * <CustomWidget> changes.
   *
   * @param props Dictionary containing props that have changed since
   *   last update.
   */
  updateProps(props: Partial<P>): void;
  /**
   * This function is called when the CustomWidget is removed from the
   * React tree. Any cleanup should be done here, including destroying
   * the root widget.
   */
  unmount(): void;
}

export type CustomWidgetProps<P extends object> = P & {
  widget: new (props: P) => ICustomWidget<P>;
};

export class CustomWidgetElement
  implements GjsElement<"CUSTOM_WIDGET", Gtk.Widget>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "CUSTOM_WIDGET";
  readonly customWidget: ICustomWidget<any>;
  private readonly widget: Gtk.Widget;

  private parent: GjsElement | null = null;

  readonly lifecycle = new ElementLifecycleController();

  private currentProps: Record<string, any> = {};

  constructor(props: DiffedProps) {
    this.currentProps = Object.fromEntries(props);

    const constuctorProp = props.find((p) => p[0] === "widget");

    if (!constuctorProp) {
      throw new Error("'widget' is not defined!");
    }

    const constructor = constuctorProp[1] as new (
      props: object
    ) => ICustomWidget<any>;

    this.customWidget = new constructor(this.currentProps);
    this.widget = this.customWidget.getRootWidget();

    this.lifecycle.onUpdate((diffedProps) => {
      const updatedProps = Object.fromEntries(diffedProps);
      Object.assign(this.currentProps, updatedProps);
      this.customWidget.updateProps(updatedProps);
    });

    this.lifecycle.emitLifecycleEventAfterCreate();
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    throw new Error("CustomWidgetElement cannot have children.");
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    throw new Error("CustomWidgetElement cannot have children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.customWidget.unmount();
  }

  render() {
    this.widget.show_all();
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

  getWidget() {
    return this.widget;
  }

  getParentElement() {
    return this.parent;
  }

  addEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {}

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEvenTListenerCallback
  ): void {}

  setProperty(key: string, value: any) {
    this.lifecycle.emitLifecycleEventUpdate([[key, value]]);
  }

  getProperty(key: string) {
    return this.currentProps[key];
  }

  diffProps(
    oldProps: Record<string, any>,
    newProps: Record<string, any>
  ): DiffedProps {
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
