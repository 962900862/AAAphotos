# PhotoChatPro

PhotoChatPro 是一个强大的图片增强工具，专门为小红书平台优化，提供高清图片处理和主页美化功能。

## 功能特点

- 🖼️ 高清图片增强
- 🎨 小红书主页优化
- 🔄 批量图片处理
- 🚀 4K 蓝光增强
- 📱 移动端优化
- 🔒 安全可靠

## 技术栈

- 前端：Next.js 14 + React 18 + TypeScript + Tailwind CSS
- 后端：Python + CodeFormer AI
- 部署：Vercel
- 测试：Jest + React Testing Library
- 代码质量：ESLint + Prettier + TypeScript

## 快速开始

### 环境要求

- Node.js 18+
- Python 3.9+
- npm 或 yarn

### 安装步骤

1. 克隆仓库：
   ```bash
   git clone https://github.com/yourusername/photochatpro.git
   cd photochatpro
   ```

2. 安装前端依赖：
   ```bash
   npm install
   # 或
   yarn install
   ```

3. 安装 Python 依赖：
   ```bash
   pip install -r requirements.txt
   ```

4. 配置环境变量：
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 文件，填入必要的配置
   ```

5. 启动开发服务器：
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

### 测试

运行测试：
```bash
npm test
# 或
yarn test
```

### 构建

构建生产版本：
```bash
npm run build
# 或
yarn build
```

## 项目结构

```
photochatpro/
├── app/                    # Next.js 应用目录
├── components/            # React 组件
├── lib/                   # 工具函数和共享代码
├── public/               # 静态资源
├── scripts/              # 构建和部署脚本
├── __tests__/           # 测试文件
├── api_enhance.py       # Python 后端服务
└── requirements.txt     # Python 依赖
```

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 代码规范

- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 使用 Jest 和 React Testing Library 进行测试
- 保持 80% 以上的测试覆盖率

## 性能优化

- 图片懒加载
- 组件代码分割
- 静态资源优化
- 缓存策略

## 安全措施

- 输入验证
- XSS 防护
- CSRF 防护
- 速率限制
- 文件上传限制

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 更新日志

### v0.1.0 (2024-03-18)
- 初始版本发布
- 基础图片增强功能
- 小红书主页优化
- 4K 蓝光增强

## 联系方式

- 项目维护者：[Your Name](https://github.com/yourusername)
- 邮箱：your.email@example.com
- 项目链接：[https://github.com/yourusername/photochatpro](https://github.com/yourusername/photochatpro)
