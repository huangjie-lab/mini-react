import { renderWithHooks } from "./hooks";
import { reconcileChildren } from "./ReactChildFiber";
import { updateNode } from "./utils";

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    updateNode(wip.stateNode, {}, wip.props);
  }
  // 协调子节点
  reconcileChildren(wip, wip.props.children);
}
export function updateFunctionComponent(wip) {
  renderWithHooks(wip);
  // 函数组件的type是个函数 直接执行拿到children
  const { type, props } = wip;
  // 子节点
  const children = type(props);
  reconcileChildren(wip, children);
}
export function updateClassComponent(wip) {
  // 函数组件的type是个函数 直接执行拿到children
  const { props, type } = wip;

  //   console.log(type, typeof type, "typeof");

  const instance = new type(props);

  const children = instance.render();

  reconcileChildren(wip, children);
}

export function updateFragmentComponent(wip) {
  reconcileChildren(wip, wip.props.children);
}

// 文本节点 document.createTextNode
export function updateHostTextComponent(wip) {
  //   console.log(wip, "wip host text");
  wip.stateNode = document.createTextNode(wip.props.children);
}
