
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


const setconditon = async(id) => {

  Swal.fire({
  title: "Choose Condition",
  html: `
    <div style="display:flex; gap:20px; justify-content:center; margin-top:20px;">
      <button id="andBtn" class="swal2-confirm swal2-styled" style="padding:10px 20px;">
        AND
      </button>
      <button id="orBtn" class="swal2-cancel swal2-styled" style="padding:10px 20px;">
        OR
      </button>
    </div>
  `,
  showConfirmButton: false,
  showCancelButton: false,
  didOpen: () => {
    document.getElementById("andBtn").onclick = () => {
      Swal.close();
      console.log("AND selected");
      alert("and")
      setvalue("AND")
    };

    document.getElementById("orBtn").onclick = () => {
      Swal.close();
      console.log("OR selected");
      alert("or")
      setvalue("OR")
      // your logic here
    };
  }
});



 alert("hii")
  // Find the matching column
  const updated = Store.column.map((col) => {
    if (col.id === id) {
      return {
        ...col,
        condition: value  // <-- set AND / OR here
      };
      ;
    }
    
    return col;
  });

  Store.column = updated;

  console.log(updated)
 
  
}



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

        <div style={{display : "flex" , width : "400px",justifyContent : "space-evenly",position : "relative"}}>


            <button
        className="btn"
         style={{width : "120px",position : "absolute",zIndex : "12",right : "842px"}}
         onPointerDown={(e) => e.stopPropagation()}

          onClick={()=>setconditon(column.id)}
        >
           Add Condition
        </button>

          <button
        className="btn"
         style={{width : "40px"}}
         onPointerDown={(e) => e.stopPropagation()}

          onClick={() => addRuleInsideGroup(column.id)}
        >
           <IoMdAdd/>
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
         style={{width : "40px"}}
         onPointerDown={(e) => e.stopPropagation()}

          onClick={() => deleteGroup(column.id)}
        >
          <MdDelete/>
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
