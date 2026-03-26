import React, { useState } from "react";
import { useUser } from "../../../context/UserContext";
import supabase from "../../../src/supabase-connect";
import { useSelfAssessment } from "../../../hooks/useSelfAssessment";
import SwotAnalysis from "../../Tool1Components/SwotAnalysis";
import OrganizationalStructure from "../../Tool1Components/OrganizationalStructure";

const Tool1SelfAssessment = () => {
  const {
    loading,
    uploading,
    chart,
    swotData,
    handleSwotChange,
    handleSaveSwot,
    handleUploadChart,
    handleDeleteChart
  } = useSelfAssessment();
  return (
    <>
      <h2 className="text-2xl font-bold text-[#121212] mb-4">
        Tool 1: Self Assessment
      </h2>
      <section className="mb-6">
        <h3 className="font-semibold mb-2">Objectives</h3>
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

      <SwotAnalysis
        swotData={swotData}
        handleSwotChange={handleSwotChange}
        handleSaveSwot={handleSaveSwot}
        loading={loading}
      />

      <div className="flex align-center justify-center mb-2">
        <p className="text-xs text-gray-400">Page 3</p>
      </div>

      <OrganizationalStructure
        chart={chart}
        uploading={uploading}
        handleUploadChart={handleUploadChart}
        handleDeleteChart={handleDeleteChart}
      />
    </>
  );
};

export default Tool1SelfAssessment;