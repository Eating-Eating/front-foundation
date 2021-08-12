import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {stringJson} from './output'
// const initialState:{
//   routes:singleCata[]
// } = { 
//   routes:[{
//     label:'react',
//     mdPath:"./pages/markdown/react/index.md",
//     routePath:'/react',
//     keyWords:[{
//       keyWords:[],
//       mdPath:"./pages/markdown/react/key.md",
//       routePath:'/react/key',
//       label:'key'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/react/hooks.md",
//       routePath:'/react/hooks',
//       label:'hooks'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/react/fiber.md",
//       routePath:'/react/fiber',
//       label:'fiber'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/react/diff.md",
//       routePath:'/react/diff',
//       label:'diff'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/react/update.md",
//       routePath:'/react/update',
//       label:'update'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/react/redux.md",
//       routePath:'/react/redux',
//       label:'redux'
//     }],
//   },{
//     label:'vue',
//     mdPath:"./pages/markdown/vue/index.md",
//     routePath:'/vue',
//     keyWords:[{
//       keyWords:[],
//       mdPath:"./pages/markdown/vue/key.md",
//       routePath:'/vue/key',
//       label:'key'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/vue/diff.md",
//       routePath:'/vue/diff',
//       label:'diff'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/vue/watch.md",
//       routePath:'/vue/watch',
//       label:'watch'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/vue/vuex.md",
//       routePath:'/vue/vuex',
//       label:'vuex'
//     }],
//   },{
//     label:'浏览器相关',
//     mdPath:"./pages/markdown/webBrowser/index.md",
//     routePath:'/webBrowser',
//     keyWords:[{
//       keyWords:[],
//       mdPath:"./pages/markdown/webBrowser/cookie.md",
//       routePath:'/webBrowser/cookie',
//       label:'cookie'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/webBrowser/crossPage.md",
//       routePath:'/webBrowser/crossPage',
//       label:'crossPage'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/webBrowser/memory.md",
//       routePath:'/webBrowser/memory',
//       label:'memory'
//     },{
//       keyWords:[{
//         keyWords:[],
//         mdPath:"./pages/markdown/webBrowser/performance.md",
//         routePath:'/webBrowser/performance',
//         label:'错误收集'
//       },{
//         keyWords:[],
//         mdPath:"./pages/markdown/webBrowser/performance.md",
//         routePath:'/webBrowser/performance',
//         label:'错误上报'
//       },{
//         keyWords:[],
//         mdPath:"./pages/markdown/webBrowser/performance.md",
//         routePath:'/webBrowser/performance',
//         label:'promise/vue/react错误'
//       }],
//       mdPath:"./pages/markdown/webBrowser/performance.md",
//       routePath:'/webBrowser/performance',
//       label:'performance'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/webBrowser/pwa.md",
//       routePath:'/webBrowser/pwa',
//       label:'pwa'
//     },{
//       keyWords:[],
//       mdPath:"./pages/markdown/webBrowser/safety.md",
//       routePath:'/webBrowser/safety',
//       label:'safety'
//     }],
//   }]
// }
console.log(JSON.parse(stringJson))
const initialState:{
  routes:singleCata[]
} = {
  routes:JSON.parse(stringJson).keyWords
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
  keyWords:singleCata[] | string[],
  mdPath?:string;
  routePath?:string;
  label:string;
}

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const routes = initialState.routes