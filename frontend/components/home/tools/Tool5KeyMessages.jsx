import React, { useState, useEffect } from "react";
import { FiSave, FiPlus, FiTrash2 } from "react-icons/fi";
import { useUser } from "../../../context/UserContext";
import { useKeyMessages } from "../../../hooks/useKeyMessages";

// Configuration for better maintainability
const SECTIONS = [
  { id: "awareness", title: "Key Messages: Raise awareness" },
  { id: "interest", title: "Key Messages: Capture their interest" },
  { id: "action", title: "Key Messages: Call to action" },
  { id: "benefits", title: "Key Messages: Benefits" }
];

const DONOR_TYPES = [
  { id: "members", label: "Members", color: "blue" },
  { id: "corporates", label: "Corporates", color: "green" },
  { id: "hnwi", label: "High Net Worth Individuals", color: "purple" }
];

const DONOR_CATEGORIES = [
  { id: "current", label: "Current", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  { id: "former", label: "Former", bgColor: "bg-gray-50", borderColor: "border-gray-200" },
  { id: "potential", label: "Potential", bgColor: "bg-green-50", borderColor: "border-green-200" }
];

// Reusable Input Component
const NumberInput = ({ value, onChange, label, placeholder, disabled }) => (
  <div className="border rounded-xl p-3 bg-white hover:shadow-sm transition-shadow">
    <label className="text-xs font-semibold text-gray-600 block mb-1">
      {label}
    </label>
    <input
      type="number"
      min="0"
      step="1"
      value={value || ""}
      onChange={(e) => onChange(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
      placeholder={placeholder || "0"}
      disabled={disabled}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#22864D] focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400"
    />
  </div>
);

// Reusable Card Component for Donor Type Section
const DonorTypeSection = ({ donorType, categories, data, onDataChange, disabled }) => {
  return (
    <div className="border rounded-xl overflow-hidden">
      <div className={`bg-${donorType.color}-50 px-4 py-3 border-b`}>
        <h4 className={`font-semibold text-${donorType.color}-800`}>
          {donorType.label}
        </h4>
      </div>
      <div className="p-4 space-y-4">
        {categories.map((category) => (
          <div key={category.id}>
            <h5 className={`text-sm font-medium text-${category.bgColor.includes('blue') ? 'blue' : category.bgColor.includes('green') ? 'green' : 'gray'}-700 mb-2`}>
              {category.label}
            </h5>
            <NumberInput
              label={`# of ${donorType.label}`}
              value={data[category.id]?.[donorType.id]}
              onChange={(value) => onDataChange(category.id, donorType.id, value)}
              disabled={disabled}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Section Component
const KeyMessagesSection = ({ section, data, onDataChange, disabled }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
      <div className="bg-black px-6 py-4">
        <h3 className="text-lg font-bold text-white">
          {section.title}
        </h3>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {DONOR_TYPES.map((donorType) => (
            <DonorTypeSection
              key={donorType.id}
              donorType={donorType}
              categories={DONOR_CATEGORIES}
              data={data}
              onDataChange={onDataChange}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Summary Statistics Component
const SummaryStats = ({ allData }) => {
  // Calculate totals for each donor category
  const calculateTotals = () => {
    const totals = {
      current: { members: 0, corporates: 0, hnwi: 0 },
      former: { members: 0, corporates: 0, hnwi: 0 },
      potential: { members: 0, corporates: 0, hnwi: 0 }
    };
    
    Object.values(allData).forEach(sectionData => {
      DONOR_CATEGORIES.forEach(category => {
        DONOR_TYPES.forEach(donorType => {
          const value = sectionData?.[category.id]?.[donorType.id] || 0;
          totals[category.id][donorType.id] += value;
        });
      });
    });
    
    return totals;
  };
  
  const totals = calculateTotals();
  
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-6 border border-gray-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">Summary Across All Sections</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DONOR_CATEGORIES.map((category) => (
          <div key={category.id} className={`${category.bgColor} rounded-lg p-3`}>
            <p className="text-xs font-semibold text-gray-600 mb-2">{category.label}</p>
            <div className="space-y-1">
              {DONOR_TYPES.map((donorType) => (
                <div key={donorType.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{donorType.label}:</span>
                  <span className="font-semibold text-gray-800">
                    {totals[category.id][donorType.id]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
const Tool5KeyMessages = () => {
  const [data, setData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const { user } = useUser();
  const { loadKeyMessages, saveKeyMessages, loading, saving } = useKeyMessages(user?.id);

  const handleDataChange = (sectionId, categoryId, donorTypeId, value) => {
    setData((prev) => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [categoryId]: {
          ...prev[sectionId]?.[categoryId],
          [donorTypeId]: value,
        },
      },
    }));

    setHasChanges(true);
  };

  useEffect(() => {
    const init = async () => {
      const loaded = await loadKeyMessages();
      setData(loaded);
    };
    init();
  }, [loadKeyMessages]);

  const handleSaveAll = async () => {
    const success = await saveKeyMessages(data);
    if (success) setHasChanges(false);
  };

 if (loading) {
  return (
    <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
      Loading key messages…
    </div>
  );
}
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between mb-4 items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#001033]">
            Tool 5: Key Messages and Communications
          </h2>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleSaveAll}
            disabled={saving || loading}
            className={`flex items-center gap-2 px-4 py-2 bg-[#22864D] text-white rounded-lg hover:bg-[#1a6b3c] transition-colors ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FiSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      
        {/* Objectives Section */}
        <section className="mb-6">
          <h3 className="font-semibold text-[#001033] mb-2">Objectives</h3>
          <ul className="text-sm list-disc pl-6 space-y-1">
            <li>To strategize on how to engage your potential organization donors using strong key messages</li>
            <li>To identify needed materials and strategies to engage and nurture donors</li>
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            Identify needed Fundraising materials and strategies that correspond to the different potential donors.
          </p>
        </section>
      
      {/* Summary Statistics */}
      {/* {Object.keys(data).length > 0 && <SummaryStats allData={data} />} */}
      
      {/* Key Messages Sections */}
      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <KeyMessagesSection
            key={section.id}
            section={section}
            data={data[section.id] || {}}
            onDataChange={(categoryId, donorTypeId, value) => 
              handleDataChange(section.id, categoryId, donorTypeId, value)
            }
            disabled={saving}
          />
        ))}
      </div>
      
      {/* Unsaved Changes Indicator */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-yellow-800">
            You have unsaved changes. Click "Save All Changes" to save.
          </p>
        </div>
      )}
    </div>
  );
};

export default Tool5KeyMessages;