## this

![this](.\this.png)

## new

> new/call/apply引用自
>
> 作者：若川
> 链接：https://juejin.cn/post/6844903704663949325
> 来源：掘金
> 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

1. 创建了一个全新的对象。
2. 这个对象会被执行`[[Prototype]]`（也就是`__proto__`）链接。
3. 生成的新对象会绑定到函数调用的`this`。
4. 通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
5. 如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。

```javascript
/**
 * 模拟实现 new 操作符
 * @param  {Function} ctor [构造函数]
 * @return {Object|Function|Regex|Date|Error}      [返回结果]
 */
function newOperator(ctor){
    if(typeof ctor !== 'function'){
      throw 'newOperator function the first param must be a function';
    }
    // ES6 new.target 是指向构造函数
    newOperator.target = ctor;
    // 1.创建一个全新的对象，
    // 2.并且执行[[Prototype]]链接
    // 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
    var newObj = Object.create(ctor.prototype);
    // ES5 arguments转成数组 当然也可以用ES6 [...arguments], Aarry.from(arguments);
    // 除去ctor构造函数的其余参数
    var argsArr = [].slice.call(arguments, 1);
    // 3.生成的新对象会绑定到函数调用的`this`。
    // 获取到ctor函数返回结果
    var ctorReturnResult = ctor.apply(newObj, argsArr);
    // 小结4 中这些类型中合并起来只有Object和Function两种类型 typeof null 也是'object'所以要不等于null，排除null
    var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
    var isFunction = typeof ctorReturnResult === 'function';
    if(isObject || isFunction){
        return ctorReturnResult;
    }
    // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。
    return newObj;
}
```

## apply/call

**相同点：**
 1、`call`和`apply`的第一个参数`thisArg`，都是`func`运行时指定的`this`。而且，`this`可能不是该方法看到的实际值：如果这个函数处于**非严格模式**下，则指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。
 2、都可以只传递一个参数。
 **不同点：**`apply`只接收两个参数，第二个参数可以是数组也可以是类数组，其实也可以是对象，后续的参数忽略不计。`call`接收第二个及以后一系列的参数。

apply:

```javascript
// 浏览器环境 非严格模式
function getGlobalObject(){
    return this;
}
function generateFunctionCode(argsArrayLength){
    var code = 'return arguments[0][arguments[1]](';
    for(var i = 0; i < argsArrayLength; i++){
        if(i > 0){
            code += ',';
        }
        code += 'arguments[2][' + i + ']';
    }
    code += ')';
    // return arguments[0][arguments[1]](arg1, arg2, arg3...)
    return code;
}
Function.prototype.applyFn = function apply(thisArg, argsArray){ // `apply` 方法的 `length` 属性是 `2`。
    // 1.如果 `IsCallable(func)` 是 `false`, 则抛出一个 `TypeError` 异常。
    if(typeof this !== 'function'){
        throw new TypeError(this + ' is not a function');
    }
    // 2.如果 argArray 是 null 或 undefined, 则
    // 返回提供 thisArg 作为 this 值并以空参数列表调用 func 的 [[Call]] 内部方法的结果。
    if(typeof argsArray === 'undefined' || argsArray === null){
        argsArray = [];
    }
    // 3.如果 Type(argArray) 不是 Object, 则抛出一个 TypeError 异常 .
    if(argsArray !== new Object(argsArray)){
        throw new TypeError('CreateListFromArrayLike called on non-object');
    }
    if(typeof thisArg === 'undefined' || thisArg === null){
        // 在外面传入的 thisArg 值会修改并成为 this 值。
        // ES3: thisArg 是 undefined 或 null 时它会被替换成全局对象 浏览器里是window
        thisArg = getGlobalObject();
    }
    // ES3: 所有其他值会被应用 ToObject 并将结果作为 this 值，这是第三版引入的更改。
    thisArg = new Object(thisArg);
    var __fn = '__' + new Date().getTime();
    // 万一还是有 先存储一份，删除后，再恢复该值
    var originalVal = thisArg[__fn];
    // 是否有原始值
    var hasOriginalVal = thisArg.hasOwnProperty(__fn);
    thisArg[__fn] = this;
    // 9.提供 `thisArg` 作为 `this` 值并以 `argList` 作为参数列表，调用 `func` 的 `[[Call]]` 内部方法，返回结果。
    // ES6版
    // var result = thisArg[__fn](...args);
    var code = generateFunctionCode(argsArray.length);
    var result = (new Function(code))(thisArg, __fn, argsArray);
    delete thisArg[__fn];
    if(hasOriginalVal){
        thisArg[__fn] = originalVal;
    }
    return result;
};
```

