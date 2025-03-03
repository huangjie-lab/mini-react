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

export function updateNode(vnode, props) {
  Object.keys(props).forEach((k) => {
    if (k === "children") {
      if (isStringOrNumber(props[k])) {
        vnode.textContent = props[k];
      }
    } else {
      vnode[k] = props[k];
    }
  });
}
