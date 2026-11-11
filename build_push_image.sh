#!/bin/bash
# Script untuk build Docker image item-app lalu push ke GitHub Packages (GitHub Container Registry).
# Sebelum menjalankan script ini, simpan Personal Access Token GitHub (scope write:packages)
# ke environment variable agar tidak tertulis di dalam script:
#   export PASSWORD_GITHUB=<personal_access_token_Anda>

# Menghentikan script bila ada perintah yang gagal
set -e

# Username GitHub (nama image di GHCR wajib huruf kecil)
GITHUB_USERNAME=mylovelyz

# 1. Membuat Docker image dari Dockerfile di direktori saat ini dengan nama item-app dan tag v1
docker build -t item-app:v1 .

# 2. Melihat daftar image yang ada di lokal
docker images

# 3. Mengubah nama image agar sesuai format GitHub Packages: ghcr.io/<username>/<nama-image>:<tag>
docker tag item-app:v1 ghcr.io/$GITHUB_USERNAME/item-app:v1

# 4. Login ke GitHub Packages (ghcr.io) via Terminal menggunakan token dari environment variable
echo $PASSWORD_GITHUB | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

# 5. Mengunggah image ke GitHub Packages
docker push ghcr.io/$GITHUB_USERNAME/item-app:v1
