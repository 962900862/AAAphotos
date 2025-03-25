// import { intl } from 'di18n-react';
// import { intl } from '../../lib/intl-mock';
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@gradio/client';

// 内联定义intl对象
const intl = {
  t: (message: string, params?: any): string => {
    if (params) {
      let result = message;
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined) {
          const regex = new RegExp(`{${key}}`, 'g');
          result = result.replace(regex, String(params[key]));
        }
      });
      return result;
    }
    return message;
  }
};

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
    console.log(intl.t('📤 开始上传图片到360图床...'));
    console.log(
      intl.t('📊 图片大小: {slot0}KB, 类型: {slot1}', {
        slot0: (imageBlob.size / 1024).toFixed(2),
        slot1: imageBlob.type,
      })
    );

    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', imageBlob, 'image.jpg');
    console.log(intl.t('🔍 已准备FormData数据，开始发送请求到图床API...', {}));

    // 发送请求到360图床API
    const startTime = Date.now();
    console.log(
      intl.t('⏱️ [{slot0}] 开始发送图床请求', {
        slot0: new Date().toISOString(),
      })
    );
    const response = await fetch('https://api.xinyew.cn/api/360tc', {
      method: 'POST',
      body: formData,
    });
    const endTime = Date.now();
    console.log(
      intl.t('⏱️ [{slot0}] 图床请求完成，耗时: {slot1}ms', {
        slot0: new Date().toISOString(),
        slot1: endTime - startTime,
      })
    );

    if (!response.ok) {
      console.error(
        intl.t('❌ 上传图片失败: HTTP {slot0}', { slot0: response.status })
      );
      console.error(
        intl.t('📝 响应状态: {slot0}', { slot0: response.statusText })
      );
      return null;
    }

    console.log(intl.t('✅ HTTP响应成功，开始解析JSON...', {}));
    const result = await response.json();
    console.log(intl.t('✅ JSON解析完成', {}));

    // 360图床API返回格式: errno为0表示成功
    if (result.errno !== 0) {
      console.error(
        intl.t('❌ 上传图片失败: {slot0}', {
          slot0: result.message || '未知错误',
        })
      );
      console.error(intl.t('📝 完整错误响应:', {}), result);
      return null;
    }

    // 获取上传后的URL
    const imageUrl = result.data?.url;
    if (!imageUrl) {
      console.error(intl.t('❌ 上传成功但未获取到图像URL'));
      console.error(intl.t('📝 响应数据:', {}), result.data);
      return null;
    }

    console.log(
      intl.t('✅ 图片上传到360图床成功: {imageUrl}', { imageUrl: imageUrl })
    );
    // 打印完整的返回结果，便于调试
    console.log(intl.t('360图床API返回数据:'), JSON.stringify(result, null, 2));

    // 打印高亮的URL，方便在日志中查找
    console.log('\n');
    console.log('===========================================================');
    console.log(intl.t('📸 【图床URL】: {imageUrl}', { imageUrl: imageUrl }));
    console.log('===========================================================');
    console.log('\n');

    return imageUrl;
  } catch (error) {
    console.error(intl.t('❌ 上传图片过程中发生错误:'), error);
    if (error instanceof Error) {
      console.error(intl.t('📝 错误名称: {slot0}', { slot0: error.name }));
      console.error(intl.t('📝 错误信息: {slot0}', { slot0: error.message }));
      console.error(intl.t('📝 错误堆栈: {slot0}', { slot0: error.stack }));
    }
    return null;
  }
}

/**
 * 图像增强API处理函数 - 使用JavaScript直接调用CodeFormer
 */
