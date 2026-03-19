import React from "react";

const Tool7Policies = () => {
  return (
    <div className="max-w-4xl mx-auto">

      <h2 className="text-2xl font-bold text-[#001033] mb-4">
        Tool 7: Fundraising Policies Sentence Completion
      </h2>
      <section className="mb-6">
        <h3 className="font-medium">Objectives</h3>
        <ul className="text-sm list-disc pl-6 mt-1 text-gray-600">
          <li>
            To discuss and formulate fundraising policies relevant to your organization
          </li>
        </ul>
      </section>

      <div className="bg-white rounded-2xl shadow p-6 space-y-6">

        {/* QUESTION 1 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            1. We will partner with...
          </label>

          <textarea
            rows={5}
            placeholder="List organizations, groups, or types of partners your organization will collaborate with..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-green-400 outline-none"
          />

          <p className="text-xs text-gray-500 mt-1">
            Example: NGOs, local businesses, government agencies, community leaders
          </p>
        </div>

        {/* QUESTION 2 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            2. We will NOT partner with...
          </label>

          <textarea
            rows={5}
            placeholder="Define restrictions or types of partners your organization will avoid..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-red-400 outline-none"
          />

          <p className="text-xs text-gray-500 mt-1">
            Example: Organizations with conflicting values, unethical practices, etc.
          </p>
        </div>
        {/* QUESTION 3 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            3. Upon receiving financial or in-kind contributions, we will . . .
          </label>

          <textarea
            rows={5}
            placeholder="Define restrictions or types of partners your organization will avoid..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-red-400 outline-none"
          />

          <p className="text-xs text-gray-500 mt-1">
            Example: Organizations with conflicting values, unethical practices, etc.
          </p>
        </div>
        {/* QUESTION 3 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            4. The funds raised will be used in  . . .
          </label>

          <textarea
            rows={5}
            placeholder="Define restrictions or types of partners your organization will avoid..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-red-400 outline-none"
          />

          <p className="text-xs text-gray-500 mt-1">
            Example: Organizations with conflicting values, unethical practices, etc.
          </p>
        </div>
        {/* QUESTION 5 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            5. We will acknowledge stakeholders by  . . .
          </label>

          <textarea
            rows={5}
            placeholder="Define restrictions or types of partners your organization will avoid..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-red-400 outline-none"
          />

          <p className="text-xs text-gray-500 mt-1">
            Example: Organizations with conflicting values, unethical practices, etc.
          </p>
        </div>
        {/* QUESTION 6 */}
        <div>
          <label className="block font-semibold text-[#001033] mb-2">
            6. Fundraising policy formulation is the responsibility of  . . .
          </label>

          <textarea
            rows={5}
            placeholder="Define restrictions or types of partners your organization will avoid..."
            className="w-full border rounded-xl p-4 text-sm resize-none focus:ring-2 focus:ring-red-400 outline-none"
          />

          <p className="text-xs text-gray-500 mt-1">
            Example: Organizations with conflicting values, unethical practices, etc.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Tool7Policies;
