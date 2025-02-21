/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createColumnHelper, flexRender, useReactTable } from "@/app/components/ui/table";
import tasks from "@/app/data/task";
import { capitalize } from "lodash";
import { ClipboardCheck, Clock } from "lucide-react";
import React from "react";

type Task = {
  id: number;
  title: string;
  status: string;
  priority: string;
};

// const defaultData: Task[] = [
//   {
//     id: 1,
//     title: "Task 1",
//     status: "In Progress",
//     priority: "High",
//   },
//   {
//     id: 2,
//     title: "Task 2",
//     status: "Completed",
//     priority: "Medium",
//   },
//   {
//     id: 3,
//     title: "Task 3",
//     status: "Not Started",
//     priority: "Low",
//   },
// ];

const columnHelper = createColumnHelper<Task>();

const columns = [
  columnHelper.accessor("title"),
  columnHelper.accessor("status"),
  columnHelper.accessor("priority"),
];

function Tasks() {
  const [data] = React.useState(() => [...tasks]);

  const table = useReactTable<Task>({
    data,
    columns,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-200 text-green-800";
      case "in_progress":
        return "bg-amber-200 text-amber-800";
      case "not_started":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => capitalize(word))
      .join(" ");
  };

  const renderCell = (columnId: keyof Task, value: any) => {
    const cellValue = typeof value === "function" ? value() : value;
    if (columnId === "status") {
      const formattedStatus = formatStatus(cellValue);
      return (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${getStatusColor(cellValue)}`}
        >
          {formattedStatus}
        </span>
      );
    }
    return cellValue;
  };

  return (
    <div className="p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center">
                    {header.id === "title" && <ClipboardCheck className="mr-2" />}
                    {header.id === "priority" && <Clock className="mr-2" />}
                    {header.id === "title" ? "Task" : capitalize(flexRender(header.render()))}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                  {renderCell(column.id, flexRender(row.getValue(column.id)))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tasks;
