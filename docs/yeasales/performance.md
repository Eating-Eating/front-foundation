# 前端监控系统设计概要



## 一、设计目的

用户访问我们的业务应用时，整个访问过程大致可以分为三个阶段：页面生产时（服务端状态）、页面加载时和页面运行时。

为了保证线上业务稳定运行，我们会在服务端对业务的运行状态进行各种监控，现在已使用prometheus 各种export对服务端服务以及机器等进行监控，而前端页面加载和前端运行时的状态监控还是空白状态。对于一些指标不能方便获取到。例如：

u 各个地区用户访问我们应用的实际速度未知；

u 每个应用内有大量的异步数据调用，而他们的性能、成功率都是未知的；

u 无法第一时间获取用户访问我们应用时遇到的错误；

u 无法量化的衡量开发团队产品开发的质量与评估；

![img](.\wps1.png) 

 

## 二、设计原理

前端监控的目标主要是对真实用户使用前端应用（以下简称应用）时页面加载性能指标的采集以及运行时状态数据的采集。采集以全局无感埋点与开发者自定义埋点的方式进行。

全埋点通过获取客户端（浏览器/微信/支付宝等）的navigation.timing数据上送；监听windows.onError获取JS Error信息上送；劫持客户端异步请求对象（fetch/$ajax)监听api请求信息，并上送监听结果。同时前端SDK库提供api（正常上报/异常上报）给开发者自定义埋点采集数据上送。

服务端运行一个web服务持久化前端埋点采集数据，以文件形式保存日志。同时Prometheus Export监听日志文件，解析日志内容并向prometheus暴露度量指标（详细指标内容见后续指标设计）。为了区分不同应用数据，需要在每个应用上送数据中附带应用ID。

 

前端性能监控利器Performance.timing:

![img](.\wps2.jpg) 

## 三、功能目标

（1）统计用户使用满意度

满意度 = (满意数量 + 可容忍数量 / 2) / 总样本数量

满意(0-T)；可容忍(T-4T)；不满意(>4T)；T为首屏渲染时间，默认为2秒。

（2）应用出错率统计（JS Error）

错误率 = 错误样本数量 / 总样本数量

注：在一个PV周期内，如果发生错误(JS Error)，则此PV周期为错误样本。

（3）API调用成功率统计

API成功率 = 成功调用API / 总API调用样本

（4）阶段请求耗时统计

n DNS解析耗时

n TCP连接耗时

n SSL连接耗时

n 网络请求耗时（TTFB）

n 数据传输耗时（Trans）

n DOM解析耗时

n 资源加载耗时（Res）

（5）关键性能指标统计

n 首包时间（FristByte），测量网络状况。

n 白屏时间（FPT）影响用户体验重要指标

n 首次可交互时间（TTI）影响用户体验重要指标

（6）服务端可扩展性

在数据收集方面采用性能很好的openresty，而且只纯粹的做一件事就是打印access日志。所以两个节点就基本可以满足需求。日志解析方面，先将日志采集到kafka消息队列再通过消费kafka数据导出prometheus指标。

## 四、总体设计框架

![img](.\wps3.jpg) 

## 五、监控服务应用

![img](.\wps4.jpg) 

## 六、前端监控接入流程

![img](.\wps5.jpg) 

## 七、前端埋点及SDK使用

申请应用ID（pid），应用ID是用于prometheus查询数据的一个指标，这个是必须选项并且不能和其他应用重复。后续采集前端数据上送会检验pid是否合法。

（1）CDN方式接入

在<body>内容第一行粘贴探针代码

<script>

!(function(c,b,d,a){c[a]||(c[a]={});c[a].config={pid:"your-project-id"};with(b)with(body)with(insertBefore(createElement("script"),firstChild))setAttribute("crossorigin","",src=d)

})(window,document,"https://pic1.leshuazf.com/fems/fel.min.js","__fel");</script>

在 config 中添加额外参数。如《SDK配置》。自定义埋点数据采集请参考《API使用指南》。

（2）NPM方式接入

（6）SDK配置

