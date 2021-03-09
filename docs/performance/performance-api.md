## performance 分析

在讲如何监控之前，先来看看浏览器提供的 performance api，这也是性能监控数据的主要来源。
performance 提供高精度的时间戳，精度可达纳秒级别，且不会随操作系统时间设置的影响。
目前市场上的支持情况：主流浏览器都支持，大可放心使用。

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5ba37dfj31yo0hq42c.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5ba37dfj31yo0hq42c.jpg)

### 基本属性

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5be2ewkj31tg092n0v.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5be2ewkj31tg092n0v.jpg)

performance.navigation: 页面是加载还是刷新、发生了多少次重定向

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5bnvq8mj30ne05ijs4.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5bnvq8mj30ne05ijs4.jpg)

performance.timing: 页面加载的各阶段时长

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5bwyq4mj30mg0o0wjy.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5bwyq4mj30mg0o0wjy.jpg)

各阶段的含义：

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5cm2r73j31g20u0x6r.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5cm2r73j31g20u0x6r.jpg)

performance.memory： 基本内存使用情况，Chrome 添加的一个非标准扩展

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5cbazibj315q06eq4i.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5cbazibj315q06eq4i.jpg)

performance.timeorigin: 性能测量开始时的时间的高精度时间戳

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5cviad6j30dm026mx8.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5cviad6j30dm026mx8.jpg)

### 基本方法

performance.getEntries()
通过这个方法可以获取到所有的 performance 实体对象，通过 getEntriesByName 和 getEntriesByType 方法可对所有的 performance 实体对象 进行过滤，返回特定类型的实体。
mark 方法 和 measure 方法的结合可打点计时，获取某个函数执行耗时等。

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5dbnjlej31nq0u01es.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5dbnjlej31nq0u01es.jpg)

performance.getEntriesByName()
performance.getEntriesByType()
performance.mark()
performance.clearMarks()
performance.measure()
performance.clearMeasures()
performance.now()
...

### 提供的 API

performance 也提供了多种 API，不同的 API 之间可能会有重叠的部分。

#### 1. PerformanceObserver API

用于检测性能的事件，这个 API 利用了观察者模式。
获取资源信息

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5dyhhrtj31g40liq6s.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5dyhhrtj31g40liq6s.jpg)

监测 TTI

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5e76hzhj30yq0bsgna.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5e76hzhj30yq0bsgna.jpg)

监测 长任务

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5f4cbcsj30uo0dk76r.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5f4cbcsj30uo0dk76r.jpg)

#### 2. Navigation Timing API

https://www.w3.org/TR/navigation-timing-2/
performance.getEntriesByType("navigation");

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5foxbyej30u011ath3.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5foxbyej30u011ath3.jpg)

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5g41v1jj318o0dugnt.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5g41v1jj318o0dugnt.jpg)

不同阶段之间是连续的吗? —— 不连续
每个阶段都一定会发生吗？—— 不一定

重定向次数：performance.navigation.redirectCount
重定向耗时: redirectEnd - redirectStart
DNS 解析耗时: domainLookupEnd - domainLookupStart
TCP 连接耗时: connectEnd - connectStart
SSL 安全连接耗时: connectEnd - secureConnectionStart
网络请求耗时 (TTFB): responseStart - requestStart
数据传输耗时: responseEnd - responseStart
DOM 解析耗时: domInteractive - responseEnd
资源加载耗时: loadEventStart - domContentLoadedEventEnd
首包时间: responseStart - domainLookupStart
白屏时间: responseEnd - fetchStart
首次可交互时间: domInteractive - fetchStart
DOM Ready 时间: domContentLoadEventEnd - fetchStart
页面完全加载时间: loadEventStart - fetchStart
http 头部大小： transferSize - encodedBodySize

#### 3. Resource Timing API

https://w3c.github.io/resource-timing/
performance.getEntriesByType("resource");

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5gxga20j31as0u01kx.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5gxga20j31as0u01kx.jpg)

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5h63g05j31c60le0w9.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5h63g05j31c60le0w9.jpg)



| 123456 | // 某类资源的加载时间，可测量图片、js、css、XHRresourceListEntries.forEach(resource => {  if (resource.initiatorType == 'img') {  console.info(`Time taken to load ${resource.name}: `, resource.responseEnd - resource.startTime);  }}); |
| ------ | ------------------------------------------------------------ |
|        |                                                              |



这个数据和 chrome 调式工具里 network 的瀑布图数据是一样的。

#### 4. paint Timing API

https://w3c.github.io/paint-timing/
首屏渲染时间、首次有内容渲染时间

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5inwonkj30rq0g4acu.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5inwonkj30rq0g4acu.jpg)

#### 5. User Timing API

https://www.w3.org/TR/user-timing-2/#introduction
主要是利用 mark 和 measure 方法去打点计算某个阶段的耗时，例如某个函数的耗时等。

#### 6. High Resolution Time API

https://w3c.github.io/hr-time/#dom-performance-timeorigin
主要包括 now() 方法和 timeOrigin 属性。

#### 7. Performance Timeline API

https://www.w3.org/TR/performance-timeline-2/#introduction

### 总结

基于 performance 我们可以测量如下几个方面：
mark、measure、navigation、resource、paint、frame。

let p = window.performance.getEntries();
重定向次数：performance.navigation.redirectCount
JS 资源数量：p.filter(ele => ele.initiatorType === "script").length
CSS 资源数量：p.filter(ele => ele.initiatorType === "css").length
AJAX 请求数量：p.filter(ele => ele.initiatorType === "xmlhttprequest").length
IMG 资源数量：p.filter(ele => ele.initiatorType === "img").length
总资源数量: window.performance.getEntriesByType("resource").length

