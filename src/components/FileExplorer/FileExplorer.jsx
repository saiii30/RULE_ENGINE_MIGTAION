

import { MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import Store from "../../Store";
import { useEffect } from "react";
import { observer } from "mobx-react";
import { useState } from "react";
export const FileExplorer = observer(({selectedNode,setPopupOpen,setSelectedNode,setHoverId,hoverId}) => {

  useEffect(() => {
    console.log("treedata updated:", Store.treedata);
  }, [Store.treedata]);  

  //  const [open, setOpen] = useState(false);
  // const [showDataPopup, setShowDataPopup] = useState(false);

  // const [rows, setRows] = useState([]);

  // const addRow = () => {
  //   setRows([...rows, { label: "", type: "" }]);
  // };

  // const updateRow = (index, key, value) => {
  //   const newRows = [...rows];
  //   newRows[index][key] = value;
  //   setRows(newRows);
  // };



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
          style={{position : "absolute",top : "0px",width :"120px",height : "270px",padding : "10px",left : "70px"}}
        >
          <button
           
            onClick={() =>Store.menudrop = false}
          >
            ✕
          </button>
 
          
 
          <div style={{marginTop : "2px",display : "flex",flexDirection : "column",gap : "10px"  }}>
 
            {/* + Button */}
            <button
            style={{marginTop : "10px"}}
              className="p-2 bg-blue-600 text-white rounded-md"
              onClick={Tableselect}
            >
              Add
            </button>
 
            {/* Save */}
            <button
              className="p-2 bg-blue-600 text-white rounded-md"
              onClick={() => {
                Store.menudrop = false;
                Store.saveFile();
              }}
            >
              Save
            </button>
 
            {/* Save As */}
            <button
              className="p-2 bg-blue-600 text-white rounded-md"
              onClick={() => {
                Store.menudrop = false;
                Store.saveFileAs();
              }}
            >
              Save As
            </button>
 
            {/* Download */}
            <button
              className="p-2 bg-blue-600 text-white rounded-md"
              onClick={() => {
                Store.menudrop = false;
                Store.downloadLastExport();
              }}
            >
              Download
            </button>

            <button
        onClick={() => Store.setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Action
      </button>


      {Store.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl  shadow-xl text-black" style={{width : "400px"}}>
            <h2 className="text-xl font-semibold mb-4">Add Fields</h2>

            <button
              onClick={() => Store.addRow()}
              className="mb-4 px-3 py-1 bg-green-600 text-white rounded-lg"
            >
              + Add
            </button>

            {/* ROWS */}
            {Store.rows.map((row, index) => (
  <div key={index} className="flex items-center gap-2 mb-3">

    <input
      type="text"
      placeholder="Enter label"
      value={row.label}
      onChange={(e) => Store.updateRow(index, "label", e.target.value)}
      className="border p-2 rounded w-1/3"
    />

    <select
      value={row.type}
      onChange={(e) => Store.updateRow(index, "type", e.target.value)}
      className="border p-2 rounded w-1/3"
    >
      <option value="">Select type</option>
      <option value="String">String</option>
      <option value="Number">Number</option>
      <option value="Boolean">Boolean</option>
    </select>

    {/* DELETE BUTTON */}
    <button
      onClick={() => Store.deleteRow(index)}
      className="px-3 py-2 bg-red-500 text-white rounded-lg"
    >
      Delete
    </button>
  </div>
))}




            {/* BUTTONS */}
            <div className="flex justify-between mt-4">
              {/* <button
                onClick={() => Store.setShowDataPopup(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl"
              >
                Show
              </button> */}

              <button
                onClick={() => Store.setOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHOW DATA POPUP */}
     
          </div>
        </div>
      )}
 
    


  </div>
    )
})