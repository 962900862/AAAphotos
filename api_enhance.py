#!/usr/bin/env python3
"""
图像增强脚本 - 使用CodeFormer AI模型处理图像
通过Hugging Face的Gradio客户端调用CodeFormer模型
可以接收URL或base64格式的图像数据
"""

import sys
import json
import base64
import requests
import time
from io import BytesIO
from gradio_client import Client, handle_file
import argparse
import logging

# 设置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def print_progress(step, message):
    """打印进度信息，避免特殊字符"""
    # 只在关键步骤打印，减少输出
    if isinstance(step, str) or step in [2.3, 3.34, 5.1]:
        # 避免使用可能导致编码问题的特殊字符
        timestamp = time.strftime("%H:%M:%S", time.localtime()) 
        msg = f"[{timestamp}] {message}"
        print(msg)
        logger.info(message)
        sys.stdout.flush()

def print_separator(char="=", length=50):
    """打印分隔线"""
    line = char * length
    print(f"\n{line}\n")
    sys.stdout.flush()

def upload_to_360image(image_data):
    """上传图像到360图床服务，返回URL"""
    try:
        print_progress(2, "开始上传图像到360图床服务")
        
        # 使用正确的360图床API地址
        url = "https://api.xinyew.cn/api/360tc"
        files = {"file": ("image.jpg", image_data, "image/jpeg")}
        
        response = requests.post(url, files=files)
        
        if response.status_code != 200:
            print_progress(2.3, f"错误: 上传图片失败 (HTTP {response.status_code})")
            return None
        
        result = response.json()
        # 360图床API返回格式: errno为0表示成功
        if result.get("errno") != 0:
            print_progress(2.3, f"错误: 上传图片失败 - {result.get('message', '未知错误')}")
            return None
        
        # 正确获取URL的路径    
        image_url = result.get("data", {}).get("url")
        if not image_url:
            print_progress(2.3, "错误: 上传成功但未获取到图像URL")
            return None
            
        # 简化输出，只打印URL
        print("\n")
        print("=" * 40)
        print(f"360图床URL: {image_url}")
        print("=" * 40)
        print("\n")
        
        return image_url
    except Exception as e:
        print_progress(2.3, f"错误: 上传图像过程中发生异常 - {str(e)}")
        return None

def enhance_image_with_codeformer(image_url):
    """使用CodeFormer模型处理图像，返回处理后的图像URL"""
    try:
        print_progress(3, "开始调用CodeFormer处理图像")
        
        try:
            # 解决Windows编码问题
            import sys
            import codecs
            if sys.platform == 'win32':
                sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
                sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')
            
            # 创建一个自定义日志处理器来捕获httpx日志中的URL
            captured_url = None
            
            def capture_url_from_log(record):
                nonlocal captured_url
                if record.name == 'httpx' and 'HTTP Request: GET' in record.getMessage():
                    log_msg = record.getMessage()
                    if 'sczhou-codeformer.hf.space/file=' in log_msg:
                        # 提取URL部分
                        url_start = log_msg.find('https://sczhou-codeformer.hf.space/file=')
                        url_end = log_msg.find('"', url_start)
                        if url_start > 0 and url_end > url_start:
                            captured_url = log_msg[url_start:url_end]
                            print_progress(3.32, f"从日志中捕获到URL: {captured_url}")
            
            # 添加自定义日志处理器
            class UrlCaptureHandler(logging.Handler):
                def emit(self, record):
                    capture_url_from_log(record)
            
            # 将处理器添加到根日志记录器
            url_handler = UrlCaptureHandler()
            logging.getLogger().addHandler(url_handler)
            
            client = Client("sczhou/CodeFormer")
            print_progress(3.1, "成功连接到Hugging Face")
        except Exception as e:
            print_progress(3.34, f"错误: 创建Client对象失败 - {str(e)}")
            raise
        
        print_progress(3.2, "正在处理图像，这可能需要10-30秒...")
        
        # 调用CodeFormer模型API
        start_time = time.time()
        
        try:
            result = client.predict(
                image=handle_file(image_url),
                face_align=True,
                background_enhance=True,
                face_upsample=True,
                upscale=2,
                codeformer_fidelity=0.7,
                api_name="/predict"
            )
            
            process_time = time.time() - start_time
            print_progress(3.34, f"AI处理完成，耗时: {process_time:.2f}秒")
            
            # 移除自定义日志处理器
            logging.getLogger().removeHandler(url_handler)
            
            # 打印完整结果用于调试
            print_progress(3.35, f"API返回结果: {result}")
            
            # 首先检查是否从日志中捕获到了URL
            if captured_url:
                print_progress(3.36, f"使用从日志中捕获的URL: {captured_url}")
                
                # 打印URL，确保可见
                print("\n")
                print("=" * 60)
                print(f"CodeFormer处理结果URL: {captured_url}")
                print("=" * 60)
                print("\n")
                
                # 返回捕获的URL
                return {"type": "url", "data": captured_url}
            
            # 如果没有从日志中捕获到URL，尝试从API结果中提取
            if result and isinstance(result, list) and len(result) > 0:
                processed_image_url = result[0]
                print_progress(3.36, f"从API结果中获取URL: {processed_image_url}")
                
                # 打印URL，确保可见
                print("\n")
                print("=" * 60)
                print(f"CodeFormer处理结果URL: {processed_image_url}")
                print("=" * 60)
                print("\n")
                
                # 直接返回URL字符串，而不是图像内容
                return {"type": "url", "data": processed_image_url}
            else:
                print_progress(3.34, "错误: 处理图像未返回结果URL")
                return None
                
        except Exception as e:
            # 移除自定义日志处理器
            logging.getLogger().removeHandler(url_handler)
            print_progress(3.34, f"错误: API调用失败 - {str(e)}")
            
            # 如果API调用失败，但我们捕获到了URL，仍然返回它
            if captured_url:
                print_progress(3.37, f"尽管API调用失败，但已捕获URL: {captured_url}")
                return {"type": "url", "data": captured_url}
            
            raise
    except Exception as e:
        print_progress(3.34, f"错误: 处理图像过程中发生异常 - {str(e)}")
        print_progress(3.34, f"异常类型: {type(e).__name__}")
        return None