| 参数名   | 类型 | 空 | 默认        | 描述                                                     |
| ------------ | -------- | ------ | --------------- | ------------------------------------------------------------ |
| pid          | String   | 否     | 无              | 应用唯一 ID，由服务端在创建监控应用时自动生成                |
| page         | String   | 是     | host + pathname | 页面名称，默认取当前页面 URL 的关键部分                      |
| enableSPA    | Boolean  | 是     | false           | 是否监听页面的 hashchange 事件并重新上报 PV，适用于单页面应用场景 |
| parseHash    | Function | 是     | 见描述          | 单页面应用场景中，在 enableSPA 设为 true 的前提下，页面触发 hashchange 事件时，此参数用于将 URL hash 解析为 page 字段的方法。 |
| disableHook  | Boolean  | 是     | false           | 是否禁用 AJAX 请求监听，默认会监听并用于 API 调用成功率上报  |
| autoSendPv   | Boolean  | 是     | true            | 是否初始化后自动发送 PV，默认会自动发送                      |
| sendResource | Boolean  | 是     | false           | 是否上报页面静态资源。在页面 load 时会根据该项配置判断是否要上报页面加载的静态资源，所以请直接使用在 config 配置 sendResource 的方式。而 setConfig 的方式可能在页面 load 后才会触发，从而配置的 sendResource 会无效。sendResource 配置为 true 后，在页面 onload 时会上报当前页面加载的静态资源信息。如果发现页面加载较慢，可以在会话追踪页面，点击查看本次页面加载的静态资源瀑布图，判断页面加载较慢的具体原因。（服务端暂未采集） |

 

（7）API使用指南

1、__fel.api(api, success, time, code, msg)

此接口用于上报页面的 API 调用成功率，SDK 默认会监听页面的 AJAX 请求并调用此接口上报；

如果页面的数据请求方式是 JSONP 或者其它自定义方法（比如客户端 SDK 等），可以在数据请求方法中调用 `api()` 方法手动上报。

另外，如果要调用此接口，建议在 SDK 配置项中将 `disabledHook` 设置为 true，具体配置请参照 SDK 配置项。

| 参数名 | 类型      | 空 | 默认 | 描述     |
| ---------- | ------------- | ------ | -------- | ------------ |
| api        | String        | 否     | -        | 接口名       |
| success    | String        | 否     |          | 是否调用成功 |
| time       | Number        | 否     | -        | 接口耗时     |
| code       | String/Number | 是     | 无       | 返回码       |
| msg        | String        | 是     | 无       | 返回信息     |

 

2、__fel.error(error, pos)（服务端暂未采集）

此接口用于上报页面中的 JS 错误或者使用者想要关注的异常；

一般情况下，SDK 会监听页面全局的 Error 并调用此接口上报异常信息，但由于浏览器的同源策略往往获取不到错误的具体信息，这时就需要使用者手动上报。

| 参数名   | 类型 | 空 | 默认 | 描述                        |
| ------------ | -------- | ------ | -------- | ------------------------------- |
| error        | Error    | 否     | -        | JS 的 Error 对象                |
| pos          | Object   | 是     | -        | 错误发生的位置，包含以下3个属性 |
| pos.filename | String   | 是     | -        | 错误发生的文件名                |
| pos.lineno   | Number   | 是     | -        | 错误发生的行数                  |
| pos.colno    | Number   | 是     | -        | 错误发生的列数                  |

 

3、__fel.speed(point, time)

此接口用于上报页面中的一些自定义的关键时间节点；

| 参数名 | 类型 | 空 | 默认               | 描述                                        |
| ---------- | -------- | ------ | ---------------------- | ----------------------------------------------- |
| point      | Enum     | 否     | -                      | 测速关键字，必须是 s0 ~ s10                     |
| time       | Number   | 否     | Date.now() - startTime | 耗时(毫秒)，默认是当前时间 - 页面起始时间       |
| forceSPA   | Boolean  | 是     | false                  | 只在 SPA 中有效，上报数据时 page 是否使用子页面 |

 

4、BrowserLogger.singleton(config, prePipe)

静态方法，返回一个单例对象，只在第一次调用时传入的config,prePipe生效，之后调用只返回已经生成的实例：

此方法可以用于在应用入口初始化 SDK，也可以在每次调用时获取实例。

| 参数名 | 类型 | 空 | 默认 | 描述                |
| ---------- | -------- | ------ | -------- | ----------------------- |
| config     | Object   | 否     | -        | 应用配置，参考SDK配置。 |
| prePipe    | Array    | 是     | -        | 预上报内容。            |

 

5、__fel.setConfig(next)

修改配置项，用于在 SDK 初始完成后重新修改部分配置项，具体配置请参照 SDK 配置项。

