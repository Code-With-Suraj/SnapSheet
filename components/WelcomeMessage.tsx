// Fix: Import React to resolve the 'Cannot find namespace JSX' error.
import React from 'react';

const Feature: React.FC<{ icon: JSX.Element; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-brand-light rounded-lg">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <p className="mt-1 text-slate-600">{children}</p>
        </div>
    </div>
);

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);
const MagicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c.252 0 .487.126.659.341l3.598 4.198c.394.46.394 1.144 0 1.604l-3.598 4.198c-.172.215-.407.341-.659.341V3.104z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 3.104v5.714a2.25 2.25 0 00.659 1.591l4.408 4.408c.39.39.39 1.024 0 1.414l-4.408 4.408a2.25 2.25 0 00-.659 1.591V18.5" />
    </svg>
);
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-brand-primary">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


export const WelcomeMessage: React.FC = () => {
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">How It Works</h2>
            <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
                Transform documents, reports, or any tabular data into an editable format in three simple steps.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
                <Feature icon={<UploadIcon />} title="1. Upload File">
                    Select or drag-and-drop an image or PDF of the table you want to convert.
                </Feature>
                <Feature icon={<MagicIcon />} title="2. AI Extraction">
                    Our powerful AI analyzes the file, recognizes the table structure, and extracts the data.
                </Feature>
                <Feature icon={<DownloadIcon />} title="3. Download CSV">
                    Review the extracted data and download it as a CSV file, ready to use in Excel, Google Sheets, or any spreadsheet software.
                </Feature>
            </div>
        </div>
    );
};