import React, { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../assets/baseURL";
import { pdfjs, Document, Page } from "react-pdf";
import PdfReader from "./PdfReader";
import Container from "./ui/Container";

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
    <div className="min-h-screen bg-ink-50 pb-16 pt-24 sm:pt-28">
      <Container className="max-w-2xl">
        <form
          className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8"
          onSubmit={submitFiles}
        >
          <h4 className="font-display text-lg font-bold text-ink-900 mb-4">Add Pdfs</h4>
          <input
            type="text"
            placeholder="Add a title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-3 w-full rounded-xl border border-ink-200 bg-ink-50 p-3 text-ink-800 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <input
            type="file"
            accept="application/pdf"
            required
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4 w-full text-sm text-ink-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100"
          />
          <button
            className="w-full rounded-xl bg-brand-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-brand-700"
            type="submit"
          >
            Add
          </button>
        </form>

        <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
          <h4 className="font-display text-lg font-bold text-ink-900 mb-4">All Files</h4>
          <ul className="divide-y divide-ink-100">
            {allPdf.map((pdf, index) => (
              <li key={index} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm font-medium text-ink-700">{pdf.title}</span>
                <button className="shrink-0 rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100">
                  Read file
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
          <PdfReader />
        </div>
      </Container>
    </div>
  );
};

export default Adds;
