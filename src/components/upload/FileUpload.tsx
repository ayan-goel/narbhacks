"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export default function FileUpload({ onFileSelect, isUploading = false }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      setError("Please upload a valid JSON file from your ChatGPT export.");
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Basic validation
      if (!file.name.toLowerCase().endsWith('.json')) {
        setError("Please upload a JSON file.");
        return;
      }

      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError("File too large. Please upload a file smaller than 100MB.");
        return;
      }

      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    multiple: false,
    disabled: isUploading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-[#10A37F] bg-[#10A37F]/5' 
            : 'border-gray-300 hover:border-[#10A37F] hover:bg-gray-50'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10A37F]"></div>
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {isUploading ? "Uploading..." : "Upload your ChatGPT data"}
            </h3>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? "Drop your conversations.json file here"
                : "Drag and drop your conversations.json file, or click to browse"
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <FileText className="h-4 w-4" />
            <span>JSON files up to 100MB</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>
          <strong>How to get your ChatGPT data:</strong> Go to ChatGPT Settings → Data controls → Export data → Download your conversations.json file.
        </p>
      </div>
    </div>
  );
}