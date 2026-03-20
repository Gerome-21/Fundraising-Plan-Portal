import { useState } from "react";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";
import supabase from "../../src/supabase-connect";

export const useGiftRange = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // LOAD DATA
  const loadGiftRanges = async () => {
    if (!user?.id) return [];

    try {
      const { data, error } = await supabase
        .from("gift_ranges")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        giftRange: item.gift_range,
        gifts: item.gifts,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load gift ranges");
      return [];
    }
  };

  // SAVE ALL (replace existing)
  const saveGiftRanges = async (rows) => {
    if (!user?.id) return false;

    setLoading(true);

    try {
      // 1. DELETE existing rows
      const { error: deleteError } = await supabase
        .from("gift_ranges")
        .delete()
        .eq("user_id", user.id);

      if (deleteError) throw deleteError;

      // 2. INSERT new rows
      const formatted = rows
        .filter(r => r.giftRange || r.gifts) // ignore empty rows
        .map(r => ({
          user_id: user.id,
          gift_range: Number(r.giftRange) || 0,
          gifts: Number(r.gifts) || 0,
        }));

      if (formatted.length > 0) {
        const { error: insertError } = await supabase
          .from("gift_ranges")
          .insert(formatted);

        if (insertError) throw insertError;
      }

      toast.success("Saved successfully!");
      return true;

    } catch (err) {
      console.error(err);
      toast.error("Failed to save data");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loadGiftRanges,
    saveGiftRanges,
    loading,
  };
};
