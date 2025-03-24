import { NextRequest, NextResponse } from 'next/server';
import { client } from '@gradio/client';

// 设置最大执行时间为60秒（Hobby计划的最大值）
export const maxDuration = 60;
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// CORS配置助手函数
function setCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// 处理OPTIONS请求（预检请求）
export async function OPTIONS() {
  return setCorsHeaders(NextResponse.json({}, { status: 200 }));
}

/**
 * 上传图片到360图床
 * @param imageBlob 图片Blob数据
 * @returns 上传后的图床URL
 */
async function uploadTo360ImageBed(imageBlob: Blob): Promise<string | null> {
  try {
    console.log('📤 开始上传图片到360图床...');
    console.log(`📊 图片大小: ${(imageBlob.size / 1024).toFixed(2)}KB, 类型: ${imageBlob.type}`);
    
    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', imageBlob, 'image.jpg');
    console.log(`🔍 已准备FormData数据，开始发送请求到图床API...`);
    
    // 发送请求到360图床API
    const startTime = Date.now();
    console.log(`⏱️ [${new Date().toISOString()}] 开始发送图床请求`);
    const response = await fetch('https://api.xinyew.cn/api/360tc', {
      method: 'POST',
      body: formData
    });
    const endTime = Date.now();
    console.log(`⏱️ [${new Date().toISOString()}] 图床请求完成，耗时: ${endTime - startTime}ms`);
    
    if (!response.ok) {
      console.error(`❌ 上传图片失败: HTTP ${response.status}`);
      console.error(`📝 响应状态: ${response.statusText}`);
      return null;
    }
    
    console.log(`✅ HTTP响应成功，开始解析JSON...`);
    const result = await response.json();
    console.log(`✅ JSON解析完成`);
    
    // 360图床API返回格式: errno为0表示成功
    if (result.errno !== 0) {
      console.error(`❌ 上传图片失败: ${result.message || '未知错误'}`);
      console.error(`📝 完整错误响应:`, result);
      return null;
    }
    
    // 获取上传后的URL
    const imageUrl = result.data?.url;
    if (!imageUrl) {
      console.error('❌ 上传成功但未获取到图像URL');
      console.error(`📝 响应数据:`, result.data);
      return null;
    }
    
    console.log(`✅ 图片上传到360图床成功: ${imageUrl}`);
    // 打印完整的返回结果，便于调试
    console.log('360图床API返回数据:', JSON.stringify(result, null, 2));
    
    // 打印高亮的URL，方便在日志中查找
    console.log('\n');
    console.log('===========================================================');
    console.log(`📸 【图床URL】: ${imageUrl}`);
    console.log('===========================================================');
    console.log('\n');
    
    return imageUrl;
  } catch (error) {
    console.error('❌ 上传图片过程中发生错误:', error);
    if (error instanceof Error) {
      console.error(`📝 错误名称: ${error.name}`);
      console.error(`📝 错误信息: ${error.message}`);
      console.error(`📝 错误堆栈: ${error.stack}`);
    }
    return null;
  }
}

/**
 * 图像增强API处理函数 - 使用JavaScript直接调用CodeFormer
 */
