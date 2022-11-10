import Reconciler from "react-reconciler";
import { appendInstance } from "./gjs-reconcilers/append-instance";
import { createInstance } from "./gjs-reconcilers/create-instances";
import { createTextInstance } from "./gjs-reconcilers/create-text-instance";
import { removeChild } from "./gjs-reconcilers/remove-child";
import { updateInstance } from "./gjs-reconcilers/update-instance";

const rootHostContext = {};
const childHostContext = {};

export const GjsRenderer = Reconciler({
  isPrimaryRenderer: true,
  noTimeout: -1,
  supportsMutation: true,
  supportsHydration: false,
  afterActiveInstanceBlur() {},
  appendChildToContainer(container: any, child: any) {
    return appendInstance(container, child);
  },
  appendInitialChild(parentInstance: any, child: any) {
    return appendInstance(parentInstance, child);
  },
  appendChild(parentInstance: any, child: any) {
    return appendInstance(parentInstance, child);
  },
  beforeActiveInstanceBlur() {},
  cancelTimeout(id) {},
  clearContainer(container) {},
  createInstance(
    type: any,
    props: any,
    rootContainer,
    hostContext,
    internalHandle
  ) {
    return createInstance(type, props);
  },
  createTextInstance(text, rootContainer, hostContext, internalHandle) {
    return createTextInstance(text, rootContainer);
  },
  detachDeletedInstance(node) {},
  finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {},
  getChildHostContext(parentHostContext, type, rootContainer) {
    return childHostContext;
  },
  getCurrentEventPriority() {},
  getInstanceFromNode(node) {},
  getInstanceFromScope(scopeInstance) {},
  getPublicInstance(instance) {},
  getRootHostContext(rootContainer) {
    return rootHostContext;
  },
  prepareForCommit(containerInfo) {},
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
    return updateInstance(instance, nextProps);
  },
  commitTextUpdate(textInstance: any, oldText, newText) {
    return updateInstance(textInstance, { children: newText });
  },
  removeChild(parentInstance: any, child: any) {
    return removeChild(parentInstance, child);
  },
});
