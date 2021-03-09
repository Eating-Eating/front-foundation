## React16架构

React16架构可以分为三层：

- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入**Reconciler**
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

可以看到，相较于React15，React16中新增了**Scheduler（调度器）**，让我们来了解下他。

### Scheduler（调度器）

既然我们以浏览器是否有剩余时间作为任务中断的标准，那么我们需要一种机制，当浏览器有剩余时间时通知我们。

其实部分浏览器已经实现了这个API，这就是[requestIdleCallback (opens new window)](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)。但是由于以下因素，`React`放弃使用：

- 浏览器兼容性
- 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换tab后，之前tab注册的`requestIdleCallback`触发的频率会变得很低

基于以上原因，`React`实现了功能更完备的`requestIdleCallback`polyfill，这就是**Scheduler**。除了在空闲时触发回调的功能外，**Scheduler**还提供了多种调度优先级供任务设置。

> [Scheduler (opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/scheduler/README.md)是独立于`React`的库

### Reconciler（协调器）

我们知道，在React15中**Reconciler**是递归处理虚拟DOM的。让我们看看[React16的Reconciler (opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L1673)。

我们可以看见，更新工作从递归变成了可以中断的循环过程。每次循环都会调用`shouldYield`判断当前是否有剩余时间。

```js
/** @noinline */
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}
```

那么React16是如何解决中断更新时DOM渲染不完全的问题呢？

在React16中，**Reconciler**与**Renderer**不再是交替工作。当**Scheduler**将任务交给**Reconciler**后，**Reconciler**会为变化的虚拟DOM打上代表增/删/更新的标记，类似这样：

```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```

> 全部的标记见[这里(opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactSideEffectTags.js)

整个**Scheduler**与**Reconciler**的工作都在内存中进行。只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**。

> 你可以在[这里 (opens new window)](https://zh-hans.reactjs.org/docs/codebase-overview.html#fiber-reconciler)看到`React`官方对React16新**Reconciler**的解释

### Renderer（渲染器）

**Renderer**根据**Reconciler**为虚拟DOM打的标记，同步执行对应的DOM操作。

所以，对于我们在上一节使用过的Demo

<details class="custom-block details" style="display: block; position: relative; border-radius: 2px; margin: 1.6em 0px; padding: 1.6em; background-color: rgb(238, 238, 238); color: rgb(44, 62, 80); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, Cantarell, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; font-size: 16px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;"><summary style="outline: none; cursor: pointer;">乘法小Demo</summary></details>

在React16架构中整个更新流程为：

![更新流程](https://react.iamkasong.com/img/process.png)

其中红框中的步骤随时可能由于以下原因被中断：

- 有其他更高优任务需要先更新
- 当前帧没有剩余时间

由于红框中的工作都在内存中进行，不会更新页面上的DOM，所以即使反复中断，用户也不会看见更新不完全的DOM（即上一节演示的情况）。

> 实际上，由于**Scheduler**和**Reconciler**都是平台无关的，所以`React`为他们单独发了一个包[react-Reconciler (opens new window)](https://www.npmjs.com/package/react-reconciler)。你可以用这个包自己实现一个`ReactDOM`，具体见**参考资料

### 代数效应与Fiber

`Fiber`并不是计算机术语中的新名词，他的中文翻译叫做`纤程`，与进程（Process）、线程（Thread）、协程（Coroutine）同为程序执行过程。

在很多文章中将`纤程`理解为`协程`的一种实现。在`JS`中，`协程`的实现便是`Generator`。

所以，我们可以将`纤程`(Fiber)、`协程`(Generator)理解为`代数效应`思想在`JS`中的体现。

`React Fiber`可以理解为：

`React`内部实现的一套状态更新机制。支持任务不同`优先级`，可中断与恢复，并且恢复后可以复用之前的`中间状态`。

其中每个任务更新单元为`React Element`对应的`Fiber节点`。

### Fiber的起源

> 最早的`Fiber`官方解释来源于[2016年React团队成员Acdlite的一篇介绍 (opens new window)](https://github.com/acdlite/react-fiber-architecture)。

从上一章的学习我们知道：

在`React15`及以前，`Reconciler`采用递归的方式创建虚拟DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。

为了解决这个问题，`React16`将**递归的无法中断的更新**重构为**异步的可中断更新**，由于曾经用于递归的**虚拟DOM**数据结构已经无法满足需要。于是，全新的`Fiber`架构应运而生。

## Fiber的含义

`Fiber`包含三层含义：

1. 作为架构来说，之前`React15`的`Reconciler`采用递归的方式执行，数据保存在递归调用栈中，所以被称为`stack Reconciler`。`React16`的`Reconciler`基于`Fiber节点`实现，被称为`Fiber Reconciler`。
2. 作为静态的数据结构来说，每个`Fiber节点`对应一个`React element`，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
3. 作为动态的工作单元来说，每个`Fiber节点`保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

### Fiber的结构

你可以从这里看到[Fiber节点的属性定义 (opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117)。虽然属性很多，但我们可以按三层含义将他们分类来看

```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // 作为静态数据结构的属性
  this.tag = tag;
  this.key = key;
  this.elementType = null;
  this.type = null;
  this.stateNode = null;

  // 用于连接其他Fiber节点形成Fiber树
  this.return = null;
  this.child = null;
  this.sibling = null;
  this.index = 0;

  this.ref = null;

  // 作为动态的工作单元的属性
  this.pendingProps = pendingProps;
  this.memoizedProps = null;
  this.updateQueue = null;
  this.memoizedState = null;
  this.dependencies = null;

  this.mode = mode;

  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  // 调度优先级相关
  this.lanes = NoLanes;
  this.childLanes = NoLanes;

  // 指向该fiber在另一次更新时对应的fiber
  this.alternate = null;
}
```

### 作为架构来说

每个Fiber节点有个对应的`React element`，多个`Fiber节点`是如何连接形成树呢？靠如下三个属性：

```js
// 指向父级Fiber节点
this.return = null;
// 指向子Fiber节点
this.child = null;
// 指向右边第一个兄弟Fiber节点
this.sibling = null;
```

举个例子，如下的组件结构：

```js
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  )
}
```

对应的`Fiber树`结构： ![Fiber架构](https://react.iamkasong.com/img/fiber.png)

> 这里需要提一下，为什么父级指针叫做`return`而不是`parent`或者`father`呢？因为作为一个工作单元，`return`指节点执行完`completeWork`（本章后面会介绍）后会返回的下一个节点。子`Fiber节点`及其兄弟节点完成工作后会返回其父级节点，所以用`return`指代父级节点。

### 作为静态的数据结构

作为一种静态的数据结构，保存了组件相关的信息：

```js
// Fiber对应组件的类型 Function/Class/Host...
this.tag = tag;
// key属性
this.key = key;
// 大部分情况同type，某些情况不同，比如FunctionComponent使用React.memo包裹
this.elementType = null;
// 对于 FunctionComponent，指函数本身，对于ClassComponent，指class，对于HostComponent，指DOM节点tagName
this.type = null;
// Fiber对应的真实DOM节点
this.stateNode = null;
```

### 作为动态的工作单元

作为动态的工作单元，`Fiber`中如下参数保存了本次更新相关的信息，我们会在后续的更新流程中使用到具体属性时再详细介绍

```js
// 保存本次更新造成的状态改变相关信息
this.pendingProps = pendingProps;
this.memoizedProps = null;
this.updateQueue = null;
this.memoizedState = null;
this.dependencies = null;

this.mode = mode;

// 保存本次更新会造成的DOM操作
this.effectTag = NoEffect;
this.nextEffect = null;

this.firstEffect = null;
this.lastEffect = null;
```

如下两个字段保存调度优先级相关的信息，会在讲解`Scheduler`时介绍。

```js
// 调度优先级相关
this.lanes = NoLanes;
this.childLanes = NoLanes;
```

注意

在2020年5月，调度优先级策略经历了比较大的重构。以`expirationTime`属性为代表的优先级模型被`lane`取代。详见[这个PR(opens new window)](https://github.com/facebook/react/pull/18796)

如果你的源码中`fiber.expirationTime`仍存在，请参照[调试源码](https://react.iamkasong.com/preparation/source.html)章节获取最新代码。

### 什么是“双缓存”

当我们用`canvas`绘制动画，每一帧绘制前都会调用`ctx.clearRect`清除上一帧的画面。

如果当前帧画面计算量比较大，导致清除上一帧画面到绘制当前帧画面之间有较长间隙，就会出现白屏。

为了解决这个问题，我们可以在内存中绘制当前帧动画，绘制完毕后直接用当前帧替换上一帧画面，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。

这种**在内存中构建并直接替换**的技术叫做[双缓存 (opens new window)](https://baike.baidu.com/item/双缓冲)。

`React`使用“双缓存”来完成`Fiber树`的构建与替换——对应着`DOM树`的创建与更新。

### 双缓存Fiber树

在`React`中最多会同时存在两棵`Fiber树`。当前屏幕上显示内容对应的`Fiber树`称为`current Fiber树`，正在内存中构建的`Fiber树`称为`workInProgress Fiber树`。

`current Fiber树`中的`Fiber节点`被称为`current fiber`，`workInProgress Fiber树`中的`Fiber节点`被称为`workInProgress fiber`，他们通过`alternate`属性连接。

```js
currentFiber.alternate === workInProgressFiber;
workInProgressFiber.alternate === currentFiber;
```

`React`应用的根节点通过`current`指针在不同`Fiber树`的`rootFiber`间切换来实现`Fiber树`的切换。

当`workInProgress Fiber树`构建完成交给`Renderer`渲染在页面上后，应用根节点的`current`指针指向`workInProgress Fiber树`，此时`workInProgress Fiber树`就变为`current Fiber树`。

每次状态更新都会产生新的`workInProgress Fiber树`，通过`current`与`workInProgress`的替换，完成`DOM`更新。

接下来我们以具体例子讲解`mount时`、`update时`的构建/替换流程。

### mount时

考虑如下例子：

```js
function App() {
  const [num, add] = useState(0);
  return (
    <p onClick={() => add(num + 1)}>{num}</p>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));
```

1. 首次执行`ReactDOM.render`会创建`fiberRootNode`（源码中叫`fiberRoot`）和`rootFiber`。其中`fiberRootNode`是整个应用的根节点，`rootFiber`是`<App/>`所在组件树的根节点。

之所以要区分`fiberRootNode`与`rootFiber`，是因为在应用中我们可以多次调用`ReactDOM.render`渲染不同的组件树，他们会拥有不同的`rootFiber`。但是整个应用的根节点只有一个，那就是`fiberRootNode`。

`fiberRootNode`的`current`会指向当前页面上已渲染内容对应对`Fiber树`，被称为`current Fiber树`。

![rootFiber](https://react.iamkasong.com/img/rootfiber.png)

```js
fiberRootNode.current = rootFiber;
```

由于是首屏渲染，页面中还没有挂载任何`DOM`，所以`fiberRootNode.current`指向的`rootFiber`没有任何`子Fiber节点`（即`current Fiber树`为空）。

1. 接下来进入`render阶段`，根据组件返回的`JSX`在内存中依次创建`Fiber节点`并连接在一起构建`Fiber树`，被称为`workInProgress Fiber树`。（下图中右侧为内存中构建的树，左侧为页面显示的树）

在构建`workInProgress Fiber树`时会尝试复用`current Fiber树`中已有的`Fiber节点`内的属性，在`首屏渲染`时只有`rootFiber`存在对应的`current fiber`（即`rootFiber.alternate`）。

![workInProgressFiber](https://react.iamkasong.com/img/workInProgressFiber.png)

1. 图中右侧已构建完的`workInProgress Fiber树`在`commit阶段`渲染到页面。

此时`DOM`更新为右侧树对应的样子。`fiberRootNode`的`current`指针指向`workInProgress Fiber树`使其变为`current Fiber 树`。

![workInProgressFiberFinish](https://react.iamkasong.com/img/wipTreeFinish.png)

### update时

1. 接下来我们点击`p节点`触发状态改变，这会开启一次新的`render阶段`并构建一棵新的`workInProgress Fiber 树`。

![wipTreeUpdate](https://react.iamkasong.com/img/wipTreeUpdate.png)

和`mount`时一样，`workInProgress fiber`的创建可以复用`current Fiber树`对应的节点数据。

> 这个决定是否复用的过程就是Diff算法，后面章节会详细讲解

1. `workInProgress Fiber 树`在`render阶段`完成构建后进入`commit阶段`渲染到页面上。渲染完毕后，`workInProgress Fiber 树`变为`current Fiber 树`。

![currentTreeUpdate](https://react.iamkasong.com/img/currentTreeUpdate.png)

### render阶段

render阶段开始于performSyncWorkOnRoot或performConcurrentWorkOnRoot方法的调用。这取决于本次更新是同步更新还是异步更新。

我们现在还不需要学习这两个方法，只需要知道在这两个方法中会调用如下两个方法：

```js
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress);
  }
}

// performConcurrentWorkOnRoot会调用该方法
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress);
  }
}
```

可以看到，他们唯一的区别是是否调用shouldYield。如果当前浏览器帧没有剩余时间，shouldYield会中止循环，直到浏览器有空闲时间后再继续遍历。

workInProgress代表当前已创建的workInProgress fiber。

performUnitOfWork方法会创建下一个Fiber节点并赋值给workInProgress，并将workInProgress与已创建的Fiber节点连接起来构成Fiber树。

你可以从这里 (opens new window)看到workLoopConcurrent的源码

我们知道Fiber Reconciler是从Stack Reconciler重构而来，通过遍历的方式实现可中断的递归，所以performUnitOfWork的工作可以分为两部分：“递”和“归”。

#“递”阶段
首先从rootFiber开始向下深度优先遍历。为遍历到的每个Fiber节点调用beginWork方法 (opens new window)。

该方法会根据传入的Fiber节点创建子Fiber节点，并将这两个Fiber节点连接起来。

当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段。

#“归”阶段
在“归”阶段会调用completeWork (opens new window)处理Fiber节点。

当某个Fiber节点执行完completeWork，如果其存在兄弟Fiber节点（即fiber.sibling !== null），会进入其兄弟Fiber的“递”阶段。

如果不存在兄弟Fiber，会进入父级Fiber的“归”阶段。

“递”和“归”阶段会交错执行直到“归”到rootFiber。至此，render阶段的工作就结束了。

#例子
以上一节的例子举例：
```js

function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  )
}
```
ReactDOM.render(<App />, document.getElementById("root"));
对应的Fiber树结构： Fiber架构

render阶段会依次执行：
```js
1. rootFiber beginWork
2. App Fiber beginWork
3. div Fiber beginWork
4. "i am" Fiber beginWork
5. "i am" Fiber completeWork
6. span Fiber beginWork
7. span Fiber completeWork
8. div Fiber completeWork
9. App Fiber completeWork
10. rootFiber completeWork
```

之所以没有 “KaSong” Fiber 的 beginWork/completeWork，是因为作为一种性能优化手段，针对只有单一文本子节点的Fiber，React会特殊处理。

### commit阶段

`commitRoot`方法是`commit阶段`工作的起点。`fiberRootNode`会作为传参。

```js
commitRoot(root);
```

在`rootFiber.firstEffect`上保存了一条需要执行`副作用`的`Fiber节点`的单向链表`effectList`，这些`Fiber节点`的`updateQueue`中保存了变化的`props`。

这些`副作用`对应的`DOM操作`在`commit`阶段执行。

除此之外，一些生命周期钩子（比如`componentDidXXX`）、`hook`（比如`useEffect`）需要在`commit`阶段执行。

`commit`阶段的主要工作（即`Renderer`的工作流程）分为三部分：

- before mutation阶段（执行`DOM`操作前）
- mutation阶段（执行`DOM`操作）
- layout阶段（执行`DOM`操作后）

你可以从[这里 (opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2001)看到`commit`阶段的完整代码

在`before mutation阶段`之前和`layout阶段`之后还有一些额外工作，涉及到比如`useEffect`的触发、`优先级相关`的重置、`ref`的绑定/解绑。

这些对我们当前属于超纲内容，为了内容完整性，在这节简单介绍。

#### before mutation之前

`commitRootImpl`方法中直到第一句`if (firstEffect !== null)`之前属于`before mutation`之前。

我们大体看下他做的工作，现在你还不需要理解他们：

```js
do {
    // 触发useEffect回调与其他同步任务。由于这些任务可能触发新的渲染，所以这里要一直遍历执行直到没有任务
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);

  // root指 fiberRootNode
  // root.finishedWork指当前应用的rootFiber
  const finishedWork = root.finishedWork;

  // 凡是变量名带lane的都是优先级相关
  const lanes = root.finishedLanes;
  if (finishedWork === null) {
    return null;
  }
  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  // 重置Scheduler绑定的回调函数
  root.callbackNode = null;
  root.callbackId = NoLanes;

  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  // 重置优先级相关变量
  markRootFinished(root, remainingLanes);

  // 清除已完成的discrete updates，例如：用户鼠标点击触发的更新。
  if (rootsWithPendingDiscreteUpdates !== null) {
    if (
      !hasDiscreteLanes(remainingLanes) &&
      rootsWithPendingDiscreteUpdates.has(root)
    ) {
      rootsWithPendingDiscreteUpdates.delete(root);
    }
  }

  // 重置全局变量
  if (root === workInProgressRoot) {
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  } else {
  }

  // 将effectList赋值给firstEffect
  // 由于每个fiber的effectList只包含他的子孙节点
  // 所以根节点如果有effectTag则不会被包含进来
  // 所以这里将有effectTag的根节点插入到effectList尾部
  // 这样才能保证有effect的fiber都在effectList中
  let firstEffect;
  if (finishedWork.effectTag > PerformedWork) {
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // 根节点没有effectTag
    firstEffect = finishedWork.firstEffect;
  }
```

可以看到，`before mutation`之前主要做一些变量赋值，状态重置的工作。

这一长串代码我们只需要关注最后赋值的`firstEffect`，在`commit`的三个子阶段都会用到他。

#### layout之后

接下来让我们简单看下`layout`阶段执行完后的代码，现在你还不需要理解他们：

```js
const rootDidHavePassiveEffects = rootDoesHavePassiveEffects;

// useEffect相关
if (rootDoesHavePassiveEffects) {
  rootDoesHavePassiveEffects = false;
  rootWithPendingPassiveEffects = root;
  pendingPassiveEffectsLanes = lanes;
  pendingPassiveEffectsRenderPriority = renderPriorityLevel;
} else {}

// 性能优化相关
if (remainingLanes !== NoLanes) {
  if (enableSchedulerTracing) {
    // ...
  }
} else {
  // ...
}

// 性能优化相关
if (enableSchedulerTracing) {
  if (!rootDidHavePassiveEffects) {
    // ...
  }
}

// ...检测无限循环的同步任务
if (remainingLanes === SyncLane) {
  // ...
} 

// 在离开commitRoot函数前调用，触发一次新的调度，确保任何附加的任务被调度
ensureRootIsScheduled(root, now());

// ...处理未捕获错误及老版本遗留的边界问题


// 执行同步任务，这样同步任务不需要等到下次事件循环再执行
// 比如在 componentDidMount 中执行 setState 创建的更新会在这里被同步执行
// 或useLayoutEffect
flushSyncCallbackQueue();

return null;
```

> 你可以在[这里 (opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L2195)看到这段代码

主要包括三点内容：

1. `useEffect`相关的处理。

我们会在讲解`layout阶段`时讲解。

1. 性能追踪相关。

源码里有很多和`interaction`相关的变量。他们都和追踪`React`渲染时间、性能相关，在[Profiler API (opens new window)](https://zh-hans.reactjs.org/docs/profiler.html)和[DevTools (opens new window)](https://github.com/facebook/react-devtools/pull/1069)中使用。

> 你可以在这里看到[interaction的定义(opens new window)](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16#overview)

1. 在`commit`阶段会触发一些生命周期钩子（如 `componentDidXXX`）和`hook`（如`useLayoutEffect`、`useEffect`）。

在这些回调方法中可能触发新的更新，新的更新会开启新的`render-commit`流程。

### react Diff

一个DOM节点在某一时刻最多会有4个节点和他相关。

current Fiber。如果该DOM节点已在页面中，current Fiber代表该DOM节点对应的Fiber节点。

workInProgress Fiber。如果该DOM节点将在本次更新中渲染到页面中，workInProgress Fiber代表该DOM节点对应的Fiber节点。

DOM节点本身。

JSX对象。即ClassComponent的render方法的返回结果，或FunctionComponent的调用结果。JSX对象中包含描述DOM节点的信息。

Diff算法的本质是对比1和4，生成2。

#### Diff的瓶颈以及React如何应对
由于`Diff`操作本身也会带来性能损耗，React文档中提到，即使在最前沿的算法中，将前后两棵树完全比对的算法的复杂程度为 O(n 3 )，其中`n`是树中元素的数量。

如果在`React`中使用了该算法，那么展示1000个元素所需要执行的计算量将在十亿的量级范围。这个开销实在是太过高昂。

为了降低算法复杂度，React的diff会预设三个限制：

1. 只对同级元素进行`Diff`。如果一个`DOM节点`在前后两次更新中跨越了层级，那么`React`不会尝试复用他。
2. 两个不同类型的元素会产生出不同的树。如果元素由`div`变为`p`，React会销毁`div`及其子孙节点，并新建`p`及其子孙节点。
3. 开发者可以通过 `key prop`来暗示哪些子元素在不同的渲染下能保持稳定。考虑如下例子：

```js
// 更新前
<div>
  <p key="ka">ka</p>
  <h3 key="song">song</h3>
</div>

// 更新后
<div>
  <h3 key="song">song</h3>
  <p key="ka">ka</p>
</div>
```
如果没有key，React会认为div的第一个子节点由p变为h3，第二个子节点由h3变为p。这符合限制2的设定，会销毁并新建。

但是当我们用key指明了节点前后对应关系后，React知道key === "ka"的p在更新后还存在，所以DOM节点可以复用，只是需要交换下顺序。

这就是React为了应对算法性能瓶颈做出的三条限制。

### 状态更新

在开始学习前，我们先了解源码中几个关键节点（即几个关键函数的调用）。通过这章的学习，我们会将这些关键节点的调用路径串起来。

先从我们所熟知的概念开始。

#### render阶段的开始

我们在[render阶段流程概览一节](https://react.iamkasong.com/process/reconciler.html)讲到，

`render阶段`开始于`performSyncWorkOnRoot`或`performConcurrentWorkOnRoot`方法的调用。这取决于本次更新是同步更新还是异步更新。

#### commit阶段的开始

我们在[commit阶段流程概览一节](https://react.iamkasong.com/renderer/prepare.html)讲到，

`commit阶段`开始于`commitRoot`方法的调用。其中`rootFiber`会作为传参。

我们已经知道，`render阶段`完成后会进入`commit阶段`。让我们继续补全从`触发状态更新`到`render阶段`的路径。

```sh
触发状态更新（根据场景调用不同方法）

    |
    |
    v

    ？

    |
    |
    v

render阶段（`performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot`）

    |
    |
    v

commit阶段（`commitRoot`）
```

#### 创建Update对象

在`React`中，有如下方法可以触发状态更新（排除`SSR`相关）：

- ReactDOM.render
- this.setState
- this.forceUpdate
- useState
- useReducer

这些方法调用的场景各不相同，他们是如何接入同一套**状态更新机制**呢？

答案是：每次`状态更新`都会创建一个保存**更新状态相关内容**的对象，我们叫他`Update`。在`render阶段`的`beginWork`中会根据`Update`计算新的`state`。

我们会在下一节详细讲解`Update`。

#### 从fiber到root

现在`触发状态更新的fiber`上已经包含`Update`对象。

我们知道，`render阶段`是从`rootFiber`开始向下遍历。那么如何从`触发状态更新的fiber`得到`rootFiber`呢？

答案是：调用`markUpdateLaneFromFiberToRoot`方法。

> 你可以从[这里 (opens new window)](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L636)看到`markUpdateLaneFromFiberToRoot`的源码

该方法做的工作可以概括为：从`触发状态更新的fiber`一直向上遍历到`rootFiber`，并返回`rootFiber`。

由于不同更新优先级不尽相同，所以过程中还会更新遍历到的`fiber`的优先级。这对于我们当前属于超纲内容。

#### 调度更新

现在我们拥有一个`rootFiber`，该`rootFiber`对应的`Fiber树`中某个`Fiber节点`包含一个`Update`。

接下来通知`Scheduler`根据**更新**的优先级，决定以**同步**还是**异步**的方式调度本次更新。

这里调用的方法是`ensureRootIsScheduled`。

以下是`ensureRootIsScheduled`最核心的一段代码：

```js
if (newCallbackPriority === SyncLanePriority) {
  // 任务已经过期，需要同步执行render阶段
  newCallbackNode = scheduleSyncCallback(
    performSyncWorkOnRoot.bind(null, root)
  );
} else {
  // 根据任务优先级异步执行render阶段
  var schedulerPriorityLevel = lanePriorityToSchedulerPriority(
    newCallbackPriority
  );
  newCallbackNode = scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root)
  );
}
```

> 你可以从[这里 (opens new window)](https://github.com/facebook/react/blob/b6df4417c79c11cfb44f965fab55b573882b1d54/packages/react-reconciler/src/ReactFiberWorkLoop.new.js#L602)看到`ensureRootIsScheduled`的源码

其中，`scheduleCallback`和`scheduleSyncCallback`会调用`Scheduler`提供的调度方法根据`优先级`调度回调函数执行。

可以看到，这里调度的回调函数为：

```js
performSyncWorkOnRoot.bind(null, root);
performConcurrentWorkOnRoot.bind(null, root);
```

即`render阶段`的入口函数。

至此，`状态更新`就和我们所熟知的`render阶段`连接上了。

#### 总结

让我们梳理下`状态更新`的整个调用路径的关键节点：

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

### Hook

为了更好理解`Hooks`原理，这一节我们遵循`React`的运行流程，实现一个不到100行代码的极简`useState Hook`。建议对照着代码来看本节内容。

#### 工作原理

对于`useState Hook`，考虑如下例子：

```js
function App() {
  const [num, updateNum] = useState(0);

  return <p onClick={() => updateNum(num => num + 1)}>{num}</p>;
}
```

可以将工作分为两部分：

1. 通过一些途径产生`更新`，`更新`会造成组件`render`。
2. 组件`render`时`useState`返回的`num`为更新后的结果。

其中`步骤1`的`更新`可以分为`mount`和`update`：

1. 调用`ReactDOM.render`会产生`mount`的`更新`，`更新`内容为`useState`的`initialValue`（即`0`）。
2. 点击`p`标签触发`updateNum`会产生一次`update`的`更新`，`更新`内容为`num => num + 1`。

接下来讲解这两个步骤如何实现。

#### 更新是什么

> 1. 通过一些途径产生`更新`，`更新`会造成组件`render`。

首先我们要明确`更新`是什么。

在我们的极简例子中，`更新`就是如下数据结构：

```js
const update = {
  // 更新执行的函数
  action,
  // 与同一个Hook的其他更新形成链表
  next: null
}
```

对于`App`来说，点击`p`标签产生的`update`的`action`为`num => num + 1`。

如果我们改写下`App`的`onClick`：

```js
// 之前
return <p onClick={() => updateNum(num => num + 1)}>{num}</p>;

// 之后
return <p onClick={() => {
  updateNum(num => num + 1);
  updateNum(num => num + 1);
  updateNum(num => num + 1);
}}>{num}</p>;
```

那么点击`p`标签会产生三个`update`。

#### update数据结构

这些`update`是如何组合在一起呢？

答案是：他们会形成`环状单向链表`。

调用`updateNum`实际调用的是`dispatchAction.bind(null, hook.queue)`，我们先来了解下这个函数：

```js
function dispatchAction(queue, action) {
  // 创建update
  const update = {
    action,
    next: null
  }

  // 环状单向链表操作
  if (queue.pending === null) {
    update.next = update;
  } else {
    update.next = queue.pending.next;
    queue.pending.next = update;
  }
  queue.pending = update;

  // 模拟React开始调度更新
  schedule();
}
```

环状链表操作不太容易理解，这里我们详细讲解下。

当产生第一个`update`（我们叫他`u0`），此时`queue.pending === null`。

`update.next = update;`即`u0.next = u0`，他会和自己首尾相连形成`单向环状链表`。

然后`queue.pending = update;`即`queue.pending = u0`

```js
queue.pending = u0 ---> u0
                ^       |
                |       |
                ---------
```

当产生第二个`update`（我们叫他`u1`），`update.next = queue.pending.next;`，此时`queue.pending.next === u0`， 即`u1.next = u0`。

`queue.pending.next = update;`，即`u0.next = u1`。

然后`queue.pending = update;`即`queue.pending = u1`

```js
queue.pending = u1 ---> u0   
                ^       |
                |       |
                ---------
```

你可以照着这个例子模拟插入多个`update`的情况，会发现`queue.pending`始终指向最后一个插入的`update`。

这样做的好处是，当我们要遍历`update`时，`queue.pending.next`指向第一个插入的`update`。

#### 状态如何保存

现在我们知道，`更新`产生的`update`对象会保存在`queue`中。

不同于`ClassComponent`的实例可以存储数据，对于`FunctionComponent`，`queue`存储在哪里呢？

答案是：`FunctionComponent`对应的`fiber`中。

我们使用如下精简的`fiber`结构：

```js
// App组件对应的fiber对象
const fiber = {
  // 保存该FunctionComponent对应的Hooks链表
  memoizedState: null,
  // 指向App函数
  stateNode: App
};
```

#### Hook数据结构

接下来我们关注`fiber.memoizedState`中保存的`Hook`的数据结构。

可以看到，`Hook`与`update`类似，都通过`链表`连接。不过`Hook`是`无环`的`单向链表`。

```js
hook = {
  // 保存update的queue，即上文介绍的queue
  queue: {
    pending: null
  },
  // 保存hook对应的state
  memoizedState: initialState,
  // 与下一个Hook连接形成单向无环链表
  next: null
}
```

注意

注意区分`update`与`hook`的所属关系：

每个`useState`对应一个`hook`对象。

调用`const [num, updateNum] = useState(0);`时`updateNum`（即上文介绍的`dispatchAction`）产生的`update`保存在`useState`对应的`hook.queue`中。

#### 模拟React调度更新流程

在上文`dispatchAction`末尾我们通过`schedule`方法模拟`React`调度更新流程。

```js
function dispatchAction(queue, action) {
  // ...创建update
  
  // ...环状单向链表操作

  // 模拟React开始调度更新
  schedule();
}
```

现在我们来实现他。

我们用`isMount`变量指代是`mount`还是`update`。

```js
// 首次render时是mount
isMount = true;

function schedule() {
  // 更新前将workInProgressHook重置为fiber保存的第一个Hook
  workInProgressHook = fiber.memoizedState;
  // 触发组件render
  fiber.stateNode();
  // 组件首次render为mount，以后再触发的更新为update
  isMount = false;
}
```

通过`workInProgressHook`变量指向当前正在工作的`hook`。

```js
workInProgressHook = fiber.memoizedState;
```

在组件`render`时，每当遇到下一个`useState`，我们移动`workInProgressHook`的指针。

```js
workInProgressHook = workInProgressHook.next;
```

这样，只要每次组件`render`时`useState`的调用顺序及数量保持一致，那么始终可以通过`workInProgressHook`找到当前`useState`对应的`hook`对象。

到此为止，我们已经完成第一步。

> 1. 通过一些途径产生`更新`，`更新`会造成组件`render`。

接下来实现第二步。

> 1. 组件`render`时`useState`返回的`num`为更新后的结果。

#### 计算state

组件`render`时会调用`useState`，他的大体逻辑如下：

```js
function useState(initialState) {
  // 当前useState使用的hook会被赋值该该变量
  let hook;

  if (isMount) {
    // ...mount时需要生成hook对象
  } else {
    // ...update时从workInProgressHook中取出该useState对应的hook
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    // ...根据queue.pending中保存的update更新state
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}
```

我们首先关注如何获取`hook`对象：

```js
if (isMount) {
  // mount时为该useState生成hook
  hook = {
    queue: {
      pending: null
    },
    memoizedState: initialState,
    next: null
  }

  // 将hook插入fiber.memoizedState链表末尾
  if (!fiber.memoizedState) {
    fiber.memoizedState = hook;
  } else {
    workInProgressHook.next = hook;
  }
  // 移动workInProgressHook指针
  workInProgressHook = hook;
} else {
  // update时找到对应hook
  hook = workInProgressHook;
  // 移动workInProgressHook指针
  workInProgressHook = workInProgressHook.next;
}
```

当找到该`useState`对应的`hook`后，如果该`hook.queue.pending`不为空（即存在`update`），则更新其`state`。

```js
// update执行前的初始state
let baseState = hook.memoizedState;

if (hook.queue.pending) {
  // 获取update环状单向链表中第一个update
  let firstUpdate = hook.queue.pending.next;

  do {
    // 执行update action
    const action = firstUpdate.action;
    baseState = action(baseState);
    firstUpdate = firstUpdate.next;

    // 最后一个update执行完后跳出循环
  } while (firstUpdate !== hook.queue.pending.next)

  // 清空queue.pending
  hook.queue.pending = null;
}

// 将update action执行完后的state作为memoizedState
hook.memoizedState = baseState;
```

完整代码如下：

```js
function useState(initialState) {
  let hook;

  if (isMount) {
    hook = {
      queue: {
        pending: null
      },
      memoizedState: initialState,
      next: null
    }
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;

    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending)

    hook.queue.pending = null;
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}
```

#### 对触发事件进行抽象

最后，让我们抽象一下`React`的事件触发方式。

通过调用`App`返回的`click`方法模拟组件`click`的行为。

```js
function App() {
  const [num, updateNum] = useState(0);

  console.log(`${isMount ? 'mount' : 'update'} num: `, num);

  return {
    click() {
      updateNum(num => num + 1);
    }
  }
}
```

### Concurrent Mode

在[ReactDOM.render](https://react.iamkasong.com/state/reactdom.html#react的其他入口函数)一节我们介绍了`React`当前的三种入口函数。日常开发主要使用的是`Legacy Mode`（通过`ReactDOM.render`创建）。

从[React v17.0 正式发布！ (opens new window)](https://mp.weixin.qq.com/s/zrrqldzRbcPApga_Cp2b8A)一文可以看到，`v17.0`没有包含新特性。究其原因，`v17.0`主要的工作在于源码内部对`Concurrent Mode`的支持。所以`v17`版本也被称为“垫脚石”版本。

你可以从官网[Concurrent 模式介绍 (opens new window)](https://zh-hans.reactjs.org/docs/concurrent-mode-intro.html)了解其基本概念。

一句话概括：

> Concurrent 模式是一组 React 的新功能，可帮助应用保持响应，并根据用户的设备性能和网速进行适当的调整。

`Concurrent Mode`是`React`过去2年重构`Fiber架构`的源动力，也是`React`未来的发展方向。

可以预见，当`v17`完美支持`Concurrent Mode`后，`v18`会迎来一大波基于`Concurrent Mode`的库。

底层基础决定了上层`API`的实现，接下来让我们了解下，`Concurrent Mode`自底向上都包含哪些组成部分，能够发挥哪些能力？

#### 底层架构 —— Fiber架构

从[设计理念](https://react.iamkasong.com/preparation/idea.html)我们了解到要实现`Concurrent Mode`，最关键的一点是：实现异步可中断的更新。

基于这个前提，`React`花费2年时间重构完成了`Fiber`架构。

`Fiber`机构的意义在于，他将单个`组件`作为`工作单元`，使以`组件`为粒度的“异步可中断的更新”成为可能。

#### 架构的驱动力 —— Scheduler

如果我们同步运行`Fiber`架构（通过`ReactDOM.render`），则`Fiber`架构与重构前并无区别。

但是当我们配合`时间切片`，就能根据宿主环境性能，为每个`工作单元`分配一个`可运行时间`，实现“异步可中断的更新”。

于是，[scheduler (opens new window)](https://github.com/facebook/react/tree/master/packages/scheduler)（调度器）产生了。

#### 架构运行策略 —— lane模型

到目前为止，`React`可以控制`更新`在`Fiber`架构中运行/中断/继续运行。

基于当前的架构，当一次`更新`在运行过程中被中断，过段时间再继续运行，这就是“异步可中断的更新”。

当一次`更新`在运行过程中被中断，转而重新开始一次新的`更新`，我们可以说：后一次`更新`打断了前一次`更新`。

这就是`优先级`的概念：后一次`更新`的`优先级`更高，他打断了正在进行的前一次`更新`。

多个`优先级`之间如何互相打断？`优先级`能否升降？本次`更新`应该赋予什么`优先级`？

这就需要一个模型控制不同`优先级`之间的关系与行为，于是`lane`模型诞生了。

#### 上层实现

现在，我们可以说：

> 从源码层面讲，Concurrent Mode是一套可控的“多优先级更新架构”。

那么基于该架构之上可以实现哪些有意思的功能？我们举几个例子：

##### batchedUpdates

如果我们在一次事件回调中触发多次`更新`，他们会被合并为一次`更新`进行处理。

如下代码执行只会触发一次`更新`：

```js
onClick() {
  this.setState({stateA: 1});
  this.setState({stateB: false});
  this.setState({stateA: 2});
}
```

这种合并多个`更新`的优化方式被称为`batchedUpdates`。

`batchedUpdates`在很早的版本就存在了，不过之前的实现局限很多（脱离当前上下文环境的`更新`不会被合并）。

在`Concurrent Mode`中，是以`优先级`为依据对更新进行合并的，使用范围更广。

##### 可以在组件请求数据时展示一个`pending`状态。请求成功后渲染数据。

本质上讲`Suspense`内的组件子树比组件树的其他部分拥有更低的`优先级`。

##### useDeferredValue

[useDeferredValue (opens new window)](https://zh-hans.reactjs.org/docs/concurrent-mode-reference.html#usedeferredvalue)返回一个延迟响应的值，该值可能“延后”的最长时间为`timeoutMs`。

例子：

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

在`useDeferredValue`内部会调用`useState`并触发一次`更新`。

这次`更新`的`优先级`很低，所以当前如果有正在进行中的`更新`，不会受`useDeferredValue`产生的`更新`影响。所以`useDeferredValue`能够返回延迟的值。

当超过`timeoutMs`后`useDeferredValue`产生的`更新`还没进行（由于`优先级`太低一直被打断），则会再触发一次高优先级`更新`。

#### 总结

除了以上介绍的实现，相信未来`React`还会开发更多基于`Concurrent Mode`的玩法。

`Fiber`架构在之前的章节已经学习了。所以，在本章接下来的部分，我们会按照上文的脉络，自底向上，从架构到实现讲解`Concurrent Mode`。