| 参数名 | 类型 | 空 | 默认 | 描述                                |
| ---------- | -------- | ------ | -------- | --------------------------------------- |
| next       | Object   | 否     | -        | 需要修改的配置项以及其值，参考SDK配置。 |

 

6、__fel.setPage(page, sendPv)

用于重新设置页面的 page（默认会触发重新上报 PV），此接口一般在单页面应用中会用到。

| 参数名 | 类型 | 空 | 默认 | 描述               |
| ---------- | -------- | ------ | -------- | ---------------------- |
| page       | String   | 否     | -        | 新的Page name          |
| sendPv     | Boolean  | 是     | true     | 是否上报PV，默认上报。 |

 

## 八、监控度量指标

（1）Counter（计数器）

1、PV请求统计

2、JS Error统计

3、API请求成功统计

4、API请求失败统计

5、服务端请求数统计

 

（2）Gauge（测量图）

1、页面健康程度

（3）Summary（总结）

1、统计JS Error错误率

2、统计API请求错误率

3、统计API请求完成耗时

4、统计阶段请求耗时

5、统计关键性能指标

6、用户停留时间

 

## 九、数据模型

（1）标签

| 标签名 | 类型 | 空 | 默认 | 描述                         |
| ---------- | -------- | ------ | -------- | -------------------------------- |
| network    | String   | 是     | -        | 网络，4G/WiFi/3G                 |
| browser    | String   | 是     | -        | 浏览器类型，wechat/safari/chrome |
| system     | String   | 是     | -        | 操作系统，android/iphone/linux   |
| device     | String   | 是     | -        | 终端设备，huawei/iphone/nexus    |

 

（2）Exporter 指标

http_request_total		// 总请求次数

http_api_request_total		// API请求次数

http_api_duration_ms		// api请求耗时

http_request_dns_ms		// DNS查询时间

http_request_tcp_ms		// TCP建立时间

http_request_ssl_ms		// SSL建立时间

http_request_ttfb_ms		// 服务器处理时间

http_request_trans_ms		// 传输时间

http_request_dom_ms		// DOM解析时间

http_request_res_ms		// 静态资源下载时间

http_request_firstbyte_ms	// 首字节时间

http_request_fpt_ms		// 首屏时间

http_request_tti_ms		// 可交互时间

http_request_ready_ms		// 页面OnReady时间

http_request_load_ms		// 页面完全加载完成

page_err_count			// 页面发生错误个数

page_stay_ms			// 用户停留时间

page_healthy				// 页面健康 0-1

## 十、接入Prometheus步骤

\1. 前端埋点数据上送，参考《前端埋点及SDK使用》

\2. 向运维申请Grafana帐号

\3. 创建Dashboard。

\4. Dashboard中创建Panel。

 

## 十一、其他说明

Prometheus专长的是监控警报和时间序列数据库，能够通过多维度的分析一些系统性能指标。对于详细的日志分析并不擅长。所以目前我们虽然可以做到把前端错误日志，静态资源文件列表采集上送。但是在prometheus上并没有去分析他。如果有需要可以引入ELK。

## 十二、附录

首屏时间是一个重要的性能指标，反映用户从打开应用到显示应用页面的时间。也就是用户看到的白屏时间。首屏时间太长会给用户造成很不好的体验。一般建议首屏时间要在2s以内。以下两个图的作用是一样的，就是观察应用的首屏时间。从下面图可以看出，该应用的首屏（白屏时间）主要分布在480ms-800ms之间。选择不同维度可以看在不同设备，浏览器上的时间指标。

\1. 首屏时间的P90时间序列

![img](.\wps6.jpg) 

\2. 首屏时间的时间分布

![img](.\wps7.jpg) 

可操作时间反映了用户可以与应用交互的时间。从图表可以看出，该应用可操作时间大概在1.6s左右。

![img](.\wps8.jpg) 

打开次数可以反映应用的使用情况，例如在什么时间点是峰值，什么时间点是谷值。

![img](.\wps9.jpg) 

异步请求成功率反映应用ajax调用的成功率，如果返回码规划的好，可以看出应用使用的稳定性。错误码可以帮忙分析主要是那些接口出了问题。更详细的接口分析可以借助ELK做日志分析。前端采集会详细采集每个接口的情况。

![img](.\wps10.jpg) 

![img](.\wps11.jpg) 

DNS查询，TCP连接，SSL建立时间可以反映用户的网络环境。

![img](.\wps12.jpg) 

![img](.\wps13.jpg) 

![img](.\wps14.jpg) 