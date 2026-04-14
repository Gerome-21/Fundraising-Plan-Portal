// Overview.jsx
import React, { useRef } from 'react';
import { useOverviewData } from '../../../hooks/useOverviewData';
import Tool1OverviewSection from '../../OverviewSections/Tool1OverviewSection';
import Tool2OverviewSection from '../../OverviewSections/Tool2OverviewSection';
import Tool3OverviewSection from '../../OverviewSections/Tool3OverviewSection';
import Tool4OverviewSection from '../../OverviewSections/Tool4OverviewSection';
import Tool5OverviewSection from '../../OverviewSections/Tool5OverviewSection';
import Tool6OverviewSection from '../../OverviewSections/Tool6OverviewSection';
import Tool7OverviewSection from '../../OverviewSections/Tool7OverviewSection';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import { useReactToPrint } from 'react-to-print';
import { useUser } from '../../../context/UserContext';


const Overview = () => {
  const { isLoading, tool1, tool2, tool3, tool4, tool5, tool6, tool7 } = useOverviewData();
  const { user} = useUser();
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Fundraising Plan Report',
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading overview...
      </div>
    );
  }

  return (
    <div className="bg-white text-[#001033] max-w-5xl mx-auto">

      {/* Print/Download Controls — excluded from PDF via @media print CSS */}
      <div className="flex justify-end gap-3 p-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
        >
          <FiPrinter size={15} /> Print
        </button>
        {/* PDF download: add html2canvas+jsPDF here later */}
        <button
          className="flex items-center gap-2 px-4 py-2 bg-[#22864D] text-white rounded-lg text-sm hover:bg-[#1a6b3c]"
        >
          <FiDownload size={15} /> Download PDF
        </button>
      </div>

      {/* ── Printable Area ── */}
      <div ref={printRef} className="p-8">

        {/* Header */}
        <div className="flex justify-between items-start pb-6 mb-6 border-b">
          <div>
            <h2 className="text-xl mt-2 font-bold">{user.organization_name}</h2>
            <p className="text-sm text-gray-600">Prepared by: {user.user_name}</p>
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
            <img src="/akubo.jpg" alt="Akubo Logo" className="w-12 h-12 object-contain rounded-full" />
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8 border-b border-dashed pb-6 text-center">
          <h2 className="font-semibold text-xl mb-2">Fundraising Plan Report</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            This report summarizes the organization's fundraising plan based on the completed
            planning tools. It highlights key strategies, financial projections, and
            organizational insights to support effective decision-making and implementation.
          </p>
        </div>

        {/* Tool Sections */}
        <Tool1OverviewSection
          swotData={tool1.swotData}
          chart={tool1.chart}
          chartData={tool1.chartData}
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
        <div className="text-center text-xs text-gray-400 mt-10 border-t pt-4">
           — End of Overview — 
        </div>
      </div>
    </div>
  );
};

export default Overview;