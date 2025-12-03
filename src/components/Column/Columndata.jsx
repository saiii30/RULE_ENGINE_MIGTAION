
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
export const Columndata = observer(({ column, addRuleInsideGroup,handleDeleteRule={handleDeleteRule},deleteGroup ,toggleCollapse,editvalue }) => {

const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.id,    
    });

    const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    
  };


  const [openDropdownId, setOpenDropdownId] = useState(null);

const toggleDropdown = (id) => {
  setOpenDropdownId(prev => (prev === id ? null : id));
};

const handleSelectCondition = (columnId, selectedRuleId) => {
  if (!selectedRuleId) return;

  const index = Store.column.findIndex(c => c.id === columnId);

  if (index !== -1) {
    Store.column[index] = {
      ...Store.column[index],
      condition: selectedRuleId
    };
  }

  setOpenDropdownId(null); // close dropdown
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
    onClick={() => toggleDropdown(column.id)}
  >
    {column.condition ? column.condition.replace(/\D/g, "") : "Add Condition"}

  </a>

  {/* dropdown */}
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
  )}

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
