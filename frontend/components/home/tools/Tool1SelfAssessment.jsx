import React, { useState } from "react";
import { FiActivity, FiImage, FiRepeat, FiRotateCcw, FiSave, FiTrash, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useUser } from "../../../context/UserContext";
import supabase from "../../../src/supabase-connect";

const Tool1SelfAssessment = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [swotData, setSwotData] = useState({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: ''
  });

  const handleSwotChange = (e) => {
    const { name, value } = e.target;
    setSwotData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSwot = async () => {
    if (!user) {
      toast.error('You must be logged in to save SWOT analysis');
      return;
    }

    if (!swotData.strengths && !swotData.weaknesses && !swotData.opportunities && !swotData.threats) {
      toast.error('Please fill in at least one SWOT field');
      return;
    }

    setLoading(true);

    try {
      // Check if user already has a SWOT analysis
      const { data: existingData, error: fetchError } = await supabase
        .from('swot_analysis')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing SWOT:', fetchError);
        toast.error('Error checking existing SWOT analysis');
        setLoading(false);
        return;
      }

      let result;
      
      if (existingData) {
        // Update existing SWOT analysis
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
        // Insert new SWOT analysis
        result = await supabase
          .from('swot_analysis')
          .insert([
            {
              user_id: user.id,
              strengths: swotData.strengths,
              weaknesses: swotData.weaknesses,
              opportunities: swotData.opportunities,
              threats: swotData.threats
            }
          ]);
      }

      if (result.error) {
        console.error('Error saving SWOT:', result.error);
        toast.error('Failed to save SWOT analysis');
      } else {
        toast.success(existingData ? 'SWOT analysis updated successfully!' : 'SWOT analysis saved successfully!');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

const extractFileNameFromUrl = (url) => {
  // Extract the file path from the Supabase storage URL
  // URL format: https://[project].supabase.co/storage/v1/object/public/uploads/filename
  const matches = url.match(/\/uploads\/(.+)$/);
  return matches ? matches[1] : null;
};

const handleUploadChart = async (e) => {
  const file = e.target.files[0];
  if (!file || !user) return;

  setUploading(true);

  try {
    // If there's an existing chart, delete the old file first
    if (chart?.image_url) {
      const oldFileName = extractFileNameFromUrl(chart.image_url);
      if (oldFileName) {
        await supabase.storage
          .from("uploads")
          .remove([oldFileName]);
      }
    }

    const fileName = `${user.id}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("uploads")
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    let result;

    if (chart) {
      result = await supabase
        .from("organizational_chart")
        .update({
          image_url: imageUrl,
          updated_at: new Date()
        })
        .eq("user_id", user.id);
    } else {
      result = await supabase
        .from("organizational_chart")
        .insert([
          {
            user_id: user.id,
            image_url: imageUrl
          }
        ]);
    }

    if (result.error) throw result.error;

    setChart({ image_url: imageUrl, updated_at: new Date() });

    toast.success("Organizational chart uploaded!");

  } catch (err) {
    console.error(err);
    toast.error("Upload failed");
  }

  setUploading(false);
  // Clear the input value to allow uploading the same file again
  e.target.value = '';
};

const handleDeleteChart = async () => {
  if (!chart) return;

  try {
    // Delete the file from storage first
    if (chart.image_url) {
      const fileName = extractFileNameFromUrl(chart.image_url);
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from("uploads")
          .remove([fileName]);
        
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          // Continue with database deletion even if storage delete fails
        }
      }
    }

    // Delete the database record
    const { error } = await supabase
      .from("organizational_chart")
      .delete()
      .eq("user_id", user.id);

    if (error) throw error;

    setChart(null);
    toast.success("Chart deleted successfully");

  } catch (err) {
    console.error('Delete error:', err);
    toast.error("Failed to delete chart");
  }
};



  React.useEffect(() => {
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

  React.useEffect(() => {
  const loadChart = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("organizational_chart")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setChart(data);
    }
  };

  loadChart();
}, [user]);

  return (
    <>
      <h2 className="text-2xl font-bold text-[#121212] mb-4">
        Tool 1: Self Assessment
      </h2>
      <section className="mb-2">
        <h3 className="font-medium">Objectives</h3>
        <ul className="text-sm list-disc pl-6 mb-4 space-y-1">
          <li>To evaluate your Organization's Fund Raising readiness and capacity</li>
          <li>To identify factors in your internal and external environments that affect its ability to raise funds</li>
        </ul>
      </section>
      <section className="mb-2">
        <h3 className="font-medium">1. Vision, Mission, Objectives</h3>
        <ul className="text-sm list-disc pl-6 mb-4 space-y-1">
          a. What is your perception/opinion of your work<br/>
          b. What do you envision for the organization 3-5 years from now?<br/>
        </ul>
      </section>
      <section className="mb-2">
        <h3 className="font-medium">2. Environment Scanning</h3>
        <ul className="text-sm list-disc pl-6 mb-4 space-y-1">
          a. What do you think are the organization’s main Fund Raising strengths and weaknesses/challenges?<br/>
          b. What have been the past successes and /or failures specific to Fund Raising?<br/>
          c. What do you think makes the organization unique?<br/>
          d. What do you think are the organization’s Fund Raising opportunities in the external environment?<br/>
          e. What are the threats against the organization in pursuing its Fund Raising objectives (competitors, challenges)?<br/>
          f. Which organizations are your competitors in programs?  How about it Fund Raising?<br/>
          g. What do you think are the trends and factors that affect the organization’s ability to raise funds?
        </ul>
      </section>
      <section className="mb-2">
        <h3 className="font-medium">3. Constituency Building and Communications</h3>
        <ul className="text-sm list-disc pl-6 mb-4 space-y-1">
          a. What impact of the organization can be communicated to the public?<br/>
          b. How do you market your services/programs?<br/>
          c. What are you doing to build relationships with current and potential donors?<br/>
        </ul>
      </section>
      <section className="mb-2">
        <h3 className="font-medium">4. Fund Raising Priorities</h3>
        <ul className="text-sm list-disc pl-6 mb-4 space-y-1">
          a. What are your organization priorities for Fund Raising? Core funding for the program? Country-based funding?  Activity-based funding?<br/>
        </ul>
      </section>
      <section className="mb-2">
        <h3 className="font-medium">5. Fund Raising History/Practices</h3>
        <ul className="text-sm list-disc pl-6 mb-4 space-y-1">
          a. How would you assess the organization’s funding status currently?<br/>
          b. How do you think the organization could raise more funds?<br/>
          c. Who is primarily responsible for the organization’s Fund Raising efforts?<br/>
          d. Which Fund Raising campaigns of the organization would you consider successful or not successful?  What Fund Raising strategies would be relevant to the organization? Why?<br/>
          e. Who to ask and not to ask for money from?  Who should do the asking?
        </ul>
      </section>
      <section className="mb-2">
        <h3 className="font-medium">6. Financial Goals and Program Costs</h3>
        <ul className="text-sm list-disc pl-6 mb-4 space-y-1">
          a. How do you fund your programs? How much do you need for operations/overhead costs?<br/>
          b. What are your organization’s current sources of funding (grants, gifts, and earned income)? What percentage of the total amount to these sources comprise?<br/>
          c. Which program expense items are in most need of funding?<br/>
          d. How much do you need to raise over the next 2 to 3 years?<br/>
          e. Tell us more about your Fund Raising systems: How donations/funding are received, recorded, and acknowledged, database, financial reports.
        </ul>
      </section>
      <section className="mb-8">
        <h3 className="font-medium">7. Relationship with Home Institution</h3>
        <ul className="text-sm list-disc pl-6 mb-4 space-y-1">
          a. What support/resources does the home institution provide the organization?<br/>
          b. What are the advantages of the project to the home institution?<br/>
          c. How does the home institution envision the project in 5 years?<br/>
          d. Who acts as the governing body for the organization?
        </ul>
      </section>

      <div className="flex align-center justify-center mb-2">
        <p className="text-xs text-gray-400">Page 2</p>
      </div>
      
      <section className="mb-8 pt-8 border-t-1 border-gray-400">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-[#121212]">SWOT Analysis</h3>
          <button
            onClick={handleSaveSwot}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 bg-[#22864D] text-white rounded-lg hover:bg-[#22864D]/90 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <FiSave className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save SWOT Analysis'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">S</div>
              <h4 className="font-semibold ">Strengths</h4>
            </div>
            <textarea 
              name="strengths"
              value={swotData.strengths}
              onChange={handleSwotChange}
              rows="6"
              placeholder="What are your organization's strengths in fund raising?"
              className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500/30 focus:border-green-500 outline-none transition text-sm"
            ></textarea>
          </div>

          <div className="bg-red-50 shadow-md rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">W</div>
              <h4 className="font-semibold ">Weaknesses</h4>
            </div>
            <textarea 
              name="weaknesses"
              value={swotData.weaknesses}
              onChange={handleSwotChange}
              rows="6"
              placeholder="What internal challenges or weaknesses exist?"
              className="w-full p-3 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500/30 focus:border-red-500 outline-none transition text-sm"
            ></textarea>
          </div>

          <div className="bg-blue-50 shadow-md rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">O</div>
              <h4 className="font-semibold">Opportunities</h4>
            </div>
            <textarea 
              name="opportunities"
              value={swotData.opportunities}
              onChange={handleSwotChange}
              rows="6"
              placeholder="What external opportunities exist for fund raising?"
              className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition text-sm"
            ></textarea>
          </div>

          <div className="bg-orange-50 shadow-md rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#121212] rounded-full flex items-center justify-center text-white font-bold">T</div>
              <h4 className="font-semibold">Threats</h4>
            </div>
            <textarea 
              name="threats"
              value={swotData.threats}
              onChange={handleSwotChange}
              rows="6"
              placeholder="What external threats could impact fund raising?"
              className="w-full p-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 outline-none transition text-sm"
            ></textarea>
          </div>
        </div>
      </section>

      <div className="flex align-center justify-center mb-2">
        <p className="text-xs text-gray-400">Page 3</p>
      </div>

      <section className="mb-8 pt-8 border-t-1 border-gray-400">
        <h3 className="font-bold text-lg mb-4">Organizational Structure</h3>
        <p className="text-sm mb-4">Provide a diagram of the current organizational chart, paying particular attention to the resource mobilization team and its relationships with other units. For smaller organizations, provide alternative structures that assume the responsibilities of resource mobilization.</p>
        
        {!chart ? (
          // Upload state 
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 transition-all hover:border-[#22864D] group">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#22864D]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#22864D]/20 transition-all">
                <FiImage className="w-8 h-8 text-[#22864D]"/>
              </div>
              
              <h4 className="font-semibold text-gray-700 mb-2">Upload Organization Chart</h4>
              <p className="text-sm text-gray-500 mb-4">Drag and drop or click to upload (PNG, JPG, JPEG)</p>
              
              <label className="cursor-pointer">
                <span className="bg-[#22864D] hover:bg-[#22864D]/90 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all inline-block shadow-md hover:shadow-lg">
                  {uploading ? 'Uploading...' : 'Choose File'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleUploadChart}
                  disabled={uploading}
                />
              </label>
              
              <div className="mt-4 text-xs text-gray-400">
                Max file size: 10MB
              </div>
            </div>
          </div>
        ) : (
          // Preview state 
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col items-center">
              {/* Image preview*/}
              <div className="relative w-full max-w-2xl mb-4 bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={chart.image_url}
                  alt="Organizational Chart"
                  className="w-full h-auto object-contain max-h-[500px]"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <label>
                  <span className="bg-white text-green-500 hover:bg-gray-200 px-5 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer">
                    <FiRepeat/>
                    Replace
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".png,.jpg,.jpeg,.pdf"
                    onChange={handleUploadChart}
                    disabled={uploading}
                  />
                </label>

                <button
                  onClick={handleDeleteChart}
                  className="bg-gray-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
                >
                <FiTrash2 className="w-4 h-4"/>
                Delete
                </button>
              </div>

              {/* Uploading overlay */}
              {uploading && (
                <div className="mt-4 w-full bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <svg className="animate-spin h-4 w-4 text-[#22864D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </section>
    </>
  );
};

export default Tool1SelfAssessment;