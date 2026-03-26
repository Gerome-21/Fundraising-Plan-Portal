import React, { useState } from "react";
import usePotentialDonor from "../../../hooks/usePotentialDonor";
import DonorPyramidSkeleton from "../../Tool4Components.jsx/DonorPyramidSkeleton";
import { StatsCards } from "../../Tool4Components.jsx/StatsCards";
import { HeatFilter } from "../../Tool4Components.jsx/HeatFilter";
import { PyramidGrid } from "../../Tool4Components.jsx/PyramidGrid";
import { DonorModal } from "../../Tool4Components.jsx/DonorModal";

const Tool4DonorPyramid = () => {
  const { donors, loading, saving, addDonor, updateDonor, deleteDonor } = usePotentialDonor();
  const [showModal, setShowModal] = useState(false);
  const [editDonor, setEditDonor] = useState(null);
  const [modalDefaults, setModalDefaults] = useState({ level: "MEDIUM", heat: "WARM" });
  const [filterHeat, setFilterHeat] = useState(null);

  const countByHeat = (heat) => donors.filter((d) => d.heat === heat).length;
  const countByLevel = (level) => donors.filter((d) => d.level === level).length;

  const handleEdit = (donor) => {
    setEditDonor(donor);
    setModalDefaults({ level: donor.level, heat: donor.heat });
    setShowModal(true);
  };

  const handleSave = async (form) => {
    if (editDonor?.id) {
      await updateDonor(editDonor.id, form);
    } else {
      await addDonor(form);
    }
    setShowModal(false);
    setEditDonor(null);
  };

  const handleDelete = (id) => deleteDonor(id);

  const handleCellAdd = (level, heat) => {
    setEditDonor(null);
    setModalDefaults({ level, heat });
    setShowModal(true);
  };

  const stats = [
    { label: "Total Donors", value: donors.length, color: "text-[#001033]", bg: "bg-indigo-50" },
    { label: "HOT", value: countByHeat("HOT"), color: "text-red-700", bg: "bg-red-50" },
    { label: "WARM", value: countByHeat("WARM"), color: "text-yellow-800", bg: "bg-yellow-50" },
    { label: "COLD", value: countByHeat("COLD"), color: "text-blue-900", bg: "bg-blue-50" },
    { label: "HIGH Level", value: countByLevel("HIGH"), color: "text-emerald-800", bg: "bg-emerald-50" },
    { label: "MEDIUM", value: countByLevel("MEDIUM"), color: "text-indigo-700", bg: "bg-indigo-50" },
    { label: "LOW Level", value: countByLevel("LOW"), color: "text-gray-500", bg: "bg-gray-100" },
  ];

  if (loading) {
    return <DonorPyramidSkeleton />;
  }

  return (
    <div className="text-gray-900 max-w-auto mx-auto px-1">
      <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
        <div>
          <h2 className="m-0 text-2xl font-bold text-[#001033] tracking-tight">
            Tool 4: Potential Donor Pyramid
          </h2>
        </div>
       
      </div>
      <section className="mb-6">
          <h3 className="font-semibold mb-2">Objectives</h3>
          <p className="text-sm">
            Identify the different donors (both current and potential) for your Organization. 
            Classify them into HIGH, MEDIUM, and LOW-LEVEL givers, then HOT, WARM, and COLD 
            according to the three Cs – Connection, Capability, and Concern. Plot them on the triangle below.
          </p>
        </section>

      {/* Summary Stats */}
      <StatsCards stats={stats} />

      {/* Heat filter */}
      <HeatFilter filterHeat={filterHeat} setFilterHeat={setFilterHeat} />

      {/* Pyramid Grid */}
      <PyramidGrid
        donors={donors}
        filterHeat={filterHeat}
        onEditDonor={handleEdit}
        onDeleteDonor={handleDelete}
        onAddDonor={handleCellAdd}
      />

      {/* Modal */}
      {showModal && (
        <DonorModal
          donor={editDonor}
          defaultLevel={modalDefaults.level}
          defaultHeat={modalDefaults.heat}
          saving={saving}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditDonor(null);
          }}
        />
      )}
    </div>
  );
};

export default Tool4DonorPyramid;