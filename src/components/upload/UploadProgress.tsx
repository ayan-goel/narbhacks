"use client";

import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface UploadProgressProps {
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
  message?: string;
  error?: string;
  estimatedTime?: string; // Add estimated time prop
}

export default function UploadProgress({ 
  progress, 
  status, 
  message = "Processing your ChatGPT data...",
  error,
  estimatedTime = "2 minutes"
}: UploadProgressProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Initialize countdown when processing starts
  useEffect(() => {
    if (status === 'processing' && estimatedTime) {
      // Parse estimated time (e.g., "2 minutes" -> 120 seconds)
      const minutes = parseInt(estimatedTime.match(/\d+/)?.[0] || "2");
      setTimeLeft(minutes * 60); // Use the full estimate since it's already realistic
    }
  }, [status, estimatedTime]);

  // Countdown timer
  useEffect(() => {
    if (status === 'processing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

        {/* Show progress bar for uploading */}
        {status === 'uploading' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 bg-[#10A37F] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Show countdown timer for processing */}
        {status === 'processing' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-gray-600">estimated time left</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}