import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import { useGiftRange } from "../../../hooks/useGiftRange";
import { useUser } from "../../../context/UserContext";
import toast from "react-hot-toast";
import GiftRangeSkeleton from "../../Tool3Components/GiftRangeSkeleton";

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
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [originalData, setOriginalData] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
    
    // Visual feedback for deletion
    setDeletingIndex(index);
    
    // Remove the row immediately
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    
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

  // Deep comparison function to check if data has changed
  const hasDataChanged = (currentData, originalData) => {
    if (!originalData || originalData.length === 0) {
      // If original is empty but current has data, that's a change
      return currentData.length > 0;
    }
    return JSON.stringify(currentData) !== JSON.stringify(originalData);
  };

  // Handle save all data
  const handleSaveAll = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    const hasValidRows = rows.some(row => row.giftRange && row.giftRange !== '');
    if (!hasValidRows) {
      toast.error('Please add at least one gift range');
      return;
    }

    setIsSaving(true);
    const success = await saveGiftRanges(rows);
    if (success) {
      setRows(rows);
      setOriginalData(JSON.parse(JSON.stringify(rows))); // Update original data after save
      setHasUnsavedChanges(false); // Clear unsaved changes
      toast.success('Successfully saved!');
    }
    setIsSaving(false);
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

  useEffect(() => {
    if (isInitialized && !initialLoading) {
      const changed = hasDataChanged(rows, originalData);
      setHasUnsavedChanges(changed);
    }
  }, [rows, originalData, isInitialized, initialLoading]);

  const loadData = async () => {
    setInitialLoading(true);

    const data = await loadGiftRanges();

    let newRows;
    if (data.length > 0) {
      newRows = data;
    } else {
      newRows = [{ giftRange: "", gifts: 0 }];
    }
    
    setRows(newRows);
    setOriginalData(JSON.parse(JSON.stringify(newRows))); // Deep copy for comparison
    setInitialLoading(false);
    setIsInitialized(true);
    setHasUnsavedChanges(false);
  };

  // Determine button classes based on state
  const isButtonInactive = loading || isSaving || !hasUnsavedChanges;
  
  const buttonClasses = isButtonInactive
    ? 'w-10 h-10 rounded-full bg-gray-300 text-gray-500 cursor-not-allowed flex items-center justify-center transition-all duration-600'
    : 'flex items-center gap-2 px-4 py-2 rounded-full bg-[#22864D] text-white hover:bg-green-700 transition-all duration-600';

  if (initialLoading) {
    return (
      <>
        <GiftRangeSkeleton/>
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
          onClick={handleSaveAll}
          disabled={isButtonInactive}
          className={buttonClasses}
          title={isButtonInactive ? "No changes to save" : "Save changes"}
        >
          <FiSave className={isButtonInactive ? 'w-4 h-4' : ''} />
          {!isButtonInactive && (isSaving ? "Saving..." : "Save Changes")}
        </button>
      </div>
      <section className="mb-6 ">
        <h3 className="font-semibold mb-2">Objectives</h3>
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
              return (
                <tr 
                  key={index} 
                  className="border-t transition-colors duration-300 hover:bg-gray-50"
                >
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
                      disabled={loading || isSaving}
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
                      disabled={loading || isSaving}
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
                      className="w-full rounded px-2 py-1 text-right bg-gray-50 text-gray-700"
                    />
                  </td>

                  {/* Cumulative Total (calculated - read only) */}
                  <td className="p-2">
                    <input
                      type="text"
                      value={formatCurrency(row.cumulativeTotal || 0)}
                      readOnly
                      className="w-full rounded px-2 py-1 font-semibold text-right bg-gray-50 text-gray-700"
                    />
                  </td>

                  {/* Delete */}
                  <td className="p-2 text-center">
                    <button
                      onClick={() => deleteRow(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={loading || isSaving}
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
      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && !isSaving && !loading && (
        <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
            <p className="text-sm text-yellow-800">
              You have unsaved changes. Click "Save Changes" to save.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Tool3GiftRange;