call:

```javascript
Function.prototype.callFn = function call(thisArg){
    var argsArray = [];
    var argumentsLength = arguments.length;
    for(var i = 0; i < argumentsLength - 1; i++){
        // argsArray.push(arguments[i + 1]);
        argsArray[i] = arguments[i + 1];
    }
    console.log('argsArray:', argsArray);
    return this.applyFn(thisArg, argsArray);
}
// 测试例子
var doSth = function (name, age){
    var type = Object.prototype.toString.call(this);
    console.log(typeof doSth);
    console.log(this === firstArg);
    console.log('type:', type);
    console.log('this:', this);
    console.log('args:', [name, age], arguments);
    return 'this--';
};

var name = 'window';

var student = {
    name: '若川',
    age: 18,
    doSth: 'doSth',
    __fn: 'doSth',
};
var firstArg = student;
var result = doSth.applyFn(firstArg, [1, {name: 'Rowboat'}]);
var result2 = doSth.callFn(firstArg, 1, {name: 'Rowboat'});
```

## Promise

```javascript
class Promise{
  constructor(executor){
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    };
    let reject = reason => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    };
    try{
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled,onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === 'fulfilled') {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      };
      if (this.state === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      };
      if (this.state === 'pending') {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0)
        });
      };
    });
    return promise2;
  }
  catch(fn){
    return this.then(null,fn);
  }
}
function resolvePromise(promise2, x, resolve, reject){
  if(x === promise2){
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  let called;
  if (x != null && (typeof x === 'object' || typeof x === 'function')) {
    try {
      let then = x.then;
      if (typeof then === 'function') { 
        then.call(x, y => {
          if(called)return;
          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, err => {
          if(called)return;
          called = true;
          reject(err);
        })
      } else {
        resolve(x);
      }
    } catch (e) {
      if(called)return;
      called = true;
      reject(e); 
    }
  } else {
    resolve(x);
  }
}
//resolve方法
Promise.resolve = function(val){
  return new Promise((resolve,reject)=>{
    resolve(val)
  });
}
//reject方法
Promise.reject = function(val){
  return new Promise((resolve,reject)=>{
    reject(val)
  });
}
//race方法 
Promise.race = function(promises){
  return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
      promises[i].then(resolve,reject)
    };
  })
}
//all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
Promise.all = function(promises){
  let arr = [];
  let i = 0;
  function processData(index,data){
    arr[index] = data;
    i++;
    if(i == promises.length){
      resolve(arr);
    };
  };
  return new Promise((resolve,reject)=>{
    for(let i=0;i<promises.length;i++){
      promises[i].then(data=>{
        processData(i,data);
      },reject);
    };
  });
}


作者：Carlus
链接：https://juejin.cn/post/6844903625769091079
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
```

## Generator/co库实现

#### 迭代器（Iterator）

顾名思义，所谓迭代器对象就是满足迭代器协议的对象。

> 迭代器协议

迭代器协议定义了一种标准的方式来产生一个有限或无限序列的值。使的迭代器对象拥有一个`next()`对象，并有以下含义：

- next： 返回一个对象的无参函数，返回对象有两个属性：
  - done（boolean)
    - 如果迭代器已经经过了被迭代序列时为 true。这时value可能描述了该迭代器的返回值。
    - 如果迭代器可以产生序列中的下一个值，则为false。这等于说done属性不指定。
  - value
    - 迭代器返回的任何 JavaScript 值。done为true时可省略。

为了加深一下理解，下面贴出

**迭代器构建版本一：Iterator的源码实现**

```javascript
// 源码实现
function createIterator(items) {
    var i = 0
    return {
        next: function() {
            var done = (i >= items.length)
            var value = !done ? items[i++] : undefined
            
            return {
                done: done,
                value: value
            }
        }
    }
}

// 应用
var iterator = createIterator([1, 2, 3])
console.log(iterator.next())	// {value: 1, done: false}
console.log(iterator.next())	// {value: 2, done: false}
console.log(iterator.next())	// {value: 3, done: false}
console.log(iterator.next())	// {value: undefined, done: true}

```

