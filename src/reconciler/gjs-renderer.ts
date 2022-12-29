import type Gtk from "gi://Gtk";
import Reconciler from "react-reconciler";
import { GjsElementManager } from "../gjs-elements/gjs-element-manager";
import type { GjsElementTypes } from "../gjs-elements/gjs-element-types";
import { ActionBarElement } from "../gjs-elements/gtk3/action-bar/action-bar";
import { ApplicationElement } from "../gjs-elements/gtk3/application/application";
import { BoxElement } from "../gjs-elements/gtk3/box/box";
import { ButtonBoxElement } from "../gjs-elements/gtk3/button-box/button-box";
import { ButtonGroupElement } from "../gjs-elements/gtk3/button-group/button-group";
import { ButtonElement } from "../gjs-elements/gtk3/button/button";
import { CheckButtonElement } from "../gjs-elements/gtk3/check-button/check-button";
import { ExpanderElement } from "../gjs-elements/gtk3/expander/expander";
import { FlowBoxElement } from "../gjs-elements/gtk3/flow-box/flow-box";
import { FlowBoxEntryElement } from "../gjs-elements/gtk3/flow-box/flow-box-entry";
import { FrameElement } from "../gjs-elements/gtk3/frame/frame";
import { GridElement } from "../gjs-elements/gtk3/grid/grid";
import { GridItemElement } from "../gjs-elements/gtk3/grid/grid-item";
import { HeaderBarElement } from "../gjs-elements/gtk3/headerbar/headerbar";
import { ImageElement } from "../gjs-elements/gtk3/image/image";
import { LabelElement } from "../gjs-elements/gtk3/label/label";
import { LinkButtonElement } from "../gjs-elements/gtk3/link-button/link-button";
import { MarkupElement } from "../gjs-elements/gtk3/markup/markup";
import { MBoldElement } from "../gjs-elements/gtk3/markup/markup-elements/b";
import { MBigElement } from "../gjs-elements/gtk3/markup/markup-elements/big";
import { MItalicElement } from "../gjs-elements/gtk3/markup/markup-elements/i";
import { MStrikethroughElement } from "../gjs-elements/gtk3/markup/markup-elements/s";
import { MSmallElement } from "../gjs-elements/gtk3/markup/markup-elements/small";
import { MSpanElement } from "../gjs-elements/gtk3/markup/markup-elements/span";
import { MSubElement } from "../gjs-elements/gtk3/markup/markup-elements/sub";
import { MSupElement } from "../gjs-elements/gtk3/markup/markup-elements/sup";
import { MMonospaceElement } from "../gjs-elements/gtk3/markup/markup-elements/tt";
import { MUnderlineElement } from "../gjs-elements/gtk3/markup/markup-elements/u";
import { TextNode } from "../gjs-elements/gtk3/markup/text-node";
import { NumberInputElement } from "../gjs-elements/gtk3/number-input/number-input";
import { PopoverElement } from "../gjs-elements/gtk3/popover/popover";
import { PopoverContentElement } from "../gjs-elements/gtk3/popover/popover-content";
import { PopoverTargetElement } from "../gjs-elements/gtk3/popover/popover-target";
import { PressableElement } from "../gjs-elements/gtk3/pressable/pressable";
import { RadioBoxElement } from "../gjs-elements/gtk3/radio/radio-box";
import { RadioButtonElement } from "../gjs-elements/gtk3/radio/radio-button";
import { RevealerElement } from "../gjs-elements/gtk3/revealer/revealer";
import { ScrollBoxElement } from "../gjs-elements/gtk3/scroll-box/scroll-box";
import { SelectorElement } from "../gjs-elements/gtk3/selector/selector";
import { SeparatorElement } from "../gjs-elements/gtk3/separator/separator";
import { SizeGroupBoxElement } from "../gjs-elements/gtk3/size-group-box/size-group-box";
import { SliderPopupButtonElement } from "../gjs-elements/gtk3/slider-popup-button/slider-popup-button";
import { SliderElement } from "../gjs-elements/gtk3/slider/slider";
import { SpinnerElement } from "../gjs-elements/gtk3/spinner/spinner";
import { StackElement } from "../gjs-elements/gtk3/stack/stack";
import { StackScreenElement } from "../gjs-elements/gtk3/stack/stack-screen";
import { StackSwitcherElement } from "../gjs-elements/gtk3/stack/stack-switcher";
import { SwitchElement } from "../gjs-elements/gtk3/switch/switch";
import { TextAreaElement } from "../gjs-elements/gtk3/text-area/text-area";
import { TextEntryElement } from "../gjs-elements/gtk3/text-entry/text-entry";
import { ToolbarElement } from "../gjs-elements/gtk3/toolbar/toolbar";
import { ToolbarButtonElement } from "../gjs-elements/gtk3/toolbar/toolbar-button";
import { ToolbarItemElement } from "../gjs-elements/gtk3/toolbar/toolbar-item";
import { ToolbarRadioButtonElement } from "../gjs-elements/gtk3/toolbar/toolbar-radio-button";
import { ToolbarSeparatorElement } from "../gjs-elements/gtk3/toolbar/toolbar-separator";
import { ToolbarToggleButtonElement } from "../gjs-elements/gtk3/toolbar/toolbar-toggle-button";
import { WindowElement } from "../gjs-elements/gtk3/window/window";

