"use client";

import { useState } from "react";
import { Share2, Download, Copy, Twitter, Facebook, Linkedin, Mail } from "lucide-react";
import { shareWrappedCard, generateSocialShareUrls, copyWrappedCardAsText } from "@/lib/exportUtils";

interface ShareCardProps {
  cardData: any;
  cardId?: string;
  onExport?: () => void;
  className?: string;
}

export default function ShareCard({ cardData, cardId, onExport, className = "" }: ShareCardProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareUrl = cardId 
    ? `${window.location.origin}/wrapped/share/${cardId}`
    : window.location.href;

  const socialUrls = generateSocialShareUrls(cardData, shareUrl);

  const handleNativeShare = async () => {
    setIsSharing(true);
    try {
      await shareWrappedCard(cardData, cardId);
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await copyWrappedCardAsText(cardData);
      // You might want to show a toast notification here
      alert('Card content copied to clipboard!');
    } catch (error) {
      console.error('Copy failed:', error);
      alert('Failed to copy content');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Copy link failed:', error);
      alert('Failed to copy link');
    }
  };

  const openSocialShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <Share2 className="h-8 w-8 mx-auto mb-3 text-[#10A37F]" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Share Your Wrapped
        </h3>
        <p className="text-gray-600">
          Show off your AI journey with friends!
        </p>
      </div>

      <div className="space-y-4">
        {/* Native Share */}
        <button
          onClick={handleNativeShare}
          disabled={isSharing}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#10A37F] text-white rounded-lg hover:bg-[#0d8f72] transition-colors disabled:opacity-50"
        >
          <Share2 className="h-5 w-5" />
          <span>{isSharing ? 'Sharing...' : 'Share Wrapped'}</span>
        </button>

        {/* Social Media Options */}
        <div className="space-y-2">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="w-full text-left text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {showShareOptions ? '▼' : '▶'} More sharing options
          </button>
          
          {showShareOptions && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => openSocialShare(socialUrls.twitter)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                <span className="text-sm">Twitter</span>
              </button>
              
              <button
                onClick={() => openSocialShare(socialUrls.facebook)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Facebook</span>
              </button>
              
              <button
                onClick={() => openSocialShare(socialUrls.linkedin)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
                <span className="text-sm">LinkedIn</span>
              </button>
              
              <button
                onClick={() => openSocialShare(socialUrls.email)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="text-sm">Email</span>
              </button>
            </div>
          )}
        </div>

        {/* Copy Options */}
        <div className="flex space-x-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span className="text-sm">Copy Link</span>
          </button>
          
          <button
            onClick={handleCopyText}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy className="h-4 w-4" />
            <span className="text-sm">Copy Text</span>
          </button>
        </div>

        {/* Export Option */}
        {onExport && (
          <button
            onClick={onExport}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export as Image</span>
          </button>
        )}

        {/* Tips */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            💡 Sharing Tips
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Share individual cards or your complete wrapped</li>
            <li>• Export as image for Instagram Stories</li>
            <li>• Copy text format for quick social posts</li>
            <li>• Send the link to friends to view online</li>
          </ul>
        </div>
      </div>
    </div>
  );
}