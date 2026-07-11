# CSDN 会议数据看板

本仓库包含两个相互独立的 React + Vite 数据看板工程，开发人员可以分别安装、运行和构建。

## 目录

| 目录 | 说明 |
| --- | --- |
| `meeting-dashboard/` | 单场会议数据看板：总数据/推广数据、曝光点击报名、渠道、漏斗、报名用户画像 |
| `ops-dashboard/` | 平台运营数据看板：总览、流量与获客、主办方与内容供给、广告投放分析 |

## 环境要求

- Node.js 22+
- npm 10+

## 一次安装全部依赖

```bash
npm install
```

## 启动会议数据看板

```bash
npm run dev:meeting
```

## 启动运营数据看板

```bash
npm run dev:ops
```

## 构建

构建两个工程：

```bash
npm run build
```

也可以分别构建：

```bash
npm run build:meeting
npm run build:ops
```

构建产物分别输出到：

- `meeting-dashboard/dist/`
- `ops-dashboard/dist/`

## 独立使用

两个子目录均拥有自己的 `package.json`、Vite 配置和源码，可以单独复制或接入现有前端工程。进入对应目录后执行：

```bash
npm install
npm run dev
```

当前数据为原型 Mock 数据，后续接入后端时主要替换各工程的 `src/App.tsx` 中数据生成与常量部分即可。
