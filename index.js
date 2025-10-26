// index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Baca data dari file JSON (seolah database)
const dataPath = './data/obat.json';
const getObat = () => JSON.parse(fs.readFileSync(dataPath));

// ===== ROUTE DASAR =====
app.get('/', (req, res) => {
  res.json({ message: 'API Apotek aktif!' });
});

// ===== GET semua obat =====
app.get('/obat', (req, res) => {
  const data = getObat();
  res.json(data);
});

// ===== GET obat berdasarkan ID =====
app.get('/obat/:id', (req, res) => {
  const data = getObat();
  const obat = data.find(o => o.id === parseInt(req.params.id));
  if (!obat) return res.status(404).json({ message: 'Obat tidak ditemukan' });
  res.json(obat);
});

// ===== POST tambah obat =====
app.post('/obat', (req, res) => {
  const data = getObat();
  const newObat = {
    id: data.length + 1,
    nama: req.body.nama,
    harga: req.body.harga,
    stok: req.body.stok,
    deskripsi: req.body.deskripsi
  };
  data.push(newObat);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.status(201).json(newObat);
});

// ===== PUT update obat =====
app.put('/obat/:id', (req, res) => {
  const data = getObat();
  const index = data.findIndex(o => o.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Obat tidak ditemukan' });

  data[index] = { ...data[index], ...req.body };
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  res.json(data[index]);
});

// ===== DELETE hapus obat =====
app.delete('/obat/:id', (req, res) => {
  let data = getObat();
  const newData = data.filter(o => o.id !== parseInt(req.params.id));
  fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));
  res.json({ message: 'Obat berhasil dihapus' });
});

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
