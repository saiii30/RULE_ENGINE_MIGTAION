
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Swal from "sweetalert2";
import { Columndata } from "../Column/Columndata";
import { observer } from "mobx-react";
import { FaPlus, FaMinus, FaExpandArrowsAlt } from "react-icons/fa";
import { useEffect } from "react";
import Store from "../../Store";
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


  useEffect(() => {
  if (!Store.selectedAttribute) return;

  const field = encodeURIComponent(Store.selectedAttribute);

  fetch(`http://localhost:4000/values/${field}`)
    .then((res) => res.json())
    .then((result) => {
      let arr = [];

      if (Array.isArray(result)) arr = result;
      else if (result?.values) arr = result.values;

      Store.selectedArray = arr;
    })
}, [Store.selectedAttribute]);

const Tableselect = async() =>{

  Store.isSidebarVisible1 = true;
    Store.pop = "Parent";
    await Store.fetchCollections();

  // alert("hii")
  // const newParent = {
  //         id: Date.now().toString(),
  //         name: "Parent",
  //         children: [],
  //         isOpen: true,
  //         level : 0,
  //       };

        
  //       Store.setTreedata([...Store.treedata, newParent]);
  //       alert(JSON.stringify(Store.treedata))
}

const popupSections = {
  ConditionId: (row) => `
    <div style="padding: 1rem 0.5rem;">
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
    </div>
  `,

  SelectAttribute: (row) => `
    <div style="padding: 1rem 0.5rem;">
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; text-align: left;">
          Select Attribute
        </label>
        <div class="dropdown-container" style="position: relative;">
          <div 
            class="dropdown-trigger" 
            id="SelectAttributeTrigger"
            data-value="${row.SelectAttribute || ""}"
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
            <span id="SelectAttributeText" style="color: ${row.SelectAttribute ? '#1e293b' : '#94a3b8'};">
              ${row.SelectAttribute || 'Select Attribute'}
            </span>
            <svg 
              class="dropdown-arrow" 
              style="width: 30px; height: 30px; color: #64748b; transition: transform 0.2s ease;"
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
            id="SelectAttributeList"
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
            ${ (Store.columns || []).map(v => `
              <div class="dropdown-option" data-value="${v}" style="padding: 0.75rem 1rem; cursor: pointer; font-size: 0.9375rem; color: #334155;">
                ${v}
              </div>
            `).join('') }
          </div>
        </div>
      </div>
    </div>
  `,

  Condition: (row) => `
    <div style="padding: 1rem 0.5rem;">
      <div style="margin-bottom: 1.5rem;">
        <label style="display:block;font-size:0.875rem;font-weight:600;color:#475569;margin-bottom:0.5rem;text-align:left;">
          Condition
        </label>
        <div class="dropdown-container" style="position: relative;">
          <div 
            class="dropdown-trigger" 
            id="ConditionTrigger"
            data-value="${row.Condition || ""}"
            style="
              display:flex;align-items:center;justify-content:space-between;width:100%;padding:0.75rem 1rem;background:linear-gradient(to bottom,#ffffff,#f8fafc);border:2px solid #e2e8f0;border-radius:0.75rem;cursor:pointer;font-size:0.9375rem;color:#1e293b;transition:all 0.2s ease;
            "
          >
            <span id="ConditionText" style="color: ${row.Condition ? '#1e293b' : '#94a3b8'};">
              ${row.Condition || 'Select Condition'}
            </span>
            <svg class="dropdown-arrow" style="width:30px;height:30px;color:#64748b;transition:transform 0.2s ease;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div class="dropdown-list" id="ConditionList" style="display:none;position:absolute;top:calc(100% + 0.5rem);left:0;right:0;background:#ffffff;border:2px solid #e2e8f0;border-radius:0.75rem;z-index:9999;max-height:240px;overflow-y:auto;animation:slideDown 0.2s ease;">
            ${["equals","not equals","greater than","less than","contains"].map(v => `
              <div class="dropdown-option" data-value="${v}" style="padding:0.75rem 1rem;cursor:pointer;font-size:0.9375rem;color:#334155;">
                ${v}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `,

  SelectValue: (row) => `
    <div style="padding: 1rem 0.5rem;">
      <div style="margin-bottom: 1.5rem;">
        <label style="display:block;font-size:0.875rem;font-weight:600;color:#475569;margin-bottom:0.5rem;text-align:left;">
          Select Value
        </label>
        <div class="dropdown-container" style="position: relative;">
          <div 
            class="dropdown-trigger" 
            id="SelectValueTrigger"
            data-value="${row.SelectValue || ""}"
            style="
              display:flex;align-items:center;justify-content:space-between;width:100%;padding:0.75rem 1rem;background:linear-gradient(to bottom,#ffffff,#f8fafc);border:2px solid #e2e8f0;border-radius:0.75rem;cursor:pointer;font-size:0.9375rem;color:#1e293b;transition:all 0.2s ease;
            "
          >
            <span id="SelectValueText" style="color: ${row.SelectValue ? '#1e293b' : '#94a3b8'};">
              ${row.SelectValue || 'Select Value'}
            </span>
            <svg class="dropdown-arrow" style="width:30px;height:30px;color:#64748b;transition:transform 0.2s ease;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div class="dropdown-list" id="SelectValueList" style="display:none;position:absolute;top:calc(100% + 0.5rem);left:0;right:0;background:#ffffff;border:2px solid #e2e8f0;border-radius:0.75rem;z-index:9999;max-height:240px;overflow-y:auto;animation:slideDown 0.2s ease;">
            ${(Store.selectedArray || []).map(v => `
              <div class="dropdown-option" data-value="${v}" style="padding:0.75rem 1rem;cursor:pointer;font-size:0.9375rem;color:#334155;">
                ${v}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `,

  Flag: (row) => `
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
              <span id="flagLabel" style="color: ${row.Flag === "True" ? "#6366f1" : "#64748b"}">
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
  `
};

const editvalue = async (id, attribute) => {



  const column = columns.find((c) => c.id === id);

  
if (!column) return;
alert(JSON.stringify(column));
const row = {};
let oldSelectAttribute = "";

column.tasks.forEach((task) => {
  for (const [key, value] of Object.entries(task)) {
    row[key] = value;
    if (key === "SelectAttribute") oldSelectAttribute = value; 
  }
});




  let newValue = "";

  // When Attribute = SelectAttribute
  if (attribute === "SelectAttribute") {
    // get new attribute from UI
    newValue =
      document
        .getElementById("SelectAttributeTrigger")
        ?.getAttribute("data-value") || "";

    // Only if the value is actually changed by user click
    if (newValue !== oldSelectAttribute) {
     
column.tasks.forEach((task) => {
  if (task.SelectValue !== undefined) {
    task.SelectValue = "Edit SelectValue";
  }
});
      
    }
  }

  // Update normal nodes if user edits some other column
  column.tasks.forEach((task) => {
  if (task[attribute] !== undefined) {
    alert("old value"+task[attribute]+" new value"+newValue)
    task[attribute] = newValue;
    alert("updated value"+task[attribute])
  }
});
  // If attribute unknown, fallback to ConditionId
  if (!popupSections[attribute]) attribute = "ConditionId";

  // Build full HTML with styles (keeps your original style block)
  const html = `
    <div style="padding: 0;">
      ${popupSections[attribute](row)}
    </div>

    <style>
      .swal-custom-popup { border-radius: 1rem !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important; }
      .swal-confirm-btn { background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%) !important; color: white !important; border: none !important; border-radius: 0.75rem !important; padding: 0.75rem 2rem !important; font-size: 0.9375rem !important; font-weight: 600 !important; cursor: pointer !important; transition: all 0.2s ease !important; box-shadow: 0 4px 6px -1px rgba(99,102,241,0.3) !important; }
      .swal-confirm-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 10px 15px -3px rgba(99,102,241,0.4) !important; }
      .swal-cancel-btn { background: white !important; color: #64748b !important; border: 2px solid #e2e8f0 !important; border-radius: 0.75rem !important; padding: 0.75rem 2rem !important; font-size: 0.9375rem !important; font-weight: 600 !important; cursor: pointer !important; transition: all 0.2s ease !important; margin-right: 0.75rem !important; }
      @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
      .dropdown-list::-webkit-scrollbar { width: 6px; }
      .dropdown-list::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
      .dropdown-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      .dropdown-list::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>
  `;

  const { value: formValues } = await Swal.fire({
    title:
      `<div style="color:#1e293b;font-weight:700;font-size:1.25rem;margin-bottom:0.25rem;">Edit ${attribute.replace(/([A-Z])/g,' $1').trim()}</div>`,
    html,
    showCancelButton: true,
    confirmButtonText: "Update Rule",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "swal-custom-popup",
      confirmButton: "swal-confirm-btn",
      cancelButton: "swal-cancel-btn",
    },
    buttonsStyling: false,
    width: "600px",
    padding: "1.5rem",
    background: "#ffffff",
    backdrop: "rgba(0, 0, 0, 0.4)",
    didOpen: () => {
      // Attach handlers only for the fields present in this popup
      // Dropdown helper:
      const attachDropdown = (field, sourceArrayGetter, fetchOnOpen) => {
        const trigger = document.getElementById(`${field}Trigger`);
        const list = document.getElementById(`${field}List`);
        const text = document.getElementById(`${field}Text`);
        const arrow = trigger?.querySelector(".dropdown-arrow");

        if (!trigger || !list) return;

        trigger.addEventListener("click", async (e) => {
          e.stopPropagation();
          const isOpen = list.style.display === "block";
          document.querySelectorAll(".dropdown-list").forEach((el) => (el.style.display = "none"));
          document.querySelectorAll(".dropdown-arrow").forEach((a) => (a.style.transform = "rotate(0deg)"));
          // Append dropdown to body
  if (!list.parentElement || list.parentElement !== document.body) {
    document.body.appendChild(list);
  }

  // Compute position relative to trigger
  const rect = trigger.getBoundingClientRect();
  list.style.position = "absolute";
  list.style.top = `${rect.bottom + window.scrollY + 5}px`;
  list.style.left = `${rect.left + window.scrollX}px`;
  list.style.width = `${rect.width}px`;
  list.style.display = list.style.display === "block" ? "none" : "block";

  if (arrow) arrow.style.transform = list.style.display === "block" ? "rotate(180deg)" : "rotate(0deg)";



          // If fetchOnOpen is true (SelectValue), compute values based on SelectAttribute
          if (fetchOnOpen && !isOpen) {
            // Determine selected attribute
            let selectedAttr =
    document.getElementById("SelectAttributeTrigger")?.getAttribute("data-value") ||
    "";

  // 2️⃣ Fallback to Store.columns if UI has nothing
  if (!selectedAttr) {
    const column = columns.find((c) => c.id === id);

    if (column) {
      column.tasks.forEach((task) => {
        // Pick SelectAttribute value
        if (task.SelectAttribute) {
          selectedAttr = task.SelectAttribute;
          Store.selectedvalue = task.SelectAttribute;
        }

        // 3️⃣ Auto-reset SelectValue if attribute changed
        if (task.SelectValue && newValue !== oldSelectAttribute) {
          task.SelectValue = "Edit SelectValue";
        }
      });
    }
  }

             // 4️⃣ If STILL empty, show message
  if (!selectedAttr || selectedAttr.trim() === "") {
    list.innerHTML = `<div style="padding:10px; color:#94a3b8">No attribute selected</div>`;
    return;
  }

            // fetch values (your original fetch logic)
            try {
              const res = await fetch(`http://localhost:4000/values/${encodeURIComponent(selectedAttr)}`);
              const result = await res.json();
              let arr = [];
              if (Array.isArray(result)) arr = result;
              else if (result?.values) arr = result.values;
              Store.selectedArray = arr;

              if (arr.length === 0) {
                list.innerHTML = `<div style="padding:10px; color:#94a3b8">No values found</div>`;
              } else {
                list.innerHTML = arr.map(v => `
                  <div class="dropdown-option" data-value="${v}" style="padding:.75rem 1rem; cursor:pointer; color:#334155">
                    ${v}
                  </div>
                `).join('');
              }

              // attach click events
              list.querySelectorAll(".dropdown-option").forEach((opt) => {
                opt.addEventListener("click", () => {
                  text.textContent = opt.textContent || "";
                  trigger.setAttribute("data-value", opt.getAttribute("data-value"));
                  list.style.display = "none";
                  if (arrow) arrow.style.transform = "rotate(0deg)";
                });
              });

            } catch (err) {
              console.error("Error fetching values:", err);
              list.innerHTML = `<div style="padding:10px; color:#94a3b8">Error loading values</div>`;
            }
          }
        });

        // Attach pre-existing options click (for static lists)
        list.querySelectorAll(".dropdown-option").forEach((opt) => {
          opt.addEventListener("click", () => {
            if (text) text.textContent = opt.textContent || "";
            if (text) text.style.color = "#1e293b";
            if (trigger) trigger.setAttribute("data-value", opt.getAttribute("data-value") || "");
            if (list) list.style.display = "none";
            if (arrow) arrow.style.transform = "rotate(0deg)";
          });
        });

        // Close when clicking outside
        document.addEventListener("click", (e) => {
          if (trigger && list && !trigger.contains(e.target) && !list.contains(e.target)) {
            list.style.display = "none";
            if (arrow) arrow.style.transform = "rotate(0deg)";
          }
        });
      };

      // Attach dropdowns only if those elements exist
      if (document.getElementById("SelectAttributeTrigger")) {
        attachDropdown("SelectAttribute", () => Store.columns || [], false);
      }
      if (document.getElementById("ConditionTrigger")) {
        attachDropdown("Condition", () => ["equals","not equals","greater than","less than","contains"], false);
      }
      if (document.getElementById("SelectValueTrigger")) {
        // fetchOnOpen = true so it loads based on SelectAttribute
        attachDropdown("SelectValue", () => Store.selectedArray || [], true);
      }

      

      const flagSwitch = document.getElementById("flagSwitch");
const flagLabel = document.getElementById("flagLabel");

flagSwitch?.addEventListener("change", () => {
  if (flagLabel) {
    flagLabel.textContent = flagSwitch.checked ? "True" : "False";
    flagLabel.style.color = flagSwitch.checked ? "#6366f1" : "#64748b";
  }
});

    },
    preConfirm: () => {
      return {
        ConditionId: document.getElementById("condId")?.value || "",
        SelectAttribute:
          document.getElementById("SelectAttributeTrigger")?.getAttribute("data-value") ||
          document.getElementById("SelectAttributeText")?.textContent?.trim() ||
          "",
        Condition:
          document.getElementById("ConditionTrigger")?.getAttribute("data-value") ||
          document.getElementById("ConditionText")?.textContent?.trim() ||
          "",
        SelectValue:
          document.getElementById("SelectValueTrigger")?.getAttribute("data-value") ||
          document.getElementById("SelectValueText")?.textContent?.trim() || "",
         Flag: document.getElementById("flagSwitch")?.checked ? "True" : "False",
      };
    }
  });

  // If user cancelled / nothing returned
  if (!formValues) return;

  // Update store nodes with only the field returned
  const column1 = columns.find((c) => c.id === id);
if (!column1) return;

// Update all tasks (usually 1 task, but handle multiple safely)
const updatedColumns = columns.map((col) => {
  if (col.id !== id) return col; // other columns unchanged

  const updatedTasks = col.tasks.map((task) => {
    const updatedTask = { ...task }; // never mutate directly

    Object.keys(formValues).forEach((label) => {
      const value = formValues[label];
      if (!value) return;

      // add or update
      updatedTask[label] = value;
    });

    return updatedTask;
  });

  return {
    ...col,
    tasks: updatedTasks,
  };
});

// ---- UPDATE REACT STATE (THIS FIXES THE UI) ----
setColumns(updatedColumns);


  
};


  
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
            ConditionId: "Edit ConditionId",
                  SelectAttribute: "Edit SelectAttribute",
                  Condition: "Edit Condition",
                  SelectValue: "Edit Value",
                  Flag: "Edit Flag",
                  Actions: "Edit Actions",
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
        <div style={{ padding: "18px" ,width: "85%",background: "#f2f2f3"}}>

       <div
        style={{
         
          display: "flex",
          gap: 12,
          width: "fit-content",
          padding:"10px",
          marginTop:"auto",
          marginBottom:"auto",
          alignItems: "center",
          padding:"19px",
          borderRadius: 8,
        }}
      >
        <button
          className="p-3 rounded-full"
          title="Add / Select collection"
          style={{ background: "#10b981", color: "white", border: "none" }}
          onClick={Tableselect}
        >
          <FaPlus />
        </button>

        <button
          className="px-3 py-2 rounded-md"
          style={{ background: "#2563eb", color: "white", border: "none" }}
          onClick={Store.saveFile}
        >
          Save
        </button>

        <button
          className="px-3 py-2 rounded-md"
          style={{ background: "#2563eb", color: "white", border: "none" }}
          onClick={Store.saveFileAs}
        >
          Save As
        </button>

        <button
          className="px-3 py-2 rounded-md"
          style={{ background: "#2563eb", color: "white", border: "none" }}
          onClick={Store.downloadLastExport}
        >
          Download
        </button>
      
        
        
      </div>
      {/* Table header - only once */}
      <div
        style={{
         display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
          
          background :"#1f2937",
          color : "white",
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
        editvalue={editvalue}
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