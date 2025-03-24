const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// 检查必要的环境变量
const requiredEnvVars = [
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'NEXT_PUBLIC_360_IMAGE_API_KEY',
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

// 递归删除目录函数
function rimraf(dir) {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // 递归删除子目录
        rimraf(curPath);
      } else {
        // 删除文件
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dir);
  }
}

// 清理旧的构建文件
console.log('清理旧的构建文件...');
try {
  if (fs.existsSync(path.join(__dirname, 'out'))) {
    rimraf(path.join(__dirname, 'out'));
    console.log('删除out目录成功');
  }
  if (fs.existsSync(path.join(__dirname, '.next'))) {
    rimraf(path.join(__dirname, '.next'));
    console.log('删除.next目录成功');
  }
} catch (error) {
  console.error('清理失败:', error);
  process.exit(1);
}

// 执行构建命令
console.log('开始构建...');
try {
  // 使用标准构建命令
  execSync('npm run build', { stdio: 'inherit' });
  
  // 导出静态HTML文件
  console.log('导出静态HTML文件...');
  execSync('npm run export', { stdio: 'inherit' });
} catch (error) {
  console.error('构建失败:', error);
  process.exit(1);
}

// 确认index.html文件存在
console.log('检查构建结果...');
if (!fs.existsSync(path.join(__dirname, 'out', 'index.html'))) {
  // 如果index.html不存在，尝试从其他文件复制
  if (fs.existsSync(path.join(__dirname, 'out', 'photochatpro.html'))) {
    fs.copyFileSync(
      path.join(__dirname, 'out', 'photochatpro.html'),
      path.join(__dirname, 'out', 'index.html')
    );
    console.log('已创建index.html文件');
  } else {
    console.error('构建后没有找到index.html或者photochatpro.html文件!');
    // 查找任何HTML文件
    const htmlFiles = findHtmlFiles(path.join(__dirname, 'out'));
    if (htmlFiles.length > 0) {
      console.log('找到以下HTML文件:');
      htmlFiles.forEach(file => console.log(` - ${file}`));
      // 复制第一个HTML文件作为index.html
      fs.copyFileSync(
        htmlFiles[0],
        path.join(__dirname, 'out', 'index.html')
      );
      console.log(`已将 ${path.basename(htmlFiles[0])} 复制为 index.html`);
    } else {
      console.error('目录中没有找到任何HTML文件!');
    }
  }
}

// 递归查找HTML文件
function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // 递归查找子目录
      results = results.concat(findHtmlFiles(filePath));
    } else {
      // 检查是否是HTML文件
      if (path.extname(filePath).toLowerCase() === '.html') {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

console.log('部署准备完成!');
console.log('注意: API路由将无法在静态部署中工作，它们需要服务器端支持!');
console.log('如果需要API功能，请使用npm run start启动服务器或部署到支持Next.js的平台上。'); 