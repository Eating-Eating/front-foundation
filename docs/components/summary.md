|           | 模块的定义                                                   | 模块的引用 | 模块的标识 |
| --------- | ------------------------------------------------------------ | ---------- | ---------- |
| CommonJS  | 所有代码都运行在模块作用域，不会污染全局作用域。 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。 模块加载的顺序，按照其在代码中出现的顺序。 |            |            |
| ES module | 通过`export`命令显式指定输出的代码，再通过`import`命令输入。 |            |            |
|           |                                                              |            |            |

| CommonJS                          | ESM                             |
| --------------------------------- | ------------------------------- |
| exports.method = method           | export { method }               |
| module.exports = function() {...} | export default function() {...} |
| export.default = function() {...} | export default function() {...} |
| var a = require('module')         | import a from 'module'          |
| var a = require('module').a       | import { a } from 'module'      |
| var a = require('module').default | import a from 'module'          |



为什么会出现两个包：node环境可能不支持es6，前端打包时需要在node环境中进行。

组件库中：

import是针对js的，但组件库需要同时分别打包css，css有单独的less编译器或者sass编译器。因此需要引入单独的Babel配置转译成import js，import css语法，即import写法转换成导入css+js。

PS：Babel 是一个编译器（输入源码 => 输出编译后的代码）。就像其他编译器一样，编译过程分为三个阶段：解析、转换和打印输出。
Babel 的三个主要处理步骤分别是： 解析（parse），转换（transform），生成（generate）。.

区别：

CommonJS是在运行时才确定引入, 然后执行这个模块, **相当于**是调用一个函数, 返回一个对象, 就这么简单。（执行时）

而ES6 Module是语言层面的, 导入导出是**声明式**的**代码集合.** 声明式的意思就是说, 直接利用**关键字**声明说我要导入/导出一个模块啦, 而不是粗鄙(节目效果)地将一个对象赋值给一个变量。（编译时）

设计思想：

CommonJS：模块就是对象

ESM：ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。