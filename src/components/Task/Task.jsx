// import React from "react";
// import "./Task.css";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import { Grab, GripVertical } from "lucide-react"; // 👈 drag icon (you can use any icon)
// import Swal from "sweetalert2";
// import { observer } from "mobx-react";
// import { MdDelete } from "react-icons/md";
// import Store from "../../Store";

// export const Task = observer(({
//   id,
//   editvalue,
//   ConditionSetId,
//   RuleId,
//   ConditionId,
//   SelectAttribute,
//   Condition,
//   SelectValue,
//   Flag,
  
//   column,
//   columnId,
//   handleDeleteRule,
//   sortableProps,
   
 
// }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
    
//   };

//   // Function to get dropdown numbers for a column
// const getConditionDropdownNumbers = (column) => {
//   if (column.type === "rule") {
//     // For rule type, use length of Store.column
//     return Array.from({ length: Store.column.length }, (_, i) => i + 1);
//   } else {
//     // For other types, use length of tasks array
//     const targetCol = Store.column.find((c) => c.id === column.id);
//     const taskLength = targetCol?.tasks?.length || 0;
//     return Array.from({ length: taskLength }, (_, i) => i + 1);
//   }
// };


   

//   return (
//    <div
//   className={column === "rule" ? "task" : "task1"}
// >
      
//       {/* {
//         column !== "rule" && (
//           <div  style={{position : "absolute",left : "-4px",bottom : "12px", cursor: "grab" }} {...attributes} {...listeners}>
//         <GripVertical size={18} />
//       </div>

//         )
//       } */}

//       {

//         column === "rule" && (
//           <div  style={style} ref={sortableProps.setNodeRef} {...sortableProps.attributes} {...sortableProps.listeners} className="set">
//         <GripVertical size={18} />  
//          <div>{ConditionSetId}</div>
//       </div>
//         ) 

//       }

//       {
//         column !== "rule" && (
//  <div style={style} {...attributes} {...listeners}  ref={setNodeRef} className="set"> 
//         <GripVertical size={18} />
//          <div>{ConditionSetId}</div>
//       </div>
//         )
//       }
      
     
//       <div>{RuleId}</div>
//       {
//         column === "rule" ? (
//           <div onClick={() => editvalue(id,"ConditionId")} style={{cursor : "pointer"}}>{ConditionId}</div>

//         ) : (
//           <div onClick={() => editvalue(id,"ConditionId")} style={{cursor : "pointer"}}>{ConditionId}</div>

//         )
//       }
      
//       <div onClick={() => editvalue(id,"SelectAttribute")} style={{cursor : "pointer"}}>{SelectAttribute}</div>
//       <div onClick={() => editvalue(id,"Condition")} style={{cursor : "pointer"}}>{Condition}</div>
//       <a 
//   onClick={() => editvalue(id, "SelectValue")} 
//   style={{ 
//     cursor: "pointer", 
//     color: "blue", 
//     textDecoration: "underline"
//   }}
// >
//   {SelectValue}
// </a>
//       <div onClick={() => editvalue(id,"Flag")} style={{cursor : "pointer"}}>{Flag}</div>
//       <div>Edit Action</div>
      

//      <div className="actions">
//     {/* <button  onPointerDown={(e) => e.stopPropagation()}
//  onClick={() => handleEditRule(columnId,id)}>Edit</button> */}
//     <button style={{height : "30px"}} onPointerDown={(e) => e.stopPropagation()}
//  onClick={() => handleDeleteRule(columnId,id)}><MdDelete/></button>
//   </div>

//   <style>
//     {`
//       .actions {
//         position: absolute;
//         right: 10px;
//         bottom: 6px;
//         display: flex;
//         gap: 8px;
//         opacity: 0;
        
//         transition: opacity 0.3s ease;
//       }

//       /* 👇 Show buttons only on hover */
//       .task:hover .actions,
//       .task1:hover .actions {
//         opacity: 1;
       
//       }
//     `}
//   </style>
//     </div>
//   );
// });

import React, { useState } from "react";
import "./Task.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Grab, GripVertical } from "lucide-react";
import { MdDelete } from "react-icons/md";
import { observer } from "mobx-react";
import Store from "../../Store";

