// PackagesPanel.jsx
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import Store from "../Store";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const PackagesPanel = observer(() => {

   const navigate = useNavigate();
  useEffect(() => {
    // fetch packages from DB on mount
    Store.fetchFlowsFromDB();
  }, []);

  const applySnapshot = (value) => {
    Store.applySnapshot(value)
     navigate("/flow");
  }

  return (
    <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            zIndex: 2000,
            width: 360,
            height : 300,
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
      <h3 className="text-lg font-bold mb-2">Saved Packages</h3>

      <div style={{display : "flex",width : "100%",alignItems : "center",justifyContent : "space-between"}}>
<button
        className="mb-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => Store.fetchFlowsFromDB()}
      >
        Refresh
      </button>

      
    <button
      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
      onClick={() => Store.visibile = false} // close the modal
    >
      Cancel
    </button>
      
      
  </div>

      {Store.packages.length === 0 ? (
        <p className="text-gray-500" style={{marginTop : "6px"}}>No packages saved</p>
      ) : (
        <ul className="space-y-2">
          {Store.packages.map((pkg) => (
            <li
              key={pkg._id || pkg.packageId}
              style={{marginTop : "10px"}}
              className="p-2 bg-white border rounded shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{cursor : "pointer"}} onClick={async () => {
    const pkg1 = await axios.get(`http://localhost:4000/api/flows/${pkg.packageId}`);
    applySnapshot(pkg1.data.snapshot); // restore flow in canvas
    Swal.fire("Restored", `${pkg.packageId} loaded`, "success");
  }}>{pkg.packageId}</span>
                <span className="text-xs text-gray-500">
                  {new Date(pkg.createdAt).toLocaleString()}
                </span>
              </div>
              <div style={{cursor : "pointer"}} className="text-xs text-gray-600" >{pkg.notes}</div>
              <div className="flex gap-2 mt-2">
              
              </div>
            </li>
          ))}
        </ul>
      )}

       
    </div>
  );
});

export default PackagesPanel;
