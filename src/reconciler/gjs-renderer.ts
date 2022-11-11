import Reconciler from "react-reconciler";
import { DefaultEventPriority } from "react-reconciler/constants";
import { BoxElement } from "../gjs-elements/box/box";
import { ButtonElement } from "../gjs-elements/button/button";
import { LabelElement } from "../gjs-elements/label/label";
import {
  isGjsElement,
  isGjsElementOrString,
} from "../gjs-elements/utils/is-gjs-element";
import { WindowElement } from "../gjs-elements/window/window";
import type { GjsElementTypes } from "./gjs-element-types";

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
    if (isGjsElementOrString(child) && isGjsElement(container)) {
      container.appendChild(child);
      container.render();
    }
  },
  appendInitialChild(parentInstance: any, child: any) {
    if (isGjsElementOrString(child) && isGjsElement(parentInstance)) {
      parentInstance.appendChild(child);
      parentInstance.render();
    }
  },
  appendChild(parentInstance: any, child: any) {
    if (isGjsElementOrString(child) && isGjsElement(parentInstance)) {
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
    switch (type) {
      case "BOX":
        return new BoxElement(props);
      case "LABEL":
        return new LabelElement(props);
      case "BUTTON":
        return new ButtonElement(props);
      case "WINDOW":
        return new WindowElement(props);
      default:
        throw new Error(`Element type not supported. (${type})`);
    }
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
    return true;
  },
  resetAfterCommit(containerInfo) {},
  prepareScopeUpdate(scopeInstance, instance) {},
  scheduleTimeout(fn, delay) {},
  shouldSetTextContent(type: any, props: any) {
    return (
      typeof props.children === "string" || typeof props.children === "number"
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
    if (isGjsElement(instance)) {
      instance.updateProps(nextProps);
      instance.render();
    }
  },
  commitTextUpdate(textInstance: any, oldText, newText) {},
  removeChild(parentInstance: any, child: any) {
    if (isGjsElement(child)) {
      child.remove(parentInstance);
    }
  },
  removeChildFromContainer(container: any, child: any) {
    if (isGjsElement(child)) {
      child.remove(container);
    }
  },
  commitMount(instance, type, props, internalInstanceHandle) {
    if (isGjsElement(instance)) {
      instance.render();
    }
  },
});
