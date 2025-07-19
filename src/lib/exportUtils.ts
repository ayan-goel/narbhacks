import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf';
  quality?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
}

export interface WrappedCardData {
  cardType: string;
  cardData: any;
  year: number;
  imageUrl?: string;
}

/**
 * Exports a DOM element as an image
 */
export async function exportElementAsImage(
  element: HTMLElement,
  options: ExportOptions = { format: 'png' }
): Promise<string> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: options.backgroundColor || '#1A1A1A',
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
      width: options.width,
      height: options.height,
    });

    return canvas.toDataURL(
      options.format === 'jpg' ? 'image/jpeg' : 'image/png',
      options.quality || 0.9
    );
  } catch (error) {
    throw new Error(`Failed to export image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Downloads an image data URL
 */
export function downloadImage(
  dataUrl: string,
  filename: string,
  format: 'png' | 'jpg' = 'png'
): void {
  const link = document.createElement('a');
  link.download = `${filename}.${format}`;
  link.href = dataUrl;
  link.click();
}

/**
 * Exports a wrapped card as an image
 */
export async function exportWrappedCardAsImage(
  cardElement: HTMLElement,
  cardData: WrappedCardData,
  options: Partial<ExportOptions> = {}
): Promise<string> {
  const defaultOptions: ExportOptions = {
    format: 'png',
    quality: 0.9,
    width: 400,
    height: 711, // 9:16 aspect ratio
    backgroundColor: '#1A1A1A',
    ...options,
  };

  const dataUrl = await exportElementAsImage(cardElement, defaultOptions);
  
  // Generate filename
  const filename = `chatgpt-wrapped-${cardData.year}-${cardData.cardType}`;
  downloadImage(dataUrl, filename, defaultOptions.format === 'jpg' ? 'jpg' : 'png');
  
  return dataUrl;
}

/**
 * Exports multiple wrapped cards as a PDF
 */
export async function exportWrappedAsPDF(
  cardElements: HTMLElement[],
  cardData: WrappedCardData[],
  options: { 
    title?: string;
    year?: number;
    orientation?: 'portrait' | 'landscape';
  } = {}
): Promise<void> {
  try {
    const { orientation = 'portrait', title = 'ChatGPT Wrapped', year = new Date().getFullYear() } = options;
    
    // Create PDF with appropriate dimensions
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Add title page
    pdf.setFontSize(24);
    pdf.text(title, pageWidth / 2, 40, { align: 'center' });
    pdf.setFontSize(18);
    pdf.text(`${year}`, pageWidth / 2, 60, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text('Generated with ChatGPT Wrapped', pageWidth / 2, pageHeight - 20, { align: 'center' });

    // Add each card as a page
    for (let i = 0; i < cardElements.length; i++) {
      pdf.addPage();
      
      const canvas = await html2canvas(cardElements[i], {
        backgroundColor: '#1A1A1A',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit the page while maintaining aspect ratio
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(
        (pageWidth - 20) / imgWidth,
        (pageHeight - 20) / imgHeight
      );

      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      const xOffset = (pageWidth - finalWidth) / 2;
      const yOffset = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      
      // Add card title at the bottom
      pdf.setFontSize(10);
      const cardTitle = `${cardData[i]?.cardType || 'Card'} ${i + 1}`;
      pdf.text(cardTitle, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Download the PDF
    const filename = `chatgpt-wrapped-${year}.pdf`;
    pdf.save(filename);
  } catch (error) {
    throw new Error(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Creates a shareable link for a wrapped card
 */
export function createShareableLink(
  cardId: string,
  baseUrl: string = window.location.origin
): string {
  return `${baseUrl}/wrapped/share/${cardId}`;
}

/**
 * Shares wrapped card using Web Share API or fallback
 */
export async function shareWrappedCard(
  cardData: WrappedCardData,
  cardId?: string,
  imageDataUrl?: string
): Promise<void> {
  const shareData = {
    title: `My ${cardData.year} ChatGPT Wrapped`,
    text: `Check out my ${cardData.year} ChatGPT Wrapped! 🤖✨`,
    url: cardId ? createShareableLink(cardId) : window.location.href,
  };

  try {
    // Try native Web Share API first
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      await navigator.share(shareData);
      return;
    }

    // Fallback: copy link to clipboard
    await navigator.clipboard.writeText(shareData.url);
    
    // Show notification (you might want to use a toast library here)
    alert('Link copied to clipboard!');
  } catch (error) {
    // Final fallback: show share dialog with pre-filled text
    const shareText = `${shareData.text}\n${shareData.url}`;
    
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Share text copied to clipboard!');
      } catch {
        prompt('Copy this text to share:', shareText);
      }
    } else {
      prompt('Copy this text to share:', shareText);
    }
  }
}

/**
 * Generates social media specific share URLs
 */
export function generateSocialShareUrls(
  cardData: WrappedCardData,
  shareUrl: string
): Record<string, string> {
  const text = encodeURIComponent(`Check out my ${cardData.year} ChatGPT Wrapped! 🤖✨`);
  const url = encodeURIComponent(shareUrl);

  return {
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    reddit: `https://reddit.com/submit?title=${text}&url=${url}`,
    email: `mailto:?subject=${encodeURIComponent(`My ${cardData.year} ChatGPT Wrapped`)}&body=${text}%20${url}`,
  };
}

