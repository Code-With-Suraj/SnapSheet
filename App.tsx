
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { DataTable } from './components/DataTable';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { WelcomeMessage } from './components/WelcomeMessage';
import { processImageToTable } from './services/geminiService';
import type { TableData, ImageData } from './types';
import { DownloadButton } from './components/DownloadButton';

const App: React.FC = () => {
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = useCallback(async (imageData: ImageData) => {
    setIsLoading(true);
    setError(null);
    setTableData(null);
    setImagePreview(imageData.dataUrl);

    try {
      const result = await processImageToTable(imageData.base64, imageData.mimeType);
      if (result && result.length > 0) {
        setTableData(result);
      } else {
        setError("Couldn't find a table in the image. Please try another one.");
      }
    } catch (err) {
      console.error(err);
      setError('Failed to process the image. Please ensure the image is clear and contains a table.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setTableData(null);
    setError(null);
    setImagePreview(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-slate-200">
          {!imagePreview && <ImageUploader onImageUpload={handleImageUpload} isProcessing={isLoading} />}
          
          {imagePreview && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-slate-700">Your Image</h2>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Try Another Image
                  </button>
              </div>
              <img src={imagePreview} alt="Table preview" className="rounded-lg max-h-80 w-auto mx-auto border border-slate-200 p-1" />
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

          {!imagePreview && !isLoading && !error && !tableData && (
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
