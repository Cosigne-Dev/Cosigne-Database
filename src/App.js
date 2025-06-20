import React, { useState, useRef } from "react";

export default function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [formData, setFormData] = useState({
    brand: "",
    size: "",
    genderAge: "",
    supplierId: ""
  });
  const [entries, setEntries] = useState([]);
  const videoRef = useRef();
  const canvasRef = useRef();

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    setImageSrc(dataUrl);
  };

  const saveEntry = () => {
    const entry = { ...formData, image: imageSrc };
    setEntries([...entries, entry]);
    setFormData({ brand: "", size: "", genderAge: "", supplierId: "" });
    setImageSrc(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const exportData = () => {
    const json = JSON.stringify(entries);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "clothing-data.json";
    link.click();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Clothing Photo Capture</h1>

      <video ref={videoRef} autoPlay className="w-full max-w-md border" />
      <canvas ref={canvasRef} className="hidden" />
      <button onClick={startCamera} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Start Camera</button>
      <button onClick={capturePhoto} className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded">Capture Photo</button>

      {imageSrc && <img src={imageSrc} alt="Captured" className="my-4 w-64" />}

      <div className="grid gap-2">
        <select name="brand" value={formData.brand} onChange={handleChange} className="border p-2">
          <option value="">Select Brand</option>
          <option value="Nike">Nike</option>
          <option value="Adidas">Adidas</option>
        </select>

        <select name="size" value={formData.size} onChange={handleChange} className="border p-2">
          <option value="">Select Size</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
        </select>

        <select name="genderAge" value={formData.genderAge} onChange={handleChange} className="border p-2">
          <option value="">Select Gender/Age</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>

        <input
          name="supplierId"
          placeholder="Supplier ID"
          value={formData.supplierId}
          onChange={handleChange}
          className="border p-2"
        />
      </div>

      <button onClick={saveEntry} className="mt-4 px-4 py-2 bg-purple-500 text-white rounded">Save Entry</button>
      <button onClick={exportData} className="ml-2 px-4 py-2 bg-gray-700 text-white rounded">Export JSON</button>

      <div className="mt-6">
        <h2 className="text-xl">Saved Entries: {entries.length}</h2>
        <ul>
          {entries.map((entry, index) => (
            <li key={index} className="border p-2 mt-2">
              <img src={entry.image} alt="entry" className="w-32 mb-2" />
              <p><strong>Brand:</strong> {entry.brand}</p>
              <p><strong>Size:</strong> {entry.size}</p>
              <p><strong>Gender/Age:</strong> {entry.genderAge}</p>
              <p><strong>Supplier ID:</strong> {entry.supplierId}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
