"use client";

import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import * as React from "react";
import "../../../globals.css"; // or your custom Kanban styles here

const TasksKanban = () => {
  const data = [
    {
      Id: 1,
      Status: "Open",
      Summary: "Analyze the new requirements gathered from the customer.",
      Type: "Story",
      Priority: "Low",
      Tags: "Analyze,Customer",
      Estimate: 3.5,
      Assignee: "Nancy Davloio",
      RankId: 1,
    },
    {
      Id: 2,
      Status: "InProgress",
      Summary: "Fix the issues reported in the IE browser.",
      Type: "Bug",
      Priority: "Release Breaker",
      Tags: "IE",
      Estimate: 2.5,
      Assignee: "Janet Leverling",
      RankId: 2,
    },
    {
      Id: 3,
      Status: "Testing",
      Summary: "Fix the issues reported by the customer.",
      Type: "Bug",
      Priority: "Low",
      Tags: "Customer",
      Estimate: "3.5",
      Assignee: "Steven Walker",
      RankId: 1,
    },
    {
      Id: 4,
      Status: "Close",
      Summary:
        "Arrange a web meeting with the customer to get the login page requirements.",
      Type: "Others",
      Priority: "Low",
      Tags: "Meeting",
      Estimate: 2,
      Assignee: "Michael Suyama",
      RankId: 1,
    },
    {
      Id: 5,
      Status: "Validate",
      Summary: "Validate new requirements",
      Type: "Improvement",
      Priority: "Low",
      Tags: "Validation",
      Estimate: 1.5,
      Assignee: "Robert King",
      RankId: 1,
    },
  ];

  return (
    <div className="w-full h-full p-4">
      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={data}
        cardSettings={{ contentField: "Summary", headerField: "Id" }}
      >
        <ColumnsDirective>
          <ColumnDirective headerText="To Do" keyField="Open" />
          <ColumnDirective headerText="In Progress" keyField="InProgress" />
          <ColumnDirective headerText="Testing" keyField="Testing" />
          <ColumnDirective headerText="Done" keyField="Close" />
          <ColumnDirective headerText="Validate" keyField="Validate" />
        </ColumnsDirective>
      </KanbanComponent>
    </div>
  );
};

export default TasksKanban;
