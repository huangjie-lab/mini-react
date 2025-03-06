// ! flags
export const NoFlags = /*                      */ 0b00000000000000000000;

// 新增和插入
export const Placement = /*                    */ 0b0000000000000000000010; // 2
// 节点更新
export const Update = /*                       */ 0b0000000000000000000100; // 4
// 节点删除
export const Deletion = /*                     */ 0b0000000000000000001000; // 8

export function isStr(s) {
  return typeof s === "string";
}

export function isStringOrNumber(s) {
  return typeof s === "string" || typeof s === "number";
}

export function isFn(fn) {
  return typeof fn === "function";
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function isUndefined(a) {
  return a === undefined;
}

export function updateNode(vnode, prevVal, nextVal) {
  // 先移除旧节点上的属性
  Object.keys(prevVal).forEach((k) => {
    if (k === "children") {
      if (isStringOrNumber(prevVal[k])) {
        vnode.textContent = "";
      }
    } else if (k.slice(0, 2) === "on") {
      // 绑定了事件 good...
      const method = k.slice(2).toLocaleLowerCase();
      vnode.removeEventListener(method, prevVal[k]);
    } else if (!k in prevVal) {
      vnode[k] = "";
    }
  });
  // (单独下面的适用于初次渲染）
  Object.keys(nextVal).forEach((k) => {
    if (k === "children") {
      if (isStringOrNumber(nextVal[k])) {
        vnode.textContent = nextVal[k];
      }
    } else if (k.slice(0, 2) === "on") {
      // 绑定了事件 good...
      const method = k.slice(2).toLocaleLowerCase();
      vnode.addEventListener(method, nextVal[k]);
    } else {
      vnode[k] = nextVal[k];
    }
  });
}
