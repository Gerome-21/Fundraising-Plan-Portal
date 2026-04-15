// hooks/usePdfExport.js
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Color properties that may contain oklch values
const COLOR_PROPS = [
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'outlineColor',
  'textDecorationColor',
  'fill',
  'stroke',
  'boxShadow',
];

// Walk every element in the clone and stamp resolved rgb() values
// from the live document — browser always resolves oklch → rgb in getComputedStyle
const resolveOklchColors = (liveRoot, clonedRoot) => {
  const liveEls   = liveRoot.querySelectorAll('*');
  const clonedEls = clonedRoot.querySelectorAll('*');

  liveEls.forEach((liveEl, i) => {
    const clonedEl = clonedEls[i];
    if (!clonedEl) return;

    const computed = window.getComputedStyle(liveEl);

    COLOR_PROPS.forEach(prop => {
      try {
        const val = computed[prop];
        // Skip empty / fully transparent values
        if (!val || val === 'rgba(0, 0, 0, 0)' || val === 'transparent') return;
        clonedEl.style[prop] = val;
      } catch (_) {
        // Some pseudo-elements will throw — safe to ignore
      }
    });
  });
};

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  // ── Capture a DOM node to canvas ──────────────────────────────────
  const captureElement = (element, liveRoot, extraOptions = {}) =>
    html2canvas(element, {
      scale:        2,
      useCORS:      true,
      logging:      false,
      backgroundColor: '#ffffff',
      height:       element.scrollHeight,
      windowHeight: element.scrollHeight,
      scrollY:      0,
      // onclone fires before html2canvas parses styles —
      // we stamp resolved rgb values so oklch is never seen by the parser
      onclone: (clonedDoc, clonedElement) => {
        resolveOklchColors(liveRoot, clonedElement);
      },
      ...extraOptions,
    });

  // ── Slice one tall canvas into A4 pages ───────────────────────────
  const appendCanvasToPdf = (canvas, pdf) => {
    const PDF_W       = 210;  // A4 mm
    const PDF_H       = 297;
    const mmPerPx     = PDF_W / canvas.width;
    const pageHeightPx = Math.floor(PDF_H / mmPerPx);

    let yPos = 0;
    let page = 0;

    while (yPos < canvas.height) {
      if (page > 0) pdf.addPage();

      const sliceH = Math.min(pageHeightPx, canvas.height - yPos);

      const slice = document.createElement('canvas');
      slice.width  = canvas.width;
      slice.height = sliceH;

      const ctx = slice.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(
        canvas,
        0, yPos, canvas.width, sliceH,   // source rect
        0, 0,    canvas.width, sliceH    // dest rect
      );

      pdf.addImage(
        slice.toDataURL('image/png'),
        'PNG',
        0, 0,
        PDF_W,
        sliceH * mmPerPx
      );

      yPos += sliceH;
      page++;
    }
  };

  // ── Main export ────────────────────────────────────────────────────
  const downloadPdf = async ({
    contentRef,
    flowRef,
    onBeforeCapture,
    onAfterCapture,
  }) => {
    if (!contentRef?.current || isExporting) return;
    setIsExporting(true);

    try {
      // Step 1 — Snapshot the ReactFlow canvas while it's still live
      let flowSnapshot = null;
      if (flowRef?.current) {
        const flowCanvas = await captureElement(
          flowRef.current,
          flowRef.current,   // liveRoot = itself for the sub-capture
          {
            backgroundColor: '#f9fafb',
            height:       flowRef.current.offsetHeight,
            windowHeight: flowRef.current.offsetHeight,
          }
        );
        flowSnapshot = flowCanvas.toDataURL('image/png');
      }

      // Step 2 — Swap ReactFlow for the static snapshot
      onBeforeCapture(flowSnapshot);
      await new Promise(r => setTimeout(r, 250)); // wait for re-render

      // Step 3 — Capture the full printable area
      // Pass contentRef.current as the liveRoot so resolveOklchColors
      // can read computed styles from the live DOM before the clone is captured
      const canvas = await captureElement(
        contentRef.current,
        contentRef.current
      );

      // Step 4 — Build and download the PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      appendCanvasToPdf(canvas, pdf);
      pdf.save('fundraising-plan-report.pdf');

    } catch (err) {
      console.error('PDF export failed:', err);
      alert(
        'PDF generation failed.\n\n' +
        'Please use the Print button instead and choose "Save as PDF" from the print dialog.'
      );
    } finally {
      onAfterCapture();
      setIsExporting(false);
    }
  };

  return { downloadPdf, isExporting };
};