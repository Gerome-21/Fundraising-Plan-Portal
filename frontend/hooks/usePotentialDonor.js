import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import supabase from '../src/supabase-connect';

const usePotentialDonor = () => {
  const { user } = useUser();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Fetch all donors for the current user ──────────────────────────────────
  const fetchDonors = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('potential_donors')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setDonors(data || []);
    } catch (err) {
      console.error('fetchDonors error:', err);
      toast.error('Failed to load donors');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  // ── Add a new donor ────────────────────────────────────────────────────────
  const addDonor = async (form) => {
    if (!user?.id) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('potential_donors')
        .insert([
          {
            user_id: user.id,
            name: form.name.trim(),
            level: form.level,
            heat: form.heat,
            connection: form.connection,
            capability: form.capability,
            concern: form.concern,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setDonors((prev) => [...prev, data]);
      toast.success('Donor added');
    } catch (err) {
      console.error('addDonor error:', err);
      toast.error('Failed to add donor');
    } finally {
      setSaving(false);
    }
  };

  // ── Update an existing donor ───────────────────────────────────────────────
  const updateDonor = async (id, form) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('potential_donors')
        .update({
          name: form.name.trim(),
          level: form.level,
          heat: form.heat,
          connection: form.connection,
          capability: form.capability,
          concern: form.concern,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)   // safety: only own rows
        .select()
        .single();

      if (error) throw error;
      setDonors((prev) => prev.map((d) => (d.id === id ? data : d)));
      toast.success('Donor updated');
    } catch (err) {
      console.error('updateDonor error:', err);
      toast.error('Failed to update donor');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete a donor ─────────────────────────────────────────────────────────
  const deleteDonor = async (id) => {
    try {
      const { error } = await supabase
        .from('potential_donors')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);   // safety: only own rows

      if (error) throw error;
      setDonors((prev) => prev.filter((d) => d.id !== id));
      toast.success('Donor removed');
    } catch (err) {
      console.error('deleteDonor error:', err);
      toast.error('Failed to delete donor');
    }
  };

  return { donors, loading, saving, addDonor, updateDonor, deleteDonor };
};

export default usePotentialDonor;