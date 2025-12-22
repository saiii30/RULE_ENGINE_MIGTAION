// src/FlowMain/Flow.jsx

import { observer } from "mobx-react";



import Navbar from "../Component/Navbar";
import Store from "../Store";
import { useEffect } from "react";

import React, { useState } from "react";
import Swal from "sweetalert2";

import {FileExplorer} from "../components/FileExplorer/FileExplorer";
import {Rules} from "../components/Rules/Rules";



const FlowDiagram = observer(() => {
    



  const [ruleCounter, setRuleCounter] = useState(1);

  const [globalId, setGlobalId] = useState(1); 
  const [hoverId, setHoverId] = useState(null);
   const [selectedNode, setSelectedNode] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [treecount,settreecount] = useState(1);



  useEffect(() => {
  if (!selectedNode) return;

  let rootParent = null;

  // ✅ CASE 1: selected node itself is root
  if (selectedNode.level === 0) {
    rootParent = selectedNode;
  } 
  // ✅ CASE 2: selected node is child / sub-child
  else {
    const findRoot = (nodes) => {
      for (const node of nodes) {
        if (node.children?.some(c => c.id === selectedNode.id)) {
          return node;
        }
        const found = node.children && findRoot(node.children);
        if (found) return found;
      }
      return null;
    };

    rootParent = findRoot(Store.treedata);
  }

  if (!rootParent?.name) return;

  const collectionName = rootParent.name.toLowerCase(); // employee | patient | ecommerce

  fetch(`http://localhost:4000/columns/${collectionName}`)
    .then(res => res.json())
    .then(keys => {
      Store.columns = keys; // ✅ already array
    })
    .catch(err => console.error(err));

}, [selectedNode]);







useEffect(() => {
  try {
    // Get all keys that start with flowData:
    const keys = Object.keys(localStorage).filter(k => k.startsWith("flowData:"));
    if (keys.length === 0) return;

    const latestKey = keys[keys.length - 1]; // pick last saved snapshot
    const snap = localStorage.getItem(latestKey);
    if (snap) Store.loadSnapshot(JSON.parse(snap));
  } catch (e) {
    console.error("Failed to load snapshot from localStorage", e);
  }
}, []);




  const handleSubmit = (value) => {

    
         if (value !== "rule") return;
    if (!selectedNode || selectedNode.level !== 2) return;
          
         
          const newRule = {
    id: `column-${globalId}`,
    type: "rule",
    name: `Rule ${globalId}`,

    treeId: selectedNode ? selectedNode.id : null,
    tasks: [
      {
        id: `task-${globalId}`,
        ConditionSetId: `ConditionSetId${globalId}`,
        RuleId: `RuleId${ruleCounter}`,

        ConditionId: "Edit ConditionId",
        SelectAttribute: "Edit SelectAttribute",
        Condition: "Edit Condition",
        SelectValue: "Edit Value",
        Flag: "Edit Flag",
        Actions: "Edit Actions",
        // ruleorgroup: "rule",
      },
    ],
  };

          addRuleOrGroupToSubChild(newRule);
          setGlobalId((id) => id + 1);
          setRuleCounter((n) => n + 1);

         

         setPopupOpen(false);
      };
const handlePopupSelect = (label) => {
  if (!selectedNode) return;

  // Stop adding children to level 2
  if (selectedNode.level === 2) {
    setPopupOpen(false);
    return;
  }

  const newChild = {
    id: Date.now().toString(),
    name: label,
    children: [],
    isOpen: true,
    level: selectedNode.level + 1,
    ruleGroups: selectedNode.level + 1 === 2 ? [] : undefined,
  };

  const updateTree = (nodes) => {
    return nodes.map((n) => {
      if (n.id === selectedNode.id) {
        // ✅ Found the target node, add child and return updated node
        return { ...n, children: [...n.children, newChild] };
      } else if (n.children?.length) {
        // Recurse only if child contains the selected node
        return { ...n, children: updateTree(n.children) };
      } else {
        return n; // untouched node
      }
    });
  };

  Store.setTreedata(updateTree(Store.treedata));
  Store.isSidebarVisible1 = false;
  setPopupOpen(false);
};








      const selectvalue = (name) => {
  
    Store.addCollection(name);
    const newParent = {
          id: `tree${treecount}`,
          name: name,
          children: [],
          isOpen: true,
          level : 0,
        };
        Store.setTreedata([...Store.treedata, newParent]);
Store.isSidebarVisible1 = false;
alert(`tree${treecount}`)
settreecount((treecount) => treecount + 1)

  };

  const handleclose = () => {
    Store.isSidebarVisible1 = false;
  };

  const addRuleOrGroupToSubChild = (item) => {
    const updateTree = (nodes) =>
      nodes.map((n) => {
        if (n.id === selectedNode.id) {
          return {
            ...n,
            ruleGroups: [...(n.ruleGroups || []), item],
          };
        }
        if (n.children?.length) {
          return { ...n, children: updateTree(n.children) };
        }
        return n;
      });

    Store.setTreedata(updateTree(Store.treedata));
    console.log(
  "Updated Tree Data:",
  JSON.parse(JSON.stringify(Store.treedata))
);


  };

  
    

  const handleAddGroup = async () => {

     if (!selectedNode || selectedNode.level !== 2) return;
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
       
       
        const newColumn = {
  id: `column-${globalId}`,
  type: "group",
  name: groupName.trim(),
  collopsed: false,
  groupRuleId: `RuleId${ruleCounter}`,

  treeId: selectedNode ? selectedNode.id : null,
  tasks: [
    {
      id: `task-${globalId}`,
      ConditionSetId: `ConditionSetId${globalId}`,
      RuleId: `RuleId${ruleCounter}`,
      ConditionId: "Edit ConditionId",
      SelectAttribute: "Edit SelectAttribute",
      Condition: "Edit Condition",
      SelectValue: "Edit Value",
      Flag: "Edit Flag",
      Actions: "Edit Actions",
    },
  ],
};

        addRuleOrGroupToSubChild(newColumn);

        setGlobalId((id) => id + 1);
        setRuleCounter((n) => n + 1);

        // ✅ Success popup
        Swal.fire({
          title: "Group Created!",
          text: `Group "${groupName}" has been added successfully.`,
          icon: "success",
          confirmButtonColor: "#2563eb",
        });
      }


      setPopupOpen(false);
    };
    

    const onClose = () => {
      setPopupOpen(false);
    }
  


  return (
    <div className="w-full h-screen " style={{position : "relative"}}>
      {/* Navbar */}
      <Navbar />

      <div style={{width: "100%",display : "flex",height : "100%"}}>

        {
          popupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-72 text-center min-h-[200px]">
        <h3 className="text-lg font-bold mb-4">Choose Option</h3>
        
        <div className="flex flex-col gap-3">
          {/* Rule Button */}
          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            onClick={() => handleSubmit("rule")}
          >
            Rule
          </button>

          {/* Group Button */}
          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            onClick={() => handleAddGroup()}
          >
            Group
          </button>
        </div>

        <button
          className="mt-4 text-red-500 underline"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
          )
        }
        
        
        {Store.isSidebarVisible1 && (
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
          <button onClick={handleclose} style={{ position: "absolute", right: 12, top: 12, border: "none", background: "red", fontSize: 18 , padding:4, }}>
            ✕
          </button>

          {
            Store.pop == "Parent" ? <>
            

          <ul style={{ listStyle: "none", padding: 0 }}>
            {(Store.tablenames || []).map((table, idx) => (
              <li
                key={idx}
                onClick={() => selectvalue(table)}
                style={{
                  padding: "8px 10px",
                  cursor: "pointer",
                  borderRadius: 6,
                  marginBottom: 6,
                  
                }}
              >
                {table}
              </li>
            ))}
          </ul>

            </> : <>
            <h3 style={{ marginBottom: 12 }}>Select a Collection</h3>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {(Store.columns || []).map((table, idx) => (
              <li
                key={idx}
                onClick={() => handlePopupSelect(table)}
                
                style={{
                  padding: "8px 10px",
                  cursor: "pointer",
                  borderRadius: 6,
                  marginBottom: 6,
                  
                }}
              >
                {table}
              </li>
            ))}
          </ul></>
          }

          
        </div>
      )}
        <FileExplorer popupOpen={popupOpen} selectedNode={selectedNode} setPopupOpen={setPopupOpen}  setSelectedNode={setSelectedNode} setHoverId={setHoverId}  globalId={globalId}  setGlobalId={setGlobalId} hoverId ={hoverId} handleAddGroup={handleAddGroup}/>
      <Rules  globalId={globalId} setGlobalId={setGlobalId} handleAddGroup={handleAddGroup} selectedNode={selectedNode} ruleCounter={ruleCounter} setRuleCounter={setRuleCounter}/>
      
    </div>

     
    </div>
  );
});

export default FlowDiagram;