export async function POST(request: NextRequest) {
  console.log(`\n\n=====================================================`);
  console.log(
    intl.t('🚀 API请求开始 - {slot0}', { slot0: new Date().toISOString() })
  );
  console.log(`=====================================================\n\n`);

  let timeoutId: NodeJS.Timeout | undefined = undefined;
  const timeoutPromise = new Promise<NextResponse>((resolve) => {
    timeoutId = setTimeout(() => {
      console.log(intl.t('⚠️⚠️⚠️ 处理即将超时，提前返回结果 ⚠️⚠️⚠️'));
      const response = NextResponse.json(
        {
          success: false,
          error: intl.t('处理时间超过限制，请尝试上传更小的图片'),
        },
        { status: 408 }
      );
      resolve(setCorsHeaders(response));
    }, 55000); // 设置为55秒，留5秒缓冲时间
  });

  try {
    // 1. 从请求中获取图片数据
    console.log(intl.t('🚀 接收到图像处理请求'));
    const formData = await request.formData();
    console.log(intl.t('✅ FormData已解析'));

    const imageFile = formData.get('image') as File | null;

    // 检查图片是否存在
    if (!imageFile) {
      console.error(intl.t('❌ 未找到图片文件'));
      clearTimeout(timeoutId!);
      return setCorsHeaders(
        NextResponse.json({ error: intl.t('未找到图片文件') }, { status: 400 })
      );
    }

    console.log(
      intl.t('📁 收到图片: {slot0}, 大小: {slot1}KB, 类型: {slot2}', {
        slot0: imageFile.name,
        slot1: (imageFile.size / 1024).toFixed(2),
        slot2: imageFile.type,
      })
    );

    // 2. 将图像转换为Blob格式
    console.log(intl.t('🔄 开始转换图像为Blob...'));
    const arrayBuffer = await imageFile.arrayBuffer();
    const imageBlob = new Blob([arrayBuffer], { type: imageFile.type });
    console.log(
      intl.t('✅ 图像已转换为Blob, 大小: {slot0}KB', {
        slot0: (imageBlob.size / 1024).toFixed(2),
      })
    );

    // 直接尝试上传原图到图床 (临时测试用)
    console.log(intl.t('🧪 临时测试: 尝试直接上传原图到图床...'));
    const directUploadUrl = await uploadTo360ImageBed(imageBlob);
    if (directUploadUrl) {
      console.log(intl.t('✅ 直接上传原图成功! 这证明图床API工作正常'));
      console.log(
        intl.t('📸 原图URL: {directUploadUrl}', {
          directUploadUrl: directUploadUrl,
        })
      );
    } else {
      console.error(intl.t('❌ 直接上传原图失败，图床API可能存在问题'));
    }

    // 3. 使用Gradio客户端调用CodeFormer API
    console.log(intl.t('🔄 开始连接CodeFormer API... 这可能需要一些时间', {}));
    console.log(
      intl.t('⏱️ [{slot0}] 开始连接', { slot0: new Date().toISOString() })
    );

    try {
      // 创建Gradio客户端连接
      const app = await client('sczhou/CodeFormer');
      console.log(
        intl.t('✅ [{slot0}] 已连接到CodeFormer API', {
          slot0: new Date().toISOString(),
        })
      );

      console.log(intl.t('🧩 开始处理图像... 这通常需要10-30秒', {}));
      console.log(
        intl.t('⏱️ [{slot0}] 开始AI处理', { slot0: new Date().toISOString() })
      );

      // 直接调用CodeFormer模型API
      console.log(intl.t('▶ 发送参数到CodeFormer:', {}));
      console.log(`  - face_align: true`);
      console.log(`  - background_enhance: true`);
      console.log(`  - face_upsample: true`);
      console.log(`  - upscale: 2`);
      console.log(`  - codeformer_fidelity: 0.7\n`);

      const result = await app.predict('/predict', [
        imageBlob, // 图像
        true, // face_align
        true, // background_enhance
        true, // face_upsample
        2, // upscale
        0.9, // codeformer_fidelity
      ]);

      console.log(
        intl.t('✅✅✅ 图像处理完成 - {slot0} ✅✅✅', {
          slot0: new Date().toISOString(),
        })
      );

      // 检查API返回的结果
      console.log(intl.t('🔍 API返回结果详情:'));
      console.log('==============================================');

      // 格式化打印整个结果
      console.log(JSON.stringify(result, null, 2));

      console.log('==============================================\n');

      if (
        !result ||
        !result.data ||
        !Array.isArray(result.data) ||
        result.data.length === 0
      ) {
        console.error(intl.t('❌❌❌ API返回结果无效 ❌❌❌'));
        clearTimeout(timeoutId!);
        return setCorsHeaders(
          NextResponse.json(
            {
              success: false,
              error: intl.t('处理图片失败，API返回结果无效'),
            },
            { status: 500 }
          )
        );
      }

      // 详细记录返回数据的结构
      console.log(intl.t('🔍 分析返回数据结构:'));
      console.log(intl.t('- 数据类型: {slot0}', { slot0: typeof result.data }));
      console.log(
        intl.t('- 是否为数组: {slot0}', { slot0: Array.isArray(result.data) })
      );
      console.log(intl.t('- 数组长度: {slot0}', { slot0: result.data.length }));

      // 循环显示所有数组项
      console.log(intl.t('🔍 数组内容详情:'));
      for (let i = 0; i < result.data.length; i++) {
        console.log(intl.t('🔍 [{i}] 项数据:', { i: i }));
        console.log(
          intl.t('- 类型: {slot0}', { slot0: typeof result.data[i] })
        );
        if (typeof result.data[i] === 'object' && result.data[i] !== null) {
          console.log(intl.t('- 属性列表:'));
          const item = result.data[i] as any;
          Object.keys(item).forEach((key) => {
            console.log(`  • ${key}: ${typeof item[key]}`);
            if (key === 'url' || key === 'path') {
              console.log(intl.t('值: {slot0}', { slot0: item[key] }));
            }
          });
        } else {
          console.log(intl.t('- 值: {slot0}', { slot0: result.data[i] }));
        }
      }
      console.log('');

      // 提取图片URL - 处理新的数据结构，使用result.data[1]
      console.log(intl.t('🔎 开始提取图片URL（从数组索引[1]）...'));
      let processedImageUrl = '';

      // 首先检查索引1是否存在
      if (result.data.length > 1) {
        const resultItem = result.data[1] as any;
        if (resultItem && typeof resultItem === 'object') {
          if (resultItem.url) {
            // 新版API返回包含url字段的对象格式
            processedImageUrl = resultItem.url;
            console.log(
              intl.t('🔎 从索引[1]对象中提取URL: {processedImageUrl}', {
                processedImageUrl: processedImageUrl,
              })
            );
          } else if (resultItem.path) {
            // 如果有path但没有url，尝试从path构建URL
            const path = resultItem.path;
            processedImageUrl = `https://sczhou-codeformer.hf.space/file=${path}`;
            console.log(
              intl.t('🔎 从索引[1]的path构建URL: {processedImageUrl}', {
                processedImageUrl: processedImageUrl,
              })
            );
          }
        } else if (typeof resultItem === 'string') {
          // 旧版API返回的是直接的URL字符串
          processedImageUrl = resultItem;
          console.log(
            intl.t('🔎 直接使用索引[1]的字符串URL: {processedImageUrl}', {
              processedImageUrl: processedImageUrl,
            })
          );
        }
      }

      // 如果索引1没有找到有效URL，回退到索引0
      if (!processedImageUrl && result.data[0]) {
        console.log(intl.t('⚠️ 索引[1]没有找到有效URL，尝试使用索引[0]'));
        const resultItem = result.data[0] as any;
        if (resultItem && typeof resultItem === 'object') {
          if (resultItem.url) {
            processedImageUrl = resultItem.url;
            console.log(
              intl.t('🔎 从索引[0]对象中提取URL: {processedImageUrl}', {
                processedImageUrl: processedImageUrl,
              })
            );
          } else if (resultItem.path) {
            const path = resultItem.path;
            processedImageUrl = `https://sczhou-codeformer.hf.space/file=${path}`;
            console.log(
              intl.t('🔎 从索引[0]的path构建URL: {processedImageUrl}', {
                processedImageUrl: processedImageUrl,
              })
            );
          }
        } else if (typeof resultItem === 'string') {
          processedImageUrl = resultItem;
          console.log(
            intl.t('🔎 直接使用索引[0]的字符串URL: {processedImageUrl}', {
              processedImageUrl: processedImageUrl,
            })
          );
        }
      }

      // 如果还是没有找到有效URL
      if (!processedImageUrl) {
        console.error(intl.t('❌ 无法从结果中提取图片URL'));
        console.error(
          intl.t('📊 完整数据结构:'),
          JSON.stringify(result.data, null, 2)
        );
        clearTimeout(timeoutId!);
        return setCorsHeaders(
          NextResponse.json(
            {
              success: false,
              error: intl.t('处理图片失败，无法提取结果URL'),
            },
            { status: 500 }
          )
        );
      }

      // 高亮打印提取到的URL
      console.log('\n======================================');
      console.log(
        intl.t('📸 【提取到的URL】: {processedImageUrl}', {
          processedImageUrl: processedImageUrl,
        })
      );
      console.log('======================================\n');

      // 从CodeFormer获取处理后的图像内容
      console.log(intl.t('🔄 从CodeFormer下载处理后的图像...', {}));
      console.log(
        intl.t('⏱️ [{slot0}] 开始下载处理后的图像', {
          slot0: new Date().toISOString(),
        })
      );
      const imageResponse = await fetch(processedImageUrl);
      console.log(
        intl.t('⏱️ [{slot0}] 下载响应接收完成', {
          slot0: new Date().toISOString(),
        })
      );

      if (!imageResponse.ok) {
        console.error(
          intl.t('❌ 下载处理后的图像失败: HTTP {slot0}', {
            slot0: imageResponse.status,
          })
        );
        console.error(
          intl.t('📝 响应状态: {slot0}', { slot0: imageResponse.statusText })
        );
        clearTimeout(timeoutId!);
        return setCorsHeaders(
          NextResponse.json(
            {
              error: intl.t('下载处理后的图像失败: HTTP {slot0}', {
                slot0: imageResponse.status,
              }),
            },
            { status: 500 }
          )
        );
      }

      // 获取图像Blob
      console.log(intl.t('🔄 将图像响应转换为Blob...'));
      const processedImageBlob = await imageResponse.blob();
      console.log(
        intl.t('✅ 下载处理后的图像成功, 大小: {slot0}KB', {
          slot0: (processedImageBlob.size / 1024).toFixed(2),
        })
      );

      // 上传图像到360图床，确保持久化存储
      console.log(intl.t('🔄 开始上传AI处理后的图像到360图床...', {}));
      const uploadedUrl = await uploadTo360ImageBed(processedImageBlob);

      if (uploadedUrl) {
        console.log(
          intl.t('✅ 360图床URL: {uploadedUrl}', { uploadedUrl: uploadedUrl })
        );
        // 打印更醒目的URL信息，方便在日志中查找
        console.log('========================================');
        console.log(
          intl.t('📸 图床URL: {uploadedUrl}', { uploadedUrl: uploadedUrl })
        );
        console.log('========================================');
      } else {
        console.log(
          intl.t('⚠️ 上传到360图床失败，将使用CodeFormer临时URL', {})
        );
      }

      // 返回处理结果
      clearTimeout(timeoutId!);

      // 如果上传到360图床成功，返回图床URL，否则返回CodeFormer URL
      const finalImageUrl = uploadedUrl || processedImageUrl;

      // 高亮打印最终使用的URL
      console.log('\n========================================');
      console.log(
        intl.t('📸 【最终使用的URL】: {finalImageUrl}', {
          finalImageUrl: finalImageUrl,
        })
      );
      console.log('========================================\n');

      console.log(
        intl.t('✅ [{slot0}] 处理完成，返回最终URL: {finalImageUrl}', {
          slot0: new Date().toISOString(),
          finalImageUrl: finalImageUrl,
        })
      );

      // 格式化返回结果，确保字段名称正确
      const resultJson = {
        success: true,
        imageUrl: finalImageUrl,
      };

      // 打印最终返回的JSON
      console.log('\n=============================================');
      console.log(intl.t('📊 【API最终返回数据】'));
      console.log('=============================================');
      console.log(JSON.stringify(resultJson, null, 2));
      console.log('=============================================\n');

      console.log(`\n\n=============================================`);
      console.log(
        intl.t('🏁 API请求处理结束 - {slot0}', {
          slot0: new Date().toISOString(),
        })
      );
      console.log(`=============================================\n\n`);

      // 极度简化返回数据，只返回图片URL和状态
      return setCorsHeaders(NextResponse.json(resultJson));
    } catch (apiError: any) {
      console.error(
        intl.t('❌ [{slot0}] 调用CodeFormer API失败:', {
          slot0: new Date().toISOString(),
        }),
        apiError
      );
      console.error(intl.t('📝 错误详情:'), apiError.message);

      // 如果直接上传成功，则返回原图URL
      if (directUploadUrl) {
        console.log(intl.t('⚠️ 由于AI处理失败，返回原图URL'));
        clearTimeout(timeoutId!);
        return setCorsHeaders(
          NextResponse.json({
            success: true,
            imageUrl: directUploadUrl,
          })
        );
      }

      clearTimeout(timeoutId!);
      return setCorsHeaders(
        NextResponse.json(
          {
            success: false,
            error: intl.t('调用图像处理API失败: {slot0}', {
              slot0: apiError.message || '未知错误',
            }),
          },
          { status: 500 }
        )
      );
    }
  } catch (error: any) {
    // 清除超时定时器
    if (timeoutId) clearTimeout(timeoutId);

    console.error(
      intl.t('❌ [{slot0}] 处理图片时出错:', {
        slot0: new Date().toISOString(),
      }),
      error
    );
    if (error instanceof Error) {
      console.error(intl.t('📝 错误名称: {slot0}', { slot0: error.name }));
      console.error(intl.t('📝 错误信息: {slot0}', { slot0: error.message }));
      console.error(intl.t('📝 错误堆栈: {slot0}', { slot0: error.stack }));
    }

    return setCorsHeaders(
      NextResponse.json(
        {
          success: false,
          error: intl.t('处理图片失败: {slot0}', {
            slot0: error.message || '未知错误',
          }),
        },
        { status: 500 }
      )
    );
  }
}
