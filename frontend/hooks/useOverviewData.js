// hooks/useOverviewData.js
import { useEffect, useState } from 'react';
import { useSelfAssessment } from './useSelfAssessment';
import { useProgramNeeds } from './useProgramNeeds';
import { useGiftRange } from './useGiftRange';
import usePotentialDonor from './usePotentialDonor';
import {useKeyMessages} from './useKeyMessages';
import {useFundraisingActionPlan } from './useFundrasingActionPlan';
import { useFundraisingPolicies } from './useFundraisingPolicies';
import { useUser } from '../context/UserContext';

const years = ["2026", "2027", "2028", "2029", "2030"];

const SECTIONS = [
  { id: "awareness", title: "Raise Awareness" },
  { id: "interest",  title: "Capture Their Interest" },
  { id: "action",    title: "Call to Action" },
  { id: "benefits",  title: "Benefits" },
];
const DONOR_TYPES      = ["members", "corporates", "hnwi"];
const DONOR_TYPE_LABELS = { members: "Members", corporates: "Corporates", hnwi: "High Net Worth Individuals" };
const DONOR_CATEGORIES = ["current", "former", "potential"];
const ACTION_YEARS      = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];

export const useOverviewData = () => {
  const { user } = useUser();

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

  // Tool 5 — manual load
  const { loadKeyMessages } = useKeyMessages(user?.id);
  const [tool5Data, setTool5Data]       = useState({});
  const [tool5Loading, setTool5Loading] = useState(true);
  useEffect(() => {
    if (!user?.id) return;
    loadKeyMessages().then(data => { setTool5Data(data); setTool5Loading(false); });
  }, [user?.id]);

  // ── Tool 6 ────────────────────────────────────────────────────────────
  const {
    programs: tool6Programs,
    loadData: loadTool6,
    initialLoading: tool6Loading,
  } = useFundraisingActionPlan();

  useEffect(() => {
    if (user?.id) loadTool6();
  }, [user?.id]);

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

  // ── Tool 5 derived data ──────────────────────────────────────────────
  const tool5Summary = DONOR_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = DONOR_TYPES.reduce((dAcc, dt) => {
      dAcc[dt] = SECTIONS.reduce((sum, sec) => {
        return sum + (Number(tool5Data?.[sec.id]?.[cat]?.[dt]) || 0);
      }, 0);
      return dAcc;
    }, {});
    return acc;
  }, {});

  // Grand total across everything
  const tool5GrandTotal = DONOR_CATEGORIES.reduce((sum, cat) =>
    sum + DONOR_TYPES.reduce((s2, dt) => s2 + (tool5Summary[cat][dt] || 0), 0), 0);

  // ── Tool 6 derived data ───────────────────────────────────────────────
  const tool6Totals = ACTION_YEARS.reduce((acc, _, yi) => {
    acc.expenses[yi] = 0;
    acc.revenue[yi]  = 0;
    tool6Programs.forEach(p =>
      p.strategies.forEach(s => {
        acc.expenses[yi] += parseFloat(s.years[yi]?.expenses) || 0;
        acc.revenue[yi]  += parseFloat(s.years[yi]?.revenue)  || 0;
      })
    );
    return acc;
  }, { expenses: Array(5).fill(0), revenue: Array(5).fill(0) });

  // Collect all funding prospects that have content (for notes block)
  const tool6FundingNotes = [];
  tool6Programs.forEach(p =>
    p.strategies.forEach(s => {
      if (s.fundingProspects?.trim()) {
        tool6FundingNotes.push({
          program:  p.name,
          strategy: s.name,
          note:     s.fundingProspects,
        });
      }
    })
  );

  // ── Tool 7 — auto-fetches via its own useEffect ───────────────────
  const { formData: tool7FormData, isLoading: tool7Loading } = useFundraisingPolicies();

  const POLICY_FIELDS = [
    { key: "partner_with",               label: "1. We will partner with..."                                       },
    { key: "not_partner_with",           label: "2. We will NOT partner with..."                                   },
    { key: "contribution_handling",      label: "3. Upon receiving contributions, we will..."                      },
    { key: "fund_usage",                 label: "4. The funds raised will be used for..."                          },
    { key: "stakeholder_acknowledgement",label: "5. We will acknowledge stakeholders by..."                        },
    { key: "policy_responsibility",      label: "6. Fundraising policy formulation is the responsibility of..."   },
  ];

  // Check if at least one field has content
  const tool7HasContent = POLICY_FIELDS.some(f => tool7FormData?.[f.key]?.trim());

  return {
    isLoading: tool1Loading || tool2Loading || tool3Loading || tool4Loading || tool5Loading || tool6Loading || tool7Loading,

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
    tool5: {
      rawData:    tool5Data,
      summary:    tool5Summary,
      grandTotal: tool5GrandTotal,
      sections:   SECTIONS,
      DONOR_TYPES, DONOR_TYPE_LABELS, DONOR_CATEGORIES,
      isComplete: tool5GrandTotal > 0,
    },
    tool6: {
      programs:     tool6Programs,
      totals:       tool6Totals,
      fundingNotes: tool6FundingNotes,
      years:        ACTION_YEARS,
      isComplete:   tool6Programs.length > 0,
    },
    tool7: {
      formData:     tool7FormData,
      fields:       POLICY_FIELDS,
      isComplete:   tool7HasContent,
    },
  };
};