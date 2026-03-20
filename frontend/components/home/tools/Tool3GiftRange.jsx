import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import { useGiftRange } from "../../../hooks/Tool3/useGiftRange";
import { useUser } from "../../../context/UserContext";

const Tool3GiftRange = () => {
  const [rows, setRows] = useState([
    {
      giftRange: "",
      gifts: 0,
    },
  ]);
  const { user } = useUser();
  const { loadGiftRanges, saveGiftRanges, loading } = useGiftRange();
  const [isSaving, setIsSaving] = useState(false);


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

  // Calculate cumulative totals (running total)
  const rowsWithCumulative = computedRows.map((row, index) => {
    let runningTotal = 0;
    for (let i = 0; i <= index; i++) {
      runningTotal += computedRows[i].subtotal;
    }
    
    return {
      ...row,
      cumulativeTotal: runningTotal,
    };
  });

  // TOTALS FOR FOOTER
  const totalGifts = rowsWithCumulative.reduce((sum, row) => sum + (Number(row.gifts) || 0), 0);
  const totalProspects = rowsWithCumulative.reduce((sum, row) => sum + (row.prospects || 0), 0);
  const totalSubtotal = rowsWithCumulative.reduce((sum, row) => sum + (row.subtotal || 0), 0);
  const totalCumulative = rowsWithCumulative.reduce(
    (sum, row) => sum + (row.cumulativeTotal || 0),
    0
  );

  // Format number with commas
  const formatNumber = (num) => {
    if (num === 0 || !num) return "0";
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatCurrency = (num) => {
    return `₱ ${formatNumber(num)}`;
  };

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const loadData = async () => {
    const data = await loadGiftRanges();
    if (data.length > 0) {
      setRows(data);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#001033]">
          Tool 3: Gift Range Chart
        </h2>

        <button
          onClick={async () => {
            if (!user) {
              toast.error("Please login first");
              return;
            }

            setIsSaving(true);
            await saveGiftRanges(rows);
            setIsSaving(false);
          }}
          disabled={loading || isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-[#22864D] text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          <FiSave />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
      
      {/* TABLE */}
      <div className="overflow-auto rounded-xl border">

        <table className="min-w-full text-sm text-left">
          
          {/* HEADER */}
          <thead className="bg-black text-white sticky top-0">
            <tr>
              <th className="px-3 py-2 text-xs">Gift Range (Amount)</th>
              <th className="px-3 py-2 text-xs">No. of Gifts</th>
              <th className="px-3 py-2 text-xs">No. of Prospects <br/>(Gifts ×5)</th>
              <th className="px-3 py-2 text-xs">Subtotal <br/>(Range × Gifts)</th>
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
                      placeholder="Enter amount"
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
                      placeholder="0"
                    />
                  </td>

                  {/* Prospects (calculated - read only) */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.prospects || 0}
                      readOnly
                      className="w-full rounded px-2 py-1 bg-gray-50 text-gray-700"
                    />
                  </td>

                  {/* Subtotal (calculated - read only) */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={formatCurrency(row.subtotal || 0)}
                      readOnly
                      className="w-full rounded px-2 py-1 bg-gray-50 text-gray-700 text-right"
                    />
                  </td>

                  {/* Cumulative Total (calculated - read only) */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={formatCurrency(row.cumulativeTotal || 0)}
                      readOnly
                      className="w-full rounded px-2 py-1 bg-gray-50 text-gray-700 font-semibold text-right"
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
          <tfoot className="bg-gray-100 font-bold border-t-2 border-gray-300">
            <tr>
              <td className="px-3 py-3 text-sm">TOTAL</td>
              <td className="px-3 py-3 text-left">{totalGifts}</td>
              <td className="px-3 py-3 text-left">{totalProspects}</td>
              <td className="px-3 py-3 text-right">{formatCurrency(totalSubtotal)}</td>
              <td className="px-3 py-3 text-right">{formatCurrency(totalCumulative)}</td>
              <td className="px-3 py-3"></td>
            </tr>
          </tfoot>

        </table>
      </div>
    </>
  );
};

export default Tool3GiftRange;