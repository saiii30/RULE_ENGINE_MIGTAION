// src/FlowMain/Flow.jsx
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { FaPlus, FaMinus, FaExpandArrowsAlt } from "react-icons/fa";
import { toJS } from "mobx";
import { useState } from "react";
import Store from "../Store";
import Navbar from "../Component/Navbar";
import FileExplorer from "../Component/FileExplorer";
import FlowCanvas from "./FlowCanvas";


const FlowDiagram = observer(() => {

  useEffect(() => {
          fetch("http://localhost:4000/columns").then((res) => res.json()).then((result) => Store.columns = result).catch((err)=> console.error(err));          
      }, []);



   const [hoverId, setHoverId] = useState(null);
   const [selectedNode, setSelectedNode] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
   const [treeData, setTreeData] = useState([]);
 

  // fetch collections and show popup
  const Tableselect = async () => {
    console.log("Fetching collections...");
    Store.closeColumnPicker();
    await Store.fetchCollections();
    Store.isSidebarVisible1 = true;
    Store.pop = "Parent";


     
  };

  const selectvalue = (name) => {
    Store.tableName = name;
    Store.addCollection(name);
    Store.isSidebarVisible1 = false;

    const newParent = {
          id: Date.now().toString(),
          name:  Store.tableName,
          children: [],
          isOpen: true,
          level : 0,
        };
        setTreeData([...treeData, newParent]);
    console.log("Selected:", name, "->", toJS(Store.selectedCollections));
  };

  const handleclose = () => {
    Store.isSidebarVisible1 = false;
  };

  const handlePopupSelect = (label) => {
    
    
        
    
        // Stop adding children to level 2
        if (selectedNode.level === 2) {
          return;
        }
        
        const newChild = {
          id: Date.now().toString(),
          name: label,
          children: [],
          isOpen: true,
          level: selectedNode.level + 1,
        };
    
        const addChild = (nodes) =>
          nodes.map((n) => {
            if (n.id === selectedNode.id) {
              return { ...n, children: [...n.children, newChild] };
            }
            return { ...n, children: addChild(n.children) };
          });
    
        setTreeData(addChild(treeData));
        Store.isSidebarVisible1 = false;
      };
    

  return (
    <div className="w-full h-screen " style={{position : "relative"}}>
      {/* Navbar */}
      <Navbar />

      {/* layout: left sidebar (18%) + main (rest) */}
      <div style={{display : "flex",width : "100%",position : "relative"}}  >
        {/* Sidebar: narrowed to ~18% */}
        <div style={{ width: "15%", borderRight: "5px solid #ddd",padding: "2px" }}>

           
          <FileExplorer treeData={treeData} setTreeData={setTreeData} setPopupOpen={setPopupOpen} popupOpen={popupOpen} setSelectedNode={setSelectedNode} selectedNode={selectedNode} hoverId={hoverId} setHoverId={setHoverId}/>
        </div>

        {/* Main area */}

        <div style={{width : "85%",position : "relative"}}>

        

        <div
        style={{
         
          display: "flex",
          gap: 12,
          width: "fit-content",
          padding:"10px",
          marginTop:"auto",
          marginBottom:"auto",
          alignItems: "center",
          padding:"19px",
          borderRadius: 8,
        }}
      >
        <button
          className="p-3 rounded-full"
          title="Add / Select collection"
          style={{ background: "#10b981", color: "white", border: "none" }}
          onClick={Tableselect}
        >
          <FaPlus />
        </button>

        <button
          className="px-3 py-2 rounded-md"
          style={{ background: "#2563eb", color: "white", border: "none" }}
          onClick={Store.saveFile}
        >
          Save
        </button>

        <button
          className="px-3 py-2 rounded-md"
          style={{ background: "#2563eb", color: "white", border: "none" }}
          onClick={Store.saveFileAs}
        >
          Save As
        </button>

        <button
          className="px-3 py-2 rounded-md"
          style={{ background: "#2563eb", color: "white", border: "none" }}
          onClick={Store.downloadLastExport}
        >
          Download
        </button>
      </div>

        <div style={{ width: "100%",position : "relative"}}>
          <FlowCanvas />
        </div>

        </div>
        
      </div>

      {/* Top-right buttons: keep them above the table */}
      

      
      {/* popup modal for selecting collections */}
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
    </div>
  );
});

export default FlowDiagram;