#### 可迭代（Iterable）

满足可迭代协议的对象就是可迭代对象。

**可迭代协议**：允许JS对象去定义或定制它们的迭代行为。

**可迭代对象**：该对象必须实现@[@iterator](https://github.com/iterator)方法，即这个对象或它原型链（prototype chain）上的某个对象必须有一个名字是Symbol.iterator的属性。

> Symbol.iterator：返回一个对象的无参函数，被返回对象符合迭代器协议

在ES6中，所有的集合对象（Array、Set与Map）以及String、TypedArray、arguments都是可迭代对象，它们都有默认的迭代器。

**当一个对象被迭代的时候，它的@[@iterator](https://github.com/iterator)方法被调用并且无参数，并返回一个值迭代器**

- 扩展运算符

  ```javascript
  [...'abc']	// ["a", "b", "c"]
  ...['a', 'b', 'c']	// ["a", "b", "c"]
  ```

- yield*

  ```javascript
  function* generator() {
      yield* ['a', 'b', 'c']
  }
  generator().next()	// { value: "a", done: false }
  ```

- 解构赋值

  ```javascript
  let [a, b, c] = new Set(['a', 'b', 'c'])
  a	// 'a'
  ```

#### 可迭代对象

这里以`for ...of`为例子，加深对可迭代对象的理解

`for...of`接受一个可迭代对象（Iterable），或者能强制转换/包装成一个可迭代对象的值（如'abc'）。遍历时，`for...of`会获取可迭代对象的`[Symbol.iterator]()`，对该迭代器逐次调用next()，直到迭代器返回对象的done属性为true时，遍历结束，不对该value处理。

`for...of`循环实例：

```
var a = ['a', 'b', 'c', 'd', 'e']

for (var val of a) {
    console.log(val)
}
// 'a' 'b' 'c' 'd' 'e'
```

转换成普通的for循环实例，等价于上面`for...of`循环

```
var a = ["a", "b", "c", "d", "e"]
for (var val, ret, it = a[Symbol.iterator]();
    (ret = it.next()) && !ret.done;
    ) {
    val = ret.value
    console.log(val)
}
// "a" "b" "c" "d" "e"
```

#### 使迭代器可迭代

在**迭代器**部分我们定义了一个简单的迭代器函数`createIterator`，但是该函数生成的迭代器部分并没有实现可迭代协议，所以不能在`for...of`等语法中使用。需要为该对象实现可迭代协议，

在`[Symbol.iterator]`函数中返回该迭代器自身。

```javascript
function createIterator(items) {
    var i = 0
    return {
        next: function () {
            var done = (i >= items.length)
            var value = !done ? items[i++] : undefined
            return {
                done: done,
                value: value
            }
        }
        [Symbol.iterator]: function () {
        	return this
    	}
    }
}
var iterator = createIterator([1, 2, 3])
...iterator		// 1, 2, 3
```

**添加[Symbol.iterator]使Object可迭代**

根据可迭代协议，给Object的原型添加[Symbol.iterator]，值为返回一个对象的无参函数，被返回对象符合迭代器协议。

```javascript
Object.prototype[Symbol.iterator] = function () {
    var i = 0
    var items = Object.entries(this)
    return {
        next: function () {
            var done = (i >= items.length)
            var value = !done ? items[i++] : undefined
            
            return {
                done: done,
                value: value
            }
        }
    }
}
```

使用生成器简化代码

```javascript
Object.prototype[Symbol.iterator] = function* () {
    for (const key in this) {
        if (this.hasOwnPrototype(key)) {
            yield [key, this[key]]
        }
    }
}
```

#### co库/async await

一句话，async、await 是 co 库的官方实现。也可以看作自带启动器的 generator 函数的语法糖。不同的是，async、await 只支持 Promise 和原始类型的值，不支持 thunk 函数。

co库源码实现：

co 就是上面那个自动执行器的扩展，它的[源码](https://github.com/tj/co/blob/master/index.js)只有几十行，非常简单。

首先，co 函数接受 Generator 函数作为参数，返回一个 Promise 对象。

```javascript
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
  });
}
```

在返回的 Promise 对象里面，co 先检查参数 gen 是否为 Generator 函数。如果是，就执行该函数，得到一个内部指针对象；如果不是就返回，并将 Promise 对象的状态改为 resolved 。

```javascript
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);
  });
}
```

接着，co 将 Generator 函数的内部指针对象的 next 方法，包装成 onFulefilled 函数。这主要是为了能够捕捉抛出的错误。

```javascript
function co(gen) {
  var ctx = this;

  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.call(ctx);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }    
  });
}
```

最后，就是关键的 next 函数，它会反复调用自身。

```javascript
function next(ret) {
  if (ret.done) return resolve(ret.value);
  var value = toPromise.call(ctx, ret.value);
  if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
  return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
});
```

async与co库用法的区别：

```js
// generator with co
co(function* () {
  try {    
    const content1 = yield readFileWithPromise('/etc/passwd', 'utf8')
    console.log(content1)
    const content2 = yield readFileWithPromise('/etc/profile', 'utf8')
    console.log(content2)
    return 'done'
  } catch (err) {
    console.error(err)
    return 'fail'
  }
})

// async await
async function readfile() {
  try {
    const content1 = await readFileWithPromise('/etc/passwd', 'utf8')
    console.log(content1)
    const content2 = await readFileWithPromise('/etc/profile', 'utf8')
    console.log(content2)
    return 'done'
  } catch (err) {
    throw(err)
  }
}
readfile().then(
  res => console.log(res),
  err => console.error(err)
)
```

## 节流防抖

```javascript
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result
  console.log('tag', '')
  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}
//注意点：多次调用指向同一个函数，函数中的参数都会被保留
```

## 深拷贝

> [如何写出一个惊艳面试官的深拷贝?](https://segmentfault.com/a/1190000020255831)

主要分为可迭代不可迭代数据类型，分别处理

```javascript
const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';
const argsTag = '[object Arguments]';

const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];


function forEach(array, iteratee) {
    let index = -1;
    const length = array.length;
    while (++index < length) {
        iteratee(array[index], index);
    }
    return array;
}

function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
}

function getType(target) {
    return Object.prototype.toString.call(target);
}

function getInit(target) {
    const Ctor = target.constructor;
    return new Ctor();
}

function cloneSymbol(targe) {
    return Object(Symbol.prototype.valueOf.call(targe));
}

function cloneReg(targe) {
    const reFlags = /\w*$/;
    const result = new targe.constructor(targe.source, reFlags.exec(targe));
    result.lastIndex = targe.lastIndex;
    return result;
}

function cloneFunction(func) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    if (func.prototype) {
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            if (param) {
                const paramArr = param[0].split(',');
                return new Function(...paramArr, body[0]);
            } else {
                return new Function(body[0]);
            }
        } else {
            return null;
        }
    } else {
        return eval(funcString);
    }
}

function cloneOtherType(targe, type) {
    const Ctor = targe.constructor;
    switch (type) {
        case boolTag:
        case numberTag:
        case stringTag:
        case errorTag:
        case dateTag:
            return new Ctor(targe);
        case regexpTag:
            return cloneReg(targe);
        case symbolTag:
            return cloneSymbol(targe);
        case funcTag:
            return cloneFunction(targe);
        default:
            return null;
    }
}

function clone(target, map = new WeakMap()) {

    // 克隆原始类型
    if (!isObject(target)) {
        return target;
    }

    // 初始化
    const type = getType(target);
    let cloneTarget;
    if (deepTag.includes(type)) {
        cloneTarget = getInit(target, type);
    } else {
        return cloneOtherType(target, type);
    }

    // 防止循环引用
    if (map.get(target)) {
        return map.get(target);
    }
    map.set(target, cloneTarget);

    // 克隆set
    if (type === setTag) {
        target.forEach(value => {
            cloneTarget.add(clone(value, map));
        });
        return cloneTarget;
    }

    // 克隆map
    if (type === mapTag) {
        target.forEach((value, key) => {
            cloneTarget.set(key, clone(value, map));
        });
        return cloneTarget;
    }

    // 克隆对象和数组
    const keys = type === arrayTag ? undefined : Object.keys(target);
    forEach(keys || target, (value, key) => {
        if (keys) {
            key = value;
        }
        cloneTarget[key] = clone(target[key], map);
    });

    return cloneTarget;
}

module.exports = {
    clone
};

```

