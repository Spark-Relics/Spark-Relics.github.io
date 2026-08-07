# Spark Relics Official Website

使用 `Astro + Tailwind CSS` 构建的官网仓库，自动通过 GitHub Actions 部署到 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## GitHub 社区数据同步

首页成员、仓库、星标、Fork 与贡献者统计来自 GitHub API，生成文件为 `src/data/github-community.json`。

```bash
npm run sync:github
```

部署工作流每 6 小时自动同步一次，数据范围包括 `Spark-Relics` 组织公开仓库和创立者 `ad-naan` 的个人公开仓库（按 Star 取前 5）。公开数据无需额外配置；如需自动更新隐藏的组织成员，请在仓库 `Settings > Secrets and variables > Actions` 中添加：

- Secret 名称：`COMMUNITY_GITHUB_TOKEN`
- 推荐权限：组织 `Members: read`、目标仓库 `Metadata: read`

Token 只在 GitHub Actions 同步阶段使用，不会被写入生成文件或发送到浏览器。同步脚本只收集公开仓库，不读取或输出任何私有仓库信息。

## 自动部署 (CI/CD)

- 工作流文件：`.github/workflows/deploy.yml`
- 触发条件：推送到 `main` 分支
- 部署目标：[https://spark-relics.github.io/](https://spark-relics.github.io/)

## 首次仓库设置

1. 在 GitHub 仓库中打开 `Settings > Pages`
2. `Build and deployment` 的 `Source` 选择 `GitHub Actions`
3. 推送代码到 `main` 分支，等待 Actions 完成部署
# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
