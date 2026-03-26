import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiSave, FiMessageSquare } from "react-icons/fi";
import toast from 'react-hot-toast';
import { useProgramNeeds } from "../../../hooks/useProgramNeeds";
import { useUser } from "../../../context/UserContext";
import ProgramNeedsSkeleton from "../../Tool2Components/ProgramNeedsSkeleton";
import CommentModal from "../../Tool2Components/CommentModal";

const years = ["2026", "2027", "2028", "2029", "2030"];

const Tool2ProgramNeeds = () => {
  const { user } = useUser();
  const { 
    loading, 
    initialLoading, 
    saveAllProgramNeeds, 
    loadProgramNeeds,
    deleteRequirement 
  } = useProgramNeeds();

  const [deletedRequirementIds, setDeletedRequirementIds] = useState([]);
  const [pendingDeleteRequirements, setPendingDeleteRequirements] = useState([]);
  
  const [requirements, setRequirements] = useState([
    { id: null, name: "Program 1", budgets: {}, comments: "" }
  ]);

  const [committedFunds, setCommittedFunds] = useState([
    { id: null, name: "Grants?", budgets: {}, comments: "" },
    { id: null, name: "Interest Income?", budgets: {}, comments: "" },
    { id: null, name: "Consultancy Contracts?", budgets: {}, comments: "" },
    { id: null, name: "Conference/Membership Fees/Sponsorship?", budgets: {}, comments: "" }
  ]);

  const [commentModalState, setCommentModalState] = useState({
    isOpen: false,
    targetType: null, // 'requirement' or 'committed'
    index: null,
    comment: '',
    position: { top: 0, left: 0 }
  });

  // Open comment modal 
 const openCommentModal = (type, index, event) => {
  const buttonRect = event.currentTarget.getBoundingClientRect();
  setCommentModalState({
    isOpen: true,
    targetType: type,
    index: index,
    comment: (type === 'requirement' ? requirements[index] : committedFunds[index])?.comments || '',
    position: {
      top: buttonRect.top + window.scrollY,
      left: buttonRect.left + window.scrollX
    }
  });
};
  // Update comment in local state (no database save yet)
  const updateComment = (newComment) => {
    if (commentModalState.targetType === 'requirement') {
      const updated = [...requirements];
      updated[commentModalState.index].comments = newComment;
      setRequirements(updated);
    } else if (commentModalState.targetType === 'committed') {
      const updated = [...committedFunds];
      updated[commentModalState.index].comments = newComment;
      setCommittedFunds(updated);
    }
  };

  // Close comment modal
  const closeCommentModal = () => {
    setCommentModalState({
      isOpen: false,
      targetType: null,
      index: null,
      comment: '',
      position: { top: 0, left: 0 }
    });
  };

  const [isSaving, setIsSaving] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);

  // Load data when component mounts and user is available
  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  const loadUserData = async () => {
    const data = await loadProgramNeeds();
    if (data.requirements.length > 0) {
      setRequirements(data.requirements);
    }
    if (data.committedFunds.length > 0) {
      setCommittedFunds(data.committedFunds);
    }
  };

  const addRequirement = () => {
    setRequirements([
      ...requirements,
      { id: null, name: "", budgets: {}, comments: "" }
    ]);
  };

  const removeRequirement = (index) => {
  const requirement = requirements[index];
  
  // Mark the row for deletion visually
  setDeletingIndex(index);
  
  // If it's an existing requirement (has an id), mark it for pending deletion
  if (requirement.id) {
    // Add to pending delete list (to keep visual indicator)
    setPendingDeleteRequirements(prev => [...prev, requirement.id]);
    // Also add to deleted IDs list for database deletion
    setDeletedRequirementIds(prev => [...prev, requirement.id]);
  } else {
    // If it's a new unsaved requirement, remove immediately
    const updated = [...requirements];
    updated.splice(index, 1);
    setRequirements(updated);
  }
  
  // Clear deleting state
  setTimeout(() => {
    setDeletingIndex(null);
  }, 300);
  
  // Show a different message indicating it will be deleted on save
  if (requirement.id) {
    toast.success('Requirement marked for deletion. Click Save to confirm.');
  } else {
    toast.success('Requirement removed');
  }
};

  const handleRequirementChange = (index, field, value) => {
    const updated = [...requirements];
    updated[index][field] = value;
    setRequirements(updated);
  };

  const handleRequirementBudgetChange = (index, year, value) => {
    const updated = [...requirements];
    updated[index].budgets[year] = value ? parseFloat(value) || 0 : "";
    setRequirements(updated);
  };

  const handleCommittedChange = (index, year, value) => {
    const updated = [...committedFunds];
    updated[index].budgets[year] = value ? parseFloat(value) || 0 : "";
    setCommittedFunds(updated);
  };

  const handleCommittedCommentChange = (index, value) => {
    const updated = [...committedFunds];
    updated[index].comments = value;
    setCommittedFunds(updated);
  };

  const handleSaveAll = async () => {
  if (!user) {
    toast.error('Please log in to save data');
    return;
  }

  // Filter out pending delete requirements before validation
  const activeRequirements = requirements.filter(
    req => !pendingDeleteRequirements.includes(req.id)
  );

  // Validate that at least one requirement has a name
  const hasValidRequirements = activeRequirements.some(req => req.name.trim() !== '');
  if (!hasValidRequirements) {
    toast.error('Please add at least one program requirement');
    return;
  }

  setIsSaving(true);
  
  try {
    // First, delete all marked requirements from database
    if (deletedRequirementIds.length > 0) {
      for (const id of deletedRequirementIds) {
        await deleteRequirement(id);
      }
    }
    
    // Then save all active requirements (excluding pending deletes)
    const success = await saveAllProgramNeeds(activeRequirements, committedFunds);
    
    if (success) {
      // Clear deleted IDs and pending delete after successful save
      setDeletedRequirementIds([]);
      setPendingDeleteRequirements([]);
      // Update requirements to only show active ones
      setRequirements(activeRequirements);
      toast.success('Successfully saved!');
    }
  } catch (error) {
    console.error('Error saving:', error);
    toast.error('Failed to save changes');
  } finally {
    setIsSaving(false);
  }
};

  // Calculate totals for each year
  const calculateYearTotal = (items, year) => {
    return items.reduce((sum, item) => {
      const value = item.budgets[year];
      return sum + (typeof value === 'number' && !isNaN(value) ? value : 0);
    }, 0);
  };

  const requirementTotals = years.map(year => calculateYearTotal(requirements, year));
  const committedTotals = years.map(year => calculateYearTotal(committedFunds, year));
  const gaps = years.map((_, index) => committedTotals[index] - requirementTotals[index]);

  // Format number with commas
  const formatNumber = (num) => {
    if (num === 0) return "0";
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (initialLoading) {
    return (
      <>
        <ProgramNeedsSkeleton/>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#001033]">
          Tool 2: Program Needs List
        </h2>
        <button
          onClick={handleSaveAll}
          disabled={loading || isSaving || !user}
          className={`flex items-center gap-2 px-4 py-2 bg-[#22864D] text-white rounded-lg hover:bg-[#1a6b3c] transition-colors ${
            (loading || isSaving || !user) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FiSave />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      
      <section className="mb-6 ">
        <h3 className="font-semibold mb-2">Objectives</h3>
        <ul className="text-sm list-disc pl-6 mb-6 space-y-1">
          <li>To determine the funds needed by the program</li>
          <li>To identify the difference between the program requirements and the committed funds</li>
        </ul>
      </section> 

      <div className="overflow-x-auto bg-white shadow-md rounded-lg border">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-black text-white">
              <th className="text-sm px-4 py-3 text-left w-[250px]">
                A. Program Requirements
              </th>

              <th colSpan={5} className="text-sm text-center border-x">
                PROJECTED BUDGET
              </th>

              <th className="text-sm px-4 py-3 text-left w-[100px]">
                COMMENTS
              </th>

              <th className="text-sm px-4 py-3 text-left"></th>
            </tr>

            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th></th>
              {years.map((year) => (
                <th key={year} className="px-3 py-2 text-center">
                  {year}
                </th>
              ))}
              <th></th>
              <th></th>
            </tr>
          </thead>

          {/* PROGRAM REQUIREMENTS */}
          <tbody>
            {requirements.map((req, index) => {
              const isPendingDelete = req.id && pendingDeleteRequirements.includes(req.id);
              
              return (
                <tr
                  key={index}
                  className={`border-t transition-colors duration-300 
                    ${deletingIndex === index ? 'bg-red-200' : ''}
                    ${isPendingDelete ? 'bg-red-100 line-through text-gray-500' : 'hover:bg-gray-50'}
                  `}
                >
                  {/* Requirement name */}
                  <td className="p-2">
                    <input
                      type="text"
                      placeholder="Program Requirement"
                      value={req.name}
                      onChange={(e) =>
                        handleRequirementChange(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className={`w-full border rounded px-2 py-1 text-xs ${
                        isPendingDelete ? 'bg-gray-100 text-gray-500' : ''
                      }`}
                      disabled={isPendingDelete || loading || isSaving}
                    />
                  </td>

                  {/* Budgets */}
                  {years.map((year) => (
                    <td key={year} className="p-2">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={req.budgets[year] || ""}
                        onChange={(e) =>
                          handleRequirementBudgetChange(
                            index,
                            year,
                            e.target.value
                          )
                        }
                        className={`w-full border rounded px-2 py-1 text-xs text-right ${
                          isPendingDelete ? 'bg-gray-100 text-gray-500' : ''
                        }`}
                        disabled={isPendingDelete || loading || isSaving}
                      />
                    </td>
                  ))}

                  {/* Comments */}
                  <td className="p-2">
                    <button
                      onClick={(e) => openCommentModal('requirement', index, e)}
                      disabled={isPendingDelete || loading || isSaving}
                      className={`w-full flex items-center justify-between gap-1 px-3 py-2 rounded-lg border transition-all duration-200 ${
                        req.comments && req.comments.trim() !== ''
                          ? 'bg-green-50 border-green-300 hover:bg-green-100'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      } ${(isPendingDelete || loading || isSaving) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span className={`text-xs truncate flex-1 text-left ${
                        req.comments && req.comments.trim() !== '' ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {req.comments && req.comments.trim() !== '' 
                          ? req.comments.length > 8
                            ? `${req.comments.substring(0, 11)}...` 
                            : req.comments
                          : 'Add comment...'}
                      </span>
                      <FiMessageSquare className={`flex-shrink-0 ${
                        req.comments && req.comments.trim() !== '' ? 'text-green-600' : 'text-gray-400'
                      }`} size={14} />
                    </button>
                  </td>

                  {/* Delete */}
                  <td className="text-center">
                    <button
                      onClick={() => removeRequirement(index)}
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
              <td colSpan={8} className="p-3">
                <button
                  onClick={addRequirement}
                  className="flex items-center gap-2 text-[#22864D] font-medium hover:underline"
                  disabled={loading}
                >
                  <FiPlus />
                  Add Requirement
                </button>
              </td>
            </tr>

            {/* TOTAL A */}
            <tr className="bg-gray-100 font-semibold border-t">
              <td className="px-4 py-3">TOTAL A</td>
              {requirementTotals.map((total, i) => (
                <td key={i} className="px-4 py-3 text-right">
                  {formatNumber(total)}
                </td>
              ))}
              <td></td>
              <td></td>
            </tr>

            {/* SECTION B */}
            <tr className="bg-black text-white">
              <td colSpan={8} className="px-4 py-3 font-semibold">
                B. COMMITTED FUNDS
              </td>
            </tr>

            {committedFunds.map((item, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{item.name}</td>

                {years.map((year) => (
                  <td key={year} className="p-2">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={item.budgets[year] || ""}
                      onChange={(e) => handleCommittedChange(i, year, e.target.value)}
                      className="w-full border rounded px-2 py-1 text-sm text-right text-xs"
                      disabled={loading}
                    />
                  </td>
                ))}

                {/* Comments */}
                <td className="p-2">
                  <button
                    onClick={(e) => openCommentModal('committed', i, e)}
                    disabled={loading || isSaving}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
                      item.comments && item.comments.trim() !== ''
                        ? 'bg-green-50 border-green-300 hover:bg-green-100'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } ${(loading || isSaving) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className={`text-xs truncate flex-1 text-left ${
                      item.comments && item.comments.trim() !== '' ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {item.comments && item.comments.trim() !== '' 
                        ? item.comments.length > 8 
                          ? `${item.comments.substring(0, 11)}...` 
                          : item.comments
                        : 'Add comment...'}
                    </span>
                    <FiMessageSquare className={`flex-shrink-0 ${
                      item.comments && item.comments.trim() !== '' ? 'text-green-600' : 'text-gray-400'
                    }`} size={14} />
                  </button>
                </td>

                <td></td>
              </tr>
            ))}

            {/* TOTAL B */}
            <tr className="bg-gray-100 font-semibold border-t">
              <td className="px-4 py-3">TOTAL B</td>
              {committedTotals.map((total, i) => (
                <td key={i} className="px-4 py-3 text-right">
                  {formatNumber(total)}
                </td>
              ))}
              <td></td>
              <td></td>
            </tr>

            {/* SECTION C */}
            <tr className="bg-black text-white">
              <td colSpan={8} className="px-4 py-3 font-semibold">
                C. TOTAL GAP (B - A)
              </td>
            </tr>

            {/* GAP ROW */}
            <tr className="bg-green-50 font-semibold border-t">
              <td className="px-4 py-3">GAP</td>
              {gaps.map((gap, i) => (
                <td key={i} className={`px-4 py-3 text-right ${gap < 0 ? 'text-red-600' : 'text-black'}`}>
                  {formatNumber(gap)}
                </td>
              ))}
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {/* Comment Modal */}
        <CommentModal
          isOpen={commentModalState.isOpen}
          onClose={closeCommentModal}
          onSave={updateComment}
          initialComment={commentModalState.comment}
          position={commentModalState.position}
        />
      </div>
    </>
  );
};

export default Tool2ProgramNeeds;