import createFiber from "./ReactFiber";
import { isArray, isStringOrNumber, updateNode } from "./utils";

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
    updateNode(wip.stateNode, wip.props);
  }
  // 子节点
  reconcileChildren(wip, wip.props.children);
}
export function updateFunctionComponent(wip) {
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

function reconcileChildren(wip, children) {
  const newChildren = isArray(children) ? children : [children];

  //   为啥去掉这句就不能渲染了 todo ...?
  if (isStringOrNumber(children)) {
    return;
  }
  // 实现fiber的链表结构
  let previousNewFiber = null;
  for (let index = 0; index < newChildren.length; index++) {
    const newChild = newChildren[index];
    const newFiber = createFiber(newChild, wip);
    if (index === 0) {
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    // 记录一下上次的fiber
    previousNewFiber = newFiber;
  }
}
