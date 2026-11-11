// Memuat variabel environment dari berkas .env (PORT, AMQP_URL) ke process.env
require('dotenv').config()

// Mengimpor framework web Express
const express = require("express");
// Membuat instance aplikasi Express
const app = express();

// Mengimpor body-parser untuk membaca body request
const bp = require("body-parser");
// Mengaktifkan parsing body berformat JSON pada semua request
app.use(bp.json());

// Mengimpor library amqplib sebagai klien RabbitMQ (protokol AMQP)
const amqp = require("amqplib");
// Mengambil alamat RabbitMQ dari environment variable AMQP_URL
const amqpServer = process.env.AMQP_URL;
// Variabel global untuk menyimpan channel dan koneksi RabbitMQ
var channel, connection;

// Membuka koneksi ke RabbitMQ saat aplikasi dijalankan
connectToQueue();

// Fungsi untuk membuat koneksi, channel, dan queue di RabbitMQ
async function connectToQueue() {
    // Terhubung ke RabbitMQ; bila gagal, proses akan keluar agar container di-restart
    try {
        connection = await amqp.connect(amqpServer);
    } catch (ex) {
        // Mencetak pesan error koneksi
        console.error("Failed to connect to RabbitMQ:", ex.message);
        // Keluar dengan kode 1 sehingga Docker/Kubernetes menjalankan ulang container
        process.exit(1);
    }
    // Membuat channel pada koneksi tersebut
    channel = await connection.createChannel();
    try {
        // Nama queue tujuan pengiriman data order
        const queue = "order";
        // Memastikan queue "order" ada (dibuat bila belum ada)
        await channel.assertQueue(queue);
        // Menandakan koneksi ke queue berhasil
        console.log("Connected to the queue!")
    } catch (ex) {
        // Mencetak error bila pembuatan queue gagal
        console.error(ex);
    }
}

// Endpoint POST /order untuk menerima data order dalam bentuk JSON
app.post("/order", (req, res) => {
    // Mengambil properti "order" dari body request
    const { order } = req.body;
    // Mengirim data order ke queue RabbitMQ
    createOrder(order);
    // Mengembalikan data order sebagai response ke client
    res.send(order);
});

// Fungsi untuk mengirim data order ke queue
const createOrder = async order => {
    // Nama queue tujuan
    const queue = "order";
    // Mengubah order menjadi JSON string lalu Buffer, dan mengirimkannya ke queue
    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
    // Menandakan order berhasil dikirim
    console.log("Order succesfully created!")
    // Menangani sinyal SIGINT (Ctrl+C) satu kali
    process.once('SIGINT', async () => { 
        // Mencetak pesan bahwa koneksi akan ditutup
        console.log('got sigint, closing connection');
        // Menutup channel RabbitMQ
        await channel.close();
        // Menutup koneksi RabbitMQ
        await connection.close(); 
        // Menghentikan proses dengan kode sukses
        process.exit(0);
    });
};

// Menjalankan server HTTP pada port dari environment variable PORT
app.listen(process.env.PORT, () => {
    // Mencetak port tempat server berjalan
    console.log(`Server running at ${process.env.PORT}`);
});
