# 移卡Vue组件库实践分析

> 1、逻辑思维前端开发团队
>
> https://github.com/arronKler/lime-ui
>
> https://juejin.im/post/5d6bdb96f265da03c428a85b2
>
> 2、有赞前端
>
> https://github.com/youzan/vant/tree/dev/packages/vant-cli
>
> https://github.com/youzan/vant/blob/dev/packages/vant-cli/docs/config.md
>
> https://www.yuque.com/neverland/vant/fuwcko
>
> https://juejin.im/post/6844903582102192142#heading-0
>
> 3、element前端
>
> https://juejin.im/post/6844904197863964685#heading-25
>
> https://github.com/ElemeFE/element/blob/master/.github/CONTRIBUTING.zh-CN.md
>
> 4、antd（react，dumi+father的组件脚手架开发）
>
> https://d.umijs.org/guide
>
> https://github.com/umijs/father/tree/2.x
>
> ps：阿里系的生态过于庞大，抽象层级过多，不适合用作基础组件库技术参考。

|                     |           |           |                                                              |                                                              |                                                              |
| ------------------- | --------- | --------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 名称                | 团队      | 下载量/月 | 生态                                                         | 特色                                                         | 2019 年在做的事情                                            |
| **React Bootstrap** | 社区      | 1600k     | React Bootstrap - 桌面端 React 组件React Router Bootstrap - React Router 辅助库 | 基于 Bootstrap 4，用户基数大                                 | 低频维护                                                     |
| **Ant Design**      | 蚂蚁      | 1100k     | Ant Design-桌面端 React 组件Ant Design Mobile - 移动端 React 组件Ant Design Mobile RN - React Native 组件Ant Design Pro - 中后台解决方案Ant Design Icons - 图标库Ant Design Vue - Vue 版本（社区维护）NG ZORRO - Angular 版本（社区维护）Babel Plugin Import - 按需引入插件 | 一套完备的设计语言提供设计语言在各个框架对应的实现背靠体验技术部，技术实力雄厚 | 升级到 React 16.8减小包体积虚拟滚动性能优化将 Pro 的组件迁移到 Antd统一 API 命名规范优化开发体验，完善错误提示提供更完善的设计资源 |
| **Reactstrap**      | 社区      | 768k      | Reactstrap - 桌面端 React 组件                               | 基于 Bootstrap 4                                             | 低频维护                                                     |
| **Element UI**      | 饿了么    | 575k      | Element UI - 桌面端 Vue 组件Element React -桌面端 React 组件Vue Markdown Loader - 文档转 Vue 组件的插件 | 一套完备的设计语言饿了么大前端持续投入                       | 即将开源 Element Pro即将开源 Element Mobile持续添加新组件    |
| **Vuetify**         | 社区      | 546k      | Vuetify - 桌面端 Vue 组件Vuetify Loader - 组件按需引入插件Matetial Theme Kit - 额外的样式主题（收费）Scaffolding - 各种形式的脚手架模板 | 基于 Material Design非常完备的文档和教程维护者实力很强       | 升级到最新的 MD 视觉规范使用 TypeScript 重构优化 Accessibility增强 Grid 布局系统增加大量的代码示例 |
| **Material UI**     | 社区      | 500k      | Material UI - 桌面端 React 组件Vue Material - 桌面端 Vue 组件 |                                                              |                                                              |
| **Fabric UI**       | 微软      | 443k      |                                                              |                                                              |                                                              |
| **Blueprint**       |           | 268k      |                                                              |                                                              |                                                              |
| **Rebass**          |           | 89k       |                                                              |                                                              |                                                              |
| **iVIew**           | 独立运营  | 71k       |                                                              |                                                              |                                                              |
| **React Toolbox**   |           | 68k       |                                                              |                                                              |                                                              |
| **Sematic UI**      | 社区      | 54k       |                                                              |                                                              |                                                              |
| **Grommet**         |           | 49k       |                                                              |                                                              |                                                              |
| **Primereact**      |           | 44k       |                                                              |                                                              |                                                              |
| **Quasar**          |           | 41k       |                                                              |                                                              |                                                              |
| **Vant**            | 有赞      | 41k       |                                                              |                                                              |                                                              |
| **Onsen UI**        |           | 35k       |                                                              |                                                              |                                                              |
| **Mint UI**         | 饿了么    | 27k       |                                                              |                                                              |                                                              |
| **Elemental**       |           | 17k       |                                                              |                                                              |                                                              |
| **Vux**             | 个人      | 15k       |                                                              |                                                              |                                                              |
| **Evergreen UI**    | Segment   | 14k       |                                                              |                                                              |                                                              |
| **Cube UI**         | 滴滴      | 8k        |                                                              |                                                              |                                                              |
| **Ring UI**         | JetBrains | 7k        |                                                              |                                                              |                                                              |
| **Muse UI**         |           | 7k        |                                                              |                                                              |                                                              |
| **Resuit**          |           | 5k        |                                                              |                                                              |                                                              |
| **Mand Mobile**     | 滴滴      | 4k        |                                                              |                                                              |                                                              |
| **Vue Strap**       |           | 3k        |                                                              |                                                              |                                                              |
| **Taro UI**         | 京东      | 3k        |                                                              |                                                              |                                                              |
| **Zent**            | 有赞      | 3k        |                                                              |                                                              |                                                              |
| **Keen UI**         |           | 2k        |                                                              |                                                              |                                                              |
| **Weex UI**         | 阿里      | 2k        |                                                              |                                                              |                                                              |

