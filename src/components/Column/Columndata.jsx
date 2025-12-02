
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

  const[value,setvalue] = useState("")
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


const setconditon = async (id) => {
  // Prepare HTML dynamically with all columns and their stored count
  const html = Store.column
    .map(
      (col) => `
      <div style="display:flex; justify-content:space-between; padding:5px 10px; cursor:pointer; border-bottom:1px solid #eee;" data-rule-id="${col.tasks?.[0]?.RuleId}">
        
        <span>Rule: ${col.count || 0}</span>
      </div>
    `
    )
    .join("");

  Swal.fire({
    title: "Select Column",
    html: `<div style="max-height:300px; overflow-y:auto;">${html}</div>`,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: "Close",
    didOpen: () => {
      // Add click for each column div
      const divs = Swal.getHtmlContainer().querySelectorAll("div[data-rule-id]");
      divs.forEach((div) => {
        div.onclick = () => {
          const selectedRuleId = div.getAttribute("data-rule-id");
          Swal.close();

          console.log("Selected RuleId:", selectedRuleId);
          alert(selectedRuleId);

          // Update only the 'condition' property with RuleId
          const colIndex = Store.column.findIndex(c => c.id === id);
          if (colIndex !== -1) {
            Store.column[colIndex] = {
              ...Store.column[colIndex],
              condition: selectedRuleId
            };
          }
        };
      });
    },
  });
};




// const setconditon = async(id) => {

//   Swal.fire({
//   title: "Choose Condition",
//   html: `
//     <div style="display:flex; gap:20px; justify-content:center; margin-top:20px;">
//       <button id="andBtn" class="swal2-confirm swal2-styled" style="padding:10px 20px;">
//         AND
//       </button>
//       <button id="orBtn" class="swal2-cancel swal2-styled" style="padding:10px 20px;">
//         OR
//       </button>
//     </div>
//   `,
//   showConfirmButton: false,
//   showCancelButton: false,
//   didOpen: () => {
//     document.getElementById("andBtn").onclick = () => {
//       Swal.close();
//       console.log("AND selected");
//        updateCondition(id, "AND");   // <--- Update here
      
//     };

//     document.getElementById("orBtn").onclick = () => {
//       Swal.close();
//       console.log("OR selected");
//        updateCondition(id, "OR");    // <--- Update here
      
//       // your logic here
//     };
//   }
// });



  
// }


const updateCondition = (id, cond) => {

  Store.column = Store.column.map((col) =>
    col.id === id ? { ...col, condition: cond } : col
  );

  console.log("Updated condition:", cond);

  // If using React state:
  // setColumns([...Store.column]);
};



  return (
     <div style={style} className="column" >
      {/* <h4>{column.name}</h4> */}
  

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
        

      <div>
        {column.type === "group" && (

        <div style={{display : "flex" , width : "150px",justifyContent : "space-evenly",position : "relative"}}>


          <a
  href="#"
  style={{
    width: "120px",
    position: "absolute",
    zIndex: 12,
    right: "802px",
    color: "blue",
    textDecoration: "underline",
    cursor: "pointer"
  }}
  onPointerDown={(e) => e.stopPropagation()}
  onClick={() => setconditon(column.id)}
>
  {column.condition ? column.condition : "Add Condition"}
</a>

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
