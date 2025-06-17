const Inventaris = require("../models/Inventaris");
const fs = require("fs");
const path = require("path");

// Tambah Data Inventaris
exports.createInventaris = async (req, res) => {
  try {
    const {
      stockKode,
      namaItem,
      kategori,
      pemakaiSaatIni,
      riwayatPemakai,
      buktiPembelian,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Foto barang wajib diunggah" });
    }

    if (!namaItem) {
      return res.status(400).json({ message: "Nama item wajib diisi" });
    }

    // Parsing pemakai saat ini
    const pemakaiSaatIniParsed = JSON.parse(pemakaiSaatIni);
    pemakaiSaatIniParsed.tanggal = new Date(pemakaiSaatIniParsed.tanggal);

    // Parsing riwayat pemakai
    const riwayatPemakaiParsed = JSON.parse(riwayatPemakai).map((item) => ({
      ...item,
      tanggal: new Date(item.tanggal),
    }));

    const newInventaris = new Inventaris({
      stockKode,
      namaItem,
      foto: req.file.path,
      kategori,
      pemakaiSaatIni: pemakaiSaatIniParsed,
      riwayatPemakai: riwayatPemakaiParsed,
      buktiPembelian,
    });

    await newInventaris.save();
    res.status(201).json(newInventaris);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil Semua Inventaris
exports.getInventaris = async (req, res) => {
  try {
    const data = await Inventaris.find();
    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: "Tidak ada data inventaris ditemukan" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ambil Inventaris Berdasarkan ID
exports.getInventarisById = async (req, res) => {
  try {
    const data = await Inventaris.findById(req.params.id);
    if (!data) {
      return res
        .status(404)
        .json({ message: "Data inventaris tidak ditemukan" });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hapus Inventaris
exports.deleteInventaris = async (req, res) => {
  try {
    const item = await Inventaris.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    // Hapus foto dari filesystem
    if (item.foto) {
      const filePath = path.normalize(path.join(__dirname, "..", item.foto));
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Gagal menghapus file:", err);
        } else {
          console.log("File berhasil dihapus:", filePath);
        }
      });
    }

    await Inventaris.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Inventaris (khusus update pemakai + namaItem)
exports.updateInventaris = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      namaItem, // jika ingin bisa diubah juga
      pemakaiSaatIni: { nama, divisi, lokasi, spesifikasi, tanggal },
    } = req.body;

    const inventaris = await Inventaris.findById(id);
    if (!inventaris) {
      return res.status(404).json({ message: "Inventaris tidak ditemukan" });
    }

    if (!inventaris.pemakaiSaatIni) {
      return res.status(400).json({
        message: "Data pemakaiSaatIni tidak ditemukan dalam inventaris",
      });
    }

    // Push data lama ke riwayat
    const riwayatLama = {
      nama: inventaris.pemakaiSaatIni.nama,
      divisi: inventaris.pemakaiSaatIni.divisi,
      lokasi: inventaris.pemakaiSaatIni.lokasi,
      spesifikasi: inventaris.pemakaiSaatIni.spesifikasi,
      tanggal: inventaris.pemakaiSaatIni.tanggal,
    };
    inventaris.riwayatPemakai.push(riwayatLama);

    // Update data pemakai saat ini
    inventaris.pemakaiSaatIni.nama = nama;
    inventaris.pemakaiSaatIni.divisi = divisi;
    inventaris.pemakaiSaatIni.lokasi = lokasi;
    inventaris.pemakaiSaatIni.spesifikasi = spesifikasi;
    inventaris.pemakaiSaatIni.tanggal = new Date(tanggal);

    // Update nama item jika dikirim
    if (namaItem) {
      inventaris.namaItem = namaItem;
    }

    await inventaris.save();
    res.status(200).json(inventaris);
  } catch (error) {
    console.error("Gagal update inventaris:", error);
    res.status(500).json({ message: error.message });
  }
};
