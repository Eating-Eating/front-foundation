## fiber：

|              | 是什么                                           | Fiber解决了什么问题        |
| ------------ | ------------------------------------------------ | -------------------------- |
| 架构层面     | Fiber Reconciler的基础单元，负责调度更新初始化等 | 更新无法停止，diff算法应用 |
| 数据结构     | React Element，组件类型，对应dom节点信息         |                            |
| 动态工作单元 | 改变的状态，要执行的工作                         |                            |

## 状态更新：

在`React`中，有如下方法可以触发状态更新（排除`SSR`相关）：

- ReactDOM.render
- this.setState
- this.forceUpdate
- useState
- useReducer

这些方法调用的场景各不相同，他们是如何接入同一套**状态更新机制**呢？

答案是：每次`状态更新`都会创建一个保存**更新状态相关内容**的对象，我们叫他`Update`。在`render阶段`的`beginWork`中会根据`Update`计算新的`state`。

```sh
触发状态更新（根据场景调用不同方法）

    |
    |
    v

创建Update对象（接下来三节详解）

    |
    |
    v

从fiber到root（`markUpdateLaneFromFiberToRoot`）

    |
    |
    v

调度更新（`ensureRootIsScheduled`）

    |
    |
    v

render阶段（`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`）

    |
    |
    v

commit阶段（`commitRoot`）
```



## hook：

|               | 是什么                                                       | 怎么用                       | hook解决了什么问题         |
| ------------- | ------------------------------------------------------------ | ---------------------------- | -------------------------- |
| hook          | 即fiber的动态工作单元时状态，无环单向链表的数据结构，其中有hook.queue属性，存放pending对象，即update对象 | 创建一个Functional Component | 在组件之间复用状态逻辑很难 |
| update对象    | 环形单向链表、queue永远指向新插入的update即fiber的动态工作单元时状态，无环单向链表的数据结构，其中有hook.queue属性，存放pending对象，即update对象 | update对象保存在queue中      | 复杂组件变得难以理解       |
| memoizedState | hook对象中存储的值，useContext没有，其他都有                 |                              | 难以理解的 class           |

useCallback/useMemo：函数本身/函数执行结果。`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

useState/useReducer：代替方案，管理组件内部多个状态时可以使用。单组件的Redux。

### useEffect:

commit阶段：分为before mutation/mutation/layout三个阶段，分别处理useEffectList以及一系列生命周期钩子