/**
 * Exports wrapped data as JSON
 */
export function exportWrappedDataAsJSON(
  wrappedData: WrappedCardData[],
  userStats: any,
  filename?: string
): void {
  const exportData = {
    exportDate: new Date().toISOString(),
    year: wrappedData[0]?.year || new Date().getFullYear(),
    userStats,
    cards: wrappedData,
    metadata: {
      totalCards: wrappedData.length,
      cardTypes: [...new Set(wrappedData.map(card => card.cardType))],
      version: '1.0',
    },
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename || `chatgpt-wrapped-${exportData.year}-data.json`;
  link.click();
  
  URL.revokeObjectURL(link.href);
}

/**
 * Exports statistics as CSV
 */
export function exportStatsAsCSV(
  userStats: any,
  filename?: string
): void {
  const csvData = [
    ['Metric', 'Value'],
    ['Total Conversations', userStats.totalConversations],
    ['Total Messages', userStats.totalMessages],
    ['Total Tokens', userStats.totalTokens],
    ['Average Conversation Length', userStats.averageConversationLength?.toFixed(2)],
    ['Most Active Month', userStats.mostActiveMonth],
    ['Favorite Time of Day', userStats.favoriteTimeOfDay],
    ['Positive Sentiment', userStats.sentimentBreakdown?.positive || 0],
    ['Negative Sentiment', userStats.sentimentBreakdown?.negative || 0],
    ['Neutral Sentiment', userStats.sentimentBreakdown?.neutral || 0],
    ['Top Topics', userStats.topTopics?.join('; ') || ''],
  ];

  const csvContent = csvData
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  link.href = URL.createObjectURL(blob);
  link.download = filename || `chatgpt-wrapped-${userStats.year || 'stats'}.csv`;
  link.click();
  
  URL.revokeObjectURL(link.href);
}

/**
 * Copies wrapped card data to clipboard as text
 */
export async function copyWrappedCardAsText(cardData: WrappedCardData): Promise<void> {
  let text = `🤖 My ${cardData.year} ChatGPT Wrapped - ${cardData.cardType.toUpperCase()} 🤖\n\n`;

  switch (cardData.cardType) {
    case 'stats':
      text += `📊 STATISTICS:\n`;
      text += `• Conversations: ${cardData.cardData.totalConversations?.toLocaleString()}\n`;
      text += `• Messages: ${cardData.cardData.totalMessages?.toLocaleString()}\n`;
      text += `• Average length: ${Math.round(cardData.cardData.averageConversationLength || 0)} messages\n`;
      text += `• Most active: ${cardData.cardData.mostActiveMonth}\n`;
      text += `• Favorite time: ${cardData.cardData.favoriteTimeOfDay}\n`;
      break;

    case 'topics':
      text += `🧠 TOP TOPICS:\n`;
      cardData.cardData.topTopics?.slice(0, 5).forEach((topic: string, i: number) => {
        text += `${i + 1}. ${topic}\n`;
      });
      break;

    case 'insights':
      text += `💡 INSIGHTS:\n`;
      text += `• Personality: ${cardData.cardData.personality}\n`;
      text += `• ${cardData.cardData.yearInReview}\n`;
      break;

    default:
      text += JSON.stringify(cardData.cardData, null, 2);
  }

  text += `\n✨ Generated with ChatGPT Wrapped`;

  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    throw new Error('Failed to copy to clipboard');
  }
}

/**
 * Batch export all wrapped cards as images
 */
export async function batchExportWrappedCards(
  cardElements: HTMLElement[],
  cardData: WrappedCardData[],
  options: Partial<ExportOptions> = {}
): Promise<string[]> {
  const imageUrls: string[] = [];
  
  for (let i = 0; i < cardElements.length; i++) {
    try {
      const dataUrl = await exportWrappedCardAsImage(
        cardElements[i],
        cardData[i],
        options
      );
      imageUrls.push(dataUrl);
    } catch (error) {
      console.error(`Failed to export card ${i}:`, error);
      imageUrls.push('');
    }
  }
  
  return imageUrls;
}