import React, { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../assets/baseURL";
import { pdfjs, Document, Page } from "react-pdf";
import PdfReader from "./PdfReader";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Adds = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allPdf, setAllPdf] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null); // State to track the selected PDF
  const [numPages, setNumPages] = useState(null); // State to track the number of pages

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    try {
      const result = await axios.get(`${baseURL}uploadfile/pdfdetails`);
      console.log(result.data.data);
      setAllPdf(result.data.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const submitFiles = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    console.log(file, title);

    try {
      const result = await axios.post(`${baseURL}uploadfile/uploadfiles`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(result);
      setTitle("");
      setFile("");
      getPdf(); // Refresh PDF list after upload
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

 
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center">
      <form className="flex flex-col items-center justify-center mb-6" onSubmit={submitFiles}>
        <h4 className="mb-2">Add Pdfs</h4>
        <input
          type="text"
          placeholder="Add a title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <input
          type="file"
          accept="application/pdf"
          required
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-2"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Add
        </button>
      </form>

      <div className="flex flex-col items-center">
        <h4 className="mb-4">All Files</h4>
        <ul className="list-disc">
          {allPdf.map((pdf, index) => (
            <div key={index}>
              <li className="mb-2">{pdf.title}</li>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
               
              >
                Read file
              </button>
            </div>
          ))}
        </ul>
      </div>

   <PdfReader />
    </div>
  );
};

export default Adds;
