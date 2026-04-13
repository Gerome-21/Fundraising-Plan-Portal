// hooks/useOverviewData.js
import { useEffect, useState } from 'react';
import { useSelfAssessment } from './useSelfAssessment';
import { useProgramNeeds } from './useProgramNeeds';
import { useGiftRange } from './useGiftRange';
import usePotentialDonor from './usePotentialDonor';

const years = ["2026", "2027", "2028", "2029", "2030"];

export const useOverviewData = () => {
  // ── Tool 1 — auto-fetches via its own useEffects ──────────────────
  const { swotData, chart, chartData, loading: tool1Loading } = useSelfAssessment();

  // ── Tool 2 — manual load (hook only exposes functions) ────────────
  const { loadProgramNeeds, initialLoading: tool2Loading } = useProgramNeeds();
  const [tool2Data, setTool2Data] = useState({ requirements: [], committedFunds: [] });

  useEffect(() => {
    loadProgramNeeds().then(setTool2Data);
  }, []);

  // ── Tool 3 — manual load (same pattern with Tool 2) ─────────────────
  const { loadGiftRanges } = useGiftRange();
  const [tool3Rows, setTool3Rows] = useState([]);
  const [tool3Loading, setTool3Loading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await loadGiftRanges();
      setTool3Rows(data);
      setTool3Loading(false);
    };
    fetch();
  }, []);

  // Tool 4 — auto-fetches via its own useEffect, just destructure
  const { donors, loading: tool4Loading } = usePotentialDonor();

  // ── Tool 2 calculations ───────────────────────────────────────────
  const calcYearTotal = (items, year) =>
    items.reduce((sum, item) => {
      const val = item.budgets[year];
      return sum + (typeof val === 'number' && !isNaN(val) ? val : 0);
    }, 0);

  const requirementTotals = years.map(y => calcYearTotal(tool2Data.requirements, y));
  const committedTotals   = years.map(y => calcYearTotal(tool2Data.committedFunds, y));
  const gaps              = years.map((_, i) => committedTotals[i] - requirementTotals[i]);

  // ── Tool 3 calculations ───────────────────────────────────────────
  const computedTool3Rows = tool3Rows.map((row, index) => {
    const amount   = Number(row.giftRange) || 0;
    const gifts    = Number(row.gifts) || 0;
    const prospects = gifts * 5;
    const subtotal  = amount * gifts;

    // Running cumulative total up to this row
    let cumulativeTotal = 0;
    for (let i = 0; i <= index; i++) {
      cumulativeTotal += (Number(tool3Rows[i].giftRange) || 0) * (Number(tool3Rows[i].gifts) || 0);
    }

    return { ...row, prospects, subtotal, cumulativeTotal };
  });

  const tool3Totals = {
    gifts:      computedTool3Rows.reduce((s, r) => s + (Number(r.gifts) || 0), 0),
    prospects:  computedTool3Rows.reduce((s, r) => s + (r.prospects || 0), 0),
    subtotal:   computedTool3Rows.reduce((s, r) => s + (r.subtotal || 0), 0),
    cumulative: computedTool3Rows.reduce((s, r) => s + (r.cumulativeTotal || 0), 0),
  };

  // ── Tool 4 derived data ───────────────────────────────────────────
  const LEVEL_ORDER = ["HIGH", "MEDIUM", "LOW"];
  const HEAT_ORDER  = ["HOT", "WARM", "COLD"];

  // Group donors into { HIGH: { HOT: [], WARM: [], COLD: [] }, MEDIUM: {...}, LOW: {...} }
  const donorMatrix = LEVEL_ORDER.reduce((acc, level) => {
    acc[level] = HEAT_ORDER.reduce((hAcc, heat) => {
      hAcc[heat] = donors.filter(d => d.level === level && d.heat === heat);
      return hAcc;
    }, {});
    return acc;
  }, {});

  const tool4Stats = {
    total:  donors.length,
    byHeat:  { HOT: 0, WARM: 0, COLD: 0 },
    byLevel: { HIGH: 0, MEDIUM: 0, LOW: 0 },
  };
  donors.forEach(d => {
    if (tool4Stats.byHeat[d.heat]  !== undefined) tool4Stats.byHeat[d.heat]++;
    if (tool4Stats.byLevel[d.level] !== undefined) tool4Stats.byLevel[d.level]++;
  });

  return {
    isLoading: tool1Loading || tool2Loading || tool3Loading || tool4Loading,

    tool1: {
      swotData, chart, chartData,
      isComplete: !!(swotData.strengths || swotData.weaknesses || swotData.opportunities || swotData.threats),
    },

    tool2: {
      requirements:    tool2Data.requirements,
      committedFunds:  tool2Data.committedFunds,
      years,
      requirementTotals,
      committedTotals,
      gaps,
      isComplete: tool2Data.requirements.length > 0,
    },

    tool3: {
      rows:     computedTool3Rows,
      totals:   tool3Totals,
      isComplete: tool3Rows.length > 0,
    },
    tool4: {
      donors, donorMatrix, stats: tool4Stats,
      LEVEL_ORDER, HEAT_ORDER,
      isComplete: donors.length > 0,
    },
  };
};