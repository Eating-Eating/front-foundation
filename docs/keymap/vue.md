| vue        | 使用场景、用法 | 是什么                                     | 缺陷（如何优化） | 其他方案/区别     |
| ---------- | -------------- | ------------------------------------------ | ---------------- | ----------------- |
| 自定义指令 | 权限/控制dom   | 注册/dom/生命周期/操作                     |                  | 获取ref           |
| nextTick   | 异步           | 异步队列/回调/promise对象/setTimeout(fn,0) |                  | setTimeout,宏任务 |
|            |                |                                            |                  |                   |

computed/watch/methods 的区别

关键词：getter/setter，dep，dirty，异步，watcher的四个属性

computed跟watch本质都是watcher

watch可以配置的是可配置的watch，有



|          | 触发机制                                                   | 用法区别                                 |
| -------- | ---------------------------------------------------------- | ---------------------------------------- |
| methods  | 模板渲染时                                                 |                                          |
| computed | computed watcher，触发getter的事件发布，修改dirty属性      | 简单逻辑                                 |
| watch    | sync watcher，deep watcher，user watcher，computed watcher | 复杂逻辑，深度监听，异步（可设置中间态） |

