
import "./Column.css";
import { Task } from "../Task/Task";
import { GripVertical } from "lucide-react";
import { MdOutlineExpandLess } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { observer } from "mobx-react";
import Store from "../../Store";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Swal from "sweetalert2";
export const Columndata = observer(({ column, addRuleInsideGroup,handleDeleteRule={handleDeleteRule},deleteGroup ,toggleCollapse ,editvalue}) => {

const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.id,    
    });

    const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    
  };


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
            };

            const getConditionDropdownNumbers = () => {
    
    
      
      
      return Array.from({ length: Store.column.length }, (_, i) => i + 1);
    
  };

            const editCondition = async (id) => {

              alert(id)

      var value;
      value = getConditionDropdownNumbers();
      Store.conditionidvalue = value;
   

 
// Find column that contains the clicked task
const column = Store.column.find(col =>
  col.id === id
);

if (!column) return;

// ✅ Only get condition
const conditionValue = column.condition;

// Prepare row with only condition
const row = {
  Condition: conditionValue
};
  const html = `
    <div style="padding: 0;">
          ${popupSections.ConditionId({ ConditionId: conditionValue })}

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
     `<div style="color:#1e293b;font-weight:700;font-size:1.25rem;margin-bottom:0.25rem;">Edit Condition Id</div>`,
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

      // 🔥 Rebuild ConditionId list fresh every time popup opens
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


      if (document.getElementById("ConditionIdTrigger")) {
        // fetchOnOpen = true so it loads based on SelectAttribute
        attachDropdown("ConditionId", () => Store.conditionidvalue, false);
      }

    },
    preConfirm: () => {
      return {
        ConditionId:   
        document.getElementById("ConditionIdTrigger")?.getAttribute("data-value") ||
          document.getElementById("ConditionIdText")?.textContent?.trim() ||
          "",
      };
    }
  });

   if (!formValues) return;

    if (!formValues) return;

const index = Store.column.findIndex(c => c.id === id);

if (index !== -1) {
  Store.column[index] = {
    ...Store.column[index],
    condition: formValues.ConditionId   // ✅ Save selected dropdown value
  };
}

};


  const editGroupName = async (columnId) => {
  const { value: Name } = await Swal.fire({
    title: `<div style="color:#1e293b; font-weight:700; font-size:1.3rem;">Edit Group Name</div>`,
    input: "text",
    inputLabel: "Enter New Group Name",
    inputPlaceholder: "e.g. Updated Price Rules",
    showCancelButton: true,
    confirmButtonText: "Update",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#64748b",
    inputValidator: (value) => {
      if (!value) {
        return "Please enter a group name!";
      }
      if (value.trim().length < 3) {
        return "Group name should have at least 3 characters!";
      }
    },
  });

  // ✅ If user entered a valid name, update the column in state
  if (Name) {
    Store.column = Store.column.map(col =>
  col.id === columnId ? { ...col, name: Name.trim() } : col
);

    // ✅ Success message
    Swal.fire({
      title: "Group Updated!",
      text: `Group name has been changed to "${Name.trim()}"`,
      icon: "success",
      confirmButtonColor: "#2563eb",
    });
  }
};



  return (
     <div style={style} className="column" >
      
  

     <div style={{display : "flex",width : "100%",justifyContent : "space-between",alignItems : "center",position : "relative"}}>
      
        <div style={{display : "flex",justifyContent : "space-between",alignItems : "center",height : "10px",textAlign : "center",position : "relative"}}>
<div style={{display : "flex", cursor: "grab" }}>

  {
    column.type != "rule" &&
      <GripVertical size={18} ref={setNodeRef}  {...attributes} {...listeners}/>

    

  }
        
      </div>
      
     
     {
        column.type === "group" && (

          <div style={{fontSize : "14px"}}>{column.name}</div>
         )

     }
      
        
        
      
        </div>
        

      <div style={{position : "relative"}}>
        {column.type === "group" && (

        <div style={{display : "flex" , width : "150px",justifyContent : "space-evenly",position : "relative"}}>


          <div style={{ width: "120px", position: "absolute", zIndex: 12, right: "820px", color: "blue", textDecoration: "underline", cursor: "pointer" }}>

  {/* clickable text */}
  <a
    href="#"
    style={{
      width: "120px",
      color: "blue",
      textDecoration: "underline",
      cursor: "pointer"
    }}
    onPointerDown={(e) => e.stopPropagation()}
    onClick={() => editCondition(column.id)}
  >
    {column.condition ? column.condition.replace(/\D/g, "") : "Add Condition"}

  </a>

  {/* dropdown
  {openDropdownId === column.id && (
    <select
      style={{
        position: "absolute",
        top: "25px",
        left: "0px",
        width: "150px",
        padding: "6px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        background: "white",
        zIndex: 12,
      }}
      onChange={(e) => handleSelectCondition(column.id, e.target.value)}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <option value="">Select Column</option>

      {Store.column.map((col) => {
  const ruleId = col.tasks?.[0]?.RuleId;          // e.g. id1, id2, Rule3
  const onlyNumber = ruleId?.replace(/\D/g, "");  // result: 1, 2, 3

  return (
    <option key={col.id} value={ruleId}>
      {onlyNumber}
    </option>
  );
})}

    </select>
  )} */}

</div>


          <button
  className="icon-btn add-icon"
  onPointerDown={(e) => e.stopPropagation()}
  onClick={() => addRuleInsideGroup(column.id)}
>
  <IoMdAdd size={20} />
</button>

<button
  className="icon-btn edit-icon"
  onPointerDown={(e) => e.stopPropagation()}
  onClick={() => editGroupName(column.id)}
>
  <MdEdit size={20} />
</button>

<button
  className="icon-btn delete-icon"
  onPointerDown={(e) => e.stopPropagation()}
  onClick={() => deleteGroup(column.id)}
>
  <MdDelete size={20} />
</button>

<button
  className="icon-btn collapse-icon"
  onPointerDown={(e) => e.stopPropagation()}
  onClick={() => toggleCollapse(column.id)}
>
  {column.collapsed ? (
    <MdOutlineExpandLess size={20} />
  ) : (
    <MdOutlineExpandMore size={20} />
  )}
</button>

          </div>
       

        
      )}
      </div>

       

     </div>
      

      {/* Add Rule Button */}
     

       <div className={`collapse-container ${column.collapsed ? "collapsed" : "expanded"}`}>
        <div className="collapse-content">
          {column.tasks && column.tasks.length > 0 ?  (
            <SortableContext items={column.tasks} strategy={verticalListSortingStrategy}>
              {column.tasks.map((task) => (
                <Task
                  key={task.id}
                  {...task}
                  column={column.type}
                  columnvalue={column}
                  columnId={column.id}
                  editvalue={editvalue}
                  handleDeleteRule={handleDeleteRule}
                  sortableProps={{ setNodeRef, attributes, listeners, transform, transition }}
                />
              ))}
            </SortableContext>
          ) : (
            <p style={{ textAlign: "center" }}>No tasks yet</p>
          )}
        </div>
      </div>

     
    </div>
  );
});
