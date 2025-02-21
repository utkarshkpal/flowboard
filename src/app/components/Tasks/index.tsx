"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { createColumnHelper, flexRender, useReactTable } from "@/app/hooks/table/useTable";
import { Task, useTaskStore } from "@/app/store/useTaskStore";
import { capitalize } from "lodash";
import { ClipboardCheck, Clock, Edit, Trash } from "lucide-react";
import { useEffect, useState } from "react";

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

function Tasks() {
  const { tasks, editingTaskId, setEditingTaskId, updateTask, deleteTask } = useTaskStore();

  const editingTask = tasks.find((task) => task.id.toString() === editingTaskId);

  const [localTitle, setLocalTitle] = useState<Task["title"]>("");
  const [localPriority, setLocalPriority] = useState<Task["priority"]>("medium");
  const [localStatus, setLocalStatus] = useState<Task["status"]>("not_started");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    setLocalTitle(editingTask?.title || "");
    setLocalPriority(editingTask?.priority || "medium");
    setLocalStatus(editingTask?.status || "not_started");
  }, [editingTask]);

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id.toString());
  };

  const handleSaveClick = (taskId: string) => {
    console.log(!localTitle.trim());
    if (!localTitle.trim()) {
      setTitleError("Title is required.");
      return;
    } else {
      setTitleError("");
    }

    if (editingTaskId) {
      updateTask(Number(taskId), {
        title: localTitle,
        priority: localPriority,
        status: localStatus,
      });
    }
    setEditingTaskId(null);
  };

  const handleDeleteClick = (taskId: string) => {
    deleteTask(Number(taskId));
  };

  const columns = [
    columnHelper.accessor("title"),
    columnHelper.accessor("status"),
    columnHelper.accessor("priority"),
    columnHelper.display({
      id: "actions",
      cell: (props) => (
        <Button onClick={() => handleEditClick(props)}>
          <Edit className="w-4 h-4" />
        </Button>
      ),
    }),
  ];

  const table = useReactTable<Task>({
    data: tasks,
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

  const renderCell = (columnId: string, row: { original: Task }) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return null;

    if (editingTaskId === row.original.id.toString()) {
      // Local state for each input field

      switch (columnId) {
        case "title":
          return (
            <>
              <Input value={localTitle} onChange={(e) => setLocalTitle(e.target.value)} />
              {titleError && <p className="text-red-500 text-xs mt-1">{titleError}</p>}
            </>
          );
        case "priority":
          return (
            <Select
              onValueChange={(priority: Task["priority"]) => setLocalPriority(priority)}
              value={localPriority}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          );
        case "status":
          return (
            <Select
              onValueChange={(status: Task["status"]) => setLocalStatus(status)}
              value={localStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          );
        case "actions":
          return (
            <Button
              onClick={() => {
                handleSaveClick(row.original.id.toString());
              }}
            >
              Save
            </Button>
          );
        default:
          return null;
      }
    } else {
      // Render non-editable cells
      switch (columnId) {
        case "status":
          const formattedStatus = formatStatus(row.original.status);
          return (
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${getStatusColor(row.original.status)}`}
            >
              {formattedStatus}
            </span>
          );
        case "priority":
          return capitalize(row.original.priority);
        case "actions":
          return (
            <div className="flex space-x-2">
              <Button onClick={() => handleEditClick(row.original)}>Edit</Button>
              <Button onClick={() => handleDeleteClick(row.original.id.toString())}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          );
        default:
          return row.original[columnId as keyof Task];
      }
    }
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
                    {header.id === "actions" ? "Actions" : capitalize(flexRender(header.render()))}
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
                  {renderCell(column.id, row)}
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
