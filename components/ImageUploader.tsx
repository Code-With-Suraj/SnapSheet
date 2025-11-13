
import React, { useCallback, useState, useRef } from 'react';
import type { FileData } from '../types';

interface ImageUploaderProps {
  onImageUpload: (fileData: FileData) => void;
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

const UploadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-brand-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';

    if (isImage || isPdf) {
        const base64 = await fileToBase64(file);
        
        if (isImage) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                 onImageUpload({
                    base64,
                    mimeType: file.type,
                    previewUrl: reader.result as string,
                    name: file.name,
                    type: 'image',
                });
            };
        } else { // isPdf
            onImageUpload({
                base64,
                mimeType: file.type,
                previewUrl: null,
                name: file.name,
                type: 'pdf',
            });
        }
    } else {
        console.warn('Unsupported file type:', file.type);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);
  
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
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <UploadIcon/>
        <p className="text-lg font-semibold text-slate-700">
            <button onClick={onButtonClick} className="text-brand-primary font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-brand-primary rounded">
                Click to upload
            </button>
             {' '}or drag and drop
        </p>
        <p className="text-sm text-slate-500">PNG, JPG, WEBP, or PDF</p>
      </div>
    </div>
  );
};
