import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from "./ReactWorkTags";
import { isFn, isStr, Placement, isUndefined } from "./utils";

function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type,
    key: vnode.key,
    stateNode: null, // 原生标签时候指dom节点，类组件时候指的是实例
    props: vnode.props,
    child: null, // 第一个子fiber
    sibling: null, // 下一个兄弟fiber
    return: returnFiber, // 父节点
    // 标记节点是什么类型的
    flags: Placement,
    // 老节点
    alternate: null,
    deletions: null, // 要删除子节点 null或者[]
    index: null, //当前层级下的下标，从0开始
  };

  const { type } = vnode;

  console.log(type, "typepppp");

  if (isStr(type)) {
    // 原生标签
    fiber.tag = HostComponent;
  } else if (isFn(type)) {
    // todo ... 函数组件或者是类组件
    fiber.tag = type.prototype.isComponent ? ClassComponent : FunctionComponent;
  } else if (isUndefined(type)) {
    // 为啥此处文本就是vnode ? todo ...
    console.log(vnode, "fiber hosttext");
    fiber.tag = HostText;
    fiber.props = { children: vnode };
  } else {
    fiber.tag = Fragment;
  }

  return fiber;
}

export default createFiber;
