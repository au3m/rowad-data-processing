import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface InputSectionProps {
  onDataProcessed: (data: any[], source: 'text' | 'file') => void;
  onError: (error: string) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ onDataProcessed, onError }) => {
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextProcess = () => {
    if (!textInput.trim()) {
      onError('Please enter some text to process');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const lines = textInput.split('\n').filter(line => line.trim());
      const processedData = lines.map((line, index) => ({
        id: index + 1,
        original: line,
        processed: line.toUpperCase(),
        length: line.length,
        words: line.split(' ').length
      }));
      
      onDataProcessed(processedData, 'text');
      setIsProcessing(false);
    }, 1000);
  };

  const handleFileUpload = (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      onError('Please upload a valid Excel file (.xlsx, .xls) or CSV file');
      return;
    }

    setIsProcessing(true);
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const processedData = jsonData.map((row: any, index) => ({
          id: index + 1,
          ...row,
          _processed: true
        }));

        onDataProcessed(processedData, 'file');
        setIsProcessing(false);
      } catch (error) {
        onError('Error processing file. Please check the file format.');
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const clearFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card h-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Input</h2>
      
      {/* Input Type Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setInputType('text')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            inputType === 'text'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Text Input
        </button>
        <button
          onClick={() => setInputType('file')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
            inputType === 'file'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          File Upload
        </button>
      </div>

      {/* Text Input Section */}
      {inputType === 'text' && (
        <div className="space-y-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter your text here... Each line will be processed separately."
            className="input-field min-h-[300px] resize-none"
          />
          <button
            onClick={handleTextProcess}
            disabled={isProcessing || !textInput.trim()}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processing...
              </>
            ) : (
              'Process Text'
            )}
          </button>
        </div>
      )}

      {/* File Upload Section */}
      {inputType === 'file' && (
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {uploadedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <FileText className="w-8 h-8" />
                  <span className="font-medium">{uploadedFile.name}</span>
                  <button
                    onClick={clearFile}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  File size: {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your Excel file here
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    or click to browse (.xlsx, .xls, .csv)
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary mx-auto"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              <span>Processing file...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};