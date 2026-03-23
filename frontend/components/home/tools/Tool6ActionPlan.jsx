import React, { useState } from "react";
import { FiPlus, FiTrash2, FiChevronDown, FiChevronRight, FiX, FiTrash } from "react-icons/fi";

const Tool6ActionPlan = () => {
  const [programs, setPrograms] = useState([
    {
      id: 1,
      name: "",
      strategies: [
        {
          id: 1,
          name: "",
          years: [
            { year: "Year 1", expenses: "", revenue: "" },
            { year: "Year 2", expenses: "", revenue: "" },
            { year: "Year 3", expenses: "", revenue: "" },
            { year: "Year 4", expenses: "", revenue: "" },
            { year: "Year 5", expenses: "", revenue: "" }
          ]
        }
      ],
      expanded: true
    }
  ]);

  const addProgram = () => {
    const newId = programs.length + 1;
    setPrograms([
      ...programs,
      {
        id: newId,
        name: ``,
        strategies: [],
        expanded: true
      }
    ]);
  };

  const removeProgram = (programId) => {
    setPrograms(programs.filter(p => p.id !== programId));
  };

  const addStrategy = (programId) => {
    setPrograms(programs.map(program => {
      if (program.id === programId) {
        const newStrategyId = program.strategies.length + 1;
        return {
          ...program,
          strategies: [
            ...program.strategies,
            {
              id: newStrategyId,
              name: "",
              years: [
                { year: "Year 1", expenses: "", revenue: "" },
                { year: "Year 2", expenses: "", revenue: "" },
                { year: "Year 3", expenses: "", revenue: "" },
                { year: "Year 4", expenses: "", revenue: "" },
                { year: "Year 5", expenses: "", revenue: "" }
              ]
            }
          ]
        };
      }
      return program;
    }));
  };

  const removeStrategy = (programId, strategyId) => {
    setPrograms(programs.map(program => {
      if (program.id === programId) {
        return {
          ...program,
          strategies: program.strategies.filter(s => s.id !== strategyId)
        };
      }
      return program;
    }));
  };

  const updateProgramName = (programId, name) => {
    setPrograms(programs.map(program => 
      program.id === programId ? { ...program, name } : program
    ));
  };

  const updateStrategyName = (programId, strategyId, name) => {
    setPrograms(programs.map(program => {
      if (program.id === programId) {
        return {
          ...program,
          strategies: program.strategies.map(strategy =>
            strategy.id === strategyId ? { ...strategy, name } : strategy
          )
        };
      }
      return program;
    }));
  };

  const updateYearValue = (programId, strategyId, yearIndex, field, value) => {
    setPrograms(programs.map(program => {
      if (program.id === programId) {
        return {
          ...program,
          strategies: program.strategies.map(strategy => {
            if (strategy.id === strategyId) {
              const updatedYears = [...strategy.years];
              updatedYears[yearIndex] = {
                ...updatedYears[yearIndex],
                [field]: value === "" ? "" : parseFloat(value) || 0
              };
              return { ...strategy, years: updatedYears };
            }
            return strategy;
          })
        };
      }
      return program;
    }));
  };

  const toggleProgram = (programId) => {
    setPrograms(programs.map(program =>
      program.id === programId ? { ...program, expanded: !program.expanded } : program
    ));
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

  return (
    <>
      <h2 className="text-2xl font-bold text-[#001033] mb-4">
        Tool 6: Fundraising Action Plan
      </h2>

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
        className="mb-4 flex items-center gap-2 px-4 py-2 bg-[#22864D] text-white rounded-lg hover:bg-[#22864D]/90 transition-all"
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
              <th className="px-4 py-3 text-center w-[60px]"></th>
            </tr>
            <tr className="bg-gray-200 text-gray-700 text-xs">
              <th></th>
              {/* <th></th> */}
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
                <tr className="bg-gray-100 border-t ">
                  <td colSpan="13" className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleProgram(program.id)}
                          className="text-gray-600 hover:text-[#22864D]"
                        >
                          {program.expanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                        </button>
                        <input
                          type="text"
                          value={program.name}
                          onChange={(e) => updateProgramName(program.id, e.target.value)}
                          className="font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#22864D] outline-none px-1"
                          placeholder="Enter Program Name"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeProgram(program.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Strategies Rows */}
                {program.expanded && program.strategies.map((strategy) => (
                  <tr key={strategy.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Strategy name"
                          value={strategy.name}
                          onChange={(e) => updateStrategyName(program.id, strategy.id, e.target.value)}
                          className="w-full border rounded px-2 py-1 text-xs focus:border-[#22864D] outline-none"
                        />
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
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            type="number"
                            placeholder="0.00"
                            value={year.revenue}
                            onChange={(e) => updateYearValue(program.id, strategy.id, idx, "revenue", e.target.value)}
                            className="w-full border rounded px-2 py-1 text-xs text-right focus:border-[#22864D] outline-none"
                          />
                        </td>
                      </React.Fragment>
                    ))}
                    <td className="px-2 py-2">
                      <button
                        onClick={() => removeStrategy(program.id, strategy.id)}
                        className="text-red-700 hover:text-red-700"
                      >
                        <FiX size={14} />
                      </button>
                    </td>
                  </tr>
                  
                ))}
                {program.expanded && (
                <tr>
                  <td colSpan="13" className="px-4 py-3">
                    <button
                      onClick={() => addStrategy(program.id)}
                      className="text-xs text-[#22864D] hover:underline flex items-center gap-1"
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
                <td colSpan="-1" className="px-4 py-3 text-right">TOTAL</td>
                {Array(5).fill().map((_, idx) => (
                  <React.Fragment key={idx}>
                    <td className="px-4 py-3 text-right text-[#22864D]">
                      ₱ {formatNumber(totals.expenses[idx])}
                    </td>
                    <td className="px-4 py-3 text-right text-[#22864D]">
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

    </>
  );
};

export default Tool6ActionPlan;