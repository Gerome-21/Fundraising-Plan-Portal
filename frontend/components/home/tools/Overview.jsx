// Overview.jsx - Updated print configuration
import React, { useRef, useState, useCallback } from 'react';
import { useOverviewData } from '../../../hooks/useOverviewData';
import Tool1OverviewSection from '../../OverviewSections/Tool1OverviewSection';
import Tool2OverviewSection from '../../OverviewSections/Tool2OverviewSection';
import Tool3OverviewSection from '../../OverviewSections/Tool3OverviewSection';
import Tool4OverviewSection from '../../OverviewSections/Tool4OverviewSection';
import Tool5OverviewSection from '../../OverviewSections/Tool5OverviewSection';
import Tool6OverviewSection from '../../OverviewSections/Tool6OverviewSection';
import Tool7OverviewSection from '../../OverviewSections/Tool7OverviewSection';
import { FiPrinter, FiDownload, FiLoader } from 'react-icons/fi';
import { useReactToPrint } from 'react-to-print';
import { useUser } from '../../../context/UserContext';
import { usePdfExport } from '../../../hooks/usePdfExport';

const Overview = () => {
  const { isLoading, tool1, tool2, tool3, tool4, tool5, tool6, tool7 } = useOverviewData();
  const { user } = useUser();

  // ── Refs ────────────────────────────────────────────────────────────
  const printRef = useRef();   // wraps entire printable content
  const flowRef  = useRef();   // wraps the ReactFlow container in Tool1

  // ── PDF mode state ──────────────────────────────────────────────────
  const [isPdfMode,    setIsPdfMode]    = useState(false);
  const [flowSnapshot, setFlowSnapshot] = useState(null);

  // ── Print (browser native) ──────────────────────────────────────────
  // FIX: Use the correct API for react-to-print v5+
  const handlePrint = useReactToPrint({
    contentRef: printRef,  // Pass the ref directly instead of using content function
    documentTitle: 'Fundraising Plan Report',
    pageStyle: `
      @page { size: A4 portrait; margin: 3mm; }
      @media print {
        .print-hidden { display: none !important; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    `,
  });

  // ── PDF download ────────────────────────────────────────────────────
  const { downloadPdf, isExporting } = usePdfExport();

  const handleDownloadPdf = useCallback(() => {
    downloadPdf({
      contentRef: printRef,
      flowRef,
      onBeforeCapture: (snapshot) => {
        setFlowSnapshot(snapshot);
        setIsPdfMode(true);
      },
      onAfterCapture: () => {
        setIsPdfMode(false);
        setFlowSnapshot(null);
      },
    });
  }, [downloadPdf]);

  // ── Loading state ───────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
        <FiLoader className="w-6 h-6 animate-spin" />
        <p className="text-sm">Loading overview…</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#001033] max-w-5xl mx-auto">

      {/* ── Action bar (excluded from print/PDF via print-hidden) ─────── */}
      <div className="print-hidden flex justify-end items-center gap-3 px-6 pt-5 pb-2">

        {isExporting && (
          <span className="text-xs text-gray-400 flex items-center gap-1.5 animate-pulse">
            <FiLoader className="animate-spin w-3.5 h-3.5" />
            Generating PDF…
          </span>
        )}

        {/* Print button */}
        <button
          onClick={handlePrint}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-all"
        >
          <FiPrinter size={15} />
          Print
        </button>

        {/* Download PDF button */}
        <button
          onClick={handleDownloadPdf}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 bg-[#22864D] text-white rounded-lg text-sm hover:bg-[#1a6b3c] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FiDownload size={15} />
          {isExporting ? 'Exporting…' : 'Download PDF'}
        </button>
      </div>

      {/* ── Printable / capturable area ──────────────────────────────── */}
      <div ref={printRef} className="p-8">

        {/* Header */}
        <div className="flex justify-between items-start pb-6 mb-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">{user?.organization_name || 'Organization Name'}</h2>
            <p className="text-sm text-gray-600">{user?.user_name || 'User Name'}</p>
            <p className="text-xs text-gray-500">
              Date Generated: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-start gap-3 text-right">
            <div>
              <h2 className="text-base font-bold text-[#22864D]">Akubo Software, Inc.</h2>
              <p className="text-xs font-semibold text-gray-700">Fundraising Plan Portal</p>
              <p className="text-xs text-gray-500">https://www.akubo.com</p>
            </div>
            <img src="/akubo.jpg" alt="Akubo Logo"
              className="w-12 h-12 object-contain rounded-full" />
          </div>
        </div>

        {/* Executive summary */}
        <div className="mb-8 border-b border-dashed pb-6 text-center">
          <h2 className="font-semibold text-xl mb-2">Fundraising Plan Report</h2>
          <p className="text-sm text-gray-700 leading-relaxed max-w-2xl mx-auto">
            This report summarizes the organization's fundraising plan based on the completed
            planning tools. It highlights key strategies, financial projections, and
            organizational insights to support effective decision-making and implementation.
          </p>
        </div>

        {/* ── Tool sections ─────────────────────────────────────────── */}
        <Tool1OverviewSection
          swotData={tool1.swotData}
          chart={tool1.chart}
          chartData={tool1.chartData}
          isPdfMode={isPdfMode}
          flowSnapshot={flowSnapshot}
          flowRef={flowRef}
        />

        <Tool2OverviewSection
          requirements={tool2.requirements}
          committedFunds={tool2.committedFunds}
          years={tool2.years}
          requirementTotals={tool2.requirementTotals}
          committedTotals={tool2.committedTotals}
          gaps={tool2.gaps}
        />

        <Tool3OverviewSection
          rows={tool3.rows}
          totals={tool3.totals}
        />

        <Tool4OverviewSection
          donors={tool4.donors}
          donorMatrix={tool4.donorMatrix}
          stats={tool4.stats}
        />

        <Tool5OverviewSection
          rawData={tool5.rawData}
          summary={tool5.summary}
          grandTotal={tool5.grandTotal}
        />

        <Tool6OverviewSection
          programs={tool6.programs}
          totals={tool6.totals}
          fundingNotes={tool6.fundingNotes}
        />

        <Tool7OverviewSection
          formData={tool7.formData}
          fields={tool7.fields}
        />

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-10 pt-4 border-t">
          End of Fundraising Plan Report — Akubo Software Philippines, Inc.
        </div>
      </div>
    </div>
  );
};

export default Overview;