
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
        {/* {Store.rows.map((row, i) => (
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
            <p style={{ margin: 0, color: "gray" }}>{row.type}</p>
          </div>
        ))} */}

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

    {/* 📅 DATE */}
    {row.type === "Date" ? (
      <input
        type="date"
        value={row.value || ""}
        onChange={(e) =>
          Store.updateRowValue(i, e.target.value)
        }
        className="border p-2 rounded w-full mt-1"
      />
    ) : row.type === "Boolean" ? (
      <div className="flex gap-6 mt-2">
        {/* ✅ TRUE */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={row.value === true}
            onChange={() => Store.updateRowValue(i, true)}
          />
          True
        </label>

        {/* ❌ FALSE */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={row.value === false}
            onChange={() => Store.updateRowValue(i, false)}
          />
          False
        </label>
      </div>
    ) : (
      <input
        type={row.type === "Number" ? "number" : "text"}
        value={row.value || ""}
        onChange={(e) =>
          Store.updateRowValue(i, e.target.value)
        }
        className="border p-2 rounded w-full mt-1"
      />
    )}
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

