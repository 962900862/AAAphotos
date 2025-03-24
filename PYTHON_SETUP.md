# Python 环境设置指南

本指南将帮助您设置必要的Python环境，以使用照片聊天专业版的4K蓝光增强功能。

## 前提条件

- Node.js (已安装)
- Internet连接
- 管理员权限（安装软件时可能需要）

## 1. 安装Python

1. 访问Python官方网站 [python.org](https://www.python.org/downloads/) 下载Python 3.9或更高版本
2. 运行安装程序，**务必勾选"Add Python to PATH"选项**
3. 完成安装向导的步骤

## 2. 安装必要的Python包

打开命令提示符或终端，运行以下命令：

```bash
pip install gradio_client==0.5.1 requests
```

注意：必须安装特定版本(0.5.1)的gradio_client以确保兼容性。

如果上面的命令不能正常工作，您也可以尝试以下命令：

```bash
pip install --upgrade pip
pip install gradio_client==0.5.1 requests
```

或者，尝试最新版本（如果0.5.1不兼容）：

```bash
pip install gradio_client requests
```

## 3. 验证安装

运行以下命令验证安装是否成功：

```bash
python -c "from gradio_client import Client, handle_file; print('安装成功!')"
```

如果没有错误消息，则表示安装成功。

## 4. 启动应用程序

安装完所有依赖后，您可以启动应用程序：

```bash
npm run dev
```

## 常见问题

### 无法安装Python包

如果您遇到权限错误，请尝试使用管理员权限运行命令，或者使用以下命令为当前用户安装：

```bash
pip install --user gradio_client==0.5.1 requests
```

### ModuleNotFoundError

如果您收到找不到模块的错误，请确保您已正确安装所有依赖：

```bash
pip install gradio_client==0.5.1 requests
```

### 处理速度慢或失败

4K增强处理需要网络连接以访问CodeFormer API。如果处理失败，请检查以下事项：

1. **网络连接**：确保您的电脑可以访问互联网，特别是 huggingface.co 网站
2. **防火墙/代理设置**：某些防火墙或网络代理可能会阻止API调用
3. **重试**：有时API服务器繁忙，请稍后重试
4. **科学上网**：由于Hugging Face在国内可能访问不稳定，可能需要使用代理

### 手动验证网络连接

您可以运行以下命令测试网络连接：

```bash
python -c "import requests; print(requests.get('https://huggingface.co').status_code)"
```

如果返回200，则表示网络连接正常。

### 关于CodeFormer API错误

如果出现API调用错误，可能是因为模型版本变更。请尝试更新gradio_client：

```bash
pip install --upgrade gradio_client
```

## 技术细节

4K蓝光增强功能使用CodeFormer AI模型进行图像处理。处理流程如下：

1. 将用户上传的图像转换为base64编码
2. Python脚本将图像上传到临时图床获取URL
3. 使用该URL调用Hugging Face上的CodeFormer API
4. 下载处理后的图像并再次上传到图床
5. 返回最终图像URL给前端显示

该过程完全在服务器端进行，无需在客户端安装特殊软件，但需要服务器具有Python环境和必要的依赖项 