import React from "react";
import "./Task.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react"; // 👈 drag icon (you can use any icon)
import Swal from "sweetalert2";
import { observer } from "mobx-react";
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
  columnId,
  handleDeleteRule,
  sortableProps,
   
 
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

   

  return (
   <div
  ref={setNodeRef}
  style={style}
  className={column === "rule" ? "task" : "task1"}
>
      
      {/* {
        column !== "rule" && (
          <div  style={{position : "absolute",left : "-4px",bottom : "12px", cursor: "grab" }} {...attributes} {...listeners}>
        <GripVertical size={18} />
      </div>

        )
      } */}

      {

        column === "rule" && (
          <div  style={style} ref={sortableProps.setNodeRef} {...sortableProps.attributes} {...sortableProps.listeners}>
        <GripVertical size={18} />  
      </div>
        ) 

      }

      {
        column !== "rule" && (
 <div style={{ cursor: "grab" }} {...attributes} {...listeners}>
        <GripVertical size={18} />
      </div>
        )
      }
      
      <div>{ConditionSetId}</div>
      <div>{RuleId}</div>
      <div onClick={() => editvalue(id,"ConditionId")} style={{cursor : "pointer"}}>{ConditionId}</div>
      <div onClick={() => editvalue(id,"SelectAttribute")} style={{cursor : "pointer"}}>{SelectAttribute}</div>
      <div onClick={() => editvalue(id,"Condition")} style={{cursor : "pointer"}}>{Condition}</div>
      <div onClick={() => editvalue(id,"SelectValue")} style={{cursor : "pointer"}}>{SelectValue}</div>
      <div onClick={() => editvalue(id,"Flag")} style={{cursor : "pointer"}}>{Flag}</div>
      

     <div className="actions">
    {/* <button  onPointerDown={(e) => e.stopPropagation()}
 onClick={() => handleEditRule(columnId,id)}>Edit</button> */}
    <button style={{height : "30px"}} onPointerDown={(e) => e.stopPropagation()}
 onClick={() => handleDeleteRule(columnId,id)}>Delete</button>
  </div>

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

      /* 👇 Show buttons only on hover */
      .task:hover .actions,
      .task1:hover .actions {
        opacity: 1;
      }
    `}
  </style>
    </div>
  );
});
