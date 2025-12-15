
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

 

const updateRowValue = (index, val) => {
  Store.rows[index].selectedValue = val;
}


const fetchDropdownValues = async (rowIndex) => {
  const row = Store.rows[rowIndex];

  try {
    const field = encodeURIComponent(row.label);
    const res = await fetch(`http://localhost:4000/values/${field}`);
    const result = await res.json();

    let arr = [];
    if (Array.isArray(result)) arr = result;
    else if (result?.values) arr = result.values;

    // Replace default values with fetched values
    row.value = arr.length > 0 ? arr : ["No options available"];

    // Clear selected value if needed
    row.selectedValue = "";
  } catch (err) {
    console.error("Error fetching dropdown values:", err);
    row.value = ["Error loading"];
  }
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
      </div>

      <a onClick={() => editvalue(id,"SelectAttribute")} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>{SelectAttribute}</a>
      <a onClick={() => editvalue(id,"Condition")} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>{Condition}</a>
      <a 
        onClick={() => editvalue(id, "SelectValue")} 
        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
      >
        {SelectValue}
      </a>
      <a onClick={() => editvalue(id,"Flag")} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>{Flag}</a>
      <div  onClick={() => Store.setShowDataPopup(true)}>{Actions}</div>

      <div className="actions">
        <button style={{height: "30px"}} onPointerDown={(e) => e.stopPropagation()} onClick={() => handleDeleteRule(columnId,id)}>
          <MdDelete/>
        </button>
      </div>

       {Store.showDataPopup && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div
      className="bg-white p-6 rounded-xl shadow-xl flex flex-col"
      style={{ height: 300,width: 400 }}
    >
      <h2 className="text-xl font-semibold mb-3">Actions</h2>

      {/* Scroll Area */}
      <div
        style={{ overflowY: "auto", marginTop: "10px" }}
        className="flex-1 pr-1"
      >
        
        {Store.rows.map((row, i) => (
  <div
    key={i}
    style={{
      padding: "8px",
      borderRadius: "6px",
      marginBottom: "8px",
      backgroundColor: "#f7f7f7",
    }}
  >
    <p style={{ margin: 0, fontWeight: "bold" }}>{row.label}</p>

    {/* Dropdown for ALL types */}

    
   <select
  value={row.selectedValue || ""}
  onClick={() => fetchDropdownValues(i)} // fetch on click
  onChange={(e) => updateRowValue(i, e.target.value)}
  className="border p-2 rounded w-full mt-1"
>
  {Array.isArray(row.value) &&
    row.value.map((option, idx) => (
      <option key={idx} value={option}>
        {option}
      </option>
    ))}
</select>


  </div>
))}



      </div>

      <button
        onClick={() => Store.setShowDataPopup(false)}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl"
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

