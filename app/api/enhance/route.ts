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
    
    // 直接尝试上传原图到图床 (临时测试用)
    console.log('🧪 临时测试: 尝试直接上传原图到图床...');
    const directUploadUrl = await uploadTo360ImageBed(imageBlob);
    if (directUploadUrl) {
      console.log('✅ 直接上传原图成功! 这证明图床API工作正常');
      console.log(`📸 原图URL: ${directUploadUrl}`);
    } else {
      console.error('❌ 直接上传原图失败，图床API可能存在问题');
    }
    
    // 3. 使用Gradio客户端调用CodeFormer API
    console.log(`\n🔄 开始连接CodeFormer API... 这可能需要一些时间`);
    console.log(`⏱️ [${new Date().toISOString()}] 开始连接`);
    
    try {
      // 创建Gradio客户端连接
      const app = await client("sczhou/CodeFormer");
      console.log(`✅ [${new Date().toISOString()}] 已连接到CodeFormer API`);
      
      console.log(`🧩 开始处理图像... 这通常需要10-30秒`);
      console.log(`⏱️ [${new Date().toISOString()}] 开始AI处理`);
      
      // 直接调用CodeFormer模型API
      console.log(`\n▶ 发送参数到CodeFormer:`);
      console.log(`  - face_align: true`);
      console.log(`  - background_enhance: true`);
      console.log(`  - face_upsample: true`);
      console.log(`  - upscale: 2`);
      console.log(`  - codeformer_fidelity: 0.7\n`);
      
      const result = await app.predict("/predict", [
        imageBlob,          // 图像
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
        return setCorsHeaders(NextResponse.json({ 
          success: false,
          error: '处理图片失败，API返回结果无效' 
        }, { status: 500 }));
      }
      
      // 详细记录返回数据的结构
      console.log('\n🔍 分析返回数据结构:');
      console.log(`- 数据类型: ${typeof result.data}`);
      console.log(`- 是否为数组: ${Array.isArray(result.data)}`);
      console.log(`- 数组长度: ${result.data.length}`);
      
      // 循环显示所有数组项
      console.log('\n🔍 数组内容详情:');
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
            }
          });
        } else {
          console.log(`- 值: ${result.data[i]}`);
        }
      }
      console.log('');
      
      // 直接从result.data[1]获取URL，这是CodeFormer新版API的输出格式
      console.log('\n🔎 直接从result.data[1]获取URL...');
      
      // 确保数组长度足够且第二个元素存在
      if (!result.data || result.data.length < 2 || !result.data[1]) {
        console.error('❌ API返回的结果中没有result.data[1]');
        console.error('📊 数据结构:', JSON.stringify(result.data, null, 2));
        clearTimeout(timeoutId!);
        return setCorsHeaders(NextResponse.json({ 
          success: false,
          error: '处理图片失败，API返回结果格式异常' 
        }, { status: 500 }));
      }
      
      // 获取result.data[1]的类型和值
      console.log(`\n📊 result.data[1]的类型: ${typeof result.data[1]}`);
      console.log(`📊 result.data[1]的值: ${JSON.stringify(result.data[1], null, 2)}`);
      
      // 直接使用result.data[1]，不管它是字符串还是对象
      let processedImageUrl = '';
      const resultItem = result.data[1] as any;
      
      if (typeof resultItem === 'string') {
        // 如果是字符串，直接使用
        processedImageUrl = resultItem;
        console.log(`🔎 将字符串值作为URL: ${processedImageUrl}`);
      } else if (typeof resultItem === 'object' && resultItem !== null) {
        // 如果是对象，检查url属性
        if (resultItem.url) {
          processedImageUrl = resultItem.url;
          console.log(`🔎 使用对象的url属性: ${processedImageUrl}`);
        } else if (resultItem.path) {
          // 如果没有url但有path
          const path = resultItem.path;
          processedImageUrl = `https://sczhou-codeformer.hf.space/file=${path}`;
          console.log(`🔎 从path构建URL: ${processedImageUrl}`);
        } else {
          // 对象中没有找到url或path
          console.error('❌ result.data[1]是对象，但没有url或path属性');
          console.error('📊 对象内容:', JSON.stringify(resultItem, null, 2));
          clearTimeout(timeoutId!);
          return setCorsHeaders(NextResponse.json({ 
            success: false,
            error: '处理图片失败，无法从结果中提取URL' 
          }, { status: 500 }));
        }
      } else {
        // 既不是字符串也不是对象
        console.error(`❌ result.data[1]既不是字符串也不是对象，无法提取URL`);
        console.error(`📊 值的类型: ${typeof resultItem}, 值: ${JSON.stringify(resultItem, null, 2)}`);
        clearTimeout(timeoutId!);
        return setCorsHeaders(NextResponse.json({ 
          success: false,
          error: '处理图片失败，结果格式异常' 
        }, { status: 500 }));
      }
      
      // 高亮打印从result.data[1]提取的URL
      console.log('\n======================================');
      console.log(`📸 【从result.data[1]提取的URL】: ${processedImageUrl}`);
      console.log('======================================\n');
      
      // 从CodeFormer获取处理后的图像内容
      console.log(`\n🔄 从CodeFormer下载处理后的图像...`);
      console.log(`⏱️ [${new Date().toISOString()}] 开始下载处理后的图像`);
      const imageResponse = await fetch(processedImageUrl);
      console.log(`⏱️ [${new Date().toISOString()}] 下载响应接收完成`);
      
      if (!imageResponse.ok) {
        console.error(`❌ 下载处理后的图像失败: HTTP ${imageResponse.status}`);
        console.error(`📝 响应状态: ${imageResponse.statusText}`);
        clearTimeout(timeoutId!);
        return setCorsHeaders(NextResponse.json({ 
          error: `下载处理后的图像失败: HTTP ${imageResponse.status}` 
        }, { status: 500 }));
      }
      
      // 获取图像Blob
      console.log('🔄 将图像响应转换为Blob...');
      const processedImageBlob = await imageResponse.blob();
      console.log(`✅ 下载处理后的图像成功, 大小: ${(processedImageBlob.size / 1024).toFixed(2)}KB`);
      
      // 上传图像到360图床，确保持久化存储
      console.log(`\n🔄 开始上传AI处理后的图像到360图床...`);
      const uploadedUrl = await uploadTo360ImageBed(processedImageBlob);
      
      if (uploadedUrl) {
        console.log(`✅ 360图床URL: ${uploadedUrl}`);
        // 打印更醒目的URL信息，方便在日志中查找
        console.log('========================================');
        console.log(`📸 图床URL: ${uploadedUrl}`);
        console.log('========================================');
      } else {
        console.log(`⚠️ 上传到360图床失败，将使用CodeFormer临时URL`);
      }
      
      // 返回处理结果
      clearTimeout(timeoutId!);
      
      // 如果上传到360图床成功，返回图床URL，否则返回CodeFormer URL
      const finalImageUrl = uploadedUrl || processedImageUrl;
      
      // 高亮打印最终使用的URL
      console.log('\n========================================');
      console.log(`📸 【最终使用的URL】: ${finalImageUrl}`);
      console.log('========================================\n');
      
      console.log(`\n✅ [${new Date().toISOString()}] 处理完成，返回最终URL: ${finalImageUrl}`);
      
      // 格式化返回结果，确保字段名称正确
      const resultJson = {
        success: true,
        imageUrl: finalImageUrl
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
      
      // 极度简化返回数据，只返回图片URL和状态
      return setCorsHeaders(NextResponse.json(resultJson));
    } catch (apiError: any) {
      console.error(`❌ [${new Date().toISOString()}] 调用CodeFormer API失败:`, apiError);
      console.error('📝 错误详情:', apiError.message);
      
      // 如果直接上传成功，则返回原图URL
      if (directUploadUrl) {
        console.log('⚠️ 由于AI处理失败，返回原图URL');
        clearTimeout(timeoutId!);
        return setCorsHeaders(NextResponse.json({ 
          success: true,
          imageUrl: directUploadUrl
        }));
      }
      
      clearTimeout(timeoutId!);
      return setCorsHeaders(NextResponse.json({ 
        success: false,
        error: `调用图像处理API失败: ${apiError.message || '未知错误'}` 
      }, { status: 500 }));
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


