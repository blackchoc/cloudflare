# Cloudflare 登录 Demo

一个基于 Cloudflare Workers + Static Assets 的最小登录演示。

## 演示账号

- 用户名：`admin`
- 密码：`123123`

账号密码由 Worker 后端验证。验证成功后，浏览器跳转到 `/welcome/`。

> 固定明文凭据仅适用于功能演示，请勿直接用于生产环境。

## 本地运行

要求 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

打开 Wrangler 输出的本地地址（通常为 <http://localhost:8787>）。

## 测试

```bash
npm test
```

## 部署到 Cloudflare

首次部署前，使用 Wrangler 登录 Cloudflare：

```bash
npx wrangler login
npm run deploy
```

部署完成后，Wrangler 会显示公开访问地址。

## 项目结构

```text
├── public/          # 登录页、欢迎页和样式
├── src/index.js     # Worker 登录接口
├── test/            # 接口测试
└── wrangler.jsonc   # Cloudflare 配置
```
