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
