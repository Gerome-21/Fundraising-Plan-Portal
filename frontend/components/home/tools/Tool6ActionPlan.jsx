import React, { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronRight, FiX, FiSave } from "react-icons/fi";
import { MdChatBubble, MdCommentBank } from "react-icons/md";
import FundingProspectsModal from "../../Tool6Components/FundingProspectsModal";
import { useFundraisingActionPlan } from "../../../hooks/useFundrasingActionPlan";
import { useUser } from "../../../context/UserContext";
import toast from "react-hot-toast";
import FundraisingActionPlanSkeleton from "../../Tool6Components/FundraisingActionPlanSkeleton";

const Tool6ActionPlan = () => {
  const { user } = useUser();
  const { 
    programs, 
    loading, 
    initialLoading, 
    saveAllData, 
    loadData,
    addProgram: addProgramLocal,
    removeProgram: removeProgramLocal,
    addStrategy: addStrategyLocal,
    removeStrategy: removeStrategyLocal,
    updateProgramName: updateProgramNameLocal,
    updateStrategyName: updateStrategyNameLocal,
    updateFundingProspects: updateFundingProspectsLocal,
    updateYearValue: updateYearValueLocal,
    toggleProgram: toggleProgramLocal,
    setPrograms
  } = useFundraisingActionPlan();
  const [pendingDeletePrograms, setPendingDeletePrograms] = useState([]);
  const [pendingDeleteStrategies, setPendingDeleteStrategies] = useState([]); 
  
  const [isSaving, setIsSaving] = useState(false);
  const [prospectModal, setProspectModal] = useState({
    isOpen: false,
    programId: null,
    strategyId: null,
    comment: '',
    position: { top: 0, left: 0 }
  });

  // Load data on mount
  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user?.id]);

  const addProgram = () => {
    setPrograms(prev => addProgramLocal(prev));
  };

  const removeProgram = (programId) => {
    const program = programs.find(p => p.id === programId);
    if (program && typeof program.id === 'string') {
      setPendingDeletePrograms(prev => [...prev, programId]);
    } else {
      setPrograms(prev => removeProgramLocal(prev, programId));
    }
  };

  const addStrategy = (programId) => {
    setPrograms(prev => addStrategyLocal(prev, programId));
  };

  const removeStrategy = (programId, strategyId) => {
    const program = programs.find(p => p.id === programId);
    const strategy = program?.strategies.find(s => s.id === strategyId);
    if (strategy && typeof strategy.id === 'string') {
      setPendingDeleteStrategies(prev => [...prev, { programId, strategyId }]);
    } else {
      setPrograms(prev => removeStrategyLocal(prev, programId, strategyId));
    }
  };

  const updateProgramName = (programId, name) => {
    setPrograms(prev => updateProgramNameLocal(prev, programId, name));
  };

  const updateStrategyName = (programId, strategyId, name) => {
    setPrograms(prev => updateStrategyNameLocal(prev, programId, strategyId, name));
  };

  const updateYearValue = (programId, strategyId, yearIndex, field, value) => {
    setPrograms(prev => updateYearValueLocal(prev, programId, strategyId, yearIndex, field, value));
  };

  const toggleProgram = (programId) => {
    setPrograms(prev => toggleProgramLocal(prev, programId));
  };

  // Open funding prospects modal
  const openProspectModal = (programId, strategyId, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const program = programs.find(p => p.id === programId);
    const strategy = program?.strategies.find(s => s.id === strategyId);

    setProspectModal({
      isOpen: true,
      programId,
      strategyId,
      comment: strategy?.fundingProspects || '',
      position: {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX + 24
      }
    });
  };

  // Save funding prospects
  const saveProspect = (newComment) => {
    setPrograms(prev => updateFundingProspectsLocal(prev, prospectModal.programId, prospectModal.strategyId, newComment));
  };

  const closeProspectModal = () => {
    setProspectModal({ isOpen: false, programId: null, strategyId: null, comment: '', position: { top: 0, left: 0 } });
  };

  // Save all data to database
  const handleSaveAll = async () => {
    if (!user) {
      toast.error('Please log in to save data');
      return;
    }

    const hasValidPrograms = programs.some(p => p.name.trim() !== '');
    if (!hasValidPrograms) {
      toast.error('Please add at least one program with a name');
      return;
    }

    setIsSaving(true);

    // Filter out pending deletes before saving
    const activePrograms = programs
      .filter(p => !pendingDeletePrograms.includes(p.id))
      .map(p => ({
        ...p,
        strategies: p.strategies.filter(
          s => !pendingDeleteStrategies.some(
            pd => pd.programId === p.id && pd.strategyId === s.id
          )
        )
      }));

    const success = await saveAllData(activePrograms);
    if (success) {
      // Update local state directly — no reload
      setPrograms(activePrograms);
      setPendingDeletePrograms([]);
      setPendingDeleteStrategies([]);
    }

    setIsSaving(false);
  };

  // Calculate totals
  const calculateTotals = () => {
    const totals = {
      expenses: Array(5).fill(0),
      revenue: Array(5).fill(0)
    };

    programs.forEach(program => {
      program.strategies.forEach(strategy => {
        strategy.years.forEach((year, index) => {
          totals.expenses[index] += parseFloat(year.expenses) || 0;
          totals.revenue[index] += parseFloat(year.revenue) || 0;
        });
      });
    });

    return totals;
  };

  const totals = calculateTotals();

  const formatNumber = (num) => {
    if (num === 0) return "0.00";
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const years = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];

  if (initialLoading) {
    return <FundraisingActionPlanSkeleton/>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#001033]">
          Tool 6: Fundraising Action Plan
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

      <section className="mb-6">
        <h3 className="font-semibold text-[#001033] mb-2">Objectives</h3>
        <ul className="text-sm list-disc pl-6 space-y-1">
          <li>To develop a strategic, realistic, and organized Fundraising Action Plan for your Organization</li>
          <li>To practice Fundraising planning skills</li>
        </ul>
        <p className="text-sm text-gray-600 mt-3">
          Identify fund sources and corresponding strategies that can be pursued in the period of five (5) years.<br/> Briefly identify the specific objectives of the activities (amount to be raised, stakeholders to be involved).
        </p>
      </section>

      {/* Add Program Button */}
      <button
        onClick={addProgram}
        disabled={loading || isSaving}
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-[#22864D] text-white rounded-lg hover:bg-[#22864D]/90 transition-all disabled:opacity-50"
      >
        <FiPlus /> Add Program
      </button>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-xs">
          <thead className="bg-black text-white sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left w-[200px]">Key Programs</th>
              <th colSpan="2" className="px-4 py-3 text-center">Year 1</th>
              <th colSpan="2" className="px-4 py-3 text-center">Year 2</th>
              <th colSpan="2" className="px-4 py-3 text-center">Year 3</th>
              <th colSpan="2" className="px-4 py-3 text-center">Year 4</th>
              <th colSpan="2" className="px-4 py-3 text-center">Year 5</th>
              <th></th>
            </tr>
            <tr className="bg-gray-200 text-gray-700 text-xs">
              <th></th>
              <th className="px-3 py-2">Expenses</th>
              <th className="px-3 py-2">Revenue</th>
              <th className="px-3 py-2">Expenses</th>
              <th className="px-3 py-2">Revenue</th>
              <th className="px-3 py-2">Expenses</th>
              <th className="px-3 py-2">Revenue</th>
              <th className="px-3 py-2">Expenses</th>
              <th className="px-3 py-2">Revenue</th>
              <th className="px-3 py-2">Expenses</th>
              <th className="px-3 py-2">Revenue</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <React.Fragment key={program.id}>
                {/* Program Row */}
                <tr className={`bg-gray-100 border-t ${
                  pendingDeletePrograms.includes(program.id) ? 'bg-red-100' : ''
                }`}>
                  <td colSpan="13" className="px-4 py-3">
                    <div className="flex items-center justify-start">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleProgram(program.id)}
                          className="text-gray-600 hover:text-[#22864D]"
                          disabled={loading || isSaving}
                        >
                          {program.expanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                        </button>
                        <input
                          type="text"
                          value={program.name}
                          onChange={(e) => updateProgramName(program.id, e.target.value)}
                          className="font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#22864D] outline-none px-1 truncate"
                          placeholder="Enter Program Name"
                          disabled={loading || isSaving}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeProgram(program.id)}
                          className={`hover:bg-gray-200 ${
                            pendingDeletePrograms.includes(program.id)
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-red-500 hover:text-red-700'
                          }`}
                          disabled={loading || isSaving || pendingDeletePrograms.includes(program.id)}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                   </td>
                </tr>

                {/* Strategies Rows */}
                {program.expanded && program.strategies.map((strategy) => {
                  const isPendingDelete = pendingDeleteStrategies.some(
                    pd => pd.programId === program.id && pd.strategyId === strategy.id
                  );

                  return (
                    <tr key={strategy.id} className={`border-t ${
                      isPendingDelete ? 'bg-red-100 text-gray-400 line-through' : 'hover:bg-gray-50'
                    }`}>
                    <td className="px-4 py-2">
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          placeholder="Strategy name"
                          value={strategy.name}
                          onChange={(e) => updateStrategyName(program.id, strategy.id, e.target.value)}
                          className="w-full border rounded px-2 py-1 pr-7 text-xs focus:border-[#22864D] outline-none"
                          disabled={loading || isSaving}
                        />
                        <button
                          onClick={(e) => openProspectModal(program.id, strategy.id, e)}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                          title={strategy.fundingProspects || 'Add funding prospects'}
                          disabled={loading || isSaving}
                        >
                          <MdCommentBank
                            size={13}
                            className={
                              strategy.fundingProspects?.trim()
                                ? 'text-green-500'
                                : 'text-gray-400 hover:text-gray-500'
                            }
                          />
                        </button>
                      </div>
                     </td>
                    {strategy.years.map((year, idx) => (
                      <React.Fragment key={idx}>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            placeholder="0.00"
                            value={year.expenses}
                            onChange={(e) => updateYearValue(program.id, strategy.id, idx, "expenses", e.target.value)}
                            className="w-full border rounded px-2 py-1 text-xs text-right focus:border-[#22864D] outline-none"
                            disabled={loading || isSaving}
                          />
                         </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            placeholder="0.00"
                            value={year.revenue}
                            onChange={(e) => updateYearValue(program.id, strategy.id, idx, "revenue", e.target.value)}
                            className="w-full border rounded px-2 py-1 text-xs text-right focus:border-[#22864D] outline-none"
                            disabled={loading || isSaving}
                          />
                         </td>
                      </React.Fragment>
                    ))}
                    <td className="px-2 py-2">
                      <button
                        onClick={() => removeStrategy(program.id, strategy.id)}
                        className={isPendingDelete ? 'text-gray-400 cursor-not-allowed' : 'text-red-700 cursor-pointer'}
                        disabled={loading || isSaving || isPendingDelete}
                      >
                        <FiX size={14} />
                      </button>
                    </td>
                  </tr>
                  );
                })}
                {program.expanded && (
                  <tr>
                    <td colSpan="13" className="px-4 py-3">
                      <button
                        onClick={() => addStrategy(program.id)}
                        className="text-xs text-[#22864D] hover:underline flex items-center gap-1"
                        disabled={loading || isSaving}
                      >
                        <FiPlus size={12} /> Add Strategy
                      </button>
                    </td>
                  </tr>
                )}

                {/* No strategies message */}
                {program.expanded && program.strategies.length === 0 && (
                  <tr className="bg-gray-50">
                    <td colSpan="13" className="px-4 py-4 text-center text-gray-400 text-xs">
                      No strategies added yet. Click "Add Strategy" to get started.
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {/* No programs message */}
            {programs.length === 0 && (
              <tr>
                <td colSpan="13" className="px-4 py-8 text-center text-gray-400">
                  No programs added yet. Click "Add Program" to get started.
                </td>
              </tr>
            )}
          </tbody>

          {/* Totals Row */}
          {programs.length > 0 && (
            <tfoot className="bg-gray-100 font-bold border-t-2 border-gray-300">
              <tr>
                <td className="px-4 py-3 text-right">TOTAL</td>
                {Array(5).fill().map((_, idx) => (
                  <React.Fragment key={idx}>
                    <td className="px-4 py-3 text-right text-black">
                      ₱ {formatNumber(totals.expenses[idx])}
                    </td>
                    <td className="px-4 py-3 text-right text-black">
                      ₱ {formatNumber(totals.revenue[idx])}
                    </td>
                  </React.Fragment>
                ))}
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Funding Prospects Modal */}
      <FundingProspectsModal
        isOpen={prospectModal.isOpen}
        onClose={closeProspectModal}
        onSave={saveProspect}
        initialComment={prospectModal.comment}
        position={prospectModal.position}
      />
    </>
  );
};

export default Tool6ActionPlan;