import React from "react";
import { observer } from "mobx-react";
import Store from "../Store";
import Swal from "sweetalert2";
import { useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaGripVertical,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";



// ============================
// Sortable group wrapper
// ============================
const SortableTableGroup = ({
  id,
  engines,
  isDragging,
  collapsed,
  onToggleCollapse,
  onEditRuleId,
  onDeleteGroup,
  children,
  // handlers for per-row actions (used for single-row rendering)
  onEditRule,
  onDeleteRule,
  editvalue,
  onQuickAddRule,
}) => {
  // This sortable is for the group-level dragging
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition:
      transition || "transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)",
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  

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


  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`transition-all duration-300 ${isDragging ? "ring-4 ring-blue-500 ring-opacity-40" : ""}`}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
        {/* GROUP HEADER — ONLY FOR 2+ ROWS */}
        {engines.length > 1 && (
          <div
            className="rule-row bg-gray-100 font-semibold text-gray-700 border-b border-gray-300"
            style={{
              gridTemplateColumns:
                "40px 200px 120px 120px 180px 180px 180px 100px 120px",
            }}
          >
            {/* Column 1: group drag handle */}
            <div className="flex items-center justify-center">
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 transition"
                title="Drag Group"
              >
                <FaGripVertical className="text-gray-600" />
              </button>
            </div>

            {/* Column 2..8: TITLE cell spanning the middle columns (ConditionSetId..Flag) */}
            <div
              style={{
                gridColumn: "2 / 9", // spans columns 2..8 inclusive
              }}
              className="flex items-center pl-4"
            >
              Rule Group: {id}
            </div>

            {/* Column 9: Actions (collapse / edit / delete) */}
            <div className="flex items-center gap-3 justify-center">
              <button
                // onClick={() => onEditRuleId(id)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit RuleId"
              >
                <FaEdit />
              </button>

              <button
                onClick={() => onDeleteGroup(id)}
                className="text-red-600 hover:text-red-800 p-2"
                title="Delete Group"
              >
                <FaTrash />
              </button>
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded hover:bg-gray-200 transition"
                title={collapsed ? "Expand group" : "Collapse group"}
              >
                {collapsed ? <FaChevronRight /> : <FaChevronDown />}
              </button>
            </div>
          </div>
        )}

        {/* CHILDREN ROWS OR SINGLE-ROW RENDERED USING GROUP ATTRS */}
        {!collapsed && (
          <>
            {engines.length > 1 ? (
              // For multi-row groups, use the provided children (which contains nested DndContext/SortableContext)
              children
            ) : (
              // SINGLE ROW: render row here so we can attach the GROUP sortable attributes/listeners
              (() => {
                const { engine, rowData } = engines[0];
                return (
                  <div
                    className="rule-row"
                    style={{
                      gridTemplateColumns:
                        "40px 200px 120px 120px 180px 180px 180px 100px 120px",
                    }}
                  >
                    {/* Column 1: drag handle that uses GROUP attributes/listeners */}
                    <div className="flex items-center justify-center">
                      <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 transition"
                        title="Drag Group (single row)"
                      >
                        <FaGripVertical className="text-gray-600" />
                      </button>
                    </div>

                    {/* Column 2..8: data cells */}
                    <div className="text-left pl-4" style={{cursor : "pointer"}} >
                      {rowData.ConditionSetId }
                    </div>
                    <div style={{cursor : "pointer"}}>{rowData.RuleId || "Edit RuleId"}</div>
                    <div onClick={() => editvalue(engine.id,"ConditionId")} style={{cursor : "pointer"}}>{rowData.ConditionId || "Edit ConditionId"}</div>
                    <div onClick={() => editvalue(engine.id,"SelectAttribute")} style={{cursor : "pointer"}}>{rowData.SelectAttribute || "Edit SelectAttribute"}</div>
                    <div onClick={() => editvalue(engine.id,"Condition")} style={{cursor : "pointer"}}>{rowData.Condition || "Edit Condition"}</div>
                    <div onClick={() => editvalue(engine.id,"SelectValue")} style={{cursor : "pointer"}}>{rowData.SelectValue || "Edit SelectValue"}</div>
                    <div onClick={() => editvalue(engine.id,"Flag")} style={{cursor : "pointer"}}>{rowData.Flag ? "True" : "False"}</div>

                    {/* Column 9: actions */}
                    <div className="flex justify-center gap-2">
                      <button
                        // onClick={() => onEditRule(engine.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit Rule"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => onDeleteRule(engine.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Delete Rule"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ============================
// Sortable Row Component
// ============================
const SortableRow = ({ id, children, showHandle = true }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms ease",
    background: isDragging ? "#f8fafc" : "white",
    opacity: isDragging ? 0.95 : 1,
    boxShadow: isDragging ? "0 6px 18px rgba(0,0,0,0.08)" : "none",
  };

  // If showHandle === false, attach draggable handlers to the whole row (so the row can be dragged by anywhere)
  const rowProps = !showHandle ? { ...attributes, ...listeners } : {};

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rule-row"
      {...rowProps}
    >
      {showHandle ? (
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing flex justify-center items-center"
        >
          <FaGripVertical className="text-gray-600" />
        </div>
      ) : (
        <div className="flex justify-center items-center">
          {/* empty placeholder to keep first column size consistent */}
        </div>
      )}

      {children}
    </div>
  );
};

// ============================
// Main Component
// ============================
const FlowCanvas = observer(() => {
  const [activeId, setActiveId] = React.useState(null);
  const [activeGroupId, setActiveGroupId] = React.useState(null);
  const [ruleIdOrder, setRuleIdOrder] = React.useState([]);
  const [collapsedGroups, setCollapsedGroups] = React.useState({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
    <div style="padding: 1rem 0.5rem;">
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
                content: '';
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
  `
};

// ----------------------------
// editvalue function (shows only requested section)
// ----------------------------
const editvalue = async (id, attribute) => {

 const engine = Store.engines.find((e) => e.id === id);
  if (!engine) return;

  const row = {};
  let oldSelectAttribute = "";

  engine.nodes.forEach((nid) => {
    const node = Store.nodes.find((n) => n.id === nid);
    if (node) row[node.data.label] = node.data.value;

    if (node && node.data.label === "SelectAttribute") {
      oldSelectAttribute = node.data.value;   // save old value
    }
  });

  if (attribute === "SelectAttribute") {

    const newValue = row["SelectAttribute"];  // new selected value

    if (newValue !== oldSelectAttribute) {
      // Only clear WHEN changed
      row["SelectValue"] = "";

      engine.nodes.forEach((nodeId) => {
        const node = Store.nodes.find((n) => n.id === nodeId);
        if (node && node.data.label === "SelectValue") {
          node.data.value = "";
        }
      });
    }
  }

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
          if (list) list.style.display = isOpen ? "none" : "block";
          if (arrow) arrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";

          // If fetchOnOpen is true (SelectValue), compute values based on SelectAttribute
          if (fetchOnOpen && !isOpen) {
            // Determine selected attribute
            let selectedAttr = document.getElementById("SelectAttributeTrigger")?.getAttribute("data-value") || "";
            if (!selectedAttr) {
              // fallback to engine nodes (your existing approach)
              const engine = Store.engines.find((e) => e.id === id);
              if (engine) {
                engine.nodes.forEach((nid) => {
                  const node = Store.nodes.find((n) => n.id === nid);
                  if (node?.data.label === "SelectAttribute") selectedAttr = node.data.value;
                  Store.selectedvalue = node.data.value;
                });
              }
            }

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

      // Flag switch handler
      const flagSwitch = document.getElementById("flagSwitch");
      const flagLabel = document.getElementById("flagLabel");
      if (flagSwitch) {
        flagSwitch.addEventListener("change", () => {
          if (flagLabel) {
            flagLabel.textContent = flagSwitch.checked ? "True" : "False";
            flagLabel.style.color = flagSwitch.checked ? "#6366f1" : "#64748b";
          }
        });
      }
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
          document.getElementById("SelectValueText")?.textContent?.trim() ||
          "",
        Flag: document.getElementById("flagSwitch")?.checked ? "True" : "False",
      };
    }
  });

  // If user cancelled / nothing returned
  if (!formValues) return;

  // Update store nodes with only the field returned
  Object.keys(formValues).forEach((label) => {
    if (!formValues[label]) return;
    let node = Store.nodes.find(
      (n) => n.data.label === label && engine.nodes.includes(n.id)
    );
    if (!node) {
      const newNodeId = `${label}_${Date.now()}`;
      const newNode = {
        id: newNodeId,
        type: "default",
        data: { label, value: formValues[label] },
        position: { x: 0, y: 0 },
      };
      Store.nodes.push(newNode);
      engine.nodes.push(newNodeId);
    } else {
      node.data.value = formValues[label];
    }
  });

  Swal.fire({
    title: "Success!",
    text: "Rule updated successfully!",
    icon: "success",
    confirmButtonText: "OK",
    customClass: {
      confirmButton: "swal-confirm-btn",
    },
    buttonsStyling: false,
  });
};

  // Group engines by RuleId
  const groupedByRuleId = {};
  Store.engines.forEach((engine) => {
    const nodes = engine.nodes
      .map((id) => Store.nodes.find((n) => n.id === id))
      .filter(Boolean);

    const rowData = {};
    nodes.forEach((node) => (rowData[node.data.label] = node.data.value));

    const ruleId = rowData.RuleId || "Unassigned";
    if (!groupedByRuleId[ruleId]) groupedByRuleId[ruleId] = [];
    groupedByRuleId[ruleId].push({ engine, rowData });
  });

  React.useEffect(() => {
    const currentRuleIds = Object.keys(groupedByRuleId);
    if (
      ruleIdOrder.length === 0 ||
      currentRuleIds.length !== ruleIdOrder.length ||
      !currentRuleIds.every((id) => ruleIdOrder.includes(id))
    ) {
      setRuleIdOrder(currentRuleIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(groupedByRuleId).join(",")]);

  const orderedRuleIds = ruleIdOrder.filter((id) => groupedByRuleId[id]);

  // Collapse
  const toggleGroupCollapse = (ruleId) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [ruleId]: !prev[ruleId],
    }));
  };

  // Drag Helpers
  const getRuleIdForEngine = (engine) => {
    for (const nodeId of engine.nodes) {
      const node = Store.nodes.find((n) => n.id === nodeId);
      if (node?.data.label === "RuleId") return node.data.value;
    }
    return "Unassigned";
  };

  const handleDragStart = (event) => setActiveId(event.active.id);
  const handleDragCancel = () => setActiveId(null);
  const handleGroupDragStart = (event) => setActiveGroupId(event.active.id);
  const handleGroupDragCancel = () => setActiveGroupId(null);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeEngineIndex = Store.engines.findIndex((e) => e.id === active.id);
    const overEngineIndex = Store.engines.findIndex((e) => e.id === over.id);
    if (activeEngineIndex === -1 || overEngineIndex === -1) {
      setActiveId(null);
      return;
    }

    const activeRuleId = getRuleIdForEngine(Store.engines[activeEngineIndex]);
    const overRuleId = getRuleIdForEngine(Store.engines[overEngineIndex]);

    if (activeRuleId === overRuleId) {
      const sameGroupEngines = Store.engines.filter(
        (e) => getRuleIdForEngine(e) === activeRuleId
      );
      const idsInGroup = sameGroupEngines.map((e) => e.id);
      const oldIndex = idsInGroup.indexOf(active.id);
      const newIndex = idsInGroup.indexOf(over.id);
      const reordered = arrayMove(sameGroupEngines, oldIndex, newIndex);

      Store.engines = Store.engines.map((e) =>
        getRuleIdForEngine(e) === activeRuleId ? reordered.shift() : e
      );
    }

    setActiveId(null);
  };

  const handleGroupDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setRuleIdOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveGroupId(null);
  };

  // ===========================
  // EDIT RULE-ID FOR GROUP
  // (unchanged from your original behavior)
  // ===========================
  // const onEditRuleId = (ruleId) => {
  //   Swal.fire({
  //     title: "Edit RuleId",
  //     input: "text",
  //     inputValue: ruleId,
  //     showCancelButton: true,
  //     confirmButtonText: "Update",
  //   }).then((res) => {
  //     if (!res.value) return;

  //     const newRuleId = res.value;

  //     // update all engines in this group
  //     Store.engines.forEach((engine) => {
  //       engine.nodes.forEach((id) => {
  //         const node = Store.nodes.find((n) => n.id === id);
  //         if (node?.data.label === "RuleId" && node.data.value === ruleId) {
  //           node.data.value = newRuleId;
  //         }
  //       });
  //     });

  //     // update UI sorting order
  //     setRuleIdOrder((prev) =>
  //       prev.map((rid) => (rid === ruleId ? newRuleId : rid))
  //     );
  //   });
  // };

  // ===========================
  // DELETE GROUP
  // ===========================
  const onDeleteGroup = (ruleId) => {
    Swal.fire({
      title: "Delete Entire Group?",
      text: `All rules with RuleId "${ruleId}" will be removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (!result.isConfirmed) return;

      Store.engines = Store.engines.filter((engine) => {
        return !engine.nodes.some((id) => {
          const node = Store.nodes.find((n) => n.id === id);
          return node?.data.label === "RuleId" && node.data.value === ruleId;
        });
      });

      setRuleIdOrder((prev) => prev.filter((id) => id !== ruleId));
    });
  };


  const handleQuickAddRule = (ruleId) => {
    const newEngineId = `engine_${Date.now()}`;
    const newEngine = { id: newEngineId, nodes: [] };

    const defaultValues = {
      ConditionSetId: `CS_${Date.now()}`,
      RuleId: ruleId,
      ConditionId: "",
      SelectAttribute: "",
      Condition: "",
      SelectValue: "",
      Flag: "False",
    };

    Object.keys(defaultValues).forEach((label) => {
      const newNodeId = `${label}_${Date.now()}_${Math.random()}`;
      const newNode = {
        id: newNodeId,
        type: "default",
        data: { label, value: defaultValues[label] },
        position: { x: 0, y: 0 },
         valuesForAttribute: {}
      };
      Store.nodes.push(newNode);
      newEngine.nodes.push(newNodeId);
    });

    Store.engines.push(newEngine);
  };

  const handleDeleteRule = (engId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-confirm-btn-danger",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Store.engines = Store.engines.filter((e) => e.id !== engId);
        Swal.fire({
          title: "Deleted!",
          text: "Rule deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "swal-confirm-btn",
          },
          buttonsStyling: false,
        });
      }
    });
  };

  // ===========================
  // UI Rendering
  // ===========================
  return (
    <>
      <style>{`
        .rule-header,
        .rule-row {
          display: grid;
          grid-template-columns:
            40px 200px 120px 120px 180px 180px 180px 100px 120px;
          align-items: center;
          text-align: center;
        }
        .rule-header {
          position: sticky;
          top: 0;
          background-color: #0a1b44;
          color: white;
          font-weight: 600;
          height: 50px;
          border-radius: 6px;
          z-index: 50;
          padding: 0 8px;
        }
        .rule-row {
          background-color: white;
          border-bottom: 1px solid #e6e6e6;
          height: 50px;
          border-radius: 3px;
          padding: 0 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
        }
        /* small visual adjustment so actions icons sit nicely */
        .rule-row > div:last-child { padding-right: 12px; }
      `}</style>

      <div className="p-6 w-full h-full bg-background flex flex-col gap-6" style={{position : "relative"}}>
        <h2 className="text-lg font-semibold text-foreground">
          Rules & Groups
        </h2>

        <div className="rule-header mb-2">
          <div></div>
          <div className="text-left ">ConditionSetId</div>
          <div>RuleId</div>
          <div>ConditionId</div>
          <div>SelectAttribute</div>
          <div>Condition</div>
          <div>SelectValue</div>
          <div>Flag</div>
          <div>Actions</div>
        </div>

        {/* GROUP DRAG CONTEXT */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleGroupDragStart}
          onDragEnd={handleGroupDragEnd}
          onDragCancel={handleGroupDragCancel}
        >
          <SortableContext
            items={orderedRuleIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-6">
              {orderedRuleIds.map((ruleId) => {
                const engines = groupedByRuleId[ruleId];
                const collapsed = collapsedGroups[ruleId] || false;

                return (
                  <SortableTableGroup
                    key={ruleId}
                    id={ruleId}
                    engines={engines}
                    isDragging={activeGroupId === ruleId}
                    collapsed={collapsed}
                    onToggleCollapse={() => toggleGroupCollapse(ruleId)}
                    // onEditRuleId={onEditRuleId}
                    onDeleteGroup={onDeleteGroup}
                    editvalue={editvalue}

                    onDeleteRule={handleDeleteRule}
                    onQuickAddRule={handleQuickAddRule}
                  >
                    <>
                      {engines.length > 1 ? (
                        // MULTI-ROW: show title row (group header) and rows under it
                        <DndContext
                          sensors={sensors}
                          collisionDetection={closestCenter}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onDragCancel={handleDragCancel}
                        >
                          <SortableContext
                            items={engines.map((e) => e.engine.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {engines.map(({ engine, rowData }, index) => (
                              <SortableRow key={engine.id} id={engine.id} showHandle={true}>
                                <div className="text-left pl-4">{rowData.ConditionSetId || "Edit ConditionSetId"}</div>
                                <div style={{cursor : "pointer"}}>{rowData.RuleId || "Edit RuleId"}</div>
                                <div onClick={() => editvalue(engine.id,"ConditionId")} style={{cursor : "pointer"}}>{rowData.ConditionId || "Edit ConditionId"}</div>
                                <div onClick={() => editvalue(engine.id,"SelectAttribute")} style={{cursor : "pointer"}}>{rowData.SelectAttribute || "Edit SelectAttribute"}</div>
                                <div onClick={() => editvalue(engine.id,"Condition")} style={{cursor : "pointer"}}>{rowData.Condition || "Edit Condition"}</div>
                                <div onClick={() => editvalue(engine.id,"SelectValue")} style={{cursor : "pointer"}}>{rowData.SelectValue || "Edit SelectValue"}</div>
                                <div onClick={() => editvalue(engine.id,"Flag")} style={{cursor : "pointer"}}>{rowData.Flag ? "True" : "False"}</div>
                                <div className="flex justify-center gap-2">
                                  <button
                                    // onClick={() => handleEditRule(engine.id)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Edit Rule"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteRule(engine.id)}
                                    className="text-red-600 hover:text-red-800 p-2"
                                    title="Delete Rule"
                                  >
                                    <FaTrash />
                                  </button>
                                  {index === engines.length - 1 && (
                                    <button
                                      onClick={() => handleQuickAddRule(ruleId)}
                                      className="text-green-600 hover:text-green-800"
                                      title="Quick Add"
                                    >
                                      <FaPlus />
                                    </button>
                                  )}
                                </div>
                              </SortableRow>
                            ))}
                          </SortableContext>
                        </DndContext>
                      ) : (
                       null
                      )}
                    </>
                  </SortableTableGroup>
                );
              })}
            </div>
          </SortableContext>

          <DragOverlay>
            {/* Group overlay (when dragging groups) */}
            {activeGroupId ? (
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <FaGripVertical className="text-blue-600 text-xl" />
                  <span className="font-bold text-lg">Rule Group: {activeGroupId}</span>
                </div>
              </div>
            ) : null}

            {/* Row overlay (when dragging a row) */}
            {activeId && !activeGroupId ? (
              <div className="bg-white rounded-md p-3 shadow-md">
                <div className="flex items-center gap-2">
                  <FaGripVertical className="text-gray-700" />
                  <span>{activeId}</span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
});

export default FlowCanvas;
