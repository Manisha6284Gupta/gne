import { useState } from "react";

export default function OTRVerification() {
    const [otrNumber, setOtrNumber] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!selectedFile || !otrNumber) {
            alert("Please upload an image and enter OTR number");
            return;
        }

        let formData = new FormData();
        formData.append("uploadedImage", selectedFile);
        formData.append("otrNumber", otrNumber);

        try {
            let response = await fetch("http://127.0.0.1:2000/api/upload", {   
                method: "POST",
                body: formData
            });

            let result = await response.json();
            setMessage(result.message);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to server. Check console.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[rgb(254,249,231)] p-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700">Submit OTR</h2>
                <div className="mt-4">
                    <label className="block text-gray-600 font-medium">Upload Image</label>
                    <input type="file" onChange={handleFileChange} className="mt-2 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <div className="mt-4">
                    <label className="block text-gray-600 font-medium">Enter OTR Number</label>
                    <input type="text" value={otrNumber} onChange={(e) => setOtrNumber(e.target.value)} placeholder="Enter OTR Number" className="mt-2 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>
                <button onClick={handleSubmit} className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    Submit OTR
                </button>
                {message && <h3 className="mt-4 text-lg text-center font-semibold text-gray-700">{message}</h3>}
            </div>
        </div>
    );
}
