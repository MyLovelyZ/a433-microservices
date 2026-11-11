#!/bin/bash
# Script untuk build Docker image backend karsajobs lalu push ke GitHub Packages (GitHub Container Registry).
# Sebelum menjalankan script ini, simpan Personal Access Token GitHub (scope write:packages)
# ke environment variable agar tidak tertulis di dalam script:
#   export PASSWORD_GITHUB=<personal_access_token_Anda>

# Menghentikan script bila ada perintah yang gagal
set -e

# Username GitHub (nama image di GHCR wajib huruf kecil)
GITHUB_USERNAME=mylovelyz

# Nama lengkap image sesuai format GitHub Packages: ghcr.io/<username>/<nama-image>:<tag>
IMAGE_NAME=ghcr.io/$GITHUB_USERNAME/karsajobs:latest

# 1. Membuat Docker image dari Dockerfile yang disediakan di direktori saat ini
docker build -t $IMAGE_NAME .

# 2. Login ke GitHub Packages (ghcr.io) via Terminal menggunakan token dari environment variable
echo $PASSWORD_GITHUB | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

# 3. Mengunggah image ke GitHub Packages
docker push $IMAGE_NAME
