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
import { Placement, Update, updateNode } from "./utils";
import { scheduleCallback } from "./scheduler";
let wip = null; // work in progress 正在工作中的任务(fiber)
let wipRoot = null; // 记录一下根fiber 方便追加

export function scheduleUpdateOnFiber(fiber) {
  wip = fiber;
  wipRoot = fiber;
  scheduleCallback(workLoop);
  // scheduleCallback(() => {
  //   console.log("scheduleCallback1");
  // });
  // scheduleCallback(() => {
  //   console.log("scheduleCallback2");
  // });
  // scheduleCallback(() => {
  //   console.log("scheduleCallback3");
  // });
  // scheduleCallback(() => {
  //   console.log("scheduleCallbac4");
  // });
}

function performUnitOfWork() {
  const { tag } = wip;

  switch (tag) {
    // 原生标签 比如div span button p a
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
  // console.log(IdleDeadline.timeRemaining(), "IdleDeadline.timeRemaining()");

  // 最后wip 不满足终止循环
  // while (wip && IdleDeadline.timeRemaining() > 0) {
  //   performUnitOfWork();
  // }
  while (wip) {
    performUnitOfWork();
  }

  if (!wip && wipRoot) {
    commitRoot();
  }
}

// requestIdleCallback(workLoop);

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
  // 追加
  if (flags & Placement && stateNode) {
    // 函数组件prop.children的父级是函数组件名 再往上就是root根节点
    // const parentNode = wip.return.stateNode;
    const parentNode = getParentNode(wip.return);
    parentNode.appendChild(stateNode);
  }
  // 更新
  if (flags & Update && stateNode) {
    updateNode(stateNode, wip.alternate.props, wip.props);
  }
  // 删除
  if (wip.deletions) {
    // 通过父节点来删除
    commitDeletion(wip.deletions, stateNode || parentNode);
  }
  // 2.更新子节点
  commitWork(wip.child);
  // 3.更新兄弟节点
  commitWork(wip.sibling);
}

function commitDeletion(deletions, parentNode) {
  for (let i = 0; i < deletions.length; i++) {
    const deletion = deletions[i];
    // 但不一定每个子fiber都有stateNode
    parentNode.removeChild(getStateNode(deletion));
  }
}

function getStateNode(fiber) {
  const old = fiber;
  while (!old.stateNode) {
    old = old.child;
  }
  return old.stateNode;
}

function getParentNode(wip) {
  let next = wip;
  // next 最终会找到root根节点 return退出循环
  while (next) {
    if (next.stateNode) {
      return next.stateNode;
    }
    next = next.return;
  }
}

export default performUnitOfWork;
