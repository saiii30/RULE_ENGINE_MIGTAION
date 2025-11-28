

import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import Store from "../../Store";
import { useEffect } from "react";

export const FileExplorer = ({popupOpen,selectedNode,setPopupOpen,setSelectedNode,setHoverId,globalId,setColumns,hoverId,setGlobalId,handleAddGroup}) => {

  useEffect(() => {
    console.log("treedata updated:", Store.treedata);
  }, [Store.treedata]);  

     
      // ➕ Add Rule or Group
      const handleSubmit = (value) => {
        if (value === "rule") {
          setColumns((prev) => [
            ...prev,
            {
              id: `column-${prev.length + 1}`,
              type: "rule",
              name: `Rule ${prev.length + 1}`,
              tasks: [
                {
                  id: `task-${globalId}`,
                  ConditionSetId: `ConditionSetId${globalId}`,
                  RuleId: `RuleId${globalId}`,
                  ConditionId: "Edit ConditionId",
                  SelectAttribute: "Edit SelectAttribute",
                  Condition: "Edit Condition",
                  SelectValue: "Edit Value",
                  Flag: "Edit Flag",
                  Actions: "Edit Actions",
                  ruleorgroup: "rule",
                },
              ],
            },
          ]);
          setGlobalId((id) => id + 1);
         } 
      };
    
      
      // // Node click → open popup
      // const handleNodeClick = (node) => {
        
      //   setSelectedNode(node);
      //   setPopupOpen(true);
      // };

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
    
       Store.setTreedata(update(Store.treedata));
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
    
       Store.setTreedata(addChild(Store.treedata));
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
    

    return (
        <div style={{width : "15%",padding: "8px",position : "relative",background :"#1f2937",height : "100vh",color : "white",overflowY : "auto"}}>

      {/* <button onClick={handleAddParent}>Add Parent</button> */}
      <div style={{ marginTop: 20 }}>{renderTree(Store.treedata)}</div>


      

      {/* Popup */}
      {/* {popupOpen && selectedNode.level <= 1 && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "40%",
            background: "white",
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >

          <div style={{ display: "flex", justifyContent: "flex-end"  }}>
      <button
        onClick={() => setPopupOpen(false)}
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        X
      </button>
    </div>

          {studentList.map((s) => (
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


{/* 
      {popupOpen && selectedNode.level > 1 && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "40%",
            background: "white",
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >

          <div style={{ display: "flex", justifyContent: "flex-end"  }}>
      <button
        onClick={() => setPopupOpen(false)}
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        X
      </button>
    </div>
        

          {ruleOrGroup.map((s) => (
            <button
              key={s}
              onClick={() => ruleOrGroupSelect(s)}
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
    )
}