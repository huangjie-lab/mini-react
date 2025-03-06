import { peak, pop, push } from "./minHeap";

let taskQueue = [];
let taskIdCounter = 1;

export function scheduleCallback(callback) {
  const currentTime = getCurrntTime();

  // 暂时当作都不可等待
  const timeout = -1;
  const expirtationTime = currentTime - timeout;

  const newTask = {
    sortIndex: expirtationTime,
    id: taskIdCounter++,
    callback,
    expirtationTime,
  };

  push(taskQueue, newTask);

  //   请求调度
  requestHostCallback();
}

// 创建一个宏任务
function requestHostCallback() {
  port.postMessage(null);
}

const channel = new MessageChannel();

const port = channel.port1;

channel.port2.onmessage = function () {
  workLoop();
};

function workLoop() {
  let currentTask = peak(taskQueue);
  while (currentTask) {
    const callback = currentTask.callback;
    // 防止重复执行
    currentTask.callback = null;
    callback && callback();
    // 执行完从任务队列清楚 并重新调整最小堆
    pop(taskQueue);
    currentTask = peak(taskQueue);
  }
}

function getCurrntTime() {
  return performance.now();
}
