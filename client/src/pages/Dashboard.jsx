// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [counts, setCounts] = useState({ active: 0, expiring: 0, expired: 0 });

  const [productName, setProductName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setUserEmail(user.email);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (userEmail) {
      fetchReceipts();
    }
  }, [userEmail]);

  const fetchReceipts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/receipts?userEmail=${userEmail}`);
      setReceipts(res.data);
      calculateCounts(res.data);
    } catch (err) {
      console.error("Error fetching receipts:", err);
    }
  };

  const calculateCounts = (data) => {
    const now = new Date();
    const active = data.filter(
      (r) => new Date(r.warrantyEndDate) > now && new Date(r.warrantyEndDate) - now > 30 * 24 * 60 * 60 * 1000
    ).length;
    const expiring = data.filter(
      (r) =>
        new Date(r.warrantyEndDate) > now &&
        new Date(r.warrantyEndDate) - now <= 30 * 24 * 60 * 60 * 1000
    ).length;
    const expired = data.filter((r) => new Date(r.warrantyEndDate) < now).length;
    setCounts({ active, expiring, expired });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!productName || !purchaseDate || !warrantyPeriod || !receiptFile) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      setUploading(true);
      const storageRef = ref(storage, `receipts/${Date.now()}_${receiptFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, receiptFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          alert("File upload failed.");
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await axios.post("http://localhost:5000/api/receipts", {
            productName,
            purchaseDate,
            warrantyPeriodMonths: warrantyPeriod,
            userEmail,
            fileUrl: downloadURL,
          });
          setProductName("");
          setPurchaseDate("");
          setWarrantyPeriod("");
          setReceiptFile(null);
          setUploading(false);
          setUploadProgress(0);
          fetchReceipts();
        }
      );
    } catch (err) {
      console.error("Error:", err);
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/receipts/${id}`);
      fetchReceipts();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const chartData = {
    labels: ["Active", "Expiring Soon", "Expired"],
    datasets: [
      {
        label: "Warranty Count",
        data: [counts.active, counts.expiring, counts.expired],
        backgroundColor: ["#34D399", "#FBBF24", "#F87171"],
        borderRadius: 8,
      },
    ],
  };

  const getStatus = (warrantyEndDate) => {
    const now = new Date();
    const expiry = new Date(warrantyEndDate);
    if (expiry < now) return "Expired";
    if (expiry - now <= 30 * 24 * 60 * 60 * 1000) return "Expiring Soon";
    return "Active";
  };

  const filteredReceipts =
    activeTab === "All"
      ? receipts
      : receipts.filter((r) => getStatus(r.warrantyEndDate) === activeTab);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentReceipts = filteredReceipts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-50 px-6 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 mb-3">
          Welcome, {userEmail.split("@")[0]}!
        </h1>
        <p className="text-gray-700 text-lg">Manage all your warranties in one place.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border-l-4 border-green-500 p-6 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-green-700">{counts.active}</h2>
          <p className="text-gray-600">Active Warranties</p>
        </div>
        <div className="bg-white border-l-4 border-yellow-500 p-6 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-yellow-700">{counts.expiring}</h2>
          <p className="text-gray-600">Expiring Soon</p>
        </div>
        <div className="bg-white border-l-4 border-red-500 p-6 rounded-2xl shadow-md">
          <h2 className="text-3xl font-bold text-red-700">{counts.expired}</h2>
          <p className="text-gray-600">Expired Warranties</p>
        </div>
      </div>

      {/* Upload Form */}
      <div
        className="bg-white p-8 rounded-2xl shadow-md mb-12"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setReceiptFile(e.dataTransfer.files[0]);
        }}
      >
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Upload New Receipt</h3>
        <form className="space-y-4" onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Item Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="number"
            placeholder="Warranty Period (in months)"
            value={warrantyPeriod}
            onChange={(e) => setWarrantyPeriod(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) => setReceiptFile(e.target.files[0])}
            className="w-full"
          />
          {uploading && (
            <div className="text-sm text-purple-600">Uploading... {uploadProgress}%</div>
          )}
          <button
            type="submit"
            disabled={uploading}
            className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
          >
            {uploading ? "Uploading..." : "Upload Receipt"}
          </button>
        </form>
      </div>

      {/* Warranty Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-12 max-w-3xl mx-auto">
        <h4 className="text-lg font-semibold text-purple-800 mb-4 text-center">Warranty Overview</h4>
        <Bar data={chartData} />
      </div>

      {/* Tabs */}
      <div className="mb-6 text-center space-x-2">
        {["All", "Active", "Expiring Soon", "Expired"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full border ${
              activeTab === tab
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-purple-100"
            }`}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Warranty Table */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h4 className="text-lg font-semibold text-purple-800 mb-4">Recent Warranties</h4>
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="pb-2">Product</th>
              <th className="pb-2">Purchase Date</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">View</th>
              <th className="pb-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentReceipts.map((r, index) => {
              const status = getStatus(r.warrantyEndDate);
              const color =
                status === "Active"
                  ? "text-green-700"
                  : status === "Expiring Soon"
                  ? "text-yellow-700"
                  : "text-red-700";

              return (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-2">{r.productName}</td>
                  <td className="py-2">{new Date(r.purchaseDate).toLocaleDateString()}</td>
                  <td className={`py-2 ${color}`}>{status}</td>
                  <td className="py-2">
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="py-2">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(r._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: Math.ceil(filteredReceipts.length / itemsPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? "bg-purple-700 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
