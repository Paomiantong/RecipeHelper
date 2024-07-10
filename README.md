![RecipeHelper](https://socialify.git.ci/Paomiantong/RecipeHelper/image?description=1&logo=https%3A%2F%2Fraw.githubusercontent.com%2FPaomiantong%2FRecipeHelper%2Fmain%2Fsrc%2Fassets%2FLogo.png&name=1&theme=Light)

## 在线版

- **Github地址:** <https://paomiantong.github.io/RecipeHelper/#/>
- ~~**Gitee地址:** <https://a8kt.gitee.io/recipe-helper/#/>~~(Gitee的Page服务已经挂了)

## 桌面版

请前往[Acitons](https://github.com/Paomiantong/RecipeHelper/actions)下载：

- **RecipeHelper.bundle（推荐）**：包含msi和nsis格式的安装包。
- RecipeHelper.portable：单个可执行文件，但采集时钟无法正常进行通知。

## Features

- [x] **FFXIV 6.57**
- [x] 统计所需军票、双色宝石、神典石、能工巧匠票据数量
- [x] 显示可采集材料的采集位置
- [x] 可添加已有材料数量，动态计算所需材料数量
- [x] 支持配方计算项目管理
- [x] 显示采集点类型
- [x] 采集时钟

## TODO

- [ ] 显示可直接在系统商店中购买材料的价格
- [ ] 显示材料板子价格

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
