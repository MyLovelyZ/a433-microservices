# Menggunakan base image Node.js versi 14 dari Docker Hub
FROM node:14

# Menentukan /app sebagai working directory di dalam container
WORKDIR /app

# Menyalin seluruh source code dari root project (host) ke working directory (/app) di container
COPY . .

# Menjalankan aplikasi dalam production mode dan menggunakan container bernama item-db sebagai database host
ENV NODE_ENV=production DB_HOST=item-db

# Menginstal dependencies khusus production, kemudian build aplikasi (menjalankan gulp)
RUN npm install --production --unsafe-perm && npm run build

# Mengekspos port 8080 yang digunakan oleh aplikasi
EXPOSE 8080

# Menjalankan server dengan perintah npm start saat container diluncurkan
CMD ["npm", "start"]