一个比较成熟的前端团队，都会面对一个问题：**如何提高团队的开发效率？**

一个系统拥有大量的业务场景和业务代码，相似的页面和代码层出不穷，如何管理和抽象这些相似的代码和模块，这肯定是诸多团队都会遇到的问题。 不断的拷代码？还是抽象成 UI 组件或业务组件？显然后者更高效。

那么现在就面临一个选择：一是选择已有的组件库，例如 antDesign、Material-UI 、element-ui等比较成熟的组件库；二是团队再开发一套属于自己的组件库。

构建一个完整的组件库需要考虑：

- 组件设计思路
- 组件代码规范（lint）
- 组件开发流程（需要编写大量脚本：如新增组件目录，lint检查，开发环境服务等；以及编写本地自启服务；）
- 组件测试（TS/Flow）
- 打包
- 组件维护（包括 PR / issue 管理、文档）

具体参考

### 打包

对于打包后的文件，统一放在 `lib` 目录下，同时记得要在 `.gitignore` 中加上 `lib` 目录，避免将打包结果提交到代码库中。

同时针对引入方式的不同，要提供`全局引入`（UMD）和`按需加载`两种形式的包。参考element-ui的打包方式：

![img](https://user-gold-cdn.xitu.io/2020/6/23/172df2c6a4ca6dd8?imageslim)

目前antd已经全面使用rollup作为打包工具了，原因：

1、webpack产出的文件，带有包裹代码，会使包体积变大，没有达到压缩体积的作用；

2、rollup会自动输出多余的代码，体积更小；

3、rollup会将所有的模块构建在一个函数内，执行效率高；

4、能输出多种格式

最终目的都一样，为了实现按需引入或全量的打包方式。

### 建议：

如果使用fork出来二次开发的方式，该项目在进行修复bug以及升级新特性或者重构的时候，将面临非常尴尬的局面-无法向上兼容，在二次开发之后，merge的话将会面临巨量冲突，最终变成二选一的局面：要么一条路走到黑，自有组件库跟进新特性，要么重新选用第三方框架。如果第一种选择，那其实与从零开发一个组件库没有区别了，自建组件库还更可控，文档更详尽。

所以建议搭自有组件库，可以高度贴近公司的实际需求，对业务开发效率的提升也更大。