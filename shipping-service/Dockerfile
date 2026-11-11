# Base image: Node.js 18 versi alpine yang ringan
FROM node:18-alpine

# Menentukan direktori kerja di dalam container
WORKDIR /app

# Menyalin package.json dan package-lock.json terlebih dahulu agar cache layer npm efisien
COPY package*.json ./

# Menginstal dependency production saja secara bersih sesuai package-lock.json
RUN npm ci --omit=dev

# Menyalin seluruh source code aplikasi ke container
COPY . .

# Environment variable default; AMQP_URL mengarah ke host "rabbitmq" (nama service di Compose/Kubernetes)
ENV PORT=3001
ENV AMQP_URL=amqp://rabbitmq:5672

# Mendokumentasikan port yang digunakan aplikasi
EXPOSE 3001

# Menjalankan aplikasi sebagai user non-root bawaan image node
USER node

# Perintah untuk menjalankan aplikasi saat container start
CMD ["node", "index.js"]
