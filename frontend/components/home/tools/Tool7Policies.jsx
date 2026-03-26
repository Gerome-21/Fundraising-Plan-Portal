import React from "react";

const Tool7Policies = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#001033] mb-4">
        Tool 7: Fundraising Policies
      </h2>
      <section className="mb-6">
        <h3 className="font-semibold text-[#001033] mb-2">Objective</h3>
        <ul className="text-sm list-disc pl-6 space-y-1">
          <li>To create clear and responsible fundraising policies for your organization</li>
        </ul>
      </section>

      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <h3 className="font-semibold text-lg text-[#001033]">
          Fundraising Guidelines (Complete the statements below)
        </h3>

        {/* QUESTION 1 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            1. We will partner with...
          </label>
          <textarea
            rows={4}
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
            placeholder="Specify organizations or partners you will avoid and explain why..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-red-400 outline-none"
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
            placeholder="Explain how your organization will handle, record, and acknowledge donations..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-blue-400 outline-none"
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
            placeholder="Explain how you will recognize and appreciate donors and partners..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-yellow-400 outline-none"
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
            placeholder="Identify who is responsible for creating and managing fundraising policies..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: Board members, management team, finance committee
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tool7Policies;