export const Task = observer(({
  id,
  editvalue,
  ConditionSetId,
  RuleId,
  ConditionId,
  SelectAttribute,
  Condition,
  SelectValue,
  Flag,
  Actions,
  column,
  columnvalue,
  columnId,
  handleDeleteRule,
  sortableProps,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  // State to manage open dropdown for ConditionId
  const [openDropdown, setOpenDropdown] = useState(false);

  // Function to get dropdown numbers
  const getConditionDropdownNumbers = (col) => {
    
    if (col.type === "rule") {
      
      
      return Array.from({ length: Store.column.length }, (_, i) => i + 1);
    } else {
      
      const targetCol = Store.column.find((c) => c.id === col.id);
      const taskLength = targetCol?.tasks?.length || 0;
      return Array.from({ length: taskLength }, (_, i) => i + 1);
    }
  };

  // Handle selecting a number
  const handleSelectCondition = (value, taskId) => {
  alert(value);
  alert(taskId);

  // Find the column that contains this task
  const colIndex = Store.column.findIndex(col =>
    col.tasks?.some(task => task.id === taskId)
  );

  if (colIndex === -1) return;

  // Find the task inside the column
  const taskIndex = Store.column[colIndex].tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) return;

  // Update only that task's ConditionId
  Store.column[colIndex].tasks[taskIndex] = {
    ...Store.column[colIndex].tasks[taskIndex],
    ConditionId: value
  };

  setOpenDropdown(false);
};



  return (
    <div className={column === "rule" ? "task" : "task1"} style={{position : "relative"}}>
      
      {/* Grip + ConditionSetId */}
      {column === "rule" ? (
        <div style={style} ref={sortableProps.setNodeRef} {...sortableProps.attributes} {...sortableProps.listeners} className="set">
          <GripVertical size={18} />
          <div>{ConditionSetId}</div>
        </div>
      ) : (
        <div style={style} {...attributes} {...listeners} ref={setNodeRef} className="set">
          <GripVertical size={18} />
          <div>{ConditionSetId}</div>
        </div>
      )}

      <div>{RuleId}</div>

      {/* ConditionId clickable with dropdown */}
      <div style={{ position: "relative"}}>
        <div
          onClick={() => editvalue(id, "ConditionId",column,columnvalue)}
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline", width: "120px" }}
        >
          {ConditionId || "Edit Condition"}
        </div>

        {/* {openDropdown && (
          <select
            style={{
              position: "absolute",
              top: "0px",
              left: "10px",
              width: "120px",
              padding: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              background: "#fff",
              zIndex: 12,
            }}
            onChange={(e) => handleSelectCondition(e.target.value,id)}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <option value="">Select</option>
            {getConditionDropdownNumbers(columnvalue).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        )} */}
      </div>

      <div onClick={() => editvalue(id,"SelectAttribute")} style={{ cursor: "pointer" }}>{SelectAttribute}</div>
      <div onClick={() => editvalue(id,"Condition")} style={{ cursor: "pointer" }}>{Condition}</div>
      <a 
        onClick={() => editvalue(id, "SelectValue")} 
        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
      >
        {SelectValue}
      </a>
      <div onClick={() => editvalue(id,"Flag")} style={{ cursor: "pointer" }}>{Flag}</div>
      <div  onClick={() => Store.setShowDataPopup(true)}>{Actions}</div>

      <div className="actions">
        <button style={{height: "30px"}} onPointerDown={(e) => e.stopPropagation()} onClick={() => handleDeleteRule(columnId,id)}>
          <MdDelete/>
        </button>
      </div>

       {Store.showDataPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Entered Data</h2>

            {Store.rows.map((row, i) => (
              <p key={i} className="mb-2">
                <b>Label:</b> {row.label} | <b>Type:</b> {row.type}
              </p>
            ))}

            <button
              onClick={() => Store.setShowDataPopup(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          .actions {
            position: absolute;
            right: 10px;
            bottom: 6px;
            display: flex;
            gap: 8px;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .task:hover .actions,
          .task1:hover .actions {
            opacity: 1;
          }
        `}
      </style>
    </div>
  );
});

