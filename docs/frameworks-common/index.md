## 路由模式

###  hash:

\#后面 hash 值的变化，并不会导致浏览器向服务器发出请求，浏览器不发出请求，也就不会刷新页面。另外每次 hash 值的变化，还会触发`hashchange` 这个事件，通过这个事件我们就可以知道 hash 值发生了哪些变化。然后我们便可以监听`hashchange`来实现更新页面部分内容的操作。

### history:

因为 HTML5 标准发布。多了两个 API，`pushState` 和 `replaceState`，通过这两个 API 可以改变 url 地址且不会发送请求。同时还有`popstate` 事件。通过这些就能用另一种方式来实现前端路由了，但原理都是跟 hash 实现相同的。用了 HTML5 的实现，单页路由的 url 就不会多出一个#，变得更加美观。但因为没有 # 号，所以当用户刷新页面之类的操作时，浏览器还是会给服务器发送请求。为了避免出现这种情况，所以这个实现需要服务器的支持，需要把所有路由都重定向到根页面。

tip:不过这种模式要玩好，还需要后台配置支持。因为我们的应用是个单页客户端应用，如果后台没有正确的配置，当用户在浏览器直接访问 `http://oursite.com/user/id` 就会返回 404，这就不好看了。

所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 `index.html` 页面，这个页面就是你 app 依赖的页面。

## 状态管理

redux/vuex区别

从实现原理上来说，最大的区别是两点：Redux使用的是不可变数据，而Vuex的数据是可变的，因此，Redux每次都是用新state替换旧state，而Vuex是直接修改。Redux在检测数据变化的时候，是通过diff的方式比较差异的，而Vuex其实和Vue的原理一样，是通过getter/setter来比较的，这两点的区别，也是因为React和Vue的设计理念不同。React更偏向于构建稳定大型的应用，非常的科班化。相比之下，Vue更偏向于简单迅速的解决问题，更灵活，不那么严格遵循条条框框。因此也会给人一种大型项目用React，小型项目用Vue的感觉。

首先vuex是一个插件，我们需要去声明一个store类，还要有个install方法去挂载$store。
store的具体实现过程：

> 1、创建响应式的state,保存mutations,actions与getters。
> 2、实现commit根据用户传入type执行对应mutation。
> 3、实现dispatch根据传入的type生成对应的action，同时传递数据。
> 4、实现getters，按照getters定义对state派生数据。

### 首先设计vuex基本数据：

```javascript
import Vue from 'vue'
import Vuex from './vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0,
  },
  mutations: {
    add(state) {
      state.counter++
    }
  },
  actions: {
    // 参数怎么来的？
    add({ commit }) {
      // 业务逻辑组合或者异步
      setTimeout(() => {
        commit('add')
      }, 1000);
    }
  },
  getters: {
    doubleCounter: state => {
      return state.couter*2;
    },
  },
  modules: {
  }
})
```

**1.对store类的声明，install方法实现。**

```javascript
let Vue;
// 声明Store类
class Store {
 constructor(options = {}) {

 this._vm = new Vue({
 // data中的值都会做响应化处理
     data: { 
        // 相当于总线
        $$state:options.state
     }
  });
 }

 get state() {
    // 存取器使之成为只读
    return this._vm._data.$$state 
 }

 set state(v) {
     console.error('please use replaceState to reset state'); 
 } }

function install(_Vue) {
 Vue = _Vue; 

 Vue.mixin({
     beforeCreate() { 
         if (this.$options.store) {
         // this.$options为Vue 实例的初始化选项
            Vue.prototype.$store = this.$options.store; 
         } 
     }
  });
}

export default { Store, install };
```

这里有两点值得注意，源码中state利用vue的data的响应式。利用存取器，把state设置成只读属性。
这里双$定义state第一次看上去肯定有点不解，这里是为了Vue不做代理。

**2.实现commit:根据用户传入type获取并执行对应mutation**

```javascript
class Store {
    constructor(options = {}) { 
        // 保存用户配置的mutations选项
        this._mutations = options.mutations || {}
    } 

    commit(type, payload) {  
        // 获取type对应的mutation  
        const entry = this._mutations[type]

        if (!entry) {
            console.error(`unknown mutation type: ${type}`);
            return 
        }
        // 指定上下文为Store实例  
        // 传递state给mutation entry(this.state, payload);
        entry(this.state, payload)
    }
}
```

这里的entry是mutations里面定义的add方法，payload是传入的参数。

**3.实现actions:根据用户传入type获取并执行对应action**

