import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import supabase from '../../src/supabase-connect';
import { useUser } from '../../context/UserContext';

export const useProgramNeeds = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch all program requirements with their budgets
  const fetchProgramRequirements = async () => {
    if (!user?.id) return [];

    try {
      const { data, error } = await supabase
        .from('program_requirements')
        .select(`
          id,
          requirement_name,
          comments,
          created_at,
          updated_at,
          program_requirement_budgets (
            id,
            year,
            amount
          ),
          committed_funds (
            id,
            fund_type,
            year,
            amount,
            comments
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching program requirements:', error);
      toast.error('Failed to load program requirements');
      return [];
    }
  };

  // Save or update a program requirement
  const saveRequirement = async (requirementData, budgets, committedFunds) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return null;
    }

    setLoading(true);
    try {
      let requirementId = requirementData.id;

      // Insert or update program requirement
      if (requirementId) {
        // Update existing requirement
        const { error: updateError } = await supabase
          .from('program_requirements')
          .update({
            requirement_name: requirementData.name,
            comments: requirementData.comments || '',
            updated_at: new Date().toISOString()
          })
          .eq('id', requirementId)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Insert new requirement
        const { data: newRequirement, error: insertError } = await supabase
          .from('program_requirements')
          .insert([{
            user_id: user.id,
            requirement_name: requirementData.name,
            comments: requirementData.comments || ''
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        requirementId = newRequirement.id;
      }

      // Save budgets for this requirement
      if (requirementId) {
        await saveRequirementBudgets(requirementId, budgets);
      }

      toast.success('Requirement saved successfully');
      return requirementId;
    } catch (error) {
      console.error('Error saving requirement:', error);
      toast.error('Failed to save requirement');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save requirement budgets
  const saveRequirementBudgets = async (requirementId, budgets) => {
    try {
      // First, delete existing budgets for this requirement
      const { error: deleteError } = await supabase
        .from('program_requirement_budgets')
        .delete()
        .eq('requirement_id', requirementId);

      if (deleteError) throw deleteError;

      // Prepare new budget entries
      const budgetEntries = Object.entries(budgets)
        .filter(([_, amount]) => amount && !isNaN(amount) && amount > 0)
        .map(([year, amount]) => ({
          requirement_id: requirementId,
          year: parseInt(year),
          amount: parseFloat(amount)
        }));

      if (budgetEntries.length > 0) {
        const { error: insertError } = await supabase
          .from('program_requirement_budgets')
          .insert(budgetEntries);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error saving budgets:', error);
      throw error;
    }
  };

  // Save committed funds
  const saveCommittedFunds = async (requirementId, fundType, budgets, comments = '') => {
    try {
      // Delete existing committed funds for this requirement and fund type
      const { error: deleteError } = await supabase
        .from('committed_funds')
        .delete()
        .eq('requirement_id', requirementId)
        .eq('fund_type', fundType);

      if (deleteError) throw deleteError;

      // Prepare new committed fund entries
      const fundEntries = Object.entries(budgets)
        .filter(([_, amount]) => amount && !isNaN(amount) && amount > 0)
        .map(([year, amount]) => ({
          requirement_id: requirementId,
          fund_type: fundType,
          year: parseInt(year),
          amount: parseFloat(amount),
          comments: comments || ''
        }));

      if (fundEntries.length > 0) {
        const { error: insertError } = await supabase
          .from('committed_funds')
          .insert(fundEntries);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error saving committed funds:', error);
      throw error;
    }
  };

  // Delete a requirement and all related data
  const deleteRequirement = async (requirementId) => {
  if (!user?.id) return false;

  try {
    // First, delete all related budgets
    const { error: budgetsError } = await supabase
      .from('program_requirement_budgets')
      .delete()
      .eq('requirement_id', requirementId);

    if (budgetsError) throw budgetsError;

    // Second, delete all related committed funds
    const { error: fundsError } = await supabase
      .from('committed_funds')
      .delete()
      .eq('requirement_id', requirementId);

    if (fundsError) throw fundsError;

    // Finally, delete the requirement itself
    const { error } = await supabase
      .from('program_requirements')
      .delete()
      .eq('id', requirementId)
      .eq('user_id', user.id);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting requirement:', error);
    toast.error('Failed to delete requirement');
    return false;
  }
};

  // Save all program needs data at once
  const saveAllProgramNeeds = async (requirements, committedFundsList) => {
  if (!user?.id) {
    toast.error('User not authenticated');
    return false;
  }

  setLoading(true);
  try {
    // First, get all existing requirements to delete their child records
    const { data: existingRequirements, error: fetchError } = await supabase
      .from('program_requirements')
      .select('id')
      .eq('user_id', user.id);

    if (fetchError) throw fetchError;

    // Delete child records for each existing requirement
    for (const req of existingRequirements || []) {
      // Delete budgets
      const { error: budgetsError } = await supabase
        .from('program_requirement_budgets')
        .delete()
        .eq('requirement_id', req.id);

      if (budgetsError) throw budgetsError;

      // Delete committed funds
      const { error: fundsError } = await supabase
        .from('committed_funds')
        .delete()
        .eq('requirement_id', req.id);

      if (fundsError) throw fundsError;
    }

    // Now delete all requirements
    const { error: deleteError } = await supabase
      .from('program_requirements')
      .delete()
      .eq('user_id', user.id);

    if (deleteError) throw deleteError;

    // Save each requirement with its budgets
    for (const req of requirements) {
      if (req.name.trim()) {
        const { data: newRequirement, error: insertError } = await supabase
          .from('program_requirements')
          .insert([{
            user_id: user.id,
            requirement_name: req.name,
            comments: req.comments || ''
          }])
          .select()
          .single();

        if (insertError) throw insertError;

        if (newRequirement) {
          await saveRequirementBudgets(newRequirement.id, req.budgets);
        }
      }
    }

    // Handle committed funds - you might want to link these to a specific requirement
    // For now, we'll create a dummy requirement if none exists
    let targetRequirementId;
    const { data: existingReq } = await supabase
      .from('program_requirements')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (existingReq) {
      targetRequirementId = existingReq.id;
    } else {
      // Create a dummy requirement if none exists
      const { data: dummyReq, error: dummyError } = await supabase
        .from('program_requirements')
        .insert([{
          user_id: user.id,
          requirement_name: 'Committed Funds Reference',
          comments: ''
        }])
        .select()
        .single();

      if (dummyError) throw dummyError;
      targetRequirementId = dummyReq.id;
    }

    // Delete existing committed funds for this requirement
    const { error: deleteCommittedError } = await supabase
      .from('committed_funds')
      .delete()
      .eq('requirement_id', targetRequirementId);

    if (deleteCommittedError) throw deleteCommittedError;

    // Save committed funds
    for (const fund of committedFundsList) {
      const fundEntries = Object.entries(fund.budgets)
        .filter(([_, amount]) => amount && !isNaN(amount) && amount > 0)
        .map(([year, amount]) => ({
          requirement_id: targetRequirementId,
          fund_type: fund.name,
          year: parseInt(year),
          amount: parseFloat(amount),
          comments: fund.comments || ''
        }));

      if (fundEntries.length > 0) {
        const { error: insertError } = await supabase
          .from('committed_funds')
          .insert(fundEntries);

        if (insertError) throw insertError;
      }
    }

    toast.success('All program needs saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving all program needs:', error);
    toast.error('Failed to save program needs');
    return false;
  } finally {
    setLoading(false);
  }
};

  // Load data from Supabase into the component state format
  const loadProgramNeeds = async () => {
    if (!user?.id) return { requirements: [], committedFunds: [] };

    setInitialLoading(true);
    try {
      const requirements = await fetchProgramRequirements();
      
      // Transform Supabase data to component state format
      const transformedRequirements = requirements.map(req => ({
        id: req.id,
        name: req.requirement_name || '',
        budgets: (req.program_requirement_budgets || []).reduce((acc, budget) => {
          acc[budget.year.toString()] = budget.amount;
          return acc;
        }, {}),
        comments: req.comments || ''
      }));

      // Transform committed funds (assuming they're linked to requirements)
      // This is a simplified transformation - adjust based on your data structure
      const committedFundsMap = new Map();
      
      requirements.forEach(req => {
        (req.committed_funds || []).forEach(fund => {
          if (!committedFundsMap.has(fund.fund_type)) {
            committedFundsMap.set(fund.fund_type, {
              name: fund.fund_type,
              budgets: {},
              comments: fund.comments || ''
            });
          }
          const fundItem = committedFundsMap.get(fund.fund_type);
          fundItem.budgets[fund.year.toString()] = fund.amount;
        });
      });

      const transformedCommittedFunds = Array.from(committedFundsMap.values());

      // If no committed funds exist, return default ones
      if (transformedCommittedFunds.length === 0) {
        return {
          requirements: transformedRequirements,
          committedFunds: [
            { name: "Grants?", budgets: {}, comments: "" },
            { name: "Interest Income?", budgets: {}, comments: "" },
            { name: "Consultancy Contracts?", budgets: {}, comments: "" },
            { name: "Conference/Membership Fees/Sponsorship?", budgets: {}, comments: "" }
          ]
        };
      }

      return {
        requirements: transformedRequirements,
        committedFunds: transformedCommittedFunds
      };
    } catch (error) {
      console.error('Error loading program needs:', error);
      toast.error('Failed to load program needs');
      return { requirements: [], committedFunds: [] };
    } finally {
      setInitialLoading(false);
    }
  };

  return {
    loading,
    initialLoading,
    fetchProgramRequirements,
    saveRequirement,
    saveRequirementBudgets,
    saveCommittedFunds,
    deleteRequirement,
    saveAllProgramNeeds,
    loadProgramNeeds
  };
};