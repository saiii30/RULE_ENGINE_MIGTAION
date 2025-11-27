// src/FlowMain/Flow.jsx

import { observer } from "mobx-react";



import Navbar from "../Component/Navbar";


import React, { useState } from "react";
import Swal from "sweetalert2";

import {FileExplorer} from "../components/FileExplorer/FileExplorer";
import {Rules} from "../components/Rules/Rules";



const FlowDiagram = observer(() => {
    

  const [columns, setColumns] = useState([]);
  const [globalId, setGlobalId] = useState(1); 
  const [hoverId, setHoverId] = useState(null);
   const [selectedNode, setSelectedNode] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
   const [treeData, setTreeData] = useState([]);

  const handleAddGroup = async () => {
      // 🧠 Ask user for the group name
      const { value: groupName } = await Swal.fire({
        title: `<div style="color:#1e293b; font-weight:700; font-size:1.3rem;">Create New Group</div>`,
        input: "text",
        inputLabel: "Enter Group Name",
        inputPlaceholder: "e.g. Price Rules or Discount Logic",
        showCancelButton: true,
        confirmButtonText: "Create",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#2563eb",
        cancelButtonColor: "#64748b",
        inputValidator: (value) => {
          if (!value) {
            return "Please enter a group name!";
          }
          if (value.trim().length < 3) {
            return "Group name should have at least 3 characters!";
          }
        },
      });
    
      if (groupName) {
        // 🧩 Create a new column with that group name
        const newColumn = {
          id: `column-${columns.length + 1}`, // unique id
          type: "group",
          name: groupName.trim(),
          collopsed : false,
          tasks: [
            {
                id: `task-${globalId}`,
                ConditionSetId: `ConditionSetId${globalId}`,
                RuleId: `RuleId${globalId}`,
                ConditionId: `ConditionId${globalId}`,
                SelectAttribute: "33",
                Condition: "33",
                SelectValue: "33",
                Flag: "33",
                Actions: "33",
                
              },
          ], // no rules initially
        };
    
        setColumns([...columns, newColumn]);
        setGlobalId((id) => id + 1);
        // ✅ Success popup
        Swal.fire({
          title: "Group Created!",
          text: `Group "${groupName}" has been added successfully.`,
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
      }
    };
    
  


  return (
    <div className="w-full h-screen " style={{position : "relative"}}>
      {/* Navbar */}
      <Navbar />

      <div style={{width: "100%",display : "flex"}}>
        
      <FileExplorer treeData={treeData} popupOpen={popupOpen} selectedNode={selectedNode} setPopupOpen={setPopupOpen} setTreeData={setTreeData} setSelectedNode={setSelectedNode} setHoverId={setHoverId} columns={columns} globalId={globalId} setColumns={setColumns} setGlobalId={setGlobalId} hoverId ={hoverId} handleAddGroup={handleAddGroup}/>
      <Rules columns={columns} setColumns ={setColumns} globalId={globalId} setGlobalId={setGlobalId} handleAddGroup={handleAddGroup} />
      
    </div>

     
    </div>
  );
});

export default FlowDiagram;
