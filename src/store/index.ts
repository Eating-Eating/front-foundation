import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
const initialState:{
  routes:singleCata[]
} = { 
  routes:[{
    label:'react',
    mdPath:"./pages/react/index.md",
    routePath:'/react',
    keyWords:[{
      keyWords:[],
      mdPath:"./pages/react/key.md",
      routePath:'/react/key',
      label:'key'
    },{
      keyWords:[],
      mdPath:"./pages/react/hooks.md",
      routePath:'/react/hooks',
      label:'hooks'
    },{
      keyWords:[],
      mdPath:"./pages/react/fiber.md",
      routePath:'/react/fiber',
      label:'fiber'
    },{
      keyWords:[],
      mdPath:"./pages/react/diff.md",
      routePath:'/react/diff',
      label:'diff'
    },{
      keyWords:[],
      mdPath:"./pages/react/update.md",
      routePath:'/react/update',
      label:'update'
    },{
      keyWords:[],
      mdPath:"./pages/react/redux.md",
      routePath:'/react/redux',
      label:'redux'
    }],
  },{
    label:'vue',
    mdPath:"./pages/vue/index.md",
    routePath:'/vue',
    keyWords:[{
      keyWords:[],
      mdPath:"./pages/vue/key.md",
      routePath:'/vue/key',
      label:'key'
    },{
      keyWords:[],
      mdPath:"./pages/vue/diff.md",
      routePath:'/vue/diff',
      label:'diff'
    },{
      keyWords:[],
      mdPath:"./pages/vue/watch.md",
      routePath:'/vue/watch',
      label:'watch'
    },{
      keyWords:[],
      mdPath:"./pages/vue/vuex.md",
      routePath:'/vue/vuex',
      label:'vuex'
    }],
  },{
    label:'浏览器相关',
    mdPath:"./pages/webBrowser/index.md",
    routePath:'/webBrowser',
    keyWords:[{
      keyWords:[],
      mdPath:"./pages/webBrowser/cookie.md",
      routePath:'/webBrowser/cookie',
      label:'cookie'
    },{
      keyWords:[],
      mdPath:"./pages/webBrowser/crossPage.md",
      routePath:'/webBrowser/crossPage',
      label:'crossPage'
    },{
      keyWords:[],
      mdPath:"./pages/webBrowser/memory.md",
      routePath:'/webBrowser/memory',
      label:'memory'
    },{
      keyWords:[],
      mdPath:"./pages/webBrowser/performance.md",
      routePath:'/webBrowser/performance',
      label:'performance'
    },{
      keyWords:[],
      mdPath:"./pages/webBrowser/pwa.md",
      routePath:'/webBrowser/pwa',
      label:'pwa'
    },{
      keyWords:[],
      mdPath:"./pages/webBrowser/safety.md",
      routePath:'/webBrowser/safety',
      label:'safety'
    }],
  }]
}

function keyWordsReducer(state = initialState, action: { type: string }) {
  // 检查 reducer 是否关心这个 action
  if (action.type === 'counter/increment') {
    // 如果是，复制 `state`
    return {
      ...state,
      // 使用新值更新 state 副本
      // value: state.value + 1
    }
  }
  // 返回原来的 state 不变
  return state
}

export const store = configureStore({
  reducer: keyWordsReducer,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type singleCata = {
  keyWords:singleCata[],
  mdPath:string;
  routePath:string;
  label:string;
}

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const routes = initialState.routes