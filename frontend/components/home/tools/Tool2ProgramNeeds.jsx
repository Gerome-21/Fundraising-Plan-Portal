import React, { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const years = ["2026", "2027", "2028", "2029", "2030"];

const Tool2ProgramNeeds = () => {
  const [requirements, setRequirements] = useState([
    { name: "Program 1", budgets: {}, comments: "" }
  ]);

  const [committedFunds, setCommittedFunds] = useState([
    { name: "Grants?", budgets: {}, comments: "" },
    { name: "Interest Income?", budgets: {}, comments: "" },
    { name: "Consultancy Contracts?", budgets: {}, comments: "" },
    { name: "Conference/Membership Fees/Sponsorship?", budgets: {}, comments: "" }
  ]);

  const addRequirement = () => {
    setRequirements([
      ...requirements,
      { name: "", budgets: {}, comments: "" }
    ]);
  };

  const removeRequirement = (index) => {
    const updated = [...requirements];
    updated.splice(index, 1);
    setRequirements(updated);
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

  return (
    <>
      <h2 className="text-2xl font-bold text-[#001033] mb-4">
        Tool 2: Program Needs List
      </h2>
      <section className="mb-2 ">
        <h3 className="font-medium">Objectives</h3>
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

              <th className="text-sm px-4 py-3 text-left w-[200px]">
                COMMENTS
              </th>

              <th></th>
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
            {requirements.map((req, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">

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
                    className="w-full border rounded px-2 py-1 text-xs"
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
                      className="w-full border rounded px-2 py-1 text-xs text-right"
                    />
                  </td>
                ))}

                {/* Comments */}
                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Comments"
                    value={req.comments}
                    onChange={(e) =>
                      handleRequirementChange(
                        index,
                        "comments",
                        e.target.value
                      )
                    }
                    className="w-full border rounded px-2 py-1 text-xs"
                  />
                </td>

                {/* Delete */}
                <td className="text-center">
                  <button
                    onClick={() => removeRequirement(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}

            {/* Add Row */}
            <tr>
              <td colSpan={8} className="p-3">
                <button
                  onClick={addRequirement}
                  className="flex items-center gap-2 text-[#22864D] font-medium hover:underline"
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
                      className="w-full border rounded px-2 py-1 text-sm text-right"
                    />
                  </td>
                ))}

                <td className="p-2">
                  <input
                    type="text"
                    placeholder="Comments"
                    value={item.comments || ""}
                    onChange={(e) => handleCommittedCommentChange(i, e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
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
      </div>
    </>
  );
};

export default Tool2ProgramNeeds;