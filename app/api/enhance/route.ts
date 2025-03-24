import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';
import { randomUUID } from 'crypto';

// 将exec转换为Promise版本
const execPromise = promisify(exec);

// 设置最大执行时间为60秒（Hobby计划的最大值）
export const maxDuration = 60;
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// 定义图像URL类型
interface ImageUrl {
  type: string;
  url: string;
}

// 定义JSON结果类型
interface JsonResult {
  success?: boolean;
  imageUrl?: string;
  error?: string;
}

/**
 * 图像增强API处理函数
 */
export async function POST(request: NextRequest) {
  // 创建超时保护机制
  let timeoutId: NodeJS.Timeout | undefined = undefined;
  const timeoutPromise = new Promise<NextResponse>((resolve) => {
    timeoutId = setTimeout(() => {
      console.log("⚠️ 处理即将超时，提前返回结果");
      resolve(NextResponse.json({
        success: false,
        error: "处理时间超过限制，请尝试上传更小的图片或降低质量设置"
      }, { status: 408 }));
    }, 55000); // 设置为55秒，留5秒缓冲时间
  });

  // 创建临时文件来存储base64数据
  let tempFilePath: string | null = null;
  
  try {
    // 1. 从请求中获取图片数据
    console.log('🚀 接收到图像处理请求');
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    
    // 检查图片是否存在
    if (!imageFile) {
      console.error('❌ 未找到图片文件');
      clearTimeout(timeoutId!);
      return NextResponse.json({ error: '未找到图片文件' }, { status: 400 });
    }
    
    console.log(`📁 收到图片: ${imageFile.name}, 大小: ${(imageFile.size / 1024).toFixed(2)}KB, 类型: ${imageFile.type}`);
    
    // 2. 将图像转换为base64格式
    console.log('🔄 转换图像为base64格式...');
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
    console.log(`✅ 转换完成，base64数据长度: ${base64Image.length}`);
    
    // 将base64数据写入临时文件
    tempFilePath = path.join(os.tmpdir(), `image_data_${randomUUID()}.txt`);
    console.log(`📝 将base64数据写入临时文件: ${tempFilePath}`);
    await fs.writeFile(tempFilePath, base64Image, 'utf8');
    console.log('✅ 临时文件写入成功');
    
    // 3. 调用Python脚本处理图片
    console.log('\n📝 开始调用Python脚本处理图片...');
    console.log('⏳ 这可能需要一些时间，请耐心等待...\n');
    
    try {
      // 确定脚本路径
      const scriptPath = path.join(process.cwd(), 'api_enhance.py');
      console.log(`📂 脚本路径: ${scriptPath}`);
      
      // 在Windows环境下可能需要特殊处理Python路径
      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      
      // 现在使用临时文件路径而不是直接传递base64数据
      console.log(`🐍 执行 ${pythonCmd} 命令...`);
      const command = `${pythonCmd} "${scriptPath}" --input_file "${tempFilePath}" --input_type base64`;
      
      console.log(`⚙️ 执行命令: ${command}`);
      
      // 使用子进程，指定更大的缓冲区以接收所有输出
      const maxBuffer = 50 * 1024 * 1024; // 50MB
      console.log('⏳ 脚本执行中，请查看以下输出了解进度...\n');
      const { stdout, stderr } = await execPromise(command, { maxBuffer });
      
      if (stderr) {
        console.error('\n⚠️ Python脚本stderr输出:');
        console.error(stderr);
      }
      
      if (stdout) {
        // 分离JSON结果和进度输出
        // 我们期望最后一行是JSON结果
        const lines = stdout.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        
        console.log('\n🔍 Python脚本输出完成。');
        
        // 查找并提取360图床URL和最终URL
        let imageUrls: ImageUrl[] = [];
        for (const line of lines) {
          if (line.includes('## 360图床URL ##:')) {
            const url = line.split('##: ')[1];
            imageUrls.push({ type: '360图床', url });
            console.log('\n');
            console.log('📸 ' + '='.repeat(50));
            console.log(`📸 360图床返回URL: ${url}`);
            console.log('📸 ' + '='.repeat(50));
            console.log('\n');
          } else if (line.includes('## 最终处理结果URL')) {
            // 从下一行提取URL
            const index = lines.indexOf(line);
            if (index < lines.length - 1) {
              const url = lines[index + 1].trim();
              if (url && !url.startsWith('#')) {
                imageUrls.push({ type: '最终处理结果', url });
                console.log(`🌟 处理完成！最终图像URL: ${url}`);
              }
            }
          }
        }
        
        // 打印Python脚本完整输出
        console.log('\n📋 Python脚本完整输出:');
        
        // 如果找到了URL，再打印一次汇总
        if (imageUrls.length > 0) {
          console.log('\n📑 URL汇总:');
          imageUrls.forEach(({ type, url }) => {
            console.log(`${type}: ${url}`);
          });
          console.log('\n');
        }
        
        // 尝试解析JSON结果
        try {
          // 查找最后一个有效的JSON对象
          let jsonResult: JsonResult | null = null;
          for (let i = lines.length - 1; i >= 0; i--) {
            try {
              const line = lines[i].trim();
              if (line.startsWith('{') && line.endsWith('}')) {
                jsonResult = JSON.parse(line);
                console.log(`\n🔍 找到JSON结果(第${i+1}/${lines.length}行): ${line}`);
                break;
              }
            } catch (e) {
              // 继续查找下一行
            }
          }
          
          if (!jsonResult) {
            // 尝试最后一行
            try {
              jsonResult = JSON.parse(lastLine);
            } catch (e) {
              jsonResult = null;
            }
          }
          
          if (jsonResult && jsonResult.success && jsonResult.imageUrl) {
            // 4. 返回处理结果
            console.log(`\n✅ 图像处理成功! 最终URL: ${jsonResult.imageUrl}\n`);
            clearTimeout(timeoutId!);
            return NextResponse.json({
              success: true,
              imageUrl: jsonResult.imageUrl,
            });
          } else if (jsonResult) {
            console.error(`\n❌ 处理失败: ${jsonResult.error || '未知错误'}\n`);
            clearTimeout(timeoutId!);
            return NextResponse.json({ 
              error: jsonResult.error || '处理图片失败' 
            }, { status: 500 });
          } else {
            console.error('\n❌ 未能从Python输出中提取有效的JSON结果');
            clearTimeout(timeoutId!);
            return NextResponse.json({ 
              error: '未能从Python输出中提取有效的JSON结果' 
            }, { status: 500 });
          }
        } catch (parseError) {
          console.error('\n❌ 解析Python输出失败:');
          console.error(parseError);
          console.error('\nPython脚本输出内容:');
          console.error(stdout);
          clearTimeout(timeoutId!);
          return NextResponse.json({ 
            error: '解析处理结果失败' 
          }, { status: 500 });
        }
      } else {
        console.error('\n❌ Python脚本没有输出');
        clearTimeout(timeoutId!);
        return NextResponse.json({ 
          error: 'Python脚本没有输出' 
        }, { status: 500 });
      }
    } catch (pythonError) {
      console.error('\n❌ 执行Python脚本出错:');
      console.error(pythonError);
      clearTimeout(timeoutId!);
      return NextResponse.json({ 
        error: '执行Python脚本时出错，请确保已安装Python及必要的依赖包' 
      }, { status: 500 });
    }
  } catch (error) {
    // 清除超时定时器
    if (timeoutId) clearTimeout(timeoutId);
    
    console.error('\n❌ 处理图片时出错:');
    console.error(error);
    return NextResponse.json({ 
      error: '处理图片过程中出错，请稍后重试' 
    }, { status: 500 });
  } finally {
    // 清理临时文件
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
        console.log(`🧹 临时文件已清理: ${tempFilePath}`);
      } catch (error) {
        console.error('清理临时文件失败:', error);
      }
    }
  }
}
