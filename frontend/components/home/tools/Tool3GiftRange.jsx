import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import { useGiftRange } from "../../../hooks/Tool3/useGiftRange";
import { useUser } from "../../../context/UserContext";
import toast from "react-hot-toast";
import SkeletonLoader from "../../Tool3Components/SkeletonLoader";

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
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);



  // ADD ROW
  const addRow = () => {
    setRows([
      ...rows,
      { giftRange: "", gifts: 0 },
    ]);
  };

  // DELETE ROW
  const deleteRow = (index) => {
    const row = rows[index];
    
    // Mark the row for deletion visually
    setDeletingIndex(index);
    
    // If it's an existing row (has an id), mark it for pending deletion
    if (row.id) {
      setPendingDeleteIds(prev => [...prev, row.id]);
      // Show message that it will be deleted on save
      toast.success('Row marked for deletion. Click Save to confirm.');
    } else {
      // If it's a new unsaved row, remove immediately
      const updated = rows.filter((_, i) => i !== index);
      setRows(updated);
      toast.success('Row removed');
    }
    
    // Clear deleting state
    setTimeout(() => {
      setDeletingIndex(null);
    }, 300);
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
    setInitialLoading(true);

    const data = await loadGiftRanges();

    if (data.length > 0) {
      setRows(data);
    } else {
      setRows([{ giftRange: "", gifts: 0 }]);
    }

    setPendingDeleteIds([]);
    setInitialLoading(false);
  };

  if (initialLoading) {
      return (
        <>
          <SkeletonLoader/>
        </>
      );
    }

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

            const activeRows = rows.filter(row => !pendingDeleteIds.includes(row.id));
            const hasValidRows = activeRows.some(row => row.giftRange && row.giftRange !== '');
            if (!hasValidRows) {
              toast.error('Please add at least one gift range');
              return;
            }

            setIsSaving(true);
            const success = await saveGiftRanges(activeRows);
            if (success) {
              setPendingDeleteIds([]);
              setRows(activeRows);
              toast.success('Successfully saved!');
            }
            setIsSaving(false);
          }}
          disabled={loading || isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-[#22864D] text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          <FiSave />
          {isSaving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
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
              <th className="px-3 py-2 text-xs">No. of Prospects <br/>(Gifts ×5)</th>
              <th className="px-3 py-2 text-xs">Subtotal <br/>(Range × Gifts)</th>
              <th className="px-3 py-2 text-xs">Cumulative Total</th>
              <th className="px-3 py-2 text-xs text-center">Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="bg-white">
            {rowsWithCumulative.map((row, index) => {
            const isPendingDelete = row.id && pendingDeleteIds.includes(row.id);
            
            return (
              <tr 
                key={index} 
                className={`border-t transition-colors duration-300 
                  ${deletingIndex === index ? 'bg-red-200' : ''}
                  ${isPendingDelete ? 'bg-red-100 line-through text-gray-500' : 'hover:bg-gray-50'}
                `}
              >
                {/* Gift Range (amount) */}
                <td className="p-2">
                  <input
                    type="number"
                    value={row.giftRange}
                    onChange={(e) =>
                      handleChange(index, "giftRange", e.target.value)
                    }
                    className={`w-full border rounded px-2 py-1 ${
                      isPendingDelete ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder="Enter amount"
                    disabled={isPendingDelete || loading || isSaving}
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
                    className={`w-full border rounded px-2 py-1 ${
                      isPendingDelete ? 'bg-gray-100 text-gray-500' : ''
                    }`}
                    placeholder="0"
                    disabled={isPendingDelete || loading || isSaving}
                  />
                </td>

                {/* Prospects (calculated - read only) */}
                <td className="p-2">
                  <input
                    type="text"
                    value={row.prospects || 0}
                    readOnly
                    className={`w-full rounded px-2 py-1 ${
                      isPendingDelete ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-700'
                    }`}
                  />
                </td>

                {/* Subtotal (calculated - read only) */}
                <td className="p-2">
                  <input
                    type="text"
                    value={formatCurrency(row.subtotal || 0)}
                    readOnly
                    className={`w-full rounded px-2 py-1 text-right ${
                      isPendingDelete ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-700'
                    }`}
                  />
                </td>

                {/* Cumulative Total (calculated - read only) */}
                <td className="p-2">
                  <input
                    type="text"
                    value={formatCurrency(row.cumulativeTotal || 0)}
                    readOnly
                    className={`w-full rounded px-2 py-1 font-semibold text-right ${
                      isPendingDelete ? 'bg-gray-100 text-gray-500' : 'bg-gray-50 text-gray-700'
                    }`}
                  />
                </td>

                {/* Delete */}
                <td className="p-2 text-center">
                  <button
                    onClick={() => deleteRow(index)}
                    className={`${
                      isPendingDelete 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-red-500 hover:text-red-700'
                    }`}
                    disabled={loading || isSaving || isPendingDelete}
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