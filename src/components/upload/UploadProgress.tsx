"use client";

import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface UploadProgressProps {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
  error?: string;
}

export default function UploadProgress({ 
  progress, 
  status, 
  message = "Processing your ChatGPT data...",
  error 
}: UploadProgressProps) {
  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'uploading':
      case 'processing':
        return <Loader2 className="h-6 w-6 text-[#10A37F] animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'uploading':
      case 'processing':
        return 'text-[#10A37F]';
      default:
        return 'text-gray-700';
    }
  };

  const getProgressBarColor = () => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-[#10A37F]';
    }
  };

  if (status === 'idle') return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          {getStatusIcon()}
          <div className="flex-1">
            <h3 className={`font-medium ${getStatusColor()}`}>
              {status === 'uploading' && 'Uploading file...'}
              {status === 'processing' && 'Processing data...'}
              {status === 'success' && 'Upload complete!'}
              {status === 'error' && 'Upload failed'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {error || message}
            </p>
          </div>
        </div>

        {(status === 'uploading' || status === 'processing') && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="mt-4 text-xs text-gray-500">
            <p>This may take a few minutes for large conversation histories...</p>
          </div>
        )}
      </div>
    </div>
  );
}