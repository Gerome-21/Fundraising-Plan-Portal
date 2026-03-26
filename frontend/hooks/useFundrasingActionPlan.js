import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import supabase from '../src/supabase-connect';

export const useFundraisingActionPlan = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [programs, setPrograms] = useState([]);

  // Fetch all programs with their strategies and year data
  const fetchPrograms = async () => {
    if (!user?.id) return [];

    try {
      const { data, error } = await supabase
        .from('programs')
        .select(`
          id,
          name,
          created_at,
          strategies:strategies (
            id,
            name,
            funding_prospects,
            created_at,
            strategy_years (
              id,
              year_index,
              expenses,
              revenue
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to load fundraising action plan');
      return [];
    }
  };

  // Transform database data to component format
  const transformData = (dbPrograms) => {
    return dbPrograms.map(program => ({
      id: program.id,
      name: program.name || '',
      expanded: true,
      strategies: (program.strategies || []).map(strategy => ({
        id: strategy.id,
        name: strategy.name || '',
        fundingProspects: strategy.funding_prospects || '',
        years: Array(5).fill().map((_, idx) => {
          const yearData = strategy.strategy_years?.find(y => y.year_index === idx + 1);
          return {
            year: `Year ${idx + 1}`,
            expenses: yearData?.expenses?.toString() || '',
            revenue: yearData?.revenue?.toString() || ''
          };
        })
      }))
    }));
  };

  // Save all data to database
  const saveAllData = async (programsData) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return false;
    }

    setLoading(true);
    try {
      // 1. Delete all existing data for this user
      const { data: existingPrograms, error: fetchError } = await supabase
        .from('programs')
        .select('id')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      // Delete strategies years first (due to foreign key constraints)
      for (const program of existingPrograms || []) {
        const { data: strategies } = await supabase
          .from('strategies')
          .select('id')
          .eq('program_id', program.id);

        if (strategies && strategies.length > 0) {
          const strategyIds = strategies.map(s => s.id);
          const { error: deleteYearsError } = await supabase
            .from('strategy_years')
            .delete()
            .in('strategy_id', strategyIds);

          if (deleteYearsError) throw deleteYearsError;
        }

        // Delete strategies
        const { error: deleteStrategiesError } = await supabase
          .from('strategies')
          .delete()
          .eq('program_id', program.id);

        if (deleteStrategiesError) throw deleteStrategiesError;
      }

      // Delete programs
      const { error: deleteProgramsError } = await supabase
        .from('programs')
        .delete()
        .eq('user_id', user.id);

      if (deleteProgramsError) throw deleteProgramsError;

      // 2. Insert new data
      for (const program of programsData) {
        // Skip programs without a name
        if (!program.name.trim()) continue;

        // Insert program
        const { data: newProgram, error: programError } = await supabase
          .from('programs')
          .insert([{
            user_id: user.id,
            name: program.name
          }])
          .select()
          .single();

        if (programError) throw programError;

        // Insert strategies for this program
        for (const strategy of program.strategies) {
          // Skip strategies without a name
          if (!strategy.name.trim()) continue;

          const { data: newStrategy, error: strategyError } = await supabase
            .from('strategies')
            .insert([{
              program_id: newProgram.id,
              name: strategy.name,
              funding_prospects: strategy.fundingProspects || ''
            }])
            .select()
            .single();

          if (strategyError) throw strategyError;

          // Insert years for this strategy
          const yearEntries = [];
          strategy.years.forEach((year, idx) => {
            const expenses = parseFloat(year.expenses) || 0;
            const revenue = parseFloat(year.revenue) || 0;
            
            // Only insert if either expenses or revenue is non-zero
            if (expenses !== 0 || revenue !== 0) {
              yearEntries.push({
                strategy_id: newStrategy.id,
                year_index: idx + 1,
                expenses: expenses,
                revenue: revenue
              });
            }
          });

          if (yearEntries.length > 0) {
            const { error: yearsError } = await supabase
              .from('strategy_years')
              .insert(yearEntries);

            if (yearsError) throw yearsError;
          }
        }
      }

      toast.success('Successfully saved!');
      return true;
    } catch (error) {
      console.error('Error saving fundraising action plan:', error);
      toast.error('Failed to save fundraising action plan');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load data from database
  const loadData = async () => {
    if (!user?.id) {
      setPrograms([]);
      setInitialLoading(false);
      return;
    }

    setInitialLoading(true);
    try {
      const dbPrograms = await fetchPrograms();
      const transformedData = transformData(dbPrograms);
      setPrograms(transformedData);
    } catch (error) {
      console.error('Error loading data:', error);
      setPrograms([]);
    } finally {
      setInitialLoading(false);
    }
  };

  // Add a new program (local state only)
  const addProgram = (currentPrograms) => {
    const newId = Date.now(); // Temporary ID for local state
    return [
      ...currentPrograms,
      {
        id: newId,
        name: "",
        strategies: [],
        expanded: true
      }
    ];
  };

  // Remove program (local state only)
  const removeProgram = (currentPrograms, programId) => {
    return currentPrograms.filter(p => p.id !== programId);
  };

  // Add strategy (local state only)
  const addStrategy = (currentPrograms, programId) => {
    const newStrategyId = Date.now();
    return currentPrograms.map(program => {
      if (program.id === programId) {
        return {
          ...program,
          strategies: [
            ...program.strategies,
            {
              id: newStrategyId,
              name: "",
              fundingProspects: "",
              years: Array(5).fill().map((_, idx) => ({
                year: `Year ${idx + 1}`,
                expenses: "",
                revenue: ""
              }))
            }
          ]
        };
      }
      return program;
    });
  };

  // Remove strategy (local state only)
  const removeStrategy = (currentPrograms, programId, strategyId) => {
    return currentPrograms.map(program => {
      if (program.id === programId) {
        return {
          ...program,
          strategies: program.strategies.filter(s => s.id !== strategyId)
        };
      }
      return program;
    });
  };

  // Update program name (local state only)
  const updateProgramName = (currentPrograms, programId, name) => {
    return currentPrograms.map(program =>
      program.id === programId ? { ...program, name } : program
    );
  };

  // Update strategy name (local state only)
  const updateStrategyName = (currentPrograms, programId, strategyId, name) => {
    return currentPrograms.map(program => {
      if (program.id === programId) {
        return {
          ...program,
          strategies: program.strategies.map(strategy =>
            strategy.id === strategyId ? { ...strategy, name } : strategy
          )
        };
      }
      return program;
    });
  };

  // Update strategy funding prospects (local state only)
  const updateFundingProspects = (currentPrograms, programId, strategyId, fundingProspects) => {
    return currentPrograms.map(program => {
      if (program.id === programId) {
        return {
          ...program,
          strategies: program.strategies.map(strategy =>
            strategy.id === strategyId ? { ...strategy, fundingProspects } : strategy
          )
        };
      }
      return program;
    });
  };

  // Update year value (local state only)
  const updateYearValue = (currentPrograms, programId, strategyId, yearIndex, field, value) => {
    return currentPrograms.map(program => {
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
    });
  };

  // Toggle program expansion
  const toggleProgram = (currentPrograms, programId) => {
    return currentPrograms.map(program =>
      program.id === programId ? { ...program, expanded: !program.expanded } : program
    );
  };

  return {
    programs,
    loading,
    initialLoading,
    saveAllData,
    loadData,
    addProgram,
    removeProgram,
    addStrategy,
    removeStrategy,
    updateProgramName,
    updateStrategyName,
    updateFundingProspects,
    updateYearValue,
    toggleProgram,
    setPrograms
  };
};