import { diffProps } from "../gjs-elements/utils/diff-props";
import { isGjsElementOrString } from "../gjs-elements/utils/is-gjs-element";
import { EventPhaseController } from "./event-phase";
import { HostContext } from "./host-context";

GjsElementManager.register("ACTION_BAR", ActionBarElement);
GjsElementManager.register("BOX", BoxElement);
GjsElementManager.register("BUTTON_BOX", ButtonBoxElement);
GjsElementManager.register("BUTTON_GROUP", ButtonGroupElement);
GjsElementManager.register("BUTTON", ButtonElement);
GjsElementManager.register("CHECK_BUTTON", CheckButtonElement);
GjsElementManager.register("EXPANDER", ExpanderElement);
GjsElementManager.register("FLOW_BOX_ENTRY", FlowBoxEntryElement);
GjsElementManager.register("FLOW_BOX", FlowBoxElement);
GjsElementManager.register("FRAME", FrameElement);
GjsElementManager.register("GRID_ITEM", GridItemElement);
GjsElementManager.register("GRID", GridElement);
GjsElementManager.register("HEADER_BAR", HeaderBarElement);
GjsElementManager.register("IMAGE", ImageElement);
GjsElementManager.register("LABEL", LabelElement);
GjsElementManager.register("LINK_BUTTON", LinkButtonElement);
GjsElementManager.register("M_BIG", MBigElement);
GjsElementManager.register("M_BOLD", MBoldElement);
GjsElementManager.register("M_ITALIC", MItalicElement);
GjsElementManager.register("M_MONOSPACE", MMonospaceElement);
GjsElementManager.register("M_SMALL", MSmallElement);
GjsElementManager.register("M_SPAN", MSpanElement);
GjsElementManager.register("M_STRIKETHROUGH", MStrikethroughElement);
GjsElementManager.register("M_SUBSCRIPT", MSubElement);
GjsElementManager.register("M_SUPERSCRIPT", MSupElement);
GjsElementManager.register("M_UNDERLINE", MUnderlineElement);
GjsElementManager.register("MARKUP", MarkupElement);
GjsElementManager.register("NUMBER_INPUT", NumberInputElement);
GjsElementManager.register("POPOVER_CONTENT", PopoverContentElement);
GjsElementManager.register("POPOVER_TARGET", PopoverTargetElement);
GjsElementManager.register("POPOVER", PopoverElement);
GjsElementManager.register("PRESSABLE", PressableElement);
GjsElementManager.register("RADIO_BOX", RadioBoxElement);
GjsElementManager.register("RADIO_BUTTON", RadioButtonElement);
GjsElementManager.register("REVEALER", RevealerElement);
GjsElementManager.register("SCROLL_BOX", ScrollBoxElement);
GjsElementManager.register("SELECTOR", SelectorElement);
GjsElementManager.register("SEPARATOR", SeparatorElement);
GjsElementManager.register("SIZE_GROUP_BOX", SizeGroupBoxElement);
GjsElementManager.register("SLIDER_POPUP_BUTTON", SliderPopupButtonElement);
GjsElementManager.register("SLIDER", SliderElement);
GjsElementManager.register("SPINNER", SpinnerElement);
GjsElementManager.register("STACK_SCREEN", StackScreenElement);
GjsElementManager.register("STACK_SWITCHER", StackSwitcherElement);
GjsElementManager.register("STACK", StackElement);
GjsElementManager.register("SWITCH", SwitchElement);
GjsElementManager.register("TEXT_AREA", TextAreaElement);
GjsElementManager.register("TEXT_ENTRY", TextEntryElement);
GjsElementManager.register("TOOLBAR_BUTTON", ToolbarButtonElement);
GjsElementManager.register("TOOLBAR_ITEM", ToolbarItemElement);
GjsElementManager.register("TOOLBAR_RADIO_BUTTON", ToolbarRadioButtonElement);
GjsElementManager.register("TOOLBAR_SEPARATOR", ToolbarSeparatorElement);
GjsElementManager.register("TOOLBAR_TOGGLE_BUTTON", ToolbarToggleButtonElement);
GjsElementManager.register("TOOLBAR", ToolbarElement);
GjsElementManager.register("WINDOW", WindowElement);

export type GjsContext = {
  isInTextContext: boolean;
  application: ApplicationElement;
};

export const GjsRenderer = Reconciler({
  isPrimaryRenderer: true,
  noTimeout: -1,
  supportsMutation: true,
  supportsHydration: false,
  supportsPersistence: false,
  afterActiveInstanceBlur() {},
  appendChildToContainer(container: any, child: any) {
    if (
      isGjsElementOrString(child) &&
      GjsElementManager.isGjsElement(container)
    ) {
      container.appendChild(child);
      container.render();
    }
  },
  appendInitialChild(parentInstance: any, child: any) {
    if (
      isGjsElementOrString(child) &&
      GjsElementManager.isGjsElement(parentInstance)
    ) {
      parentInstance.appendChild(child);
      parentInstance.render();
    }
  },
  appendChild(parentInstance: any, child: any) {
    if (
      isGjsElementOrString(child) &&
      GjsElementManager.isGjsElement(parentInstance)
    ) {
      parentInstance.appendChild(child);
      parentInstance.render();
    }
  },
  beforeActiveInstanceBlur() {},
  cancelTimeout: clearTimeout,
  createInstance(
    type: GjsElementTypes,
    props: any,
    rootContainer,
    hostContext: HostContext<GjsContext>,
    internalHandle
  ) {
    const diffedProps = diffProps({}, props, true);

    return GjsElementManager.create(type, diffedProps, hostContext);
  },
  createTextInstance(
    text,
    rootContainer,
    hostContext: HostContext<GjsContext>,
    internalHandle
  ) {
    if (hostContext.get("isInTextContext") !== true) {
      throw new Error("Text Instances are not supported");
    }

    return new TextNode(text);
  },
  detachDeletedInstance(node) {},
  finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
    return true;
  },
  getChildHostContext(
    parentHostContext: HostContext<GjsContext>,
    type,
    rootContainer
  ): HostContext<GjsContext> {
    return GjsElementManager.getContextForKind(type, parentHostContext);
  },
  getCurrentEventPriority() {
    return EventPhaseController.getCurrentPhase();
  },
  getInstanceFromNode(node) {
    return undefined;
  },
  getInstanceFromScope(scopeInstance) {},
  getPublicInstance(instance) {
    return instance;
  },
  getRootHostContext(rootContainer) {
    return HostContext.init<GjsContext>({
      isInTextContext: false,
      application: rootContainer,
    });
  },
  prepareForCommit(containerInfo) {
    return null;
  },
  preparePortalMount(containerInfo) {},
  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainer,
    hostContext: HostContext<GjsContext>
  ) {
    if (GjsElementManager.isGjsElement(instance)) {
      return instance.diffProps(oldProps, newProps);
    }
  },
  resetAfterCommit(containerInfo) {},
  prepareScopeUpdate(scopeInstance, instance) {},
  scheduleTimeout: setTimeout,
  shouldSetTextContent(type: any, props: any) {
    return false;
  },
  commitUpdate(
    instance: any,
    updatePayload,
    type,
    prevProps,
    nextProps,
    internalHandle
  ) {
    if (updatePayload && GjsElementManager.isGjsElement(instance)) {
      instance.updateProps(updatePayload);
      instance.render();
    }
  },
  commitTextUpdate(textInstance: any, oldText, newText) {
    if (TextNode.isTextNode(textInstance)) {
      if (oldText !== newText) {
        textInstance.updateText(newText);
        textInstance.render();
      }
    }
  },
  removeChild(parentInstance: any, child: any) {
    if (GjsElementManager.isGjsElement(child)) {
      child.remove(parentInstance);
      parentInstance.render();
    }
  },
  removeChildFromContainer(container: any, child: any) {
    if (GjsElementManager.isGjsElement(child)) {
      child.remove(container);
      container.render();
    }
  },
  commitMount(instance, type, props, internalInstanceHandle) {
    if (GjsElementManager.isGjsElement(instance)) {
      instance.render();
    }
  },
  clearContainer(container) {
    if (container instanceof ApplicationElement) {
      container.clear();
    } else if (GjsElementManager.isGjsElement(container)) {
      if ((container.widget as Gtk.Box).get_children) {
        const children = (container.widget as Gtk.Box).get_children();
        for (const child of children) {
          child.destroy();
        }
      }
    }
  },
  resetTextContent(instance) {},
  insertBefore(parentInstance, child, beforeChild) {
    if (
      GjsElementManager.isGjsElement(parentInstance) &&
      GjsElementManager.isGjsElement(child) &&
      GjsElementManager.isGjsElement(beforeChild)
    ) {
      parentInstance.insertBefore(child, beforeChild);
      parentInstance.render();
    }
  },
  insertInContainerBefore(container, child, beforeChild) {
    if (
      GjsElementManager.isGjsElement(container) &&
      GjsElementManager.isGjsElement(child) &&
      GjsElementManager.isGjsElement(beforeChild)
    ) {
      container.insertBefore(child, beforeChild);
      container.render();
    }
  },
  hideInstance(instance) {
    if (GjsElementManager.isGjsElement(instance)) {
      instance.hide();
    }
  },
  unhideInstance(instance, props) {
    if (GjsElementManager.isGjsElement(instance)) {
      instance.updateProps(instance.diffProps({}, props));
      instance.show();
    }
  },
  hideTextInstance(instance) {
    if (TextNode.isTextNode(instance)) {
      instance.hide();
    }
  },
  unhideTextInstance(instance, text) {
    if (TextNode.isTextNode(instance)) {
      instance.updateText(text);
      instance.show();
    }
  },
});
