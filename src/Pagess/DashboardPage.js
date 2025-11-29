// src/Pagess/DashboardPage.js
import { useNavigate } from "react-router-dom";
import Store from "../Store";
import { use } from "react";
import { useState } from "react";
import PackagesPanel from "../Component/PackagesPanel";

const DashboardPage = () => {

  const[visibile,setVisible] = useState(false);
  const navigate = useNavigate();

  // 🧹 Create New Rule → must clear all old rules
  const handleCreateRule = () => {
    // Fully reset Store
    if (Store.clear) {
      Store.clear(); // make sure this clears nodes, engines, groups, etc.
    }

    // Reinitialize counters or IDs if needed
    if (Store.initGlobalRuleCounter) {
      Store.initGlobalRuleCounter();
    }

    // Remove any persisted local storage data if you use it
    localStorage.removeItem("rulesData");
    localStorage.removeItem("groupsData");

    // Mark a session flag so FlowPage knows it’s a *new session*
    sessionStorage.setItem("mode", "new");

    // Navigate to flow
    navigate("/flow");
  };

  // 📜 Previous Rules → only load saved rules
  const handlePreviousRules = () => {
    sessionStorage.setItem("mode", "previous");
    setVisible(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="flex flex-col gap-4">
          <button
            onClick={handlePreviousRules}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Previous Rule
          </button>
          <button
            onClick={handleCreateRule}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create New Rule
          </button>
        </div>
      </div>

      {
        visibile && (
          <PackagesPanel/>

        )
      }
    </div>
  );
};

export default DashboardPage;
