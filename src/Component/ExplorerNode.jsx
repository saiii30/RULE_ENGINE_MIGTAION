import React from "react";
import { useState } from "react";
import { observer } from "mobx-react-lite";
import { FaPlus } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdEdit, MdDelete } from "react-icons/md";
import Store from "../Store";


const ExplorerNode = observer(({  store ,treeData,setTreeData,setPopupOpen,popupOpen,setSelectedNode,selectedNode,hoverId,setHoverId}) => {


  const studentList = ["Sample1", "Sample2", "Sample3", "Sample4"];


      const handleNodeClick = (node1,level) => {


        if(level === 2)
        {
          Store.isSidebarVisible1 = false
        }
        else{
Store.isSidebarVisible1 = true
        }

        
        Store.pop = node1.name

        if(level >= 2)
        {
           
          store.openRuleGroupPicker(node1.id, node1.name);
        }
        
        setSelectedNode(node1);
        setPopupOpen(true);
      };
    
    
      // Toggle expand/collapse
      const toggleNode = (id) => {
        const update = (nodes) =>
          nodes.map((n) => {
            if (n.id === id) return { ...n, isOpen: !n.isOpen };
            return { ...n, children: update(n.children) };
          });
    
        setTreeData(update(treeData));
      };
   
      // Popup: add child
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
        };
    
        const addChild = (nodes) =>
          nodes.map((n) => {
            if (n.id === selectedNode.id) {
              return { ...n, children: [...n.children, newChild] };
            }
            return { ...n, children: addChild(n.children) };
          });
    
        setTreeData(addChild(treeData));
        setPopupOpen(false);
      };
    
      const renderTree = (nodes, level = 0) =>
        nodes.map((node, index) => (
          <div key={node.id} style={{ marginLeft: level * 10, position: "relative",cursor : "pointer" }}>
    
            {/* Vertical Line */}
            {level > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: -6,
                  top: 0,
                  bottom: 0,
                  width: "1px",
                  background: "#555"
                }}
              ></div>
            )}
    
            
            {/* Node row */}
            <div
             onMouseEnter={() => setHoverId(node.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{display : "flex",padding : "5px"}}
            >
              {/* Arrow */}
             
                <span onClick={() => toggleNode(node.id)}>
                  {node.isOpen ? <MdOutlineKeyboardArrowDown /> : <MdKeyboardArrowRight />}
                </span>
              
    
              {/* Node Name */}
              <span onClick={() => handleNodeClick(node,node.level)}>{node.name}</span>
    
               {hoverId === node.id && (
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  
                  alignItems: "center",
                  width : "100px",
                  position : "absolute",
                  left : "100px",
                  top : "2px"
                  
                  
                }}
              >
                <button
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "none",
                    background: "orange",
                    cursor: "pointer",
                    color : "black",
                    display : "flex",
                    alignItems : "center",
                    justifyContent : "center" 
                    
                  }}
                >
                  <MdDelete />
                </button>
    
                <button
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "none",
                    background: "yellow",
                    cursor: "pointer",
                    color : "black",
                    display : "flex",
                    alignItems : "center",
                    justifyContent : "center"
                  }}
                >
                  <MdEdit />
                </button>
    
                <button
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "none",
                    background: "green",
                    color : "black",
                    cursor: "pointer",
                     display : "flex",
                    alignItems : "center",
                    justifyContent : "center"
                  }}
                >
                  <FaPlus />
                </button>
              </div>
            )}
            </div>
            {/* Children */}
            {node.isOpen && renderTree(node.children, level + 1)}
          </div>
        ));
    


  return (
    <div style={{width : "100%"}}>

      
      <div style={{ marginTop: 20 }}>{renderTree(treeData)}</div>

      
      {/* {popupOpen && selectedNode.level <= 1 && (
        <div
          style={{
            position: "absolute",
            left : "100%",
           
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: 20,
            width : "300px",
            height : "300px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            backgroundColor : "red",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >

          <div style={{ display: "flex", justifyContent: "flex-end"}}>
      <button
        onClick={() => setPopupOpen(false)}
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px",
          cursor: "pointer",
          position : "fixed"
        }}
      >
        X
      </button>
    </div>

          {Store.columns.map((s) => (
            <button
              key={s}
              onClick={() => handlePopupSelect(s)}
              style={{
                display: "block",
                margin: "8px 0",
                width: "100%",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )} */}
  </div>
  );
});

export default ExplorerNode;
