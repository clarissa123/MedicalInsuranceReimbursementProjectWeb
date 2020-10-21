<!--
 * @Descripttion: 医保报销项目前端文档
 * @version: 
 * @Author: Clarissa
 * @Date: 2020-10-13 11:07:38
 * @LastEditors: Clarissa
 * @LastEditTime: 2020-10-21 15:33:03
-->
# 医保报销项目前端文档

# 前言
* 本项目属于二次开发。由于第一次开发无项目文档，故以下说明解释由二次开发人员作出，仅供参考。

# 技术栈
* vue 全家桶
* axios
* echarts
* element-ui
* handsontable

# 项目架构
```
│  vue.config.js                     // webpack配置              
├─public
│      favicon.ico                   // ico图标
│      index.html                    // 入口html文件
└─src
    │  App.vue                        // 根组件
    │  main.js                        // 程序入口文件
    ├─assets                          // 静态文件目录
    │  ├─css                          // 存放公共样式文件夹 
    │  ├─font                         // 存放公共字体文件夹         
    │  └─myStyle
    │      │  mixin.scss              // 基础样式文件
    │      │  common.scss             // 公共样式文件
    ├─axios
    │  index.js                       //axios配置目录
    ├─components                      //组件
    │      checkList                    
    │      layer                       
    │      new-text-annotation          
    │      text-annotation    
    ├─config                             // 用于导出项目通用的配置信息
    │  │  index.js                       // 配置接口访问地址
    ├─router
    │      index.js                       // 单页面路由注册组件
    ├─store
    │      index.js                       // 状态管理仓库未使用到
    └─views
    │   cacResult                  // 任务管理
    │   documentsList              // 系统管理
    │    ├─DataDetail              // 权限为管理员下的识别调整页
    │    ├─dataDetailCopy          // 测试页
    │    ├─DataDetailFuHe          // 权限为复核下的识别调整页
    │    ├─DataDetailNew           // 权限为审核下的识别调整页(存放excel表格)
    │   documentSummary            // 日志管理
    │   orgManage                  // 机构管理
    │   process                    // 报销进度
    │   roleManage                 // 权限管理
    │   userManage                 // 用户管理
```


# 安装
```
yarn install
```

# 运行
```
yarn serve
```

# 打包
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
