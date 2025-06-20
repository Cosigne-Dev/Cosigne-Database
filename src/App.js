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
  const [facingMode, setFacingMode] = useState("environment");
  const videoRef = useRef();
  const canvasRef = useRef();

  const startCamera = async () => {
    const constraints = {
      video: { facingMode }  // "user" for front, "environment" for rear
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
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

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="max-w-md mx-auto p-4 text-base">
      <h1 className="text-2xl mb-4 font-semibold text-center">Clothing Photo Capture</h1>

      <div className="flex flex-col gap-3">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded border" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex gap-2">
          <button onClick={startCamera} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded">Start Camera</button>
          <button onClick={capturePhoto} className="flex-1 px-4 py-2 bg-green-500 text-white rounded">Capture Photo</button>
        </div>
        <button onClick={toggleCamera} className="px-4 py-2 bg-yellow-500 text-white rounded">Switch Camera</button>

        {imageSrc && <img src={imageSrc} alt="Captured" className="w-full rounded mt-4" />}

        <div className="grid gap-3 mt-4">
          <select name="brand" value={formData.brand} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Brand</option>
            <option value="Nike">Nike</option>
            <option value="Adidas">Adidas</option>
          </select>

          <select name="size" value={formData.size} onChange={handleChange} className="border p-2 rounded">
            <option value="">Select Size</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>

          <select name="genderAge" value={formData.genderAge} onChange={handleChange} className="border p-2 rounded">
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
            className="border p-2 rounded"
          />
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={saveEntry} className="flex-1 px-4 py-2 bg-purple-500 text-white rounded">Save Entry</button>
          <button onClick={exportData} className="flex-1 px-4 py-2 bg-gray-700 text-white rounded">Export JSON</button>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold">Saved Entries: {entries.length}</h2>
          <ul className="space-y-4 mt-2">
            {entries.map((entry, index) => (
              <li key={index} className="border p-2 rounded">
                <img src={entry.image} alt="entry" className="w-full rounded mb-2" />
                <p><strong>Brand:</strong> {entry.brand}</p>
                <p><strong>Size:</strong> {entry.size}</p>
                <p><strong>Gender/Age:</strong> {entry.genderAge}</p>
                <p><strong>Supplier ID:</strong> {entry.supplierId}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
