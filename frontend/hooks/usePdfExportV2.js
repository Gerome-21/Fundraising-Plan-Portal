// hooks/usePdfExportV2.js
import { useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export const usePdfExportV2 = () => {
  const [isExporting, setIsExporting] = useState(false);

  const downloadPdf = useCallback(async ({ contentRef, documentTitle }) => {
    if (!contentRef?.current || isExporting) return;
    setIsExporting(true);

    try {
      // 1. Capture the target DOM element as a PNG data URL.
      // The toPng function handles the complexities of DOM-to-image conversion.
      const dataUrl = await toPng(contentRef.current, {
        cacheBust: true, // Add a timestamp to the URL to avoid caching issues.
        quality: 1,      // Set the highest image quality.
      });

      // 2. Convert the data URL into an image object to get its dimensions.
      const img = await new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = dataUrl;
      });

      // 3. Set up jsPDF and calculate dimensions for multi-page support.
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (img.height * imgWidth) / img.width;

      let heightLeft = imgHeight;
      let position = 0;

      // 4. Add the first page and image.
      pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // 5. Add subsequent pages if the image is taller than one page.
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // 6. Save the final PDF.
      pdf.save(`${documentTitle || 'document'}.pdf`);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF generation failed. Please use the Print button instead.');
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  return { downloadPdf, isExporting };
};