def main():
    """主函数，处理命令行参数并执行图像处理"""
    # 解析命令行参数
    parser = argparse.ArgumentParser(description='图像增强处理')
    parser.add_argument('--input', help='输入图像的URL或base64编码')
    parser.add_argument('--input_file', help='包含输入数据的文件路径')
    parser.add_argument('--input_type', choices=['url', 'base64'], default='url', help='输入类型：URL或base64')
    args = parser.parse_args()
    
    # 打印欢迎信息
    print_separator()
    print_progress(0, "开始图像增强处理")
    print_progress(0.1, f"输入类型: {args.input_type}")
    
    # 如果指定了输入文件，从文件读取数据
    if args.input_file:
        print_progress(0.2, f"从文件读取输入数据: {args.input_file}")
        try:
            with open(args.input_file, 'r', encoding='utf-8') as f:
                args.input = f.read().strip()
            print_progress(0.3, f"成功从文件读取数据，长度: {len(args.input)} 字符")
        except Exception as e:
            print_progress(0.3, f"错误: 无法从文件读取数据 - {str(e)}")
            print(json.dumps({
                "success": False,
                "error": f"无法从文件读取数据: {str(e)}"
            }))
            return
    
    # 确保我们有输入数据
    if not args.input:
        print_progress(0.4, "错误: 未提供输入数据")
        print(json.dumps({
            "success": False,
            "error": "未提供输入数据，请使用--input或--input_file参数"
        }))
        return
    
    print_separator()
    
    try:
        # 根据输入类型处理图像
        if args.input_type == 'url':
            # 直接使用URL
            image_url = args.input
            print_progress(1, f"使用URL模式，输入URL: {image_url}")
        else:
            # 处理base64数据
            print_progress(1, "使用base64模式处理图像数据")
            try:
                print_progress(1.1, f"收到base64数据，长度: {len(args.input)} 字符")
                # 从data URI格式中提取base64部分
                if args.input.startswith('data:'):
                    content_type, b64data = args.input.split(';base64,')
                    print_progress(1.2, f"检测到data URI格式，内容类型: {content_type}")
                else:
                    b64data = args.input
                    print_progress(1.2, "未检测到data URI格式，直接使用输入作为base64数据")
                
                # 解码base64数据
                try:
                    print_progress(1.3, "开始解码base64数据...")
                    image_data = base64.b64decode(b64data)
                    print_progress(1.4, f"base64解码成功，图像数据大小: {len(image_data)} 字节")
                except Exception as e:
                    print_progress(1.4, f"错误: base64解码失败 - {str(e)}")
                    print(json.dumps({
                        "success": False,
                        "error": f"无法解码base64数据: {str(e)}"
                    }))
                    return
                
                print_separator("-")
                # 上传到图床获取URL
                image_url = upload_to_360image(image_data)
                if not image_url:
                    print(json.dumps({
                        "success": False,
                        "error": "无法上传图像到服务器"
                    }))
                    return
            except Exception as e:
                print_progress(1.5, f"错误: 处理base64数据时出错 - {str(e)}")
                print(json.dumps({
                    "success": False,
                    "error": f"处理base64数据时出错: {str(e)}"
                }))
                return
        
        print_separator("-")
        # 使用CodeFormer处理图像
        result = enhance_image_with_codeformer(image_url)
        if not result:
            print(json.dumps({
                "success": False,
                "error": "图像处理失败"
            }))
            return
        
        # 检查返回类型
        if isinstance(result, dict) and result.get("type") == "url":
            # 直接使用返回的URL
            final_url = result["data"]
            
            print_separator()
            # 返回处理结果
            print_progress(5, "图像处理全部完成!")
            print_progress(5.1, f"最终图像URL: {final_url}")
            
            # 打印最终URL
            print("\n")
            print("=" * 50)
            print(f"最终处理结果URL: {final_url}")
            print("=" * 50)
            print("\n")
            
            print(json.dumps({
                "success": True,
                "imageUrl": final_url
            }))
            return
        
        # 如果是旧的返回格式(图像数据)，继续上传到图床
        print_separator("-")
        # 上传处理后的图像
        print_progress(4, "开始上传处理后的图像到图床服务")
        final_url = upload_to_360image(result)
        if not final_url:
            print(json.dumps({
                "success": False,
                "error": "无法上传处理后的图像"
            }))
            return
        
        print_separator()
        # 返回处理结果
        print_progress(5, "图像处理全部完成!")
        print_progress(5.1, f"最终图像URL: {final_url}")
        
        # 简化最终URL打印
        print("\n")
        print("=" * 50)
        print(f"最终处理结果URL: {final_url}")
        print("=" * 50)
        print("\n")
        
        print(json.dumps({
            "success": True,
            "imageUrl": final_url
        }))
        
    except Exception as e:
        print_progress("ERROR", f"处理过程中发生未预期的错误: {str(e)}")
        print(json.dumps({
            "success": False,
            "error": f"处理过程中发生错误: {str(e)}"
        }))

if __name__ == "__main__":
    main() 