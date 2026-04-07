import React, { useState, useEffect } from "react";
import useFundraisingPolicies from "../../../hooks/useFundraisingPolicies";
import { FiSave } from "react-icons/fi";
import PoliciesSkeleton from "../../Tool7Components/PoliciesSkeleton";

// Deep comparison function to check if data has changed
const hasDataChanged = (currentData, originalData) => {
  return JSON.stringify(currentData) !== JSON.stringify(originalData);
};

const Tool7Policies = () => {
  const { formData, setFormData, savePolicies, isLoading, isSaving } = useFundraisingPolicies();
  const [originalData, setOriginalData] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle input changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle save
  const handleSave = async () => {
    await savePolicies();
    // After successful save, update originalData with current formData
    setOriginalData({ ...formData });
    setHasUnsavedChanges(false);
  };

  // Set original data when formData is initially loaded
  useEffect(() => {
    if (!isInitialized && !isLoading && formData) {
      setOriginalData({ ...formData });
      setIsInitialized(true);
    }
  }, [formData, isLoading, isInitialized]);

  // Track changes whenever formData changes (after initialization)
  useEffect(() => {
    if (isInitialized) {
      const changed = hasDataChanged(formData, originalData);
      setHasUnsavedChanges(changed);
    }
  }, [formData, originalData, isInitialized]);

  // Show skeleton while loading
  if (isLoading) {
    return <PoliciesSkeleton />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#001033] mb-4">
        Tool 7: Fundraising Policies Sentence Completion
      </h2>
      <section className="mb-6">
        <h3 className="font-semibold text-[#001033] mb-2">Objective</h3>
        <ul className="text-sm list-disc pl-6 space-y-1">
          <li>To create clear and responsible fundraising policies for your organization</li>
        </ul>
      </section>

      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg text-[#001033]">
            Fundraising Guidelines
          </h3>
          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className={`transition-all duration-600 ${isSaving || !hasUnsavedChanges
                ? 'w-10 h-10 rounded-full bg-gray-300 text-gray-500 cursor-not-allowed flex items-center justify-center'
                : 'flex items-center gap-2 px-4 py-2 rounded-full bg-[#22864D] text-white hover:bg-[#1a6b3c]'
              }`}
          >
            <FiSave className={`loading || isSaving || !user || !hasUnsavedChanges` ? 'w-4 h-4' : ''}/>
              {!( isSaving || !hasUnsavedChanges) && (
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              )}
          </button>
        </div>

        {/* QUESTION 1 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            1. We will partner with...
          </label>
          <textarea
            rows={4}
            value={formData.partner_with}
            onChange={(e) => handleChange("partner_with", e.target.value)}
            placeholder="Describe the types of organizations or partners you will collaborate with..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-green-400 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: NGOs, ethical businesses, government agencies, community leaders
          </p>
        </div>

        {/* QUESTION 2 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            2. We will NOT partner with...
          </label>
          <textarea
            rows={4}
            value={formData.not_partner_with}
            onChange={(e) => handleChange("not_partner_with", e.target.value)}
            placeholder="Specify organizations or partners you will avoid and explain why..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-green-400 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: Groups involved in unethical practices, illegal activities, or conflicting values
          </p>
        </div>

        {/* QUESTION 3 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            3. Upon receiving financial or in-kind contributions, we will...
          </label>
          <textarea
            rows={4}
            value={formData.contribution_handling}
            onChange={(e) => handleChange("contribution_handling", e.target.value)}
            placeholder="Explain how your organization will handle, record, and acknowledge donations..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-green-400 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: Issue receipts, record donations, ensure transparency, and send acknowledgments
          </p>
        </div>

        {/* QUESTION 4 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            4. The funds raised will be used for...
          </label>
          <textarea
            rows={4}
            value={formData.fund_usage}
            onChange={(e) => handleChange("fund_usage", e.target.value)}
            placeholder="Describe how the funds will be allocated or used..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-green-400 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: Program implementation, operational costs, community projects
          </p>
        </div>

        {/* QUESTION 5 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            5. We will acknowledge stakeholders by...
          </label>
          <textarea
            rows={4}
            value={formData.stakeholder_acknowledgement}
            onChange={(e) => handleChange("stakeholder_acknowledgement", e.target.value)}
            placeholder="Explain how you will recognize and appreciate donors and partners..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-green-400 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: Thank-you letters, public recognition, reports, events
          </p>
        </div>

        {/* QUESTION 6 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            6. Fundraising policy formulation is the responsibility of...
          </label>
          <textarea
            rows={4}
            value={formData.policy_responsibility}
            onChange={(e) => handleChange("policy_responsibility", e.target.value)}
            placeholder="Identify who is responsible for creating and managing fundraising policies..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-green-400 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: Board members, management team, finance committee
          </p>
        </div>
      </div>

      {/* Unsaved Changes Indicator */}
      {hasUnsavedChanges && !isSaving && (
        <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></div>
            <p className="text-sm text-yellow-800">
              You have unsaved changes. Click "Save Changes" to save.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tool7Policies;