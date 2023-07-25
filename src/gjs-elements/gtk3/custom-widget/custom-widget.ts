import type Gtk from "gi://Gtk";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
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
  extends BaseElement
  implements GjsElement<"CUSTOM_WIDGET", Gtk.Widget>
{
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "CUSTOM_WIDGET";
  readonly customWidget: ICustomWidget<any>;
  protected readonly widget: Gtk.Widget;

  protected parent: GjsElement | null = null;

  protected readonly lifecycle = new ElementLifecycleController();
  protected handlers = null;
  protected propsMapper = null;
  protected currentProps: Record<string, any> = {};

  constructor(props: DiffedProps) {
    super();
    this.currentProps = Object.fromEntries(props);

    const constuctorProp = this.currentProps.widget;

    if (!constuctorProp) {
      throw new Error("'widget' prop is not defined!");
    }

    const constructor = constuctorProp as new (
      props: object,
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

  getCustomWidget<CW extends ICustomWidget<any>>() {
    return this.customWidget as CW;
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    throw new Error("CustomWidgetElement cannot have children.");
  }

  insertBefore(
    newChild: GjsElement | TextNode,
    beforeChild: GjsElement,
  ): void {
    throw new Error("CustomWidgetElement cannot have children.");
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.customWidget.unmount();
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

  notifyChildWillUnmount(child: GjsElement): void {}

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
    callback: Rg.GjsElementEventListenerCallback,
  ): void {}

  removeEventListener(
    signal: string,
    callback: Rg.GjsElementEventListenerCallback,
  ): void {}

  // #endregion
}
