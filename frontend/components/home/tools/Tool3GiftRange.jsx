import React, { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const Tool3GiftRange = () => {
  const [rows, setRows] = useState([
    {
      giftRange: "",
      gifts: 0,
    },
  ]);

  // ADD ROW
  const addRow = () => {
    setRows([
      ...rows,
      { giftRange: "", gifts: 0 },
    ]);
  };

  // DELETE ROW
  const deleteRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  // HANDLE CHANGE
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value === "" ? "" : Number(value);
    setRows(updated);
  };

  // COMPUTATIONS
  const computedRows = rows.map((row, index) => {
    const amount = Number(row.giftRange) || 0;
    const gifts = Number(row.gifts) || 0;
    
    // No. of Prospects = No. of Gifts * 5
    const prospects = gifts * 5;
    
    // Subtotal = Gift Range * No. of Gifts
    const subtotal = amount * gifts;
    
    return {
      ...row,
      prospects,
      subtotal,
    };
  });

  // Calculate cumulative totals
  const rowsWithCumulative = computedRows.map((row, index) => {
    // Cumulative Total = previous cumulative + current subtotal
    const cumulativeTotal = computedRows
      .slice(0, index + 1)
      .reduce((sum, r) => sum + (r.subtotal || 0), 0);
    
    return {
      ...row,
      cumulativeTotal,
    };
  });

  // TOTALS FOR FOOTER
  const totalGifts = rowsWithCumulative.reduce((sum, row) => sum + (Number(row.gifts) || 0), 0);
  const totalProspects = rowsWithCumulative.reduce((sum, row) => sum + (row.prospects || 0), 0);
  const totalSubtotal = rowsWithCumulative.reduce((sum, row) => sum + (row.subtotal || 0), 0);
  const totalCumulative = rowsWithCumulative.length > 0 
    ? rowsWithCumulative[rowsWithCumulative.length - 1].cumulativeTotal 
    : 0;

  // Format number with commas
  const formatNumber = (num) => {
    if (num === 0) return "0";
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-[#001033] mb-4">
        Tool 3: Gift Range Chart
      </h2>

      <section className="mb-2 ">
        <h3 className="font-medium">Objectives</h3>
        <ul className="text-sm list-disc pl-6 mb-6 space-y-1">
          <li>To have an estimated number of donors needed to strategically meet the organization’s funding needs</li>
          <li>To determine gift levels, the number of gifts needed per gift level, and the number of prospects the organization should seek as it implements its Fundraising activities</li>
        </ul>
      </section>

      {/* TABLE */}
      <div className="overflow-auto rounded-xl border">

        <table className="min-w-full text-sm text-left">
          
          {/* HEADER */}
          <thead className="bg-black text-white sticky top-0">
            <tr>
              <th className="px-3 py-2 text-xs">Gift Range (Amount)</th>
              <th className="px-3 py-2 text-xs">No. of Gifts</th>
              <th className="px-3 py-2 text-xs">No. of Prospects (Gifts ×5)</th>
              <th className="px-3 py-2 text-xs">Subtotal (Range × Gifts)</th>
              <th className="px-3 py-2 text-xs">Cumulative Total</th>
              <th className="px-3 py-2 text-xs text-center">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="bg-white">
            {rowsWithCumulative.map((row, index) => {
              return (
                <tr key={index} className="border-t">

                  {/* Gift Range (amount) */}
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.giftRange}
                      onChange={(e) =>
                        handleChange(index, "giftRange", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                      placeholder="100000"
                    />
                  </td>

                  {/* Gifts */}
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      value={row.gifts}
                      onChange={(e) =>
                        handleChange(index, "gifts", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>

                  {/* Prospects (calculated - read only) */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.prospects || 0}
                      readOnly
                      className="w-full border bg-gray-50 rounded px-2 py-1 text-gray-700"
                    />
                  </td>

                  {/* Subtotal (calculated - read only) */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={`₱ ${formatNumber(row.subtotal || 0)}`}
                      readOnly
                      className="w-full border bg-gray-50 rounded px-2 py-1 text-gray-700"
                    />
                  </td>

                  {/* Cumulative Total (calculated - read only) */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={`₱ ${formatNumber(row.cumulativeTotal || 0)}`}
                      readOnly
                      className="w-full border bg-gray-50 rounded px-2 py-1 text-gray-700"
                    />
                  </td>

                  {/* Delete */}
                  <td className="p-2 text-center">
                    <button
                      onClick={() => deleteRow(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
            
            {/* Add Row */}
            <tr>
              <td colSpan={6} className="p-3">
                <button
                  onClick={addRow}
                  className="flex items-center gap-2 text-[#22864D] text-xs font-medium hover:underline"
                >
                  <FiPlus />
                  Add Range
                </button>
              </td>
            </tr>
          </tbody>

          {/* FOOTER - TOTALS */}
          <tfoot className="bg-gray-100 font-bold">
            <tr>
              <td className="px-3 py-3">TOTAL</td>
              <td className="px-3 py-3 text-right">{totalGifts}</td>
              <td className="px-3 py-3 text-right">{totalProspects}</td>
              {/* <td className="px-3 py-3 text-right">₱ {formatNumber(totalSubtotal)}</td>
              <td className="px-3 py-3 text-right">₱ {formatNumber(totalCumulative)}</td> */}
              <td className="px-3 py-3 text-right">-</td>
              <td className="px-3 py-3 text-right">-</td>
            </tr>
          </tfoot>

        </table>
      </div>
    </>
  );
};

export default Tool3GiftRange;