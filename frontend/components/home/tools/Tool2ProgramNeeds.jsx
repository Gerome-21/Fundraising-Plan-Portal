import React, { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

const years = ["2026", "2027", "2028", "2029", "2030"];

const Tool2ProgramNeeds = () => {
  const [requirements, setRequirements] = useState([
    { name: "", budgets: {}, comments: "" }
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

  const handleBudgetChange = (index, year, value) => {
    const updated = [...requirements];
    updated[index].budgets[year] = value;
    setRequirements(updated);
  };

  return (
    <>
      <h2 className="text-xl font-bold text-[#001033] mb-6">
        Tool 2: Program Needs List
      </h2>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg border">
        <table className="min-w-full text-xs">

          {/* HEADER */}
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
                      placeholder="0"
                      value={req.budgets[year] || ""}
                      onChange={(e) =>
                        handleBudgetChange(
                          index,
                          year,
                          e.target.value
                        )
                      }
                      className="w-full border rounded px-2 py-1 text-xs text-center"
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

            {/* TOTAL */}
            <tr className="bg-gray-100 font-semibold border-t">
              <td className="px-4 py-3">TOTAL</td>
              {years.map((year) => (
                <td key={year}></td>
              ))}
              <td></td>
              <td></td>
            </tr>

            {/* SECTION B */}
            <tr className="bg-black text-white">
              <td colSpan={8} className="px-4 py-3 font-semibold">
                B. COMMITTED FUND
              </td>
            </tr>

            {[
              "Grants",
              "Interest Income",
              "Consultancy Contracts",
              "Conference/Membership Fees/Sponsorship"
            ].map((item, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{item}</td>

                {years.map((year) => (
                  <td key={year} className="p-2">
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1 text-sm text-center"
                    />
                  </td>
                ))}

                <td>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1 text-sm"
                  />
                </td>

                <td></td>
              </tr>
            ))}

            <tr className="bg-gray-100 font-semibold border-t">
              <td className="px-4 py-3">TOTAL</td>
              {years.map((year) => (
                <td key={year}></td>
              ))}
              <td></td>
              <td></td>
            </tr>

            {/* SECTION C */}
            <tr className="bg-black text-white">
              <td colSpan={8} className="px-4 py-3 font-semibold">
                C. TOTAL GAP (Difference between A & B)
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </>
  );
};

export default Tool2ProgramNeeds;
