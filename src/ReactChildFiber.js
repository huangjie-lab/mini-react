import createFiber from "./ReactFiber";
import { isArray, isStringOrNumber, Update } from "./utils";

// 删除单个节点 先存储到父fiber的deletions上 然后commit的时候集中删除
export function deleteChild(returnFiber, childToDelete) {
  const deletions = returnFiber.deletions;
  if (deletions) {
    returnFiber.deletions.push(childToDelete);
  } else {
    returnFiber.deletions = [childToDelete];
  }
}

// 协调children生成fiber链表
export function reconcileChildren(wip, children) {
  const newChildren = isArray(children) ? children : [children];
  // old fiber头节点
  let oldFiber = wip.alternate?.child;
  //   为啥去掉这句就不能渲染了 todo ...?
  if (isStringOrNumber(children)) {
    return;
  }
  // 实现fiber的链表结构
  let previousNewFiber = null;
  for (let index = 0; index < newChildren.length; index++) {
    const newChild = newChildren[index];
    const newFiber = createFiber(newChild, wip);

    const same = sameNode(newFiber, oldFiber);
    // 更新复用
    if (same) {
      Object.assign(newFiber, {
        stateNode: oldFiber.stateNode,
        alternate: oldFiber,
        flags: Update, // 默认是Placement 新增
      });
    }
    if (!same && oldFiber) {
      // 删除节点
      deleteChild(wip, oldFiber);
    }
    // ?? todo...
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (index === 0) {
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    // 记录一下上次的fiber
    previousNewFiber = newFiber;
  }
}

// 节点复用的条件 同一层级 类型 key相同
function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}
