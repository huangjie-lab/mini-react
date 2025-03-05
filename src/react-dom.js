import createFiber from "./ReactFiber";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

// 构造函数
function ReactDOMRoot(internalRoot) {
  this._internalRoot = internalRoot;
}

ReactDOMRoot.prototype.render = function (children) {
  // 最原始的vnode节点（jsx） 我们需要的是fiber结构的vnode
  console.log(children, "children");
  const root = this._internalRoot;
  // 原生dom节点
  console.log(root, "root");
  updateContainer(children, root);
};

// 初次渲染 组件到g根dom节点上
function updateContainer(element, container) {
  const { containerInfo } = container;
  const fiber = createFiber(element, {
    type: containerInfo.nodeName.toLocaleLowerCase(),
    stateNode: containerInfo,
  });
  // 组件初次渲染
  scheduleUpdateOnFiber(fiber);
}
function createRoot(container) {
  const root = { containerInfo: container };
  return new ReactDOMRoot(root);
}

// 一整个文件是ReactDOM, createRoot是ReactDOM上的一个方法
export default { createRoot };
