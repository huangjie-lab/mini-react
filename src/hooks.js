import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

let workInProgressHook = null;
let currentlyRenderingFiber = null;

// 供外部调用
export function renderWithHooks(fiber) {
  currentlyRenderingFiber = fiber;
  currentlyRenderingFiber.memorizedState = null;
  workInProgressHook = null;
}

// good 断点看 ...
function updateWorkInProgressHook() {
  let hook;
  //   上一次的节点 叫current
  let current = currentlyRenderingFiber.alternate;
  if (current) {
    // 组件更新
    currentlyRenderingFiber.memorizedState = current.memorizedState;
    if (workInProgressHook) {
      workInProgressHook = hook = workInProgressHook.next;
    } else {
      // hook0
      workInProgressHook = hook = currentlyRenderingFiber.memorizedState;
    }
  } else {
    // 初次渲染
    hook = {
      memorizedState: null, //state
      next: null,
    };
    if (workInProgressHook) {
      workInProgressHook = workInProgressHook.next = hook;
    } else {
      // hook0
      workInProgressHook = currentlyRenderingFiber.memorizedState = hook;
    }
  }

  return hook;
}

export function useReducer(reducer, initialState) {
  const hook = updateWorkInProgressHook();
  if (!currentlyRenderingFiber.alternate) {
    //初次渲染
    hook.memorizedState = initialState;
  }

  // 原生的
  // const dispatch = () => {
  //   hook.memorizedState = reducer(hook.memorizedState);
  //   // 触发更新 组件会重新渲染 那么就会有old fiber 记录到alternate中
  //   currentlyRenderingFiber.alternate = { ...currentlyRenderingFiber };
  //   // 先执行更新的任务 然后到该文件执行hook的更新 断点可以调试 逻辑有点复杂 需要断点看流程
  //   scheduleUpdateOnFiber(currentlyRenderingFiber);
  // };

  // const dispatch1 = dispatchReducerAction1.bind(
  //   null,
  //   currentlyRenderingFiber,
  //   hook,
  //   reducer
  // );

  // 参考redux中间件 封装了dispatch方法 借助bind方法和this指向返回一个新函数
  const dispatch = dispatchReducerAction.bind(
    currentlyRenderingFiber,
    hook,
    reducer
  );

  return [hook.memorizedState, dispatch];
}

// 使用useState时 action是setStte的参数 ？ why
function dispatchReducerAction(hook, reducer, action) {
  hook.memorizedState = reducer ? reducer(hook.memorizedState) : action;
  this.alternate = { ...this };
  this.sibling = null;
  scheduleUpdateOnFiber(this);
}

// function dispatchReducerAction1(fiber, hook, reducer, action) {
//   hook.memorizedState = reducer ? reducer(hook.memorizedState) : action;
//   fiber.alternate = { ...fiber };
//   fiber.sibling = null;
//   scheduleUpdateOnFiber(fiber);
// }

export function useState(initialState) {
  return useReducer(null, initialState);
}
