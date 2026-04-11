import React, { useState, useEffect } from "react";
import { FiSave } from "react-icons/fi";
import SwotAnalysisSkeleton from "./SwotAnalysisSkeleton";

const SwotAnalysis = ({ swotData, handleSwotChange, handleSaveSwot, loading: saveLoading }) => {
  const [localSwotData, setLocalSwotData] = useState(swotData);
  const [originalData, setOriginalData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when prop changes (initial load)
  useEffect(() => {
    if (swotData && !isInitialized) {
      // Check if swotData actually has meaningful content
      const hasContent = Object.values(swotData).some(v => v !== null && v !== undefined && v !== '');
      if (!hasContent) return; // wait for real data
      
      setLocalSwotData(swotData);
      setOriginalData(JSON.parse(JSON.stringify(swotData)));
      setIsInitialized(true);
      setHasUnsavedChanges(false);
    }
  }, [swotData, isInitialized]);

  // Track changes
  useEffect(() => {
    if (isInitialized) {
      const changed = JSON.stringify(localSwotData) !== JSON.stringify(originalData);
      setHasUnsavedChanges(changed);
    }
  }, [localSwotData, originalData, isInitialized]);

  // Handle local changes
  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocalSwotData(prev => ({ ...prev, [name]: value }));
    // Also call the parent's handler if needed
    if (handleSwotChange) {
      handleSwotChange(e);
    }
  };

  // Handle save
  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      await handleSaveSwot();
      // After successful save, update original data
      setOriginalData(JSON.parse(JSON.stringify(localSwotData)));
      setHasUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Determine button state
  const isButtonInactive = saveLoading || isSaving || !hasUnsavedChanges;
  
  const buttonClasses = isButtonInactive
    ? 'w-10 h-10 rounded-full bg-gray-300 text-gray-500 cursor-not-allowed flex items-center justify-center transition-all duration-300'
    : 'flex items-center gap-2 px-4 py-2 rounded-full bg-[#22864D] text-white hover:bg-green-700 transition-all duration-300';

  if (!isInitialized && !swotData) {
    return <SwotAnalysisSkeleton />;
  }

  return (
    <section className="mb-8 pt-8 border-t-1 border-gray-400 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-[#121212]">SWOT Analysis</h3>
        <button
          onClick={handleSave}
          disabled={isButtonInactive}
          className={buttonClasses}
          title={isButtonInactive ? "No changes to save" : "Save changes"}
        >
          <FiSave className={isButtonInactive ? 'w-4 h-4' : ''} />
          {!isButtonInactive && (isSaving ? "Saving..." : "Save Changes")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-4 shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">S</div>
            <h4 className="font-semibold">Strengths</h4>
          </div>
          <textarea
            name="strengths"
            value={localSwotData.strengths || ''}
            onChange={handleLocalChange}
            rows="6"
            placeholder="What are your organization's strengths in fund raising?"
            className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition text-sm"
            disabled={saveLoading || isSaving}
          />
        </div>

        <div className="bg-red-50 shadow-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">W</div>
            <h4 className="font-semibold">Weaknesses</h4>
          </div>
          <textarea
            name="weaknesses"
            value={localSwotData.weaknesses || ''}
            onChange={handleLocalChange}
            rows="6"
            placeholder="What internal challenges or weaknesses exist?"
            className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500/30 focus:border-red-500 outline-none transition text-sm"
            disabled={saveLoading || isSaving}
          />
        </div>

        <div className="bg-blue-50 shadow-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">O</div>
            <h4 className="font-semibold">Opportunities</h4>
          </div>
          <textarea
            name="opportunities"
            value={localSwotData.opportunities || ''}
            onChange={handleLocalChange}
            rows="6"
            placeholder="What external opportunities exist for fund raising?"
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition text-sm"
            disabled={saveLoading || isSaving}
          />
        </div>

        <div className="bg-orange-50 shadow-md rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">T</div>
            <h4 className="font-semibold">Threats</h4>
          </div>
          <textarea
            name="threats"
            value={localSwotData.threats || ''}
            onChange={handleLocalChange}
            rows="6"
            placeholder="What external threats could impact fund raising?"
            className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none transition text-sm"
            disabled={saveLoading || isSaving}
          />
        </div>
      </div>

      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && !isSaving && !saveLoading && (
        <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 shadow-lg animate-bounce z-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
            <p className="text-sm text-yellow-800">
              You have unsaved changes. Click "Save Changes" to save.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SwotAnalysis;