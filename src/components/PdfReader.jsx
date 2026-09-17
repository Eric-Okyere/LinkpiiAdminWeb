import React, { useState } from "react";
import { Document, Page } from "react-pdf";

function PdfReader({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full overflow-hidden rounded-xl border border-ink-100 shadow-soft">
        <Document
          file={pdfUrl} // Use the pdfUrl prop
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => console.error("Error loading PDF:", error)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
      <p className="mt-3 text-sm font-medium text-ink-500">
        Page {pageNumber} of {numPages}
      </p>
    </div>
  );
}

export default PdfReader;
