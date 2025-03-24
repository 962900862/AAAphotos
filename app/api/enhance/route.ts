import { NextRequest, NextResponse } from 'next/server';
import { client } from '@gradio/client';
import { Client } from "@gradio/client";

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
  console.log(`\n\n=== 🚀 [${new Date().toISOString()}] API请求开始处理 ===\n\n`);
  
  let timeoutId: NodeJS.Timeout | undefined = undefined;
  const timeoutPromise = new Promise<NextResponse>((resolve) => {
    timeoutId = setTimeout(() => {
      console.log("⚠️ 处理即将超时，提前返回结果");
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
      

      const response_0 = await fetch("https://pic1.imgdb.cn/item/67e1105a0ba3d5a1d7e28d22.png");
      const exampleImage = await response_0.blob();
                  
      const client = await Client.connect("sczhou/CodeFormer");
      const result = await client.predict("/predict", { 
              image: exampleImage, 		
          face_align: true, 		
          background_enhance: true, 		
          face_upsample: true, 		
          upscale: 3, 		
          codeformer_fidelity: 0, 
      });
      
      console.log(result.data);
      
      // 检查API返回的结果
      console.log('🔍 检查API返回结果');
      console.log('📊 Result数据:', JSON.stringify(result, null, 2));
      
      if (!result || !result.data || !Array.isArray(result.data) || result.data.length === 0) {
        console.error('❌ API返回结果无效');
        clearTimeout(timeoutId!);
        return setCorsHeaders(NextResponse.json({ 
          error: '处理图片失败，API返回结果无效' 
        }, { status: 500 }));
      }
      
      const processedImageUrl = result.data[0];
      console.log(`🌟 获取到处理后的图像URL: ${processedImageUrl}`);
      
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
      
      console.log(`\n✅ [${new Date().toISOString()}] 处理完成，返回最终URL: ${finalImageUrl}`);
      console.log(`\n\n=== 🏁 [${new Date().toISOString()}] API请求处理结束 ===\n\n`);
      
      return setCorsHeaders(NextResponse.json({
        success: true,
        imageUrl: finalImageUrl,
        isPermanent: !!uploadedUrl,
        originalImageUrl: directUploadUrl || null
      }));
    } catch (apiError: any) {
      console.error(`❌ [${new Date().toISOString()}] 调用CodeFormer API失败:`, apiError);
      console.error('📝 错误详情:', apiError.message);
      
      // 如果直接上传成功，则返回原图URL
      if (directUploadUrl) {
        console.log('⚠️ 由于AI处理失败，返回原图URL');
        clearTimeout(timeoutId!);
        return setCorsHeaders(NextResponse.json({ 
          success: true,
          imageUrl: directUploadUrl,
          isPermanent: true,
          isOriginal: true,
          error: `AI处理失败: ${apiError.message || '未知错误'}`
        }));
      }
      
      clearTimeout(timeoutId!);
      return setCorsHeaders(NextResponse.json({ 
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
      error: `处理图片失败: ${error.message || '未知错误'}` 
    }, { status: 500 }));
  }
}


