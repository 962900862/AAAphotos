#!/bin/bash

# 输出当前工作目录，用于调试
echo "Current working directory: $(pwd)"

# 输出Python版本，确认Python已安装
echo "Python version:"
python --version

# 创建并激活虚拟环境
echo "Creating Python virtual environment..."
python -m venv .venv
source .venv/bin/activate

# 安装pip和依赖
echo "Installing dependencies from requirements.txt..."
pip install --upgrade pip
pip install -r requirements.txt

# 列出已安装的包
echo "Installed Python packages:"
pip list

# 确保脚本目录是可执行的
echo "Setting permissions for Python script..."
chmod +x api_enhance.py

# 结束消息
echo "Build script completed successfully!" 