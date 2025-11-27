import React from "react";
import "./Task.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react"; // 👈 drag icon (you can use any icon)
import Swal from "sweetalert2";
export const Task = ({
  id,
  ConditionSetId,
  RuleId,
  ConditionId,
  SelectAttribute,
  Condition,
  SelectValue,
  Flag,
  Actions,
  column,
  handleEditRule,
  columnId,
  handleDeleteRule
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
      
      {
        column !== "rule" && (
          <div  style={{position : "absolute",left : "-4px",bottom : "12px", cursor: "grab" }} {...attributes} {...listeners}>
        <GripVertical size={18} />
      </div>

        )
      }

      <div>{ConditionSetId}</div>
      <div>{RuleId}</div>
      <div>{ConditionId}</div>
      <div>{SelectAttribute}</div>
      <div>{Condition}</div>
      <div>{SelectValue}</div>
      <div>{Flag}</div>
      <div>{Actions}</div>

     <div className="actions">
    <button  onPointerDown={(e) => e.stopPropagation()}
 onClick={() => handleEditRule(columnId,id)}>Edit</button>
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
};
