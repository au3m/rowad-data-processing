import React, { useState } from "react";
import { InputSection } from "./components/InputSection";
import { PreviewSection } from "./components/PreviewSection";
import { ErrorAlert } from "./components/ErrorAlert";
import logo from "../assets/Rowad-Logo.png";

function App() {
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<"text" | "file" | null>(null);
  const [error, setError] = useState<string>("");

  const handleDataProcessed = (data: any[], source: "text" | "file") => {
    setProcessedData(data);
    setDataSource(source);
    setError("");
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const clearError = () => {
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 no-print">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src={logo}
                alt="Rowad Modern Engineering"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="border-l border-gray-300 pl-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Data Processor
              </h1>
              <p className="text-sm text-gray-600">
                Process text or Excel files with ease
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* Input Section */}
          <div className="min-h-0">
            <InputSection
              onDataProcessed={handleDataProcessed}
              onError={handleError}
            />
          </div>

          {/* Preview Section */}
          <div className="min-h-0">
            <PreviewSection data={processedData} source={dataSource} />
          </div>
        </div>
      </main>

      {/* Error Alert */}
      {error && <ErrorAlert message={error} onClose={clearError} />}
    </div>
  );
}

export default App;
