## 任务调度和最小堆以及 useReducer 和 useState 需要断点调试

### 初次渲染 scheduleUpdateOnFiber

- 一个组件是一个 fiber，组件里面的标签等都是一个个的 fiber

1. 根据最原始的 vnode 节点（jsx） 调用 createFiber 方法生成我们需要的 fiber 结构的 vnode

```javascript
// 比如一个函数组件FunctionComponent 里面是
<div className="border">
  <p>段落</p>
  <button>按钮</button>
</div>
// 那最后的fiber结构
const fiber_ = {
    type:'div',
    props: {
        className: "border",
    },
    child: { // 第一个子节点
        type:'p',
        props:{children:'段落'}
        sibling:{  // 下一个兄弟节点
            type:'button'
            props:{children:'按钮'}
        }
    },
}
```

2. 根据 fiber 上不同 tag 属性调用不同的 fiber 渲染方法 该方法里面调用了 reconcileChildren 方法（协调 children 生成 fiber 链表） 递归生成 fiber 单链表结构

3. 处理完所有 fiber 和 子 fiber 后，开始往 root 节点里面进行递归提交，包括提交自己，第一个子节点，第一个子节点的兄弟节点（增删改查）的操作 调用了 commitRoot（commitWork）方法

4. 根据 flags 属性来判断是新增 还是更新 还是删除

   1. 新增则调用 dom 元素的 appendChild 方法
   2. 更新则根据新老节点对比 调用 updateNode 方法
   3. 删除则调用 commitDeletion 通过 removeChild（父 dom 和子 dom）来删除

5. 初始化结束

### 更新（更新操作无非就是 useState,useReducer 等改变了组件状态而导致更新）

所以在 hook 函数里 我们需要去调用 scheduleUpdateOnFiber 方法来出触发组件更新
然后回到了上面初次渲染一样的逻辑
