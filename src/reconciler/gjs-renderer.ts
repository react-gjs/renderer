import Reconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import { BoxElement } from "../gjs-elements/box/box";
import { ButtonElement } from "../gjs-elements/button/button";
import { FlowBoxEntryElement } from "../gjs-elements/flow-box-entry/flow-box-entry";
import { FlowBoxElement } from "../gjs-elements/flow-box/flow-box";
import { GjsElementManager } from "../gjs-elements/gjs-element-manager";
import type { GjsElementTypes } from "../gjs-elements/gjs-element-types";
import { LabelElement } from "../gjs-elements/label/label";
import { LinkButtonElement } from "../gjs-elements/link-button/link-button";
import { SwitchElement } from "../gjs-elements/switch/switch";
import { TextAreaElement } from "../gjs-elements/text-area/text-area";
import { TextEntryElement } from "../gjs-elements/text-entry/text-entry";
import { isGjsElementOrString } from "../gjs-elements/utils/is-gjs-element";
import type { DiffedProps } from "../gjs-elements/utils/map-properties";
import { UnsetProp } from "../gjs-elements/utils/map-properties";
import { WindowElement } from "../gjs-elements/window/window";

GjsElementManager.register("BOX", BoxElement);
GjsElementManager.register("BUTTON", ButtonElement);
GjsElementManager.register("FLOW_BOX", FlowBoxElement);
GjsElementManager.register("FLOW_BOX_ENTRY", FlowBoxEntryElement);
GjsElementManager.register("LABEL", LabelElement);
GjsElementManager.register("LINK_BUTTON", LinkButtonElement);
GjsElementManager.register("SWITCH", SwitchElement);
GjsElementManager.register("TEXT_AREA", TextAreaElement);
GjsElementManager.register("TEXT_ENTRY", TextEntryElement);
GjsElementManager.register("WINDOW", WindowElement);

const rootHostContext = {};
const childHostContext = {};

const compareMargins = (oldArray: any[], newArray: any[]) => {
  if (typeof oldArray !== typeof newArray) {
    return true;
  }

  if (oldArray.length !== newArray.length) {
    return true;
  }

  for (let i = 0; i < oldArray.length; i++) {
    if (oldArray[i] !== newArray[i]) {
      return true;
    }
  }

  return false;
};

const diffProps = (oldProps: any, newProps: any, gjsElem: boolean) => {
  const diffedProps: DiffedProps = [];

  const oldPropsKeys = Object.keys(oldProps);
  const newPropsKeys = Object.keys(newProps);

  for (let i = 0; i < newPropsKeys.length; i++) {
    const key = newPropsKeys[i];

    if (gjsElem && key === "margin") {
      if (compareMargins(oldProps[key], newProps[key])) {
        diffedProps.push([key, newProps[key]]);
      }
      continue;
      // we don't want to compare margins by reference, since
      // those can be tuples of numbers, and even if margin values
      // did not change, the tuple reference will be different
    }

    if (newProps[key] !== oldProps[key]) {
      diffedProps.push([key, newProps[key]]);
    }
  }

  for (let i = 0; i < oldPropsKeys.length; i++) {
    const key = oldPropsKeys[i];

    if (!(key in newProps)) {
      diffedProps.push([key, UnsetProp]);
    }
  }

  return diffedProps;
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
  cancelTimeout(id) {},
  clearContainer(container) {},
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
  getPublicInstance(instance) {},
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
    return diffProps(
      oldProps,
      newProps,
      GjsElementManager.isGjsElement(instance)
    );
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
    }
  },
  commitMount(instance, type, props, internalInstanceHandle) {
    if (GjsElementManager.isGjsElement(instance)) {
      instance.render();
    }
  },
});
