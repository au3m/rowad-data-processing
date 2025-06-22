import React, { useState } from 'react';
import { Printer, Download, FileText, Table, Eye } from 'lucide-react';
import * as XLSX from 'xlsx';

interface PreviewSectionProps {
  data: any[];
  source: 'text' | 'file' | null;
}

export const PreviewSection: React.FC<PreviewSectionProps> = ({ data, source }) => {
  const [viewMode, setViewMode] = useState<'table' | 'list'>('table');
  const [isExporting, setIsExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      if (source === 'text') {
        // Save as JSON for text data
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'processed_text_data.json';
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // Save as Excel for file data
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Processed Data');
        XLSX.writeFile(wb, 'processed_data.xlsx');
      }
      setIsExporting(false);
    }, 1000);
  };

  const renderTableView = () => {
    if (data.length === 0) return null;

    const headers = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.replace('_', ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {String(row[header] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">Item #{item.id || index + 1}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(item).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {key.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-900 mt-1">
                    {String(value || '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Preview & Output</h2>
        
        {data.length > 0 && (
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 no-print">
              <button
                onClick={handlePrint}
                className="btn-secondary"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleSave}
                disabled={isExporting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="print-content">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FileText className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Data to Preview</h3>
            <p className="text-center max-w-md">
              Process your text input or upload an Excel file to see the results here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{data.length}</span> items processed
                {source && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    Source: {source === 'text' ? 'Text Input' : 'File Upload'}
                  </span>
                )}
              </div>
            </div>
            
            {viewMode === 'table' ? renderTableView() : renderListView()}
          </div>
        )}
      </div>
    </div>
  );
};