**不重复的耗时时段区分：**
重定向耗时: redirectEnd - redirectStart
DNS 解析耗时: domainLookupEnd - domainLookupStart
TCP 连接耗时: connectEnd - connectStart
SSL 安全连接耗时: connectEnd - secureConnectionStart
网络请求耗时 (TTFB): responseStart - requestStart
HTML 下载耗时：responseEnd - responseStart
DOM 解析耗时: domInteractive - responseEnd
资源加载耗时: loadEventStart - domContentLoadedEventEnd

**其他组合分析：**
白屏时间: domLoading - fetchStart
粗略首屏时间: loadEventEnd - fetchStart 或者 domInteractive - fetchStart
DOM Ready 时间: domContentLoadEventEnd - fetchStart
页面完全加载时间: loadEventStart - fetchStart

**JS 总加载耗时:**



| 123  | const p = window.performance.getEntries();let cssR = p.filter(ele => ele.initiatorType === "script");Math.max(...cssR.map((ele) => ele.responseEnd)) - Math.min(...cssR.map((ele) => ele.startTime)); |
| ---- | ------------------------------------------------------------ |
|      |                                                              |



**CSS 总加载耗时:**



| 123  | const p = window.performance.getEntries();let cssR = p.filter(ele => ele.initiatorType === "css");Math.max(...cssR.map((ele) => ele.responseEnd)) - Math.min(...cssR.map((ele) => ele.startTime)); |
| ---- | ------------------------------------------------------------ |
|      |                                                              |



## 如何监控？

在了解了 performance 之后，我们来看看，具体是如何监控的？

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5jbytugj31mq0b2q50.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5jbytugj31mq0b2q50.jpg)

总体流程：性能指标收集与数据上报—数据存储—数据聚合—分析展示—告警、报表推送

这里主要讲述如何收集性能数据。
性能指标收集注意项：1）保证数据的准确性 2）尽量不影响应用的性能

#### 1. 基本性能上报

采集数据：将 performance navagation timing 中的所有点都上报，其余的上报内容可参考 performance 分析一节中截取部分上报。例如：白屏时间，JS 和 CSS 总数，以及加载总时长。
其余可参考的上报：是否有缓存？是否启用 gzip 压缩、页面加载方式。
在收集好性能数据后，即可将数据上报。
那选择什么时机上报？
google 开发者推荐的上报方式：

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5jncmspj31fw0lgtct.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5jncmspj31fw0lgtct.jpg)

#### 2. 首屏时间计算

我们知道首屏时间是一项重要指标，但是又很难从 performance 中拿到，来看下首屏时间计算主要有哪些方式？
https://web.dev/first-meaningful-paint/
1）用户自定义打点—最准确的方式（只有用户自己最清楚，什么样的时间才算是首屏加载完成）
2）lighthouse 中使用的是 chrome 渲染过程中记录的 trace event
3）可利用 [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) 拿到页面布局节点数目。思想是：获取到当页面具有最大布局变化的时间点
4）aegis 的方法：利用 MutationObserver 接口，监听 document 对象的节点变化。
检查这些变化的节点是否显示在首屏中，若这些节点在首屏中，那当前的时间点即为首屏渲染时间。但是还有首屏内图片的加载时间需要考虑，遍历 performance.getEntries() 拿到的所有图片实体对象，根据图片的初始加载时间和加载完成时间去更新首屏渲染时间。
5）利用 MutationObserver 接口提供了监视对 DOM 树所做更改的能力，是 DOM3 Events 规范的一部分。
方法：在首屏内容模块插入一个 div，利用 Mutation Observer API 监听该 div 的 dom 事件，判断该 div 的高度是否大于 0 或者大于指定值，如果大于了，就表示主要内容已经渲染出来，可计算首屏时间。
6）某个专利：在 loading 状态下循环判断当前页面高度是否大于屏幕高度，若大于，则获取到当前页面的屏幕图像，通过逐像素对比来判断页面渲染是否已满屏。https://patentimages.storage.googleapis.com/bd/83/3d/f65775c31c7120/CN103324521A.pdf

[![img](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5jysgr5j31et0u0h1a.jpg)](https://tva1.sinaimg.cn/large/006tNbRwgy1gah5jysgr5j31et0u0h1a.jpg)

#### 3. 异常上报

1）js error
监听 window.onerror 事件
2）promise reject 的异常
监听 unhandledrejection 事件



| 1234 | window.addEventListener("unhandledrejection", function (event) {  console.warn("WARNING: Unhandled promise rejection. Shame on you! Reason: "    + event.reason);}); |
| ---- | ------------------------------------------------------------ |
|      |                                                              |



3）资源加载失败
window.addEventListener('error')
4）网络请求失败
重写 window.XMLHttpRequest 和 window.fetch 捕获请求错误
5）iframe 异常
window.frames[0].onerror
6）window.console.error

#### 4. CGI 上报

大致原理：拦截 ajax 请求
数据存储与聚合
一个用户访问，可能会上报几十条数据，每条数据都是多维度的。即：当前访问时间、平台、网络、ip 等。这些一条条的数据都会被存储到数据库中，然后通过数据分析与聚合，提炼出有意义的数据。例如：某日所有用户的平均访问时长、pv 等。

数据统计分析的方法：平均值统计法、百分位数统计法、样本分布统计法。