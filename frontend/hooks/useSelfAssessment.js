import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useUser } from '../context/UserContext';
import supabase from '../src/supabase-connect';

export const useSelfAssessment = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [chart, setChart] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [swotData, setSwotData] = useState({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: ''
  });

  // Load SWOT data
  useEffect(() => {
    const loadSwotData = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('swot_analysis')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading SWOT:', error);
          return;
        }

        if (data) {
          setSwotData({
            strengths: data.strengths || '',
            weaknesses: data.weaknesses || '',
            opportunities: data.opportunities || '',
            threats: data.threats || ''
          });
        }
      } catch (error) {
        console.error('Error loading SWOT data:', error);
      }
    };

    loadSwotData();
  }, [user]);

  // Load organizational chart
  useEffect(() => {
    const loadChart = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('organizational_chart')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setChart(data);
      }
    };

    loadChart();
  }, [user]);

  // Load chart data from org_charts table
  useEffect(() => {
    const loadChartData = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('org_charts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setChartData({
          nodes: data.nodes,
          edges: data.edges
        });
      }
    };

    loadChartData();
  }, [user]);

  const handleSwotChange = (e) => {
    const { name, value } = e.target;
    setSwotData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSwot = async () => {
    if (!user) {
      toast.error('You must be logged in to save SWOT analysis');
      return;
    }

    // if (!swotData.strengths && !swotData.weaknesses && !swotData.opportunities && !swotData.threats) {
    //   toast.error('Please fill in at least one SWOT field');
    //   return;
    // }

    setLoading(true);
    try {
      const { data: existingData, error: fetchError } = await supabase
        .from('swot_analysis')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        toast.error('Error checking existing SWOT analysis');
        return;
      }

      let result;
      if (existingData) {
        result = await supabase
          .from('swot_analysis')
          .update({
            strengths: swotData.strengths,
            weaknesses: swotData.weaknesses,
            opportunities: swotData.opportunities,
            threats: swotData.threats,
            updated_at: new Date()
          })
          .eq('user_id', user.id);
      } else {
        result = await supabase
          .from('swot_analysis')
          .insert([{
            user_id: user.id,
            strengths: swotData.strengths,
            weaknesses: swotData.weaknesses,
            opportunities: swotData.opportunities,
            threats: swotData.threats
          }]);
      }

      if (result.error) {
        toast.error('Failed to save SWOT analysis');
      } else {
        toast.success(existingData ? 'Successfully updated!' : 'Successfully saved!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const extractFileNameFromUrl = (url) => {
    const matches = url.match(/\/uploads\/(.+)$/);
    return matches ? matches[1] : null;
  };

  const handleUploadChart = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      if (chart?.image_url) {
        const oldFileName = extractFileNameFromUrl(chart.image_url);
        if (oldFileName) {
          await supabase.storage.from('uploads').remove([oldFileName]);
        }
      }

      const fileName = `${user.id}-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('uploads').getPublicUrl(fileName);
      const imageUrl = data.publicUrl;

      let result;
      if (chart) {
        result = await supabase
          .from('organizational_chart')
          .update({ image_url: imageUrl, updated_at: new Date() })
          .eq('user_id', user.id);
      } else {
        result = await supabase
          .from('organizational_chart')
          .insert([{ user_id: user.id, image_url: imageUrl }]);
      }

      if (result.error) throw result.error;

      setChart({ image_url: imageUrl, updated_at: new Date() });
      toast.success('Organizational chart uploaded!');
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteChart = async () => {
    if (!chart) return;

    try {
      if (chart.image_url) {
        const fileName = extractFileNameFromUrl(chart.image_url);
        if (fileName) {
          const { error: storageError } = await supabase.storage
            .from('uploads')
            .remove([fileName]);

          if (storageError) {
            console.error('Error deleting file from storage:', storageError);
          }
        }
      }

      const { error } = await supabase
        .from('organizational_chart')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setChart(null);
      toast.success('Chart deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete chart');
    }
  };

  // Add function to save chart data
  const handleSaveChartData = async (data) => {
    if (!user) {
      toast.error('You must be logged in to save');
      return false;
    }

    setLoading(true);
    try {
      const { data: existingData, error: fetchError } = await supabase
        .from('org_charts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      let result;
      if (existingData) {
        result = await supabase
          .from('org_charts')
          .update({
            name: 'Organization Chart',
            nodes: data.nodes,
            edges: data.edges,
            updated_at: new Date()
          })
          .eq('user_id', user.id);
      } else {
        result = await supabase
          .from('org_charts')
          .insert([{
            user_id: user.id,
            name: 'Organization Chart',
            nodes: data.nodes,
            edges: data.edges
          }]);
      }

      if (result.error) throw result.error;

      setChartData(data);
      toast.success('Organization chart saved!');
      return true;
    } catch (error) {
      console.error('Error saving chart:', error);
      toast.error('Failed to save chart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    uploading,
    chart,
    chartData,
    swotData,
    handleSwotChange,
    handleSaveSwot,
    handleUploadChart,
    handleDeleteChart,
    handleSaveChartData
  };
};