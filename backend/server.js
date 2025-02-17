const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const util = require("util");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi database dengan koneksi pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "db_user_login",
  connectionLimit: 10,
});

// Promisify query untuk async/await
db.query = util.promisify(db.query);

// Cek koneksi database
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Gagal terhubung ke database:", err.message);
  } else {
    console.log("✅ Berhasil terhubung ke database!");
    connection.release();
  }
});

// Fungsi untuk menangani permintaan data user berdasarkan email
const getUserData = async (column, req, res) => {
  const userEmail = req.query.email;
  if (!userEmail) return res.status(400).json({ error: "Email diperlukan" });

  const allowedColumns = [
    "detak_jantung",
    "durasi_tidur",
    "langkah",
    "kalori_terbakar",
    "nama_user",
  ];
  if (!allowedColumns.includes(column))
    return res.status(400).json({ error: "Kolom tidak valid" });

  try {
    const results = await db.query(
      `SELECT ?? FROM tb_user WHERE email_user = ?`,
      [column, userEmail]
    );
    res.json(results);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error" });
  }
};

// Endpoint utama
app.get("/", (req, res) => res.json("From Backend Site"));

// Endpoint untuk mendapatkan semua user
app.get("/tb_user", async (req, res) => {
  try {
    const data = await db.query("SELECT * FROM tb_user");
    res.json(data);
  } catch (error) {
    console.error("Error query database:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Endpoint login tanpa bcrypt (password plaintext)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email dan password wajib diisi" });

  try {
    const result = await db.query(
      "SELECT nama_user, email_user, password_user FROM tb_user WHERE email_user = ?",
      [email]
    );

    if (result.length === 0)
      return res.status(401).json({ error: "Email tidak terdaftar" });

    const user = result[0];

    // Bandingkan password langsung (plaintext)
    if (password !== user.password_user)
      return res.status(401).json({ error: "Password salah" });

    // Kirim `nama_user` ke frontend
    res.json({
      message: "Login berhasil!",
      email: user.email_user,
      nama_user: user.nama_user,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

// Endpoint dinamis untuk mendapatkan data user berdasarkan email
app.get("/detak_jantung", (req, res) => getUserData("detak_jantung", req, res));
app.get("/durasi_tidur", (req, res) => getUserData("durasi_tidur", req, res));
app.get("/langkah", (req, res) => getUserData("langkah", req, res));
app.get("/kalori_terbakar", (req, res) =>
  getUserData("kalori_terbakar", req, res)
);
app.get("/nama_user", (req, res) => getUserData("nama_user", req, res));

// Jalankan server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
