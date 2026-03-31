// hooks/useFundraisingPolicies.js
import { useState, useEffect } from "react";
import supabase from "../src/supabase-connect";
import { useUser } from "../context/UserContext";
import toast from "react-hot-toast";

const useFundraisingPolicies = () => {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    partner_with: "",
    not_partner_with: "",
    contribution_handling: "",
    fund_usage: "",
    stakeholder_acknowledgement: "",
    policy_responsibility: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing data
  const fetchPolicies = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("fundraising_policies")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setFormData({
          partner_with: data.partner_with || "",
          not_partner_with: data.not_partner_with || "",
          contribution_handling: data.contribution_handling || "",
          fund_usage: data.fund_usage || "",
          stakeholder_acknowledgement:
            data.stakeholder_acknowledgement || "",
          policy_responsibility: data.policy_responsibility || "",
        });
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // ✅ Save (Insert or Update)
  const savePolicies = async () => {
    if (!user) {
      toast.error("User not logged in");
      return;
    }

    setLoading(true);

    try {
      // Check if already exists
      const { data: existing } = await supabase
        .from("fundraising_policies")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let response;

      if (existing) {
        // UPDATE
        response = await supabase
          .from("fundraising_policies")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
      } else {
        // INSERT
        response = await supabase
          .from("fundraising_policies")
          .insert([
            {
              user_id: user.id,
              ...formData,
            },
          ]);
      }

      if (response.error) {
        console.error(response.error);
        toast.error("Failed to save");
      } else {
        toast.success("Policies saved successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPolicies();
  }, [user]);

  return {
    formData,
    setFormData,
    savePolicies,
    loading,
  };
};

export default useFundraisingPolicies;
