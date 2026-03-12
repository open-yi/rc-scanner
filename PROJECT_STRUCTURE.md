# RC Scanner React - 项目结构说明

## 项目概述

这是一个基于 React 和 TypeScript 的文档扫描器组件库，支持通过相机捕获、裁剪和导出文档。

## 目录结构

```
rc-scanner-react/
├── src/                        # 组件库源代码
│   ├── components/            # 组件目录
│   │   └── Scanner.tsx        # 文档扫描器组件
│   └── index.ts               # 库的入口文件
├── demo/                       # 演示应用
│   ├── src/
│   │   ├── App.tsx            # 演示应用入口
│   │   ├── Demo.tsx           # 多个使用示例
│   │   ├── index.ts           # 演示导出
│   │   ├── main.tsx           # 演示入口
│   │   └── index.css          # 演示样式
│   └── index.html             # 演示HTML文件
├── dist/                       # 库构建输出目录（npm发布用）
├── node_modules/               # 依赖包
├── public/                     # 静态资源
├── .git/                       # Git仓库
├── .gitignore                  # Git忽略文件
├── .npmignore                  # npm发布忽略文件
├── CHANGELOG.md                # 变更日志
├── EXAMPLES.md                 # 使用示例文档
├── LICENSE                     # 许可证文件
├── package.json                # 项目配置和依赖
├── tsconfig.json               # TypeScript配置
├── tsconfig.app.json           # 应用类型配置
├── tsconfig.node.json          # Node类型配置
├── vite.config.ts              # Vite构建配置
└── README.md                   # 项目说明文档
```

## 主要文件说明

### 配置文件

- **package.json**: 项目元数据、依赖、脚本命令
- **tsconfig.json**: TypeScript基础配置
- **vite.config.ts**: Vite构建配置，支持库模式和demo模式
- **eslint.config.js**: ESLint代码规范配置

### 源代码

- **src/components/Scanner.tsx**: 核心扫描组件
  - 摄像头访问
  - 缩放和平移控制
  - 文档裁剪功能
  - 三种扫描模式：文档、照片、二维码
  - 图像网格辅助线
  - 高质量JPEG导出

- **src/index.ts**: 库入口，导出所有公开API

### 演示应用

- **demo/src/Demo.tsx**: 多个使用示例展示
  - 基础文档扫描
  - 手动控制扫描
  - 文档模式（带裁剪）
  - 照片模式
  - 二维码模式

### 文档

- **README.md**: 项目主文档，包含安装和使用说明
- **EXAMPLES.md**: 详细的使用示例
- **CHANGELOG.md**: 版本变更历史
- **LICENSE**: MIT开源许可证

## 构建和发布

### 开发模式

```bash
pnpm dev
```

启动演示应用的开发服务器。

### 构建库

```bash
pnpm build:lib
```

构建用于npm发布的库文件到 `dist/` 目录。

### 构建演示应用

```bash
pnpm build:demo
```

构建演示应用的静态文件。

## 功能特性

### 核心功能

1. **多模式扫描**
   - Document模式：文档扫描，带裁剪框和网格
   - Photo模式：普通照片拍摄
   - QR模式：二维码识别（预留接口）

2. **相机控制**
   - 自动启动相机
   - 手动控制启动/停止
   - 前置/后置摄像头选择
   - 高清摄像头支持

3. **视图控制**
   - 缩放功能（1x - 3x）
   - 平移拖动
   - 重置视图
   - 响应式设计

4. **图像处理**
   - 文档裁剪
   - 高质量JPEG导出（95%）
   - Base64编码
   - 下载功能

### 技术栈

- React 19.2.4
- TypeScript 5.9.3
- Vite 7.3.1
- ESLint 9.39.4
- pnpm 10.12.4

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- 移动浏览器（iOS Safari, Chrome Mobile）

**注意**：相机访问需要HTTPS或localhost环境。

## npm发布准备

1. 更新 `package.json` 中的版本号
2. 更新 `CHANGELOG.md`
3. 执行 `pnpm build:lib`
4. 检查 `dist/` 目录中的文件
5. 发布到npm

## 后续改进方向

- [ ] 二维码/条形码识别功能
- [ ] 图像增强（去噪、对比度调整）
- [ ] 文档自动检测和裁剪
- [ ] 立体模式（全景扫描）
- [ ] 批量扫描
- [ ] 照片滤镜
- [ ] Storybook文档
- [ ] 单元测试
- [ ] 性能优化
