# 匠心面坊 - 面条工厂小程序

基于UniApp开发的面条工厂在线订购小程序，支持多端编译（微信小程序、APP、H5）。

## 功能特性
- 📱 三端首页：轮播展示、登录注册、核心功能入口
- 🛒 在线订购：分类导航、规格选择、购物车、下单功能
- 👤 个人中心：订单管理、信用额度、地址管理
- 💳 信用支付：支持信用额度结算、账单统计
- 📊 订单跟踪：订单进度条、状态实时更新

## 技术栈
- **前端框架**：UniApp + Vue 3
- **状态管理**：本地存储（可扩展Vuex/Pinia）
- **UI设计**：原生CSS + rpx自适应
- **后端对接**：支持RESTful API接口

## 项目结构
```
noodle-factory/
├── pages/              # 页面文件
│   ├── home/           # 首页
│   ├── order/          # 订购页
│   └── profile/        # 我的页
├── components/         # 公共组件
│   ├── u-modal/        # 弹窗组件
│   └── cart-bar/       # 购物车栏组件
├── common/             # 公共方法
│   ├── util.js         # 工具函数
│   └── data.js         # 常量数据
├── static/             # 静态资源
├── App.vue             # 应用入口
├── main.js             # 主配置
├── pages.json          # 路由配置
├── manifest.json       # 应用配置
└── uni.scss            # 全局样式
```

## 运行方式
### 1. HBuilderX运行（推荐）
- 下载安装HBuilderX
- 导入项目文件夹
- 选择运行平台（微信小程序/APP/H5）
- 点击运行即可

### 2. 命令行运行
```bash
# 安装依赖
npm install

# 微信小程序
npm run dev:mp-weixin

# H5
npm run dev:h5

# APP
npm run dev:app
```

## 部署说明
### 微信小程序
1. 在`manifest.json`中配置微信小程序AppID
2. 运行 `npm run build:mp-weixin`
3. 在微信开发者工具中导入`dist/build/mp-weixin`目录
4. 提交审核发布

### H5
1. 运行 `npm run build:h5`
2. 将`dist/build/h5`目录部署到静态服务器即可

## 后端对接
当前版本为本地数据演示版本，对接真实后端需要：
1. 在`common/request.js`中封装请求方法
2. 替换本地存储调用为接口请求
3. 配置请求域名白名单

## 目录说明
- `static/icon/`：存放图标文件（home.png、cart.png、user.png等）
- `pages.json`：配置页面路由、导航栏、底部tabbar
- `uni.scss`：全局样式变量，可统一修改主题色

## 许可证
MIT License
