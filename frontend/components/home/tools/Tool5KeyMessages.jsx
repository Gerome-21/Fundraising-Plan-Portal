import React from "react";

const categories = [
  {
    label: "Current",
    fields: [
      "# of Members",
      "# of Corporates",
      "# of High Net Worth Individuals",
    ],
  },
  {
    label: "Former",
    fields: [
      "# of Members",
      "# of Corporates",
      "# of High Net Worth Individuals",
    ],
  },
  {
    label: "Potential",
    fields: [
      "# of Members",
      "# of Corporates",
      "# of High Net Worth Individuals",
    ],
  },
];

const Section = ({ title }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-6 mb-2">

      <h3 className="text-lg font-bold text-[#001033] mb-4">
        {title}
      </h3>

      <div className="space-y-2">

        {categories.map((cat, i) => (
          <div key={i}>

            <h4 className="text-sm font-semibold text-gray-600 mb-2">
              {cat.label}
            </h4>

            <div className="grid md:grid-cols-3 gap-4">

              {cat.fields.map((field, idx) => (
                <div
                  key={idx}
                  className="border rounded-xl p-4 bg-gray-50"
                >

                  <label className="text-xs text-gray-500 block mb-1">
                    {field}
                  </label>

                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400 outline-none"
                    // placeholder={`Enter ${field.toLowerCase()}`}
                  />

                </div>
              ))}

            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

const Tool5KeyMessages = () => {
  return (
    <>
      <h2 className="text-2xl font-bold text-[#001033] mb-4">
        Tool 5: Key Messages and Communications
      </h2>
      <section className="mb-2 ">
        <h3 className="font-medium">Objectives</h3>
        <ul className="text-sm list-disc pl-6 mb-6 space-y-1">
          <li>To strategize on how to engage your potential organization donors using strong key messages</li>
          <li>To identify needed materials and strategies to engage and nurture donors</li>
        </ul>
        <p className="text-sm">I
          dentify needed Fundraising materials and strategies that correspond to the different potential donors:
        </p>
      </section>
      <Section title="Key Messages: Raise awareness" />

      <Section title="Key Messages: Capture their interest" />

      <Section title="Key Messages: Call to action" />

      <Section title="Key Messages: Benefits" />

    </>
  ); 
};

export default Tool5KeyMessages;
