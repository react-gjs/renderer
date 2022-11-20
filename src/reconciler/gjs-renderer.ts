import Reconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import { BoxElement } from "../gjs-elements/box/box";
import { ButtonElement } from "../gjs-elements/button/button";
import { CheckButtonElement } from "../gjs-elements/check-button/check-button";
import { FlowBoxElement } from "../gjs-elements/flow-box/flow-box";
import { FlowBoxEntryElement } from "../gjs-elements/flow-box/flow-box-entry";
import { GjsElementManager } from "../gjs-elements/gjs-element-manager";
import type { GjsElementTypes } from "../gjs-elements/gjs-element-types";
import { GridElement } from "../gjs-elements/grid/grid";
import { GridItemElement } from "../gjs-elements/grid/grid-item";
import { ImageElement } from "../gjs-elements/image/image";
import { LabelElement } from "../gjs-elements/label/label";
import { LinkButtonElement } from "../gjs-elements/link-button/link-button";
import { PressableElement } from "../gjs-elements/pressable/pressable";
import { ScrollBoxElement } from "../gjs-elements/scroll-box/scroll-box";
import { SelectorElement } from "../gjs-elements/selector/selector";
import { SwitchElement } from "../gjs-elements/switch/switch";
import { TextAreaElement } from "../gjs-elements/text-area/text-area";
import { TextEntryElement } from "../gjs-elements/text-entry/text-entry";
import { isGjsElementOrString } from "../gjs-elements/utils/is-gjs-element";
import { WindowElement } from "../gjs-elements/window/window";
import { diffProps } from "./diff-props";

GjsElementManager.register("BOX", BoxElement);
GjsElementManager.register("BUTTON", ButtonElement);
GjsElementManager.register("CHECK_BUTTON", CheckButtonElement);
GjsElementManager.register("FLOW_BOX", FlowBoxElement);
GjsElementManager.register("FLOW_BOX_ENTRY", FlowBoxEntryElement);
GjsElementManager.register("GRID", GridElement);
GjsElementManager.register("GRID_ITEM", GridItemElement);
GjsElementManager.register("IMAGE", ImageElement);
GjsElementManager.register("LABEL", LabelElement);
GjsElementManager.register("LINK_BUTTON", LinkButtonElement);
GjsElementManager.register("PRESSABLE", PressableElement);
GjsElementManager.register("SCROLL_BOX", ScrollBoxElement);
GjsElementManager.register("SELECTOR", SelectorElement);
GjsElementManager.register("SWITCH", SwitchElement);
GjsElementManager.register("TEXT_AREA", TextAreaElement);
GjsElementManager.register("TEXT_ENTRY", TextEntryElement);
GjsElementManager.register("WINDOW", WindowElement);

const rootHostContext = {};
const childHostContext = {};

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
    hostContext,
    internalHandle
  ) {
    const diffedProps = diffProps({}, props, true);

    return GjsElementManager.create(type, diffedProps);
  },
  createTextInstance(text, rootContainer, hostContext, internalHandle) {
    throw new Error("Text Instances are not supported");
  },
  detachDeletedInstance(node) {},
  finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
    return true;
  },
  getChildHostContext(parentHostContext, type, rootContainer) {
    return childHostContext;
  },
  getCurrentEventPriority() {
    return DefaultEventPriority;
  },
  getInstanceFromNode(node) {
    return undefined;
  },
  getInstanceFromScope(scopeInstance) {},
  getPublicInstance(instance) {
    return instance;
  },
  getRootHostContext(rootContainer) {
    return rootHostContext;
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
    hostContext
  ) {
    if (GjsElementManager.isGjsElement(instance)) {
      return instance.diffProps(oldProps, newProps);
    }
    return diffProps(oldProps, newProps, false);
  },
  resetAfterCommit(containerInfo) {},
  prepareScopeUpdate(scopeInstance, instance) {},
  scheduleTimeout: setTimeout,
  shouldSetTextContent(type: any, props: any) {
    const children = props.children;
    return (
      typeof children === "string" ||
      (Array.isArray(children) &&
        children.every((child) => typeof child === "string"))
    );
  },
  commitUpdate(
    instance: any,
    updatePayload,
    type,
    prevProps,
    nextProps: any,
    internalHandle
  ) {
    if (GjsElementManager.isGjsElement(instance)) {
      instance.updateProps(updatePayload);
      instance.render();
    }
  },
  commitTextUpdate(textInstance: any, oldText, newText) {},
  removeChild(parentInstance: any, child: any) {
    if (GjsElementManager.isGjsElement(child)) {
      child.remove(parentInstance);
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
  clearContainer(container) {},
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
});
