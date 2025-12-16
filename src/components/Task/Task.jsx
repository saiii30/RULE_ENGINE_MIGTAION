
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

const toggleDropdown = (index) => {
  Store.rows.forEach((r, i) => {
    r.open = i === index ? !r.open : false;
  });
}



const updateRowValue = (index, val) => {
  Store.rows[index].selectedValue = val;
  Store.rows[index].open = false;
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
      <a style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }} onClick={() => Store.setShowDataPopup(true)}>{Actions}</a>

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
      position: "relative",
    }}
  >
    <p style={{ margin: 0, fontWeight: "bold" }}>{row.label}</p>


<div className="relative mt-1">
  {/* Dropdown trigger */}
  <div
    className="border p-2 rounded bg-white cursor-pointer flex justify-between items-center"
    onClick={() => {
      if (!row.value || row.value.length === 0) fetchDropdownValues(i);
      toggleDropdown(i);
    }}
  >
    <span className="text-sm">
      {row.selectedValue || "Select option"}
    </span>
    <span className="text-gray-500">▼</span>
  </div>

  {/* Dropdown list */}
  {row.open && (
    <div
      className="absolute left-0 w-full bg-white border rounded shadow-lg z-10"
      style={{ height: "200px", overflowY: "auto" }} // only 5 items visible
    >
      {Array.isArray(row.value) && row.value.length > 0 ? (
        row.value.map((option, idx) => (
          <div
            key={idx}
            className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            onClick={() => updateRowValue(i, option)}
          >
            {option}
          </div>
        ))
      ) : (
        <div className="px-3 py-2 text-gray-400 text-sm">
          Loading...
        </div>
      )}
    </div>
  )}
</div>




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

