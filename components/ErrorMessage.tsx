
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg my-4" role="alert">
    <div className="flex">
        <div className="py-1">
            <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M10 18a8 8 0 110-16 8 8 0 010 16zm-1-9a1 1 0 00-2 0v4a1 1 0 102 0v-4zm2-2a1 1 0 10-2 0v2a1 1 0 102 0V7z"/>
            </svg>
        </div>
        <div>
            <p className="font-bold text-red-800">An error occurred</p>
            <p className="text-sm text-red-700">{message}</p>
        </div>
    </div>
  </div>
);
