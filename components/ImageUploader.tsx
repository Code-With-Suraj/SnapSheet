
import React, { useCallback, useState, useRef } from 'react';
import type { FileData } from '../types';

interface ImageUploaderProps {
  onImageUpload: (filesData: FileData[]) => void;
  isProcessing: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove the mime type prefix: 'data:image/jpeg;base64,'
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};

const processFile = (file: File): Promise<FileData | null> => {
    return new Promise(async (resolve) => {
        try {
            const isImage = file.type.startsWith('image/');
            const isPdf = file.type === 'application/pdf';

            if (!isImage && !isPdf) {
                console.warn('Unsupported file type:', file.type);
                return resolve(null);
            }

            const base64 = await fileToBase64(file);

            if (isImage) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    resolve({
                        base64,
                        mimeType: file.type,
                        previewUrl: reader.result as string,
                        name: file.name,
                        type: 'image',
                    });
                };
                reader.onerror = () => resolve(null);
            } else { // isPdf
                resolve({
                    base64,
                    mimeType: file.type,
                    previewUrl: null,
                    name: file.name,
                    type: 'pdf',
                });
            }
        } catch (error) {
            console.error('Error processing file', error);
            resolve(null);
        }
    });
};


const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const filePromises = Array.from(files).map(processFile);
    
    const filesData = await Promise.all(filePromises);
    const validFilesData = filesData.filter((fd): fd is FileData => fd !== null);

    if (validFilesData.length > 0) {
        onImageUpload(validFilesData);
    }
    
  }, [onImageUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);
  
  const onButtonClick = () => {
      inputRef.current?.click();
  }

  return (
    <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${dragActive ? 'border-brand-primary bg-brand-light' : 'border-slate-300 bg-slate-50'}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleChange}
        disabled={isProcessing}
        multiple
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <UploadIcon/>
        <p className="text-lg font-semibold text-slate-700">
            <button onClick={onButtonClick} className="text-brand-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-brand-primary rounded">
                Click to upload
            </button>
             {' '}or drag and drop
        </p>
        <p className="text-sm text-slate-500">PNG, JPG, WEBP, or PDF files</p>
      </div>
    </div>
  );
};
