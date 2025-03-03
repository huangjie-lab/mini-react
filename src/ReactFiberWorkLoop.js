import {
  ClassComponent,
  FunctionComponent,
  HostComponent,
  HostText,
  Fragment,
} from "./ReactWorkTags";
import {
  updateClassComponent,
  updateFragmentComponent,
  updateFunctionComponent,
  updateHostComponent,
  updateHostTextComponent,
} from "./ReactFiberReconciler";
import { isFn, Placement } from "./utils";
let wip = null; // work in progress 正在工作中的任务(fiber)
let wipRoot = null; // 记录一下根fiber 方便追加

export function scheduleUpdateOnFiber(fiber) {
  console.log(fiber, "fiberrrrrr");
  wip = fiber;
  wipRoot = fiber;
}

function performUnitOfWork() {
  const { tag } = wip;

  switch (tag) {
    case HostComponent:
      updateHostComponent(wip);
      break;
    case FunctionComponent:
      updateFunctionComponent(wip);
      break;
    case ClassComponent:
      updateClassComponent(wip);
      break;
    case Fragment:
      updateFragmentComponent(wip);
      break;
    case HostText:
      updateHostTextComponent(wip);
      break;
    default:
      break;
  }

  if (wip.child) {
    wip = wip.child;
    return;
  }
  // 为啥要用到一个next呢？
  let next = wip;
  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }
  wip = null;
}

function workLoop(IdleDeadline) {
  // 断点之后  IdleDeadline.timeRemaining() 就是 0了 ？
  console.log(IdleDeadline.timeRemaining(), "IdleDeadline.timeRemaining()");

  while (wip && IdleDeadline.timeRemaining() > 0) {
    performUnitOfWork();
  }

  if (!wip && wipRoot) {
    commitRoot();
  }
}

requestIdleCallback(workLoop);

function commitRoot() {
  commitWork(wipRoot);
  wipRoot = null;
}

function commitWork(wip) {
  if (!wip) {
    return false;
  }

  // 1.更新自己
  const { flags, stateNode, type } = wip;
  // todo ... ?
  if (flags & Placement && stateNode) {
    // 函数组件prop.children的父级是函数组件名 再往上就是root根节点
    // const parentNode = wip.return.stateNode;
    const parentNode = getParentNode(wip.return);
    parentNode.appendChild(stateNode);
  }
  // 2.更新子节点
  commitWork(wip.child);
  // 3.更新兄弟节点
  commitWork(wip.sibling);
}

function getParentNode(wip) {
  let next = wip;
  while (next) {
    if (next.stateNode) {
      return next.stateNode;
    }
    next = next.return;
  }
}

export default performUnitOfWork;
