
import "./Column.css";
import { Task } from "../Task/Task";
import { GripVertical } from "lucide-react";
import { MdOutlineExpandLess } from "react-icons/md";
import { MdOutlineExpandMore } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Swal from "sweetalert2";
export const Columndata = ({ column, addRuleInsideGroup,handleEditRule,handleDeleteRule={handleDeleteRule},deleteGroup ,toggleCollapse,setColumns }) => {

const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: column.id,    
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
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
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId ? { ...col, name: Name.trim() } : col
      )
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
      {/* <h4>{column.name}</h4> */}
  

     <div style={{display : "flex",width : "100%",justifyContent : "space-between",alignItems : "center",position : "relative"}}>
      
        <div style={{display : "flex",justifyContent : "space-between",alignItems : "center",height : "30px",textAlign : "center",position : "relative"}}>
<div style={{display : "flex", cursor: "grab" }}>

  {
    column.type !== "rule" ? ( 
      <GripVertical size={18} ref={setNodeRef}  {...attributes} {...listeners}/>

    )
     : 
     (
      <GripVertical style={{position : "absolute",top : "24px",right : "-10px"}} size={18} ref={setNodeRef}  {...attributes} {...listeners}/>
     )

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

        <div style={{display : "flex" , width : "600px",justifyContent : "space-evenly"}}>
          <button
        className="btn"
         style={{width : "100px"}}
         onPointerDown={(e) => e.stopPropagation()}

          onClick={() => addRuleInsideGroup(column.id)}
        >
           Add Rule
        </button>

        <button
        className="btn"
         style={{width : "150px"}}
         onPointerDown={(e) => e.stopPropagation()}

          onClick={() => editGroupName(column.id)}
        >
           Edit Group Name
        </button>
         <button
        className="btn"
         style={{width : "100px"}}
         onPointerDown={(e) => e.stopPropagation()}

          onClick={() => deleteGroup(column.id)}
        >
          Delete
        </button>
        <button
        onPointerDown={(e) => e.stopPropagation()}

          onClick={() => toggleCollapse(column.id)}
          style={{
            width : "40px",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "5px 12px",
            cursor: "pointer",
            fontSize : "12px"
          }}

          className="btn"
        >
          {column.collapsed ? <MdOutlineExpandLess /> : <MdOutlineExpandMore />}
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
                  handleEditRule={handleEditRule}
                  handleDeleteRule={handleDeleteRule}
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
};
