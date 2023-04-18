import { DataType } from "dilswer";
import GObject from "gi://GObject";
import Gdk from "gi://Gdk";
import Gtk from "gi://Gtk?version=3.0";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import type { GjsElement } from "../../gjs-element";
import { diffProps } from "../../utils/diff-props";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import { isKeyboardSymbol } from "../../utils/is-keyboard-symbol-unicode";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../text-node";
import type { WindowElement } from "../window/window";

export type SearchBarPropsMixin = StyleProps;

export type SearchBarEvent<P extends Record<string, any> = {}> = SyntheticEvent<
  P,
  SearchBarElement
>;

export interface SearchBarProps extends SearchBarPropsMixin {
  isVisible?: boolean;
  showCloseButton?: boolean;
  onVisibilityChange?: (event: SearchBarEvent<{ isVisible: boolean }>) => void;
}

interface SearchBarInternalProps extends SearchBarProps {
  __rg_onMount?: (elem: SearchBarElement) => void;
}

export class SearchBarElement
  implements GjsElement<"SEARCH_BAR", Gtk.SearchBar>
{
  static getContext(
    currentContext: HostContext<GjsContext>
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "SEARCH_BAR";
  private widget = new Gtk.SearchBar();

  private parent: GjsElement | null = null;
  private searchEntry: Gtk.SearchEntry | null = null;

  readonly lifecycle = new ElementLifecycleController();
  private readonly handlers = new EventHandlers<Gtk.SearchBar, SearchBarProps>(
    this
  );
  private readonly children = new ChildOrderController(
    this.lifecycle,
    this.widget
  );
  private readonly propsMapper = new PropertyMapper<SearchBarInternalProps>(
    this.lifecycle,
    createStylePropMapper(this.widget),
    (props) =>
      props
        .showCloseButton(DataType.Boolean, (v = false) => {
          this.widget.set_show_close_button(v);
        })
        .isVisible(DataType.Boolean, (v = false) => {
          this.widget.set_search_mode(v);
        })
  );

  constructor(props: DiffedProps) {
    this.updateProps(props);

    this.handlers.bindInternal("notify::search-mode-enabled", () => {
      const { isVisible } = this.propsMapper.currentProps;
      if (isVisible != null && this.widget.get_search_mode() !== isVisible) {
        this.widget.set_search_mode(isVisible);
      }
    });

    this.lifecycle.emitLifecycleEventAfterCreate();

    if (this.propsMapper.currentProps.__rg_onMount) {
      this.propsMapper.currentProps.__rg_onMount(this);
    }
  }

  private onWindowKeyPress = (w: Gtk.Widget, e: any) => {
    const window = w as Gtk.Window;

    if (!this.searchEntry?.is_focus) {
      const focused = window.get_focus();

      if (focused) {
        // if the focused widget is an input type, don't do anything
        const widgetName = GObject.type_name_from_instance(focused as any);

        if (
          widgetName === "GtkEntry" ||
          widgetName === "GtkSearchEntry" ||
          widgetName === "GtkTextView"
        ) {
          return;
        }
      }
    }

    const event = e as Gdk.Event & Gdk.EventKey;

    const isSearchMode = this.widget.get_search_mode();
    const keyval = event.get_keyval()[1]!;
    const isControlled = this.propsMapper.currentProps.isVisible != null;

    const keyUnicode = Gdk.keyval_to_unicode(keyval);

    if (!isSearchMode && isKeyboardSymbol(keyUnicode)) {
      const { onVisibilityChange } = this.propsMapper.currentProps;
      if (onVisibilityChange) {
        onVisibilityChange({
          isVisible: true,
          originalEvent: event,
          target: this,
          targetWidget: this.widget,
          preventDefault: () => {},
          stopPropagation: () => {},
        });
      } else if (!isControlled) {
        this.widget.set_search_mode(true);
      } else {
        this.widget.set_search_mode(this.propsMapper.currentProps.isVisible!);
      }

      return;
    }

    if (isSearchMode && keyval === Gdk.KEY_Escape) {
      const { onVisibilityChange } = this.propsMapper.currentProps;
      if (onVisibilityChange) {
        onVisibilityChange({
          isVisible: false,
          originalEvent: event,
          target: this,
          targetWidget: this.widget,
          preventDefault: () => {},
          stopPropagation: () => {},
        });
      } else if (!isControlled) {
        this.widget.set_search_mode(true);
      } else {
        this.widget.set_search_mode(this.propsMapper.currentProps.isVisible!);
      }

      return;
    }

    if (isControlled) {
      if (this.propsMapper.currentProps.isVisible && isSearchMode) {
        this.widget.handle_event(event);
      }
    } else {
      this.widget.handle_event(event);
    }
  };

  registerEntry(entry: Gtk.SearchEntry) {
    this.widget.connect_entry(entry);
    this.searchEntry = entry;
  }

  connectToWindowEvents(window: WindowElement) {
    window.addEventListener("key-press-event", this.onWindowKeyPress);
  }

  disconnectFromWindowEvents(window: WindowElement) {
    window.removeEventListener("key-press-event", this.onWindowKeyPress);
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    const shouldAppend = child.notifyWillAppendTo(this);
    this.children.addChild(child, !shouldAppend);
    this.widget.show_all();
  }

  insertBefore(newChild: GjsElement | TextNode, beforeChild: GjsElement): void {
    ensureNotText(newChild);

    const shouldAppend = newChild.notifyWillAppendTo(this);
    this.children.insertBefore(newChild, beforeChild, !shouldAppend);
    this.widget.show_all();
  }

  remove(parent: GjsElement): void {
    parent.notifyWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
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

  notifyWillUnmount(child: GjsElement): void {
    this.children.removeChild(child);
  }

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
    return diffProps(oldProps, newProps, true);
  }

  // #endregion
}
