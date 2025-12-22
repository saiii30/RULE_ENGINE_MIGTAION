

import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import Store from "../../Store";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { useState } from "react";
import './FileExplorer.css'
export const FileExplorer = observer(({selectedNode,setPopupOpen,setSelectedNode,setHoverId,hoverId}) => {

  useEffect(() => {
    console.log("treedata updated:", Store.treedata);
  }, [Store.treedata]);  


  const getTopParentId = (nodes, targetId) => {
  for (let parent of nodes) {

    if (parent.id === targetId) {
      return parent.id; // Clicked top parent
    }

    if (parent.children) {
      for (let child of parent.children) {

        if (child.id === targetId) {
          return parent.id; // Child → return top parent
        }

        if (child.children) {
          for (let sub of child.children) {

            if (sub.id === targetId) {
              return parent.id; // Subchild → return top parent
            }

          }
        }
      }
    }
  }
  return null;
};



      const handleNodeClick = (node1,level) => {

         const topParentId = getTopParentId(Store.treedata, node1.id);
        if(level === 2)
        {
          Store.isSidebarVisible1 = false
        }
        else{
         Store.isSidebarVisible1 = true
        }
        Store.pop = node1.name

        Store.parentId = topParentId
        setSelectedNode(node1);
        alert("Clicked node: " + node1.name);
        setPopupOpen(true);
      };
    
    
      
    
      // Toggle expand/collapse
      const toggleNode = (id) => {
        const update = (nodes) =>
          nodes.map((n) => {
            if (n.id === id) return { ...n, isOpen: !n.isOpen };
            return { ...n, children: update(n.children) };
          });
    
       Store.setTreedata(update(Store.treedata));
      };
    

    
      const renderTree = (nodes, level = 0) =>
        nodes.map((node, index) => (
          <div key={node.id} style={{ marginLeft: level * 10, position: "relative",cursor : "pointer" }}>
           
            {/* Vertical Line */}
            {level > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: -10,
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
    
        const Tableselect = async() =>{
Store.menudrop = false;
  Store.isSidebarVisible1 = true;
    Store.pop = "Parent";
    await Store.fetchCollections();
}

    return (
        <div style={{width : "15%",padding: "8px",position : "relative",background :"#1f2937",height : "100%",color : "white",overflowY : "auto"}}>

      {/* <button onClick={handleAddParent}>Add Parent</button> */}
      <div style={{ marginTop: 20,position : "relative" }}>{renderTree(Store.treedata)}</div>

        {Store.menudrop && (
        <div
          className="bg-white shadow-xl rounded-lg  z-50 border"
          style={{position : "absolute",top : "0px",width :"120px",height : "220px",padding : "10px",left : "70px"}}
        >
          <div
           style={{display : 'flex',alignItems : "center",justifyContent : "flex-end",width : "100%",color : "black",cursor : "pointer"}}
            onClick={() =>Store.menudrop = false}
             className="menu-item"
          >
            ✕
          </div>
 
          
 
          <div style={{marginTop : "2px",display : "flex",flexDirection : "column",gap : "10px" ,color : "black",cursor : "pointer"}}>
 
            {/* + Button */}
            <div
            style={{marginTop : "10px"}}
               className="menu-item"
              onClick={Tableselect}
            >
              Add
            </div>
 
            {/* Save */}
            <div
                className="menu-item"
              onClick={() => {
                Store.menudrop = false;
                Store.saveFile();
              }}
            >
              Save
            </div>
 
            {/* Save As */}
            <div
             className="menu-item"
              onClick={() => {
                Store.menudrop = false;
                Store.saveFileAs();
              }}
            >
              Save As
            </div>
 
            {/* Download */}
            <div
              className="menu-item"
              onClick={() => {
                Store.menudrop = false;
                Store.downloadLastExport();
              }}
            >
              Download
            </div>

            <div
        onClick={() => Store.setOpen(true)}
       className="menu-item"
      >
        Action
      </div>


      

      {/* SHOW DATA POPUP */}
     
          </div>
        </div>
      )}
 
    


  </div>
    )
})