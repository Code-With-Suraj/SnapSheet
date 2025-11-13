
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

const App: React.FC = () => {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);

  const handleFileUpload = useCallback(async (filesData: FileData[]) => {
    setIsLoading(true);
    setError(null);
    setTableData(null);
    setUploadedFiles(filesData);

    try {
      const tablePromises = filesData.map(file =>
        processFileToTable(file.base64, file.mimeType)
      );
      const allTables = await Promise.all(tablePromises);

      // Flatten the array of tables into a single TableData array
      const combinedData: TableData = allTables.flat();

      if (combinedData.length > 0) {
        setTableData(combinedData);
      } else {
        setError("Couldn't find any tables in the uploaded files. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError('Failed to process the files. Please ensure the files are clear and contain tables.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setTableData(null);
    setError(null);
    setUploadedFiles([]);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-slate-200">
          {uploadedFiles.length === 0 && <ImageUploader onImageUpload={handleFileUpload} isProcessing={isLoading} />}
          
          {uploadedFiles.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-700">Your Files ({uploadedFiles.length})</h2>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Try Other Files
                  </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 border border-slate-200 rounded-lg p-4 bg-slate-50">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="aspect-square flex flex-col items-center justify-center p-2 border border-slate-200 rounded-md bg-white shadow-sm overflow-hidden">
                    {file.type === 'image' && file.previewUrl ? (
                        <img src={file.previewUrl} alt={file.name} className="max-h-full max-w-full object-contain rounded" title={file.name} />
                    ) : (
                        <div className="text-center flex flex-col items-center justify-center w-full h-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.414a1 1 0 00-.293-.707l-4.414-4.414A1 1 0 0011.586 3H4zm3 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <p className="mt-2 text-xs font-semibold text-slate-700 w-full truncate" title={file.name}>{file.name}</p>
                        </div>
                    )}
                  </div>
                ))}
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

          {uploadedFiles.length === 0 && !isLoading && !error && !tableData && (
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
