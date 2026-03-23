import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import supabase from '../src/supabase-connect';

// Converts flat Supabase rows → nested { [section]: { [category]: { [donor_type]: value } } }
const rowsToNested = (rows) => {
  const nested = {};
  rows.forEach(({ section, category, donor_type, value }) => {
    if (!nested[section]) nested[section] = {};
    if (!nested[section][category]) nested[section][category] = {};
    nested[section][category][donor_type] = value;
  });
  return nested;
};

// Converts nested state → flat array of row shapes ready for upsert
const nestedToRows = (userId, nestedData) => {
  const rows = [];
  Object.entries(nestedData).forEach(([section, categories]) => {
    Object.entries(categories).forEach(([category, donorTypes]) => {
      Object.entries(donorTypes).forEach(([donor_type, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          rows.push({
            user_id: userId,
            section,
            category,
            donor_type,
            value: Number(value),
          });
        }
      });
    });
  });
  return rows;
};

export const useKeyMessages = (userId) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Load ───────────────────────────────────────────────────────────────────
  const loadKeyMessages = useCallback(async () => {
    if (!userId) return {};
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('key_messages')
        .select('section, category, donor_type, value')
        .eq('user_id', userId);

      if (error) throw error;
      return rowsToNested(data || []);
    } catch (err) {
      console.error('loadKeyMessages error:', err);
      toast.error('Failed to load key messages');
      return {};
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // ── Save (upsert all rows) ─────────────────────────────────────────────────
  // Supabase upsert requires a unique constraint on (user_id, section, category, donor_type).
  // Add that constraint in your Supabase table if not already present.
  const saveKeyMessages = useCallback(async (nestedData) => {
    if (!userId) return false;
    setSaving(true);
    try {
      const rows = nestedToRows(userId, nestedData);

      if (rows.length === 0) {
        toast('Nothing to save');
        return true;
      }

      const { error } = await supabase
        .from('key_messages')
        .upsert(rows, {
          onConflict: 'user_id,section,category,donor_type',
          ignoreDuplicates: false,
        });

      if (error) throw error;
      toast.success('Saved successfully');
      return true;
    } catch (err) {
      console.error('saveKeyMessages error:', err);
      toast.error('Failed to save key messages');
      return false;
    } finally {
      setSaving(false);
    }
  }, [userId]);

 

  return { loadKeyMessages, saveKeyMessages, loading, saving };
};