
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { DataTable } from './components/DataTable';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { WelcomeMessage } from './components/WelcomeMessage';
import { processFileToTable } from './services/geminiService';
import type { TableData, FileData } from './types';
import { DownloadButton } from './components/DownloadButton';

const PdfIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.414a1 1 0 00-.293-.707l-4.414-4.414A1 1 0 0011.586 3H4zm3 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
);


const App: React.FC = () => {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);

  const handleFileUpload = useCallback(async (fileData: FileData) => {
    setIsLoading(true);
    setError(null);
    setTableData(null);
    setUploadedFile(fileData);

    try {
      const result = await processFileToTable(fileData.base64, fileData.mimeType);
      if (result && result.length > 0) {
        setTableData(result);
      } else {
        setError("Couldn't find a table in the file. Please try another one.");
      }
    } catch (err) {
      console.error(err);
      setError('Failed to process the file. Please ensure the file is clear and contains a table.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setTableData(null);
    setError(null);
    setUploadedFile(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-slate-200">
          {!uploadedFile && <ImageUploader onImageUpload={handleFileUpload} isProcessing={isLoading} />}
          
          {uploadedFile && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-700">Your File</h2>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Try Another File
                  </button>
              </div>
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col items-center justify-center">
                {uploadedFile.type === 'image' && uploadedFile.previewUrl && (
                    <img src={uploadedFile.previewUrl} alt="File preview" className="rounded-lg max-h-80 w-auto" />
                )}
                {uploadedFile.type === 'pdf' && (
                    <div className="text-center py-8">
                        <PdfIcon />
                        <p className="mt-2 font-semibold text-slate-700">{uploadedFile.name}</p>
                    </div>
                )}
              </div>
            </div>
          )}

          {isLoading && <Loader />}
          {error && !isLoading && <ErrorMessage message={error} />}

          {!isLoading && !error && tableData && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-700">Extracted Data</h2>
                <DownloadButton data={tableData} />
              </div>
              <DataTable data={tableData} />
            </div>
          )}

          {!uploadedFile && !isLoading && !error && !tableData && (
            <WelcomeMessage />
          )}
        </div>
        <footer className="text-center mt-8 text-sm text-slate-500">
          <p>Powered by Google Gemini</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
