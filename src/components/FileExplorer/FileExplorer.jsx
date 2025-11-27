

import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";


export const FileExplorer = ({treeData,popupOpen,selectedNode,setPopupOpen,setTreeData,setSelectedNode,setHoverId,globalId,setColumns,hoverId,setGlobalId,handleAddGroup}) => {
 const studentList = ["Sample1", "Sample2", "Sample3", "Sample4"];
 const ruleOrGroup = ["Rule","Group"];
    
    
    
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
                  ConditionId: `ConditionId${globalId}`,
                  SelectAttribute: "33",
                  Condition: "33",
                  SelectValue: "33",
                  Flag: "33",
                  Actions: "33",
                  ruleorgroup: "rule",
                },
              ],
            },
          ]);
          setGlobalId((id) => id + 1);
         } 
      };
    
      // Add Parent
      const handleAddParent = () => {
        const newParent = {
          id: Date.now().toString(),
          name: "Parent",
          children: [],
          isOpen: true,
          level : 0,
        };
        setTreeData([...treeData, newParent]);
      };
    
      // Node click → open popup
      const handleNodeClick = (node) => {
        
        setSelectedNode(node);
        setPopupOpen(true);
      };
    
      const ruleOrGroupSelect = (value) => {
        if(value === "Rule")
        {
          setPopupOpen(false);
          handleSubmit("rule")
    
        }
        else if(value === "Group")
        {
          setPopupOpen(false);
         handleAddGroup()
        }
      }
    
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
              <span onClick={() => handleNodeClick(node)}>{node.name}</span>
    
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
        <div style={{width : "20%",padding: "20px",position : "relative" }}>

      <button onClick={handleAddParent}>Add Parent</button>
      <div style={{ marginTop: 20 }}>{renderTree(treeData)}</div>

      {/* Popup */}
      {popupOpen && selectedNode.level <= 1 && (
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
      )}



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
      )}
    

  </div>
    )
}