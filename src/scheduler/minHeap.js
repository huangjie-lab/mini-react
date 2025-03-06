// 最小堆算法
export function push(heap, node) {
  heap.push(node);
  const last = heap.length - 1;
  siftUp(heap, node, last);
}
export function peak(heap) {
  return heap.length === 0 ? null : heap[0];
}
export function pop(heap) {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  const last = heap.pop();
  if (first !== last) {
    heap[0] = last;
    siftDown(heap, last, 0);
  }
  //   return first;
}

function siftDown(heap, node, i) {
  let index = i;
  const len = heap.length;
  const halfLen = len >> 1;
  while (index < halfLen) {
    const leftIndex = (index + 1) * 2 - 1;
    const rightIndex = leftIndex + 1;
    const left = heap[leftIndex];
    const right = heap[rightIndex];
    if (compare(left, node) < 0) {
      // left小
      if (rightIndex < len && compare(right, left) < 0) {
        // right小
        swap(heap, index, rightIndex);
        index = rightIndex;
      } else {
        // left小
        swap(heap, index, leftIndex);
        index = leftIndex;
      }
    } else {
      // node小
      if (rightIndex < len && compare(right, node) < 0) {
        // right小
        swap(heap, index, rightIndex);
        index = rightIndex;
      } else {
        break;
      }
    }
  }
}

// 向上调整最小堆
function siftUp(heap, node, last) {
  let index = last;
  while (index > 0) {
    const parentIndex = last >> 1;
    const parent = heap[parentIndex];
    if (compare(node, parent) < 0) {
      // parent大
      swap(heap, last, parentIndex);
      index = parentIndex;
    } else {
      // node大 不作调整
      break;
    }
  }
}

function compare(a, b) {
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

function swap(heap, left, right) {
  [heap[left], heap[right]] = [heap[right], heap[left]];
}
