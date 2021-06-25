**如果要我在给出进入前端工程化的第一步, 那我肯定是首推JS 模块规范.**

无论你是喜欢Vue也好, Ng/React也罢, 或者是你都不喜欢, 只想自己瞎鼓捣, webpack/Node 都绕不过JS模块规范, 一切的一切, 都需要建立在JS模块之上. 如Vue作者在 [新手向：Vue 2.0 的建议学习顺序 - 知乎专栏](https://zhuanlan.zhihu.com/p/23134551) 中所说, 如果你要开始用Vue-cli搭建项目, 那么你最好是有Webpack的基础, 然而要学好webpack, 必须先熟悉JS模块规范.

啊, 我真不想扯那么多废话的, 我好想文章一开始就进入正文, 但是这样看起来就不像个文章, 我也很痛苦.

JS模块规范有很多, 比较出名的有CommonJS/AMD/CMD等, 最后还有正统的ES6 Modules. 感谢前人为了解决实际运用中的问题而做出的努力, 但是就我个人而言, 如果你真的是不想花太多时间在模块规范上, 那么我建议**只需要深入掌握CommonJS和ES6 Modules**就好了, 其他的略作了解即可. 当然这是我个人的看法, 我是一个菜鸟.

首先来说说CommonJS. 关于它的出现和发展, 以及解决了哪些问题, 就不多说了, 有兴趣的可自行谷歌.

**一、 CommonJS模块规范**

CommonJS对模块的规范就三个:

\1. 模块的定义

\2. 模块的引用

\3. 模块的标识

整个模块, 最重要的有三个东西: module, exports, require, 分别对应定义, 定义, 引用. 除了这三个, 其余的都跟模块本身不相关.

*1.1 模块的定义*

CommonJS的模块只有一个**唯一的出口,** 那就是module.exports对象, 我们把所有要导出的变量或函数都放到这个对象里, 再导出这个对象. 那我们就可以在外部访问到这些变量和函数, 而没有被导出的东西, 对外部的模块来说是不可见的. 看代码:

```js
function isNumber (n) {
    return typeof n === 'number'
}

module.exports = {
    sum: function(a, b) {
        if(isNumber(a) && isNumber(b)) {
            return a + b
        } else {
            return NaN
        }
    }
}
```

以上代码导出了sum函数, 而不会导出isNumber函数. 可以在其他模块中这样来引入这个模块

```text
var mod = require('./index')

console.log(mod.sum(2, '2')) // NaN
console.log(mod.sum(2, 2)) // 4
mod.isNumber() // 抛出错误
```



好像一不小心把模块引用也说啦.... 不过即使是这样, 也还没有说到exports.

先说一个事实, 你可以用module.exports = {} 的形式导出, 也可以用exports.a = 'blabla' 的形式导出, 但是你决不能用**exports = {}** 的形式导出. 这是新手最容易搞混淆的地方. 这里注重说一下.

一个模块中, module变量便是整个模块, 而这个module变量有一个属性叫exports, 这个属性是exports变量的引用. 最后导出的, 是module.exports而不是exports对象. 我们可以意淫出这样的代码(实际的Commonjs实现跟这段代码完全不相干, 此处仅仅是为了更形象).

```js
/* 模块自带的部分 */
var exports = {}
var module = {
    exports: exports
}

/* 我们对模块的操作 */

/* 实例1 -> 正确 */
module.exports = {
    name: 'doublege'
}

/* 实例2 -> 正确 */
exports.name = 'doublege'

/* 实例3 -> 错误*/
exports = {
    name: 'doublege'
}
/* 操作完毕 */

/* 模块自带的部分 */
return module.exports
```

因为最后导出的是module.exports属性, 所以如果是对exports的属性赋值, 那么会让module.exports对象的属性也一起变化, 而直接对整个exports对象赋值, 那么exports和module.exports变成了两个完全不同的对象, 在内存中指向的地址都不一样啦, exports对象当然影响不到module.exports. 不明白的, 应该看看js参数的值传递规则.

*1.2 模块的引用*

上一个实例中为了便于理解, 已经展示了模块的引用, 简单地说, 就是require('moduleName'), 然后这个require方法会返回模块中导出的module.exports对象. 再调用就好啦. 相当的简单, 不是吗?

*1.3 模块的标识*

模块的标识, 说白了就是, 我在require('moduleName')一个模块的是, 如何根据传入的参数找到这个模块. 这个模块标识主要有以下几种类型:

\1. 是符合"小驼峰"式命名法的字符串. (从node_modules/系统模块中引入)

\2. 以'.' 或 '..' 开头相对路径模块(相对当前目录引入)

\3. 绝对路径(例如/var/www等绝对路径)

需要提到的一小点是, *文件后缀名".js"可以省略.*

ok, 以上就是整个CommonJS的内容了, 按理说现在该说ES6 Modules规范啦, 但是不把剩下的说完我不舒服. 所以就再来说一说, Node对CommonJS的实现.

要知道, 我们之所以还要花时间来研究CommonJS, 就是因为NodeJS, Node也是后来才支持ES6 Modules规范的, 因为ES6 Modules是语言层面的, 完全可以等V8引擎实现了ES6 Modules, Node也就算是自动实现啦. 而且Node的开发者认为, 规范应该基于"事实标准, ES6 Modules规范的那一套, 他不认同." 所以就一直等到Node 7+才实现.

Node对CommonJS的实现, 主要可以分为以下三点:

\1. 模块路径分析

\2. 模块定位

\3. 模块编译(略)


我们知道, 要确定一个文件的绝对位置, 需要 path + filename, 形如C:\\Users\\tinycold\\Desktop\\demo\\node\\node_modules\\index.js这样一个文件, C:\\Users\\tinycold\\Desktop\\demo\\node\\node_modules\\就是path, index.js是filename.

**模块路径分析,** 就是找出*path*, 而**文件定位,** 就是确定*filename.* 通过路径分析和文件定位, 就能确定要引入的模块的绝对位置. 然后进行模块的编译, 这里就不展开细说了, 有兴趣的可以自行查阅资料.

我们可以再深入一些, 看看Node是如何做**路径分析**和**文件定位**的.

**路径分析:**

我们之间说过, CommonJS有一个重点, 是模块标识符. 这个标识符指的就是传入require方法的参数. 模块路径分析会分析这个参数, 确定这个模块属于以下哪一类模块

\- 核心模块(Node自带的模块)

\- 路径模块(相对或绝对定位开始的模块)

\- 自定义模块(node_modules里的模块)

如果是核心模块, 直接跳过路径分析和文件定位, 路径模块就直接得出相对位置就好啦. 重点是自定义模块.

我们先来做这么一个实验:

在某个目录下新建这么一个名为test.js的文件.

```js
console.log(module.paths)
```

然后用node执行. 看他输出的这个数组. 我的windows是这样

[

'C:\\Users\\tinycold\\Desktop\\demo\\node\\node_modules',

'C:\\Users\\tinycold\\Desktop\\demo\\node_modules',

'C:\\Users\\tinycold\\Desktop\\node_modules',

'C:\\Users\\tinycold\\node_modules',

'C:\\Users\\node_modules',

'C:\\node_modules'

]

仔细观察, 我们会发现, 他是按照文件目录层级一层层网上找的. 我本身的文件目录是这样:

```text
/Users/tinycold/Desktop/demo/node
```

也就是说, 首先, 他会在当前目录的node_modules里找这个模块, 如果找不到(当前目录的node_modules里没有, 或者根本就有node_modules目录), 那么他会往上一级目录走, 查找上一层目录的node_modules. 依次往下, 直到根目录下都没有, 就抛出错误.

**文件定位:**

路径分析已经得出了模块的path, 下一步是得出模块的filename. 为什么不直接用模块标识符里的文件名呢? 因为准确地说, 模块标识符里并不包含文件名, 因为扩展名可以省略, 更坑爹的是, 你可以传入一个目录名, 形如: require('connect')这样.

在NodeJS中, 省略了扩展名的文件, 会依次补充上.js, .node, .json来尝试, 如果传入的是一个目录, 那么NodeJS会把它当成一个包来看待, 会采用以下方式确定文件名

第一步, 找出目录下的package.json, 用JSON.parse()解析出main字段

第二步, 如果main字段指定的文件还是省略了扩展, 那么会依次补充.js, .node, .json尝试.

第三部, 如果main字段制定的文件不存在, 或者根本就不存在package.json, 那么会默认加载这个目录下的index.js, index.node, index.json文件.

以上就是文件定位的过程, 再搭配上路径分析的过程, 进行排列组合, 这得有多少种可能呀. 所以说, 自定义模块的引入, 是最费性能的.





**二、 ES6 Modules规范**

ES6 Modules的语法和用法比较多, 我决定以解决实际问题的形式慢慢道来, 相信你看我完后就不会像我当初那样大骂"直接按照CommonJS实现不就好了嘛! 搞那么多破事儿干嘛呀!!!". 并且还会忍不住惊叹它如此周到易用.

读者在看的时候, 建议对照着CommonJS的三大特点(**定义, 引入, 标识**), 会感到一切都是那么自然.



必须要明确的一点是, ES6 Modules的核心思想, 与CommonJS大不相同, 千万不要以CommonJS那一套来推断ES6 Modules这一套, 否则会让你做出"敲打着轮椅"的动作. 关于CommonJS和ES6 Module差异的更多内容, 将放在文章的最后来说.

CommonJS是在运行时才确定引入, 然后执行这个模块, **相当于**是调用一个函数, 返回一个对象, 就这么简单.

而ES6 Module是语言层面的, 导入导出是**声明式**的**代码集合.** 声明式的意思就是说, 直接利用**关键字**声明说我要导入/导出一个模块啦, 而不是粗鄙(节目效果)地将一个对象赋值给一个变量, 例如

```js
import {a, b} from './moduleName'
```

再看看不是声明式的例子

```js
let a = require('moduleName')
```

相比声明式, 代码集合才是我们最该关注的点. 看如下代码:

```js
// circle.js
export const PI = 3.14
export let radius = 5
export let getArea = (r) => PI * r * r
```

注意: 以下理解是我自己的凭空想象, 跟实际的实现毫无关系, 完全是为了更形象地解释清楚*导出代码集合*这个概念.

***************************警戒线开始************************************

以上代码, ES6 Module会将添加了export关键字的变量/函数等(*以下简称数据*)添加到一个集合中, 并记录下这些数据的内存地址, 所以这个集合就做了两件事:

\1. 哪些数据是可以导出的

\2. 导出的数据, 内存地址是多少

然后, 在导入的时候, 再将父模块(导入这个模块的模块)import时声明的数据名称指向对应导出数据的内存地址, 形成一个链接. 假设有这样的导入代码:

```js
import {PI, radius, getArea} from './circle'
```

首先, 在编译阶段(代码正式运行之前, 而CommonJS必须在运行时), 静态分析时看到这样的语句, 就会先分别检查PI, radius, getArea是否在circle模块的""导出代码"这个集合中, 如果存在, 则将各自的内容指向"导出代码"集合中各自对应的内存地址, 类似于指针(如果你还不了解指针, 那么你就对比一下值传递和地址传递, 做一个可意会不可言传的理解, 当然, 更建议去了解一下指针的概念).

***************************警戒线结束************************************

ok, 经过一通胡说八道, 总算"讲清楚"了"声明式代码集合"的概念. 现在正式进入ES6 Module的语法.

上一个例子可以算是ES6 Module最基本的导入导出, 可以看出, 这样导入导出的一大缺点就是, 如果我要import一个模块, 就必须知道他export了哪些数据, 不然根本就没法导入. 要解决这个问题, 有两个方法:

1.

```js
import * as circle from './circle'
```

这样就能成功引入了, 什么! ? 你还想调用, 你当初可只说导入, 没说要调用吼!!! :(

\2. 利用export default

```text
export default getArea = (r) => PI * r * r
```

或

```js
let getArea = (r) => PI * r * r

// 导出列表, ES6 Module的另一种导出方式
export {
    getArea as default
}
```



导入时

```text
import default as getArea from './circle'
```

或

```js
import getArea from './circle'
```

一般情况下第二种import方式用得更多一些.



这就是ES6 Module的default关键字, 它的作用就是将一个数据命名为default, 无论是直接添加export关键字还是用别名的方式, 需要注意的是, export default的作用, 是用default**关键字**将导出的数据命名为default, 这个default是一个关键字, 不要萌萌地想要用export blabla ... 这种方式给导出的数据起别名, 要起别名, 请用导出列表的方式, 这个导出列表只要在模块的顶层, 无论是在代码的开始, 结束, 还是中间的任何地方都可以. 而且不仅导出时可以起别名, 导入时也可以起别名. 就拿刚才的那个例子来说:

```text
import * as circle from './circle'
```

这样是可以的, circle就是一个对象, 叫做模块对象, 导出列表的数据就成了circle对象的属性, 至于要怎么调用, 也必须知道导出的数据是什么才可以(毕竟你必须要知道对象的属性才能调用).

聪明的你一定知道, import 时起别名还可以针对单个数据

```as
import {PI as pai, radius as r} circle from './circle'
```

最后要说的是ES6 Module的一个骚操作——聚合模块.

我们设想这么一个场景: 我有一个main.js模块, 这个模块需要引入50个模块后再导出(这样, 我只要引入这一个模块就相当于引入了50个模块), 而且并不是每个模块中的每个数据都需要导入, 比如我有一个foo模块, 它导出了{a, b, c}三个数据, 但是我只需要他的{a}.

这样的需求用ES6 Module可以这样实现:

```js
import {a} from './foo'

/* *
 * ...
 * import 其他模块
 * */

export {
    a,
    /*... 导出其他模块*/
}
```

这样的确可以实现, 但是看起来太过粗俗. 可以换一种实现方式, 利用export... from...

```text
export {a} from './foo'
export * from './bar'
```

哇, 一下子少写了那么多行代码. 简直开心得在地上打滚儿吼!

但是这样的写法有两个点需要注意:

\1. 这样的方式不会讲数据添加到该聚合模块的作用域, 也就是说, 你无法在该模块中使用a.

\2. 如果export的数据名相同, 会产生冲突, 所以尽量不要使用export * 这种危险的操作, 因为你根本不知道*里有没有数据名与其他数据冲突

以上就是ES6 Module的全部语法啦. 是的, 全部.