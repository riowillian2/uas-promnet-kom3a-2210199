import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({
    nama_barang: "",
    jumlah: 0,
    harga_satuan: 0,
    lokasi: "",
    deskripsi: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await axios.get("http://localhost:8080/api/inventory");
    setInventory(result.data);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:8080/api/inventory", formData);
    fetchData();
    setFormData({
      nama_barang: "",
      jumlah: 0,
      harga_satuan: 0,
      lokasi: "",
      deskripsi: "",
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8080/api/inventory/${id}`);
    fetchData();
  };

  return (
    <div>
      <h1>Inventory App</h1>
      <form onSubmit={handleFormSubmit}>
        <label>Nama Barang:</label>
        <input
          type="text"
          name="nama_barang"
          value={formData.nama_barang}
          onChange={handleInputChange}
        />
        <br />
        <label>Jumlah:</label>
        <input
          type="number"
          name="jumlah"
          value={formData.jumlah}
          onChange={handleInputChange}
        />
        <br />
        <label>Harga Satuan:</label>
        <input
          type="number"
          name="harga_satuan"
          value={formData.harga_satuan}
          onChange={handleInputChange}
        />
        <br />
        <label>Lokasi:</label>
        <select
          name="lokasi"
          value={formData.lokasi}
          onChange={handleInputChange}
        >
          <option value="Bandung">Bandung</option>
          <option value="Jakarta">Jakarta</option>
          <option value="Denpasar">Denpasar</option>
          <option value="Manokwari">Manokwari</option>
        </select>
        <br />
        <label>Deskripsi:</label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleInputChange}
        />
        <br />
        <button type="submit">Tambah Barang</button>
      </form>
      <h2>Daftar Barang</h2>
      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            {item.nama_barang} - {item.jumlah} pcs - Rp {item.harga_satuan} -{" "}
            {item.lokasi} - {item.deskripsi}{" "}
            <button onClick={() => handleDelete(item.id)}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
