const mongoose = require("mongoose");

const inventarisSchema = new mongoose.Schema({
  stockKode: { type: String, required: true, unique: true },
  namaItem: { type: String, required: true }, // ✅ Tambahan
  foto: { type: String, required: true },
  kategori: { type: String, required: true },
  pemakaiSaatIni: {
    nama: { type: String, required: true },
    divisi: { type: String, required: true },
    lokasi: { type: String, required: true },
    spesifikasi: { type: String, required: true },
    tanggal: { type: Date, default: Date.now },
  },
  riwayatPemakai: [
    {
      nama: String,
      divisi: String,
      lokasi: String,
      spesifikasi: String,
      tanggal: { type: Date, default: Date.now },
    },
  ],
  buktiPembelian: { type: String, required: true },
});

module.exports = mongoose.model("Inventaris", inventarisSchema);
