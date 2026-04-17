// components/OverviewSections/Tool3OverviewSection.jsx
import React from 'react';

const fmt = (num) =>
  num === 0 || !num ? '0' : num.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });

const fmtCurrency = (num) => `₱ ${fmt(num)}`;

const Tool3OverviewSection = ({ rows, totals }) => {
  if (!rows || rows.length === 0) {
    return (
      <section className="mb-14">
        <h3 className="font-semibold text-lg mb-4 border-b pb-2">
          Tool 3 — Gift Range Chart
        </h3>
        <p className="text-sm text-gray-400 italic">No gift range data entered yet.</p>
      </section>
    );
  }

  return (
    <section className="mb-14">
      <h3 className="font-semibold text-lg mb-4 border-b pb-2">
        Tool 3 — Gift Range Chart
      </h3>
      <section className="mb-6 ">
        <h3 className="font-semibold mb-2">Objectives</h3>
        <ul className="text-sm list-disc pl-6 mb-6 space-y-1">
          <li>To have an estimated number of donors needed to strategically meet the organization’s funding needs</li>
          <li>To determine gift levels, the number of gifts needed per gift level, and the number of prospects the organization should seek as it implements its Fundraising activities</li>
        </ul>
      </section>

      <div className="border text-xs">
        <table className="min-w-full">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3 text-left">Gift Range (Amount)</th>
              <th className="px-4 py-3 text-right">No. of Gifts</th>
              <th className="px-4 py-3 text-right">No. of Prospects (×5)</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
              <th className="px-4 py-3 text-right">Cumulative Total</th>
            </tr>
          </thead>

          <tbody className="bg-white">
            {rows.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{fmtCurrency(row.giftRange || 0)}</td>
                <td className="px-4 py-2 text-right">{Number(row.gifts) || 0}</td>
                <td className="px-4 py-2 text-right">{row.prospects || 0}</td>
                <td className="px-4 py-2 text-right">{fmtCurrency(row.subtotal || 0)}</td>
                <td className="px-4 py-2 text-right font-semibold">{fmtCurrency(row.cumulativeTotal || 0)}</td>
              </tr>
            ))}
          </tbody>

          <tfoot className="bg-gray-100 font-bold border-t-2 border-gray-300">
            <tr>
              <td className="px-4 py-3">TOTAL</td>
              <td className="px-4 py-3 text-right">{totals.gifts}</td>
              <td className="px-4 py-3 text-right">{totals.prospects}</td>
              <td className="px-4 py-3 text-right">{fmtCurrency(totals.subtotal)}</td>
              <td className="px-4 py-3 text-right">{fmtCurrency(totals.cumulative)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};

export default Tool3OverviewSection;