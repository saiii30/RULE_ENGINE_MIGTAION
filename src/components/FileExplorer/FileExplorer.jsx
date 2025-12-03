

import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import Store from "../../Store";
import { useEffect } from "react";
import { observer } from "mobx-react";
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

        Store.treedata.forEach((data) => {

        })
        Store.parentId = topParentId
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
        <div style={{width : "15%",padding: "8px",position : "relative",background :"#1f2937",height : "100%",color : "white",overflowY : "auto"}}>

      {/* <button onClick={handleAddParent}>Add Parent</button> */}
      <div style={{ marginTop: 20 }}>{renderTree(Store.treedata)}</div>


  </div>
    )
})