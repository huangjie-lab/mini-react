import createFiber from "./ReactFiber";
import { isArray, isStringOrNumber, Update } from "./utils";

// 批量删除残余子节点
function deleteRemainingChildren(returnFiber, currentFirstChild) {
  let childToDelete = currentFirstChild;
  while (childToDelete) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
}

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
export function reconcileChildren(returnFiber, children) {
  const newChildren = isArray(children) ? children : [children];
  // old fiber头节点
  let oldFiber = returnFiber.alternate?.child;
  //   为啥去掉这句就不能渲染了 todo ...？ 现在不会了 但是会出现两个相同的元素
  if (isStringOrNumber(children)) {
    return;
  }
  // 实现fiber的链表结构
  let previousNewFiber = null;
  let newIndex = 0;
  for (newIndex = 0; newIndex < newChildren.length; newIndex++) {
    const newChild = newChildren[newIndex];

    // 如果newChil为null,会在createFiber中报错
    if (newChild === null) {
      continue;
    }

    const newFiber = createFiber(newChild, returnFiber);

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
      deleteChild(returnFiber, oldFiber);
    }
    // ?? todo...
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    // 第一个子fiber 好比nexIndex===0
    if (previousNewFiber === null) {
      returnFiber.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    // 记录一下上次的fiber
    previousNewFiber = newFiber;
  }

  if (newIndex === newChildren.length) {
    deleteRemainingChildren(returnFiber, oldFiber);
    return;
  }
}

// 节点复用的条件 同一层级 类型 key相同
function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}
