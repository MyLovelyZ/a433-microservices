// Memuat variabel environment dari berkas .env (PORT, AMQP_URL) ke process.env
require('dotenv').config()

// Mengimpor framework web Express
const express = require("express");
// Membuat instance aplikasi Express
const app = express();

// Mengimpor body-parser (disertakan dari starter project)
const bp = require("body-parser");

// Mengimpor library amqplib sebagai klien RabbitMQ (protokol AMQP)
const amqp = require("amqplib");
// Mengambil alamat RabbitMQ dari environment variable AMQP_URL
const amqpServer = process.env.AMQP_URL;
// Variabel global untuk menyimpan channel dan koneksi RabbitMQ
var channel, connection;

// Membuka koneksi ke RabbitMQ saat aplikasi dijalankan
connectToQueue();

// Fungsi untuk terhubung ke RabbitMQ dan mengonsumsi pesan dari queue
async function connectToQueue() {
    try {
        // Terhubung ke server RabbitMQ
        connection = await amqp.connect(amqpServer);
        // Membuat channel pada koneksi tersebut
        channel = await connection.createChannel();
        // Memastikan queue "order" ada (dibuat bila belum ada)
        await channel.assertQueue("order");
        // Mulai mengonsumsi setiap pesan yang masuk ke queue "order"
        channel.consume("order", data => {
            // Mencetak isi pesan (data order) ke console
            console.log(`Order received: ${Buffer.from(data.content)}`);
            // Mencetak pesan bahwa order akan segera dikirim
            console.log("** Will be shipped soon! **\n")
            // Mengirim ack ke RabbitMQ bahwa pesan sudah diproses
            channel.ack(data);
        });
    } catch (ex) {
        // Mencetak error koneksi
        console.error(ex);
        // Keluar dengan kode 1 sehingga Docker/Kubernetes menjalankan ulang container
        process.exit(1);
    }
}

// Menjalankan server HTTP pada port dari environment variable PORT
app.listen(process.env.PORT, () => {
    // Mencetak port tempat server berjalan
    console.log(`Server running at ${process.env.PORT}`);
});
