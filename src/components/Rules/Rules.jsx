
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
import { IoClose } from "react-icons/io5";
import { toJS } from "mobx";
import { useState } from "react";

export const Rules = observer(({globalId,setGlobalId,handleAddGroup,selectedNode,ruleCounter,setRuleCounter,setSelectedNode}) =>{

  const[value,setvalue] = useState(false)
 const tablerow = [
    
    "ConditionSetId",
    "RuleId",
    "ConditionId",
    "SelectAttribute",
    "Condition",
    "SelectValue",
    "Flag",
    "Actions",
    
  ];

const popupSections = {

  ConditionId: (row) => `
    <div style="padding: 1rem 0.5rem;">
      <div style="margin-bottom: 1.5rem;">
        <label style="display:block;font-size:0.875rem;font-weight:600;color:#475569;margin-bottom:0.5rem;text-align:left;">
          Condition
        </label>
        <div class="dropdown-container" style="position: relative;">
          <div 
            class="dropdown-trigger" 
            id="ConditionIdTrigger"
            data-value="${row.ConditionId || ""}"
            style="
              display:flex;align-items:center;justify-content:space-between;width:100%;padding:0.75rem 1rem;background:linear-gradient(to bottom,#ffffff,#f8fafc);border:2px solid #e2e8f0;border-radius:0.75rem;cursor:pointer;font-size:0.9375rem;color:#1e293b;transition:all 0.2s ease;
            "
          >
            <span id="ConditionIdText" style="color: ${row.ConditionId ? '#1e293b' : '#94a3b8'};">
              ${row.ConditionId || 'Select Condition'}
            </span>
            <svg class="dropdown-arrow" style="width:30px;height:30px;color:#64748b;transition:transform 0.2s ease;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div class="dropdown-list" id="ConditionIdList" style="display:none;position:absolute;top:calc(100% + 0.5rem);left:0;right:0;background:#ffffff;border:2px solid #e2e8f0;border-radius:0.75rem;z-index:9999;max-height:240px;overflow-y:auto;animation:slideDown 0.2s ease;">
            ${ (Store.conditionidvalue || [1,2,3,4]).map(v => `
              <div class="dropdown-option" data-value="${v}" style="padding: 0.75rem 1rem; cursor: pointer; font-size: 0.9375rem; color: #334155;">
                ${v}
              </div>
            `).join('') }
          </div>
        </div>
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

const getRootParent = (nodes, targetId) => {
  const findPath = (nodes, targetId, path = []) => {
    for (const node of nodes) {
      const newPath = [...path, node];

      if (node.id === targetId) return newPath;

      if (node.children?.length) {
        const result = findPath(node.children, targetId, newPath);
        if (result) return result;
      }
    }
    return null;
  };

  const path = findPath(nodes, targetId);
  return path?.[0] || null; // ✅ root parent
};

const getConditionDropdownNumbers = (col) => {
  // If it's a direct rule, return numbers from 1 to the number of ruleGroups under selectedNode
  if (col.type === "rule") {
    const taskLength = selectedNode?.ruleGroups?.length || 0;
    return Array.from({ length: taskLength }, (_, i) => i + 1);
  } 
  // If it's a group, return numbers from 1 to the number of tasks inside that group
  else if (col.type === "group") {
    const targetGroup = selectedNode?.ruleGroups?.find((rg) => rg.id === col.id);
    const taskLength = targetGroup?.tasks?.length || 0; // ✅ tasks length
    return Array.from({ length: taskLength }, (_, i) => i + 1);
  }

  // Default: return empty array if type is unknown
  return [];
};


const editvalue = async (id, attribute,type,columnvalue) => {

  var value;
  
  if(attribute === "ConditionId")
  {
    if(type === "rule")
    {
     
      value = getConditionDropdownNumbers(columnvalue);
      Store.conditionidvalue = value;
    }
    else{
     
      value = getConditionDropdownNumbers(columnvalue);
      Store.conditionidvalue = value;
    }

  }

 




let taskToEdit = null;

// 3️⃣ Search for the task inside ruleGroups
selectedNode.ruleGroups?.forEach((rg) => {
  // Look for the task inside the tasks array of each group or rule
  const foundTask = rg.tasks?.find((t) => t.id === id);
  if (foundTask) taskToEdit = foundTask;
});


if (!taskToEdit) return;

// 5️⃣ Prepare an object with the task's current values
const row = {};


Object.entries(taskToEdit).forEach(([key, value]) => {
  row[key] = value;
  
});



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



         
          if (fetchOnOpen && !isOpen) {





            // -----------------------------SelectValue--------------------------------------------------

            const findTaskById = (nodes, taskId) => {
  for (const node of nodes) {

    // only nodes that have ruleGroups
    if (node.ruleGroups?.length) {
      for (const rg of node.ruleGroups) {
        const task = rg.tasks?.find(t => t.id === taskId);
        if (task) return task;
      }
    }

    // search children
    if (node.children?.length) {
      const found = findTaskById(node.children, taskId);
      if (found) return found;
    }
  }
  return null;
};

// 3️⃣ get the task
const task = findTaskById(Store.treedata, id);

if (!task) {
  console.error("❌ Task not found");
  return;
}

// 4️⃣ get SelectAttribute
const selectAttribute = task.SelectAttribute;




const rootParent = getRootParent(Store.treedata, selectedNode.id);

const collectionName = rootParent?.name?.toLowerCase(); 
  
            try {
              const res = await fetch(`http://localhost:4000/values/${collectionName}/${encodeURIComponent(selectAttribute)}`);
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

      // -----------------------------ConditionId--------------------------------------------------

const conditionList = document.getElementById("ConditionIdList");

if (conditionList) {
  const arr = Store.conditionidvalue || [];

  conditionList.innerHTML = arr.length
    ? arr
        .map(
          (v) => `
      <div class="dropdown-option" data-value="${v}"
           style="padding:.75rem 1rem; cursor:pointer; color:#334155">
          ${v}
      </div>`
        )
        .join("")
    : `<div style="padding:10px; color:#94a3b8">No values found</div>`;
}



// -----------------------------SelectAttribute--------------------------------------------------

const selectAttributeList = document.getElementById("SelectAttributeList");

if (selectAttributeList) {

  if (!selectedNode) return;

  // 🔍 Find path from root to selected node
  const findPath = (nodes, targetId, path = []) => {
    for (const node of nodes) {
      const newPath = [...path, node];

      if (node.id === targetId) return newPath;

      if (node.children?.length) {
        const result = findPath(node.children, targetId, newPath);
        if (result) return result;
      }
    }
    return null;
  };

  const path = findPath(Store.treedata, selectedNode.id);

  // ✅ Root is always the first node in the path
  const rootParent = path?.[0];

  if (!rootParent?.name) return;

  const collectionName = rootParent.name.toLowerCase(); // employee | patient | ecommerce

  fetch(`http://localhost:4000/columns/${collectionName}`)
    .then(res => res.json())
    .then(keys => {
      Store.columns = keys;
    })
    .catch(err => console.error(err));
  const arr = Store.columns || [];

  selectAttributeList.innerHTML = arr.length
    ? arr
        .map(
          (v) => `
      <div class="dropdown-option" data-value="${v}"
           style="padding:.75rem 1rem; cursor:pointer; color:#334155">
          ${v}
      </div>`
        )
        .join("")
    : `<div style="padding:10px; color:#94a3b8">No values found</div>`;
}


//-----------------------------------------------------------------------Dropdowns Attachments--------------------------------------------------  

      if (document.getElementById("ConditionIdTrigger")) {
        // fetchOnOpen = true so it loads based on SelectAttribute
        attachDropdown("ConditionId", () => Store.conditionidvalue, false);
      }

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
        ConditionId:   
        document.getElementById("ConditionIdTrigger")?.getAttribute("data-value") ||
          document.getElementById("ConditionIdText")?.textContent?.trim() ||
          "",
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

   if (!formValues) return;
if (!formValues) return;
  if (!selectedNode || selectedNode.level !== 2) return;

  // 🔍 Helper: find node by id (USED AFTER TREE UPDATE)
  const findNodeById = (nodes, targetId) => {
    for (const node of nodes) {
      if (node.id === targetId) return node;
      if (node.children?.length) {
        const found = findNodeById(node.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  // 🔁 Step 1: Build updated ruleGroups (IMMUTABLE)
  const updatedRuleGroups = (selectedNode.ruleGroups || []).map((rg) => {
    // ✅ GROUP
    if (rg.type === "group") {
      return {
        ...rg,
        tasks: (rg.tasks || []).map((task) => {
          if (task.id !== id) return task;

          const updatedTask = { ...task };
          Object.keys(formValues).forEach((label) => {
            const value = formValues[label];
            if (value !== null && value !== undefined && value !== "") {
              updatedTask[label] = value;
            }
          });

          return updatedTask;
        }),
      };
    }

    // ✅ DIRECT RULE
    if (rg.type === "rule") {
      return {
        ...rg,
        tasks: (rg.tasks || []).map((task) => {
          if (task.id !== id) return task;

          const updatedTask = { ...task };
          Object.keys(formValues).forEach((label) => {
            const value = formValues[label];
            if (value !== null && value !== undefined && value !== "") {
              updatedTask[label] = value;
            }
          });

          return updatedTask;
        }),
      };
    }

    return rg;
  });

  // 🔁 Step 2: Update tree immutably
  const updateTree = (nodes) =>
    nodes.map((n) => {
      if (n.id === selectedNode.id) {
        return { ...n, ruleGroups: updatedRuleGroups };
      }
      if (n.children?.length) {
        return { ...n, children: updateTree(n.children) };
      }
      return n;
    });

  // 🌳 Step 3: Save updated tree to MobX
  const newTree = updateTree(Store.treedata);
  Store.setTreedata(newTree);

  // 🔄 Step 4: VERY IMPORTANT — re-set selectedNode
  const updatedSelectedNode = findNodeById(newTree, selectedNode.id);
  if (updatedSelectedNode) {
    setSelectedNode(updatedSelectedNode);
    // OR: Store.setSelectedNode(updatedSelectedNode);
  }

  // 🧹 Cleanup
  Store.selectedvalue = "";

  
};


  
 const handleDeleteRule = async (groupId, ruleId) => {
  if (!selectedNode || selectedNode.level !== 2) return;

  alert("Deleting rule: " + ruleId + " from group: " + groupId);

  const result = await Swal.fire({
    title: "Delete Rule?",
    text: "Are you sure you want to delete this rule?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  let updatedSelectedNode = null;

  const deleteRuleFromTree = (nodes) => {
    return nodes
      .map((n) => {
        const ruleGroups = (n.ruleGroups || [])
          .map((rg) => {
            // ✅ Delete task inside the specified group
            if (rg.type === "group" && rg.id === groupId) {
              return {
                ...rg,
                tasks: rg.tasks?.filter((t) => t.id !== ruleId) || [],
              };
            }

            // ✅ Delete top-level rule (column) regardless of groupId
            if (rg.type === "rule" && rg.id === ruleId) {
              return {
                
                tasks: rg.tasks?.filter((t) => t.id !== ruleId) || [],
              };
            }

            return rg;
          })
          .filter(Boolean);

        // Recursively handle children
        const children = n.children ? deleteRuleFromTree(n.children) : [];

        const updatedNode = { ...n, ruleGroups, children };

        if (n.id === selectedNode.id) updatedSelectedNode = updatedNode;

        return updatedNode;
      })
      .filter(Boolean);
  };

  const newTree = deleteRuleFromTree(Store.treedata);
  Store.setTreedata(newTree);

  // Clear selectedNode if deleted
  if (selectedNode?.id === ruleId) {
    setSelectedNode(null);
  } else if (updatedSelectedNode) {
    setSelectedNode(updatedSelectedNode);
  }

  Swal.fire({
    title: "Deleted!",
    text: "Rule has been deleted successfully.",
    icon: "success",
    confirmButtonColor: "#2563eb",
  });
};




const deleteGroup = async (groupId, type) => {
  if (!selectedNode || selectedNode.level !== 2) return;

  const result = await Swal.fire({
    title: `Delete ${type === "group" ? "Group" : "Rule"}?`,
    text: "This will remove the group and all its rules.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  let updatedSelectedNode = null;

  const updateTree = (nodes) =>
    nodes.map((n) => {
      if (n.id === selectedNode.id) {
        const updatedNode = {
          ...n,
          ruleGroups: (n.ruleGroups || []).filter(
            (rg) => rg.id !== groupId
          ),
        };

        updatedSelectedNode = updatedNode; // 🔥 capture fresh reference
        return updatedNode;
      }

      if (n.children?.length) {
        return { ...n, children: updateTree(n.children) };
      }

      return n;
    });

  const newTree = updateTree(Store.treedata);

  Store.setTreedata(newTree);

  // 🔥 IMPORTANT: refresh selectedNode
  if (updatedSelectedNode) {
    setSelectedNode(updatedSelectedNode);
  }

  Swal.fire({
    title: "Deleted!",
    text: "Group has been deleted.",
    icon: "success",
    confirmButtonColor: "#2563eb",
  });
};





  // ➕ Add new rule inside specific group
  const addRuleInsideGroup = (groupId) => {
  if (!selectedNode || selectedNode.level !== 2) return;

  const newRule = {
    id: `task-${globalId}`,
    ConditionSetId: `ConditionSetId${globalId}`,
    RuleId: `RuleId${ruleCounter}`,
    ConditionId: "Edit ConditionId",
    SelectAttribute: "Edit SelectAttribute",
    Condition: "Edit Condition",
    SelectValue: "Edit Value",
    Flag: "Edit Flag",
    Actions: "Edit Actions",
  };

  const updateTree = (nodes) =>
    nodes.map((n) => {
      if (n.id === selectedNode.id) {
        return {
          ...n,
          ruleGroups: (n.ruleGroups || []).map((rg) => {
            if (rg.id === groupId && rg.type === "group") {
              return {
                ...rg,
                tasks: [...(rg.tasks || []), newRule], // ✅ correct place
              };
            }
            return rg;
          }),
        };
      }

      if (n.children?.length) {
        return { ...n, children: updateTree(n.children) };
      }

      return n;
    });

  // 1️⃣ Create new tree
  const newTree = updateTree(Store.treedata);

  // 2️⃣ Update MobX
  Store.setTreedata(newTree);

  // 3️⃣ 🔥 IMPORTANT: refresh selectedNode reference
  const refreshedNode = findNodeById(newTree, selectedNode.id);
  setSelectedNode(refreshedNode);

  // 4️⃣ Counters
  setGlobalId((id) => id + 1);
  setRuleCounter((n) => n + 1);

  console.log("Updated Tree:", JSON.stringify(newTree, null, 2));
};

const findNodeById = (nodes, id) => {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children?.length) {
      const found = findNodeById(n.children, id);
      if (found) return found;
    }
  }
  return null;
};




const handleDragEnd = ({ active, over }) => {
  if (!over || active.id === over.id) return;

  const activeId = String(active.id);
  const overId = String(over.id);

  const moveNode = (node) => {
    if (!node.ruleGroups?.length) {
      node.children?.forEach(moveNode);
      return;
    }

    // Move column/group
    const activeColIndex = node.ruleGroups.findIndex(c => c.id === activeId);
    const overColIndex = node.ruleGroups.findIndex(c => c.id === overId);
    if (activeColIndex !== -1 && overColIndex !== -1) {
      node.ruleGroups.splice(overColIndex, 0, node.ruleGroups.splice(activeColIndex, 1)[0]);
      return;
    }

    // Move task inside same group
    node.ruleGroups.forEach(rg => {
      if (!rg.tasks?.length) return;
      const activeTaskIndex = rg.tasks.findIndex(t => t.id === activeId);
      const overTaskIndex = rg.tasks.findIndex(t => t.id === overId);
      if (activeTaskIndex !== -1 && overTaskIndex !== -1) {
        rg.tasks.splice(overTaskIndex, 0, rg.tasks.splice(activeTaskIndex, 1)[0]);
      }
    });

    node.children?.forEach(moveNode);
  };

  Store.treedata.forEach(moveNode);

  // Optional: refresh selectedNode to force UI update
  setSelectedNode(findNodeById(Store.treedata, selectedNode.id));
};


const selectCollection = async (name) => {

    addRow(name);
    Store.isSidebarVisible2 = false;
    Store.open = ! Store.open;
  
};

const addRow = (name) => {
  Store.rows.push({
    label: name,
    type: "",
    open: false,
    
   
  });
};


const popupVisible = () => {
  Store.isSidebarVisible2 = !Store.isSidebarVisible2;
  Store.open = ! Store.open;
}

  const toggleCollapse = (groupId) => {
  if (!selectedNode || selectedNode.level !== 2) return;

  let updatedSelectedNode = null;

  const updateTree = (nodes) =>
    nodes.map((n) => {
      if (n.id === selectedNode.id) {
        const updatedNode = {
          ...n,
          ruleGroups: (n.ruleGroups || []).map((rg) =>
            rg.id === groupId
              ? { ...rg, collapsed: !rg.collapsed }
              : rg
          ),
        };

        updatedSelectedNode = updatedNode; // 🔥 capture fresh ref
        return updatedNode;
      }

      if (n.children?.length) {
        return { ...n, children: updateTree(n.children) };
      }

      return n;
    });

  const newTree = updateTree(Store.treedata);
  Store.setTreedata(newTree);

  // 🔥 CRITICAL: update selectedNode reference
  if (updatedSelectedNode) {
    setSelectedNode(updatedSelectedNode);
  }
};



    return (
        <div style={{ padding: "20px" ,width: "85%",background: "#f2f2f3",height : "100%",position : "relative"}}>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: `repeat(${tablerow.length}, 1fr)`,
    
    background: "#1f2937",
    color: "white",
    padding: "10px",
    marginTop: "4px",
    borderRadius: "6px",
    width: "100%",
   
  }}
>
  {tablerow.map((head) => (
    <div key={head}>{head}</div>
  ))}
</div>

{Store.open && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center"
    style={{
      zIndex: 999,
    }}
  >
    <div
      className="bg-white rounded-xl shadow-xl text-black p-6"
      style={{
        width: 500,
        height: 300,
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px",
      }}
    >
      <div style={{display : "flex",alignItems : "center",justifyContent : "space-between"}} >
        <h2 className="text-xl font-semibold mb-8">Add Fields</h2>
<button
  onClick={() => Store.setOpen(false)}
  className="text-gray-600 hover:text-red-600"
>
  <IoClose size={22} />
</button>



        </div>
      

     

      {/* ADD BUTTON */}
      <div style={{width : "100%",display : "flex",alignItems : "center",justifyContent : "space-evenly"}}>
      <button style={{width : "40%"}}
        onClick={() => Store.addRow()}
        className="mb-3 px-3 py-1 bg-green-600 text-white rounded-lg w-fit"
      >
        + Add
      </button>
       <button style={{width : "40%"}}
        onClick={() => popupVisible()}
        className="mb-3 px-3 py-1 bg-green-600 text-white rounded-lg w-fit"
      >
        + Add Source from DB
      </button>
      </div>



      {/* ⭐ SCROLLABLE ROW LIST ⭐ */}
      <div style={{overflowY : "auto"}} className="flex-1  pr-1">
        {Store.rows.map((row, index) => (
          <div key={index} className="flex items-center gap-2 mb-3 " style={{justifyContent : "space-evenly",marginTop : "10px"}}>
            
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
              <option value="Date">Date</option>
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


        
      </div>

      {/* FOOTER BUTTON */}
      
    </div>
  </div>
)}

{Store.isSidebarVisible2 && (
        <div
        
          style={{
            position: "absolute",
            top: "40%",
            left: "40%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: 20,
            borderRadius: 8,
            zIndex: 2000,
            width: 360,
            height : 300,
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          <button onClick={() => popupVisible()} style={{ position: "absolute", right: 12, top: 12, border: "none", background: "red", fontSize: 18 , padding:4, }}>
            ✕
          </button>

      
            <h3 style={{ marginBottom: 12 }}>Select a Collection</h3>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {(Store.columns || []).map((table, idx) => (
              <li
                key={idx}
                onClick={() => selectCollection(table)}
                
                style={{
                  padding: "8px 10px",
                  cursor: "pointer",
                  borderRadius: 6,
                  marginBottom: 6,
                  
                }}
              >
                {table}
              </li>
            ))}
          </ul>

          
        </div>
      )}


      
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          
{selectedNode && (
  <SortableContext
    items={(selectedNode.ruleGroups || []).map((c) => c.id)}
    strategy={verticalListSortingStrategy}
  >
    {(selectedNode.ruleGroups || []).map((col) => (
      <SortableContext
        key={col.id}
        items={(col.tasks || []).map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <Columndata
          key={col.id}
          column={col}
          addRuleInsideGroup={addRuleInsideGroup}
          editvalue={editvalue}
          handleDeleteRule={handleDeleteRule}
          handleAddGroup={handleAddGroup}
          deleteGroup={deleteGroup}
          toggleCollapse={toggleCollapse}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          
        />
      </SortableContext>
    ))}
  </SortableContext>
)}

  




        </div>
      </DndContext>

</div>


    )
})