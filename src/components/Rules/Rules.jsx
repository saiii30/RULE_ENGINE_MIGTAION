
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Swal from "sweetalert2";
import { Columndata } from "../Column/Columndata";


export const Rules = ({columns,setColumns,globalId,setGlobalId,handleAddGroup}) =>{
 const tablerow = [
    "ConditionSetId",
    "RuleId",
    "ConditionId",
    "SelectAttribute",
    "Condition",
    "SelectValue",
    "Flag",
    "Action",
  ];

  
  const handleDeleteRule = async (columnId, taskId) => {
  const column = columns.find((col) => col.id === columnId);
  if (!column) return;

  const task = column.tasks.find((t) => t.id === taskId);
  if (!task) return;

  // 🔥 SweetAlert confirmation
  const result = await Swal.fire({
    title: `<div style="color:#1e293b; font-weight:700; font-size:1.3rem;">Delete Rule</div>`,
    html: `<div style="color:#475569; font-size:1rem;">Are you sure you want to delete <b>${task.ConditionId}</b>?</div>`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, Delete it",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    // 🧹 Update column tasks
    const updatedColumns = columns
      .map((col) => {
        if (col.id === columnId) {
          const updatedTasks = col.tasks.filter((t) => t.id !== taskId);

          // ⚠️ If no tasks left, remove this column completely
          if (updatedTasks.length === 0) {
            return null;
          }

          return { ...col, tasks: updatedTasks };
        }
        return col;
      })
      .filter((col) => col !== null); // remove empty columns

    setColumns(updatedColumns);

    Swal.fire({
      title: "Deleted!",
      text: "The rule has been deleted successfully.",
      icon: "success",
      confirmButtonColor: "#2563eb",
    });
  }
};
  const handleEditRule = async (columnId, taskId) => {
  // Find the selected column and task
  const column = columns.find((col) => col.id === columnId);
  if (!column) return;

  const task = column.tasks.find((t) => t.id === taskId);
  if (!task) return;

  const row = { ...task };

  const { value: formValues } = await Swal.fire({
    title: '<div style="color: #1e293b; font-weight: 700; font-size: 1.5rem; margin-bottom: 0.5rem;">Edit Rule</div>',
    html: `
      <div style="padding: 1rem 0.5rem;">
        <!-- ConditionId Input -->
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; text-align: left;">
            Condition ID
          </label>
          <input 
            id="condId" 
            type="text"
            placeholder="Enter Condition ID" 
            value="${row.ConditionId || ""}"
            style="
              width: 100%;
              padding: 0.75rem 1rem;
              border: 2px solid #e2e8f0;
              border-radius: 0.75rem;
              font-size: 0.9375rem;
              color: #1e293b;
              background: #ffffff;
              transition: all 0.2s ease;
              outline: none;
            "
            onfocus="this.style.borderColor='#6366f1'; this.style.boxShadow='0 0 0 3px rgba(99, 102, 241, 0.1)';"
            onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
          />
        </div>

        ${["SelectAttribute", "Condition", "SelectValue"]
          .map(
            (field) => `
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; text-align: left;">
                ${field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div class="dropdown-container" style="position: relative;">
                <div 
                  class="dropdown-trigger" 
                  id="${field}Trigger"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: linear-gradient(to bottom, #ffffff, #f8fafc);
                    border: 2px solid #e2e8f0;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    font-size: 0.9375rem;
                    color: #1e293b;
                    transition: all 0.2s ease;
                  "
                  onmouseover="this.style.borderColor='#cbd5e1'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,0.1)';"
                  onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                >
                  <span id="${field}Text" style="color: ${row[field] ? '#1e293b' : '#94a3b8'};">
                    ${row[field] || `Select ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                  </span>
                  <svg 
                    class="dropdown-arrow" 
                    style="width: 20px; height: 20px; color: #64748b; transition: transform 0.2s ease;"
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                <div 
                  class="dropdown-list" 
                  id="${field}List"
                  style="
                    display: none;
                    position: absolute;
                    top: calc(100% + 0.5rem);
                    left: 0;
                    right: 0;
                    background: #ffffff;
                    border: 2px solid #e2e8f0;
                    border-radius: 0.75rem;
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
                    z-index: 9999;
                    max-height: 240px;
                    overflow-y: auto;
                    animation: slideDown 0.2s ease;
                  "
                >
                  ${(field === "SelectAttribute"
                    ? ["Age", "Salary", "Country", "Gender"]
                    : field === "Condition"
                    ? ["equals", "not equals", "greater than", "less than", "contains"]
                    : ["10", "20", "30", "True", "False"]
                  )
                    .map(
                      (v) => `
                      <div 
                        class="dropdown-option" 
                        data-value="${v}"
                        style="
                          padding: 0.75rem 1rem;
                          cursor: pointer;
                          font-size: 0.9375rem;
                          color: #334155;
                          transition: all 0.15s ease;
                          border-left: 3px solid transparent;
                        "
                        onmouseover="this.style.background='#f1f5f9'; this.style.borderLeftColor='#6366f1'; this.style.color='#6366f1';"
                        onmouseout="this.style.background='transparent'; this.style.borderLeftColor='transparent'; this.style.color='#334155';"
                      >
                        ${v}
                      </div>`
                    )
                    .join("")}
                </div>
              </div>
            </div>`
          )
          .join("")}

        <!-- Flag Toggle -->
        <div style="margin-top: 1.5rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.75rem; text-align: left;">
            Flag Status
          </label>
          <div style="
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border: 2px solid #e2e8f0;
            border-radius: 0.75rem;
          ">
            <label class="switch" style="position: relative; display: inline-block; width: 52px; height: 28px; flex-shrink: 0;">
              <input 
                type="checkbox" 
                id="flagSwitch" 
                ${row.Flag === "True" ? "checked" : ""}
                style="opacity: 0; width: 0; height: 0;"
              />
              <span 
                class="slider"
                style="
                  position: absolute;
                  cursor: pointer;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
                  border-radius: 28px;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                "
              >
                <span style="
                  position: absolute;
                  height: 22px;
                  width: 22px;
                  left: 3px;
                  bottom: 3px;
                  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                  border-radius: 50%;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                "></span>
              </span>
            </label>
            <span 
              id="flagLabel"
              style="
                font-size: 0.9375rem;
                font-weight: 600;
                color: ${row.Flag === "True" ? "#6366f1" : "#64748b"};
                transition: color 0.3s ease;
              "
            >
              ${row.Flag === "True" ? "True" : "False"}
            </span>
          </div>
        </div>
      </div>

      <style>
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="checkbox"]:checked + .slider {
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%) !important;
        }
        input[type="checkbox"]:checked + .slider span {
          transform: translateX(24px);
        }
      </style>
    `,
    didOpen: () => {
      const dropdowns = ["SelectAttribute", "Condition", "SelectValue"];
      dropdowns.forEach((field) => {
        const trigger = document.getElementById(`${field}Trigger`);
        const list = document.getElementById(`${field}List`);
        const text = document.getElementById(`${field}Text`);
        const arrow = trigger?.querySelector(".dropdown-arrow");

        trigger?.addEventListener("click", (e) => {
          e.stopPropagation();
          const isOpen = list?.style.display === "block";
          document.querySelectorAll(".dropdown-list").forEach((el) => (el.style.display = "none"));
          document.querySelectorAll(".dropdown-arrow").forEach((a) => (a.style.transform = "rotate(0deg)"));
          if (list) list.style.display = isOpen ? "none" : "block";
          if (arrow) arrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
        });

        list?.querySelectorAll(".dropdown-option").forEach((opt) => {
          opt.addEventListener("click", () => {
            if (text) text.textContent = opt.textContent || "";
            if (text) text.style.color = "#1e293b";
            if (trigger) trigger.setAttribute("data-value", opt.getAttribute("data-value") || "");
            if (list) list.style.display = "none";
            if (arrow) arrow.style.transform = "rotate(0deg)";
          });
        });

        document.addEventListener("click", (e) => {
          if (trigger && list && !trigger.contains(e.target) && !list.contains(e.target)) {
            list.style.display = "none";
            if (arrow) arrow.style.transform = "rotate(0deg)";
          }
        });
      });

      const flagSwitch = document.getElementById("flagSwitch");
      const flagLabel = document.getElementById("flagLabel");
      flagSwitch?.addEventListener("change", () => {
        if (flagLabel) {
          flagLabel.textContent = flagSwitch.checked ? "True" : "False";
          flagLabel.style.color = flagSwitch.checked ? "#6366f1" : "#64748b";
        }
      });
    },
    preConfirm: () => ({
      ConditionId: document.getElementById("condId")?.value || "",
      SelectAttribute:
        document.getElementById("SelectAttributeTrigger")?.getAttribute("data-value") ||
        document.getElementById("SelectAttributeText")?.textContent?.trim() || "",
      Condition:
        document.getElementById("ConditionTrigger")?.getAttribute("data-value") ||
        document.getElementById("ConditionText")?.textContent?.trim() || "",
      SelectValue:
        document.getElementById("SelectValueTrigger")?.getAttribute("data-value") ||
        document.getElementById("SelectValueText")?.textContent?.trim() || "",
      Flag: document.getElementById("flagSwitch")?.checked ? "True" : "False",
    }),
    showCancelButton: true,
    confirmButtonText: "Update Rule",
    cancelButtonText: "Cancel",
    width: "600px",
    padding: "2rem",
    background: "#ffffff",
  });

  if (formValues) {
    // ✅ Update the specific task in your columns state
    const updatedColumns = columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            tasks: col.tasks.map((t) =>
              t.id === taskId ? { ...t, ...formValues } : t
            ),
          }
        : col
    );

    setColumns(updatedColumns);

    Swal.fire({
      title: "Success!",
      text: "Rule updated successfully!",
      icon: "success",
      confirmButtonText: "OK",
    });
  }
};

const deleteGroup = async (columnId) => {
  // 🔔 Confirm before deleting
  const result = await Swal.fire({
    title: `Delete Group "?`,
    text: "This action will remove the entire group and its rules.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (result.isConfirmed) {
    // 🗑️ Remove the column by filtering it out
    setColumns((prevColumns) => prevColumns.filter((col) => col.id !== columnId));

    // ✅ Success message
    Swal.fire({
      title: "Deleted!",
      text: `Group  has been deleted.`,
      icon: "success",
      confirmButtonColor: "#2563eb",
    });
  }
};




  // ➕ Add new rule inside specific group
  const addRuleInsideGroup = (groupId) => {
    
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === groupId && col.type === "group") {
          const newRule = {
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
          };
          setGlobalId((id) => id + 1);
          return { ...col, tasks: [...col.tasks, newRule] };
        }
        return col;
      })
    );
  };

  // 🧱 Drag handling
 const handleDragEnd = (event) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;


   const activeId = String(active.id);
  const overId = String(over.id);

 

  // 🧠 Check what is being dragged
  const isColumnDrag = activeId.startsWith("column-");
  const isTaskDrag = activeId.startsWith("task-");

  if (isColumnDrag) {
    // 🧱 Move entire column
    setColumns((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
    return;
  }

  if (isTaskDrag) {
    // 🔧 Move rule inside a group only
    setColumns((prev) =>
      prev.map((col) => {
        const activeIndex = col.tasks.findIndex((t) => t.id === active.id);
        const overIndex = col.tasks.findIndex((t) => t.id === over.id);
        if (activeIndex !== -1 && overIndex !== -1) {
          const newTasks = arrayMove(col.tasks, activeIndex, overIndex);
          return { ...col, tasks: newTasks };
        }
        return col;
      })
    );
  }
};

  const toggleCollapse = (groupId) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === groupId ? { ...col, collapsed: !col.collapsed } : col
      )
    );
  };

    return (
        <div style={{ padding: "20px" ,width: "80%",background: "#f2f2f3"}}>


      {/* Table header - only once */}
      <div
        style={{
         display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
          
          background: "#efefef",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "6px",
        }}
      >
        {tablerow.map((head) => (
          <div key={head}>{head}</div>
        ))}
      </div>

      
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          
<SortableContext
  items={columns.map((c) => c.id)}              
  strategy={verticalListSortingStrategy}        
>
  {columns.map((col) => (
    
    <SortableContext
      key={col.id}
      items={col.tasks.map((t) => t.id)}
      strategy={verticalListSortingStrategy}
    >
      <Columndata
        key={col.id}
        column={col}
        setColumns={setColumns}
        addRuleInsideGroup={addRuleInsideGroup}
        handleEditRule={handleEditRule}
        handleDeleteRule={handleDeleteRule}
        handleAddGroup={handleAddGroup}
        deleteGroup={deleteGroup}
        toggleCollapse={toggleCollapse}
      />
    </SortableContext>
  ))}
</SortableContext>


        </div>
      </DndContext>

</div>


    )
}