```javascript
class Store {
  constructor(options) {
    this._actions = options.actions

    // 锁死commit,dispatch函数this指向
    const store = this
    const {commit, dispatch} = store
    this.commit = function boundCommit(type, payload) {
      commit.call(store, type, payload)
    }
    this.dispatch = function boundDispatch(type, payload) {
      dispatch.call(store, type, payload)
    }
  }

  // dispatch，执行异步任务或复杂逻辑
  dispatch(type, payload) {
    // 1.获取action
    const entry = this._actions[type]

    if (!entry) {
      console.error('哎呦，没有这个action');
      return;
    }

    // 异步结果处理常常需要返回Promise
    return entry(this, payload)

  }
}
```

这里对dispatch和commit做了this的绑定，必须绑定commit上下文否则action中调用commit时可能出问题
**3.实现getters:state的动态计算属性**

```javascript
class Store {
  constructor(options) {
    const store = this

    this._wrappedGetters = options.getters

    // 定义computed 选项
    const computed = {}
    this.getters = {}
    Object.keys(this._wrappedGetters).forEach(key => {
      // 获取用户定义的getter
      const fn = store._wrappedGetters[key]
      // 转换为computed可以使用无参数形式
      computed[key] = function() {
        return fn(store.state)
      }
      // 为getters定义只读属性
      Object.defineProperty(store.getters, key, {
        get: () => store._vm[key]
      })
    })

    this._vm = new Vue({
      // data中的值都会做响应化处理
      data: {
        $$state: options.state
      },
      // 利用vue的computed计算属性
      computed
    })
}
```

这里看起来复杂仔细拆分每一个看，其实很简单。这里值得注意的是store._vm[key]是响应的，使用Object.defineProperty设置只读属性这样随着store._vm[key]变化store.getters[key]也会响应变化，这里的get可以理解成vue中的computed属性内容。



### redux:

基础发布订阅模式：

```javascript
const createStore = function (initState) {
  let state = initState;
  let listeners = [];

  /*订阅*/
  function subscribe(listener) {
    listeners.push(listener);
  }

  function changeState(newState) {
    state = newState;
    /*通知*/
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  function getState() {
    return state;
  }

  return {
    subscribe,
    changeState,
    getState
  }
}
```

我们来使用这个状态管理器管理多个状态 counter 和 info 试试

```javascript
let initState = {
  counter: {
    count: 0
  },
  info: {
    name: '',
    description: ''
  }
}

let store = createStore(initState);

store.subscribe(() => {
  let state = store.getState();
  console.log(`${state.info.name}：${state.info.description}`);
});
store.subscribe(() => {
  let state = store.getState();
  console.log(state.counter.count);
});

store.changeState({
  ...store.getState(),
  info: {
    name: '前端九部',
    description: '我们都是前端爱好者！'
  }
});

store.changeState({
  ...store.getState(),
  counter: {
    count: 1
  }
});
```

到这里我们完成了一个简单的状态管理器。

https://github.com/brickspert/blog/issues/22

## JSX/Template渲染

### JSX和Template

共同点：通过babel转化为虚拟dom的对象树，进一步编译成virtual dom

JSX和Template都是用于声明DOM和state之间关系的一种方式，在Vue中，Template是默认推荐的方式，但是也可以使用JSX来做更灵活的事。

JSX更加动态化，对于使用编程语言是很有帮助的，可以做任何事，但是动态化使得编译优化更加复杂和困难。

Template更加静态化并且对于表达式有更多约束，但是可以快速复用已经存在的模板，模板约束意味着可以在编译时做更多的性能优化，相对于JSX在编译时间上有着更多优势。

> 在初始化阶段，本质上发生在`auto run`函数中，然后通过`render`函数生成`Virtual DOM`，`view`根据`Virtual DOM`生成`Actual DOM`。因为`render`函数依赖于页面上所有的数据`data`，并且这些数据是响应式的，所有的数据作为组件`render`函数的依赖。一旦这些数据有所改变，那么`render`函数会被重新调用。
>
> 在更新阶段，`render`函数会重新调用并且返回一个新的`Virtual Dom`，新旧`Virtual DOM`之间会进行比较，把diff之后的最小改动应用到`Actual DOM`中。
>
> Watcher负责收集依赖，清除依赖和通知依赖。在大型复杂的组件树结构下，由于采用了精确的依赖追踪系统，所以会避免组件的过度渲染。

![preview](https://segmentfault.com/img/remote/1460000016945251?w=937&h=476/view)