export async function POST(request: NextRequest) {
  console.log(`\n\n=====================================================`);
  console.log(`🚀 API请求开始 - ${new Date().toISOString()}`);
  console.log(`=====================================================\n\n`);
  
  let timeoutId: NodeJS.Timeout | undefined = undefined;
  const timeoutPromise = new Promise<NextResponse>((resolve) => {
    timeoutId = setTimeout(() => {
      console.log("\n⚠️⚠️⚠️ 处理即将超时，提前返回结果 ⚠️⚠️⚠️");
      const response = NextResponse.json({
        success: false,
        error: "处理时间超过限制，请尝试上传更小的图片"
      }, { status: 408 });
      resolve(setCorsHeaders(response));
    }, 55000); // 设置为55秒，留5秒缓冲时间
  });
  
  try {
    // 1. 从请求中获取图片数据
    console.log('🚀 接收到图像处理请求');
    const formData = await request.formData();
    console.log('✅ FormData已解析');
    
    const imageFile = formData.get('image') as File | null;
    
    // 检查图片是否存在
    if (!imageFile) {
      console.error('❌ 未找到图片文件');
      clearTimeout(timeoutId!);
      return setCorsHeaders(NextResponse.json({ error: '未找到图片文件' }, { status: 400 }));
    }
    
    console.log(`📁 收到图片: ${imageFile.name}, 大小: ${(imageFile.size / 1024).toFixed(2)}KB, 类型: ${imageFile.type}`);
    
    // 2. 将图像转换为Blob格式
    console.log('🔄 开始转换图像为Blob...');
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBlob = new Blob([arrayBuffer], { type: imageFile.type });
    console.log(`✅ 图像已转换为Blob, 大小: ${(imageBlob.size / 1024).toFixed(2)}KB`);
    
    // 3. 先上传原图到图床
    console.log('🔄 开始上传原图到360图床...');
    const uploadedImageUrl = await uploadTo360ImageBed(imageBlob);
    
    if (!uploadedImageUrl) {
      console.error('❌ 上传原图到图床失败');
      clearTimeout(timeoutId!);
      return setCorsHeaders(NextResponse.json({ 
        success: false,
        error: '上传图片到图床失败' 
      }, { status: 500 }));
    }
    
    console.log(`✅ 原图上传成功! 图床URL: ${uploadedImageUrl}`);
    console.log(`📸 图床URL: ${uploadedImageUrl}`);
    
    // 4. 使用Gradio客户端调用CodeFormer API
    console.log(`\n🔄 开始连接CodeFormer API... 这可能需要一些时间`);
    console.log(`⏱️ [${new Date().toISOString()}] 开始连接`);
    
    try {
      // 创建Gradio客户端连接
      const app = await client("sczhou/CodeFormer");
      console.log(`✅ [${new Date().toISOString()}] 已连接到CodeFormer API`);
      
      console.log(`🧩 开始处理图像... 这通常需要10-30秒`);
      console.log(`⏱️ [${new Date().toISOString()}] 开始AI处理`);
      
      // 使用图床URL调用CodeFormer模型API
      console.log(`\n▶ 发送参数到CodeFormer:`);
      console.log(`  - 图片URL: ${uploadedImageUrl}`);
      console.log(`  - face_align: true`);
      console.log(`  - background_enhance: true`);
      console.log(`  - face_upsample: true`);
      console.log(`  - upscale: 2`);
      console.log(`  - codeformer_fidelity: 0.7\n`);
      
      const result = await app.predict("/predict", [
        uploadedImageUrl,   // 使用图床URL而不是原始Blob
        true,               // face_align
        true,               // background_enhance
        true,               // face_upsample
        2,                  // upscale
        0.7,                // codeformer_fidelity
      ]);
      
      console.log(`\n✅✅✅ 图像处理完成 - ${new Date().toISOString()} ✅✅✅\n`);
      
      // 检查API返回的结果
      console.log('\n🔍 API返回结果详情:');
      console.log('==============================================');
      
      // 格式化打印整个结果
      console.log(JSON.stringify(result, null, 2));
      
      console.log('==============================================\n');
      
      if (!result || !result.data || !Array.isArray(result.data) || result.data.length === 0) {
        console.error('\n❌❌❌ API返回结果无效 ❌❌❌');
        clearTimeout(timeoutId!);
        // 如果处理失败，返回原始图床URL
        return setCorsHeaders(NextResponse.json({ 
          success: true,
          imageUrl: uploadedImageUrl,
          message: 'AI处理失败，返回原图URL'
        }, { status: 200 }));
      }
      
      // 详细记录返回数据的结构
      console.log('\n🔍 分析返回数据结构:');
      console.log(`- 数据类型: ${typeof result.data}`);
      console.log(`- 是否为数组: ${Array.isArray(result.data)}`);
      console.log(`- 数组长度: ${result.data.length}`);
      
      // 循环显示所有数组项
      console.log('\n🔍 数组内容详情:');
      let processedImageUrl = '';
      
      for (let i = 0; i < result.data.length; i++) {
        console.log(`\n🔍 [${i}] 项数据:`);
        console.log(`- 类型: ${typeof result.data[i]}`);
        if (typeof result.data[i] === 'object' && result.data[i] !== null) {
          console.log('- 属性列表:');
          const item = result.data[i] as any;
          Object.keys(item).forEach(key => {
            console.log(`  • ${key}: ${typeof item[key]}`);
            if (key === 'url' || key === 'path') {
              console.log(`    值: ${item[key]}`);
              
              // 如果找到url属性，直接使用它
              if (key === 'url') {
                processedImageUrl = item[key];
                console.log(`\n🎯 找到目标URL属性! URL值: ${processedImageUrl}`);
              }
            }
          });
        } else {
          // 这是字符串值，可能是我们想要的URL
          console.log(`- 值: ${result.data[i]}`);
        }
      }
      console.log('');
      
      // 如果在循环中没有找到URL，直接尝试从第一项获取
      if (!processedImageUrl && result.data.length > 0) {
        const firstItem = result.data[0] as any;
        if (firstItem && typeof firstItem === 'object' && firstItem.url) {
          processedImageUrl = firstItem.url;
          console.log(`\n⚠️ 使用回退方法，直接从result.data[0].url获取: ${processedImageUrl}`);
        }
      }
      
    
      // 高亮打印找到的URL
      console.log('\n======================================');
      console.log(`📸 【提取到的URL】: ${processedImageUrl}`);
      console.log('======================================\n');
      
      // 直接使用CodeFormer返回的URL作为最终URL
      const finalImageUrl = processedImageUrl;
      
      // 高亮打印最终使用的URL
      console.log('\n========================================');
      console.log(`📸 【最终使用的URL】: ${finalImageUrl}`);
      console.log('========================================\n');
      
      console.log(`\n✅ [${new Date().toISOString()}] 处理完成，返回CodeFormer URL: ${finalImageUrl}`);
      
      // 格式化返回结果，确保字段名称正确
      const resultJson = {
        success: true,
        imageUrl: finalImageUrl,
        message: 'AI处理成功'
      };
      
      // 打印最终返回的JSON
      console.log('\n=============================================');
      console.log('📊 【API最终返回数据】');
      console.log('=============================================');
      console.log(JSON.stringify(resultJson, null, 2));
      console.log('=============================================\n');
      
      console.log(`\n\n=============================================`);
      console.log(`🏁 API请求处理结束 - ${new Date().toISOString()}`);
      console.log(`=============================================\n\n`);
      
      // 返回结果
      clearTimeout(timeoutId!);
      return setCorsHeaders(NextResponse.json(resultJson));
    } catch (apiError: any) {
      console.error(`❌ [${new Date().toISOString()}] 调用CodeFormer API失败:`, apiError);
      console.error('📝 错误详情:', apiError.message);
      
      // 由于原图已上传到图床，直接返回原图URL
      clearTimeout(timeoutId!);
      return setCorsHeaders(NextResponse.json({ 
        success: true,
        imageUrl: uploadedImageUrl,
        message: `AI处理失败: ${apiError.message || '未知错误'}, 返回原图URL`
      }));
    }
  } catch (error: any) {
    // 清除超时定时器
    if (timeoutId) clearTimeout(timeoutId);
    
    console.error(`❌ [${new Date().toISOString()}] 处理图片时出错:`, error);
    if (error instanceof Error) {
      console.error(`📝 错误名称: ${error.name}`);
      console.error(`📝 错误信息: ${error.message}`);
      console.error(`📝 错误堆栈: ${error.stack}`);
    }
    
    return setCorsHeaders(NextResponse.json({ 
      success: false,
      error: `处理图片失败: ${error.message || '未知错误'}` 
    }, { status: 500 }));
  }
}


