import { DataType } from "dilswer";
import Gdk from "gi://Gdk";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk?version=3.0";
import { KeyPressModifiers } from "../../../enums/custom";
import type { GjsContext } from "../../../reconciler/gjs-renderer";
import type { HostContext } from "../../../reconciler/host-context";
import { BaseElement, type GjsElement } from "../../gjs-element";
import { ChildOrderController } from "../../utils/element-extenders/child-order-controller";
import { ElementLifecycleController } from "../../utils/element-extenders/element-lifecycle-controller";
import type { SyntheticEvent } from "../../utils/element-extenders/event-handlers";
import { EventHandlers } from "../../utils/element-extenders/event-handlers";
import type { DiffedProps } from "../../utils/element-extenders/map-properties";
import { PropertyMapper } from "../../utils/element-extenders/map-properties";
import { ensureNotText } from "../../utils/ensure-not-string";
import { mapKeypressEventState, parseEventKey } from "../../utils/gdk-events/key-press-event";
import { isKeyboardSymbol } from "../../utils/is-keyboard-symbol-unicode";
import { mountAction } from "../../utils/mount-action";
import type { ChildPropertiesProps } from "../../utils/property-maps-factories/create-child-props-mapper";
import { createChildPropsMapper } from "../../utils/property-maps-factories/create-child-props-mapper";
import type { StyleProps } from "../../utils/property-maps-factories/create-style-prop-mapper";
import { createStylePropMapper } from "../../utils/property-maps-factories/create-style-prop-mapper";
import type { TextNode } from "../text-node";
import type { WindowElement } from "../window/window";

type SearchBarPropsMixin = ChildPropertiesProps & StyleProps;

export type SearchBarEvent<P extends Record<string, any> = {}> = SyntheticEvent<P, SearchBarElement>;

export interface SearchBarProps extends SearchBarPropsMixin {
  isVisible?: boolean;
  showCloseButton?: boolean;
  /**
   * When enabled, search bar will be shown when a keyboard symbol is
   * pressed, unless `isVisible` is set to `false`.
   *
   * @default true
   */
  showOnKeypress?:
    | boolean
    | ((
      window: Gtk.Window,
      event: SearchBarEvent<Rg.KeyPressEventData>,
    ) => boolean);
  /**
   * When a keyboard symbol is pressed and no other input is in focus,
   * this event will be fired. If the `isVisible` property of the
   * SearchBar component is set to false, the search bar will not be
   * shown even if the event is emitted with a `isVisible` value of
   * `true`.
   */
  onVisibilityChange?: (
    event: SearchBarEvent<{ isVisible: boolean }>,
  ) => void;
}

interface SearchBarInternalProps extends SearchBarProps {
  __rg_onMount?: (elem: SearchBarElement) => void;
}

export class SearchBarElement extends BaseElement implements GjsElement<"SEARCH_BAR", Gtk.SearchBar> {
  static getContext(
    currentContext: HostContext<GjsContext>,
  ): HostContext<GjsContext> {
    return currentContext;
  }

  readonly kind = "SEARCH_BAR";
  protected widget = new Gtk.SearchBar();

  protected parent: GjsElement | null = null;
  protected searchEntry: Gtk.SearchEntry | null = null;

  readonly lifecycle = new ElementLifecycleController();
  protected readonly handlers = new EventHandlers<
    Gtk.SearchBar,
    SearchBarProps
  >(this);
  protected readonly children = new ChildOrderController(
    this.lifecycle,
    this.widget,
  );
  protected readonly propsMapper = new PropertyMapper<SearchBarInternalProps>(
    this.lifecycle,
    createStylePropMapper(this.widget),
    createChildPropsMapper(
      () => this.widget,
      () => this.parent,
    ),
    (props) =>
      props
        .showCloseButton(DataType.Boolean, (v = false) => {
          this.widget.set_show_close_button(v);
        })
        .isVisible(DataType.Boolean, (v = false) => {
          this.widget.set_search_mode(v);
        }),
  );

  constructor(props: DiffedProps) {
    super();
    this.updateProps(props);

    this.handlers.bindInternal("notify::search-mode-enabled", () => {
      const { isVisible } = this.propsMapper.currentProps;
      if (
        isVisible != null
        && this.widget.get_search_mode() !== isVisible
      ) {
        this.widget.set_search_mode(isVisible);
      }
    });

    this.lifecycle.emitLifecycleEventAfterCreate();

    if (this.propsMapper.currentProps.__rg_onMount) {
      this.propsMapper.currentProps.__rg_onMount(this);
    }
  }

  protected onWindowKeyPress = (w: Gtk.Widget, e: any) => {
    const window = w as Gtk.Window;
    const event = e as Gdk.Event & Gdk.EventKey;

    const isSearchMode = this.widget.get_search_mode();
    const keyval = event.get_keyval()[1]!;
    const keypressMod = mapKeypressEventState(event);
    const isControlled = this.propsMapper.currentProps.isVisible != null;
    const keyUnicode = Gdk.keyval_to_unicode(keyval);

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
        this.widget.set_search_mode(
          this.propsMapper.currentProps.isVisible!,
        );
      }

      return;
    }

    if (!isSearchMode) {
      if (this.propsMapper.currentProps.showOnKeypress === false) {
        return;
      }

      if (!this.searchEntry?.is_focus) {
        const focused = window.get_focus();

        if (focused) {
          // if the focused widget is an input type, don't do anything
          const widgetName = GObject.type_name_from_instance(
            focused as any,
          );

          if (
            widgetName === "GtkEntry"
            || widgetName === "GtkSearchEntry"
            || widgetName === "GtkTextView"
          ) {
            return;
          }
        }
      }

      if (
        typeof this.propsMapper.currentProps.showOnKeypress
          === "function"
      ) {
        const shouldShow = this.propsMapper.currentProps.showOnKeypress(window, {
          ...parseEventKey(event),
          originalEvent: event,
          target: this,
          targetWidget: this.widget,
          preventDefault: () => {},
          stopPropagation: () => {},
        });

        if (!shouldShow) {
          return;
        }

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
          this.widget.set_search_mode(
            this.propsMapper.currentProps.isVisible!,
          );
        }
      }

      if (
        isKeyboardSymbol(keyUnicode)
        && keypressMod === KeyPressModifiers.NONE
      ) {
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
          this.widget.set_search_mode(
            this.propsMapper.currentProps.isVisible!,
          );
        }

        return;
      }
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
    window.removeEventListener(
      "key-press-event",
      this.onWindowKeyPress,
    );
  }

  updateProps(props: DiffedProps): void {
    this.lifecycle.emitLifecycleEventUpdate(props);
  }

  // #region This widget direct mutations

  appendChild(child: GjsElement | TextNode): void {
    ensureNotText(child);

    mountAction(
      this,
      child,
      (shouldOmitMount) => {
        this.children.addChild(child, shouldOmitMount);
      },
      () => {
        this.widget.show_all();
      },
    );
  }

  insertBefore(
    child: GjsElement | TextNode,
    beforeChild: GjsElement,
  ): void {
    ensureNotText(child);

    mountAction(
      this,
      child,
      (shouldOmitMount) => {
        this.children.insertBefore(
          child,
          beforeChild,
          shouldOmitMount,
        );
      },
      () => {
        this.widget.show_all();
      },
    );
  }

  remove(parent: GjsElement): void {
    parent.notifyChildWillUnmount(this);

    this.lifecycle.emitLifecycleEventBeforeDestroy();

    this.widget.destroy();
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

  notifyChildWillUnmount(child: GjsElement): void {
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

  // #endregion
}
