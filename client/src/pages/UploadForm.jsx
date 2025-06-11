import { useState } from "react";

export default function UploadForm() {
  const [formData, setFormData] = useState({
    item: "",
    brand: "",
    purchaseDate: "",
    expiryDate: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // We'll integrate Firebase upload here next
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md max-w-md"
    >
      <h2 className="text-lg font-bold mb-4 text-gray-700">
        Upload Warranty Document
      </h2>

      <input
        type="text"
        name="item"
        placeholder="Item Name"
        className="mb-3 w-full px-3 py-2 border rounded"
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="brand"
        placeholder="Brand"
        className="mb-3 w-full px-3 py-2 border rounded"
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="purchaseDate"
        className="mb-3 w-full px-3 py-2 border rounded"
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="expiryDate"
        className="mb-3 w-full px-3 py-2 border rounded"
        onChange={handleChange}
        required
      />
      <input
        type="file"
        name="file"
        accept=".pdf, image/*"
        className="mb-4"
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
      >
        Upload
      </button>
    </form>
  );
}
