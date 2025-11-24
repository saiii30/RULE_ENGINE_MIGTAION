// src/Component/FileExplorer.jsx
import React from "react";
import { observer } from "mobx-react";
import Swal from "sweetalert2";

import Store from "../Store";
import ExplorerNode from "./ExplorerNode";

import RuleGroupModal from "./RuleGroupModal";

const FileExplorer = observer(({treeData,setTreeData,setPopupOpen,popupOpen,setSelectedNode,selectedNode,hoverId,setHoverId}) => {
  return (
    <div className=" text-black " style={{position : "relative",width : "100%"}}>
  
          
            <ExplorerNode  store={Store} treeData={treeData} setTreeData={setTreeData} setPopupOpen={setPopupOpen} popupOpen={popupOpen} setSelectedNode={setSelectedNode} selectedNode={selectedNode} hoverId={hoverId} setHoverId={setHoverId}/> 

      {/* Rule / Group Modal */}
      <RuleGroupModal
        open={Store.ruleGroupPicker.open}
        onClose={() => Store.closeRuleGroupPicker()}
        onSelect={(choice) => {
          if (choice === "group") {
            Swal.fire({
              title: "Enter group name",
              input: "text",
              inputPlaceholder: "e.g., groupA",
              showCancelButton: true,
              confirmButtonText: "Create",
              inputValidator: (val) =>
                !val || !val.trim() ? "Please enter a group name" : undefined,
            }).then((res) => {
              if (res.isConfirmed) {
                Store.createRuleEngineNodes("group", Store.activeCollection, res.value.trim());
                Swal.fire("Created", "Group engine created successfully!", "success");
                Store.closeRuleGroupPicker();
              }
            });
          } else {
            Store.activeGroupName = null;
            Store.createRuleEngineNodes(choice, Store.activeCollection);
            Swal.fire("Created", "Rule engine created successfully!", "success");
            Store.closeRuleGroupPicker();
          }
        }}
      />
    </div>
  );
});

export default FileExplorer;
