import React from "react";

const TableHeader = () => {
  const columns = [
    "ConditionSetId",
    "RuleId",
    "ConditionId",
    "SelectAttribute",
    "Condition",
    "SelectValue",
    "Flag",
    "Actions",
  ];

  return (
    <thead
      className="text-foreground"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "#031130ff",
        color: "#fff",
      }}
    >
      <tr>
        <th className="px-3 py-2 font-medium text-sm text-center w-16"></th>
        {columns.map((col) => (
          <th
            key={col}
            className="px-3 py-2 border font-medium text-sm text-center"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
