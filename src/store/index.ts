import { configureStore } from '@reduxjs/toolkit'
const initialState = { 
  react:[''],
  vue:['']
}

function keywordsReducer(state = initialState, action: { type: string }) {
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

export default configureStore({
  reducer: keywordsReducer,
})
