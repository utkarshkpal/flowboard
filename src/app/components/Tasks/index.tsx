"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import CustomFieldsEditor from "@/app/components/CustomField";
import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { createColumnHelper, useReactTable } from "@/app/hooks/table/useTable";
import { CustomField, Task, useTaskStore } from "@/app/store/useTaskStore";
import { capitalize } from "lodash";
import { ArrowDown, ArrowUp, ArrowUpDown, Edit, FileQuestion, Pencil, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import TaskModal from "../TaskModal";
import { priorityOrder, statusOrder } from "./constants";
import DeleteDialog from "./DeleteDialog";
import Filters from "./filters";
import Pagination from "./pagination";
import TableLoader from "./TableLoader";
import TaskTable from "./TaskTable";
const columnHelper = createColumnHelper<Task>();

function Tasks() {
  const {
    tasks,
    customFields,
    editingTaskId,
    isHydrated,
    setEditingTaskId,
    updateTask,
    deleteTask,
    addCustomField,
    removeCustomField,
  } = useTaskStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchText, setSearchText] = useState(searchParams.get("searchText") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [priority, setPriority] = useState(searchParams.get("priority") || "all");

  const editingTask = tasks.find((task) => task.id.toString() === editingTaskId);

  const [localTitle, setLocalTitle] = useState<Task["title"]>("");
  const [localPriority, setLocalPriority] = useState<Task["priority"]>("medium");
  const [localStatus, setLocalStatus] = useState<Task["status"]>("not_started");
  const [titleError, setTitleError] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isCustomFieldDialogOpen, setIsCustomFieldDialogOpen] = useState(false);
  const [localCustomFields, setLocalCustomFields] = useState<
    Record<string, string | number | boolean>
  >({});

  console.log("render");

  useEffect(() => {
    const query = new URLSearchParams();
    if (searchText) query.set("searchText", searchText);
    if (status !== "all") query.set("status", status);
    if (priority !== "all") query.set("priority", priority);
    router.replace(`?${query.toString()}`);
  }, [searchText, status, priority, router]);

  const handleFilterChange = useCallback((type: string, value: string) => {
    switch (type) {
      case "text":
        setSearchText(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "priority":
        setPriority(value);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    if (editingTask) {
      setLocalTitle(editingTask.title);
      setLocalPriority(editingTask.priority);
      setLocalStatus(editingTask.status);
      setLocalCustomFields(
        editingTask.customFields.reduce(
          (acc, field) => {
            acc[field.name] = field.value;
            return acc;
          },
          {} as Record<string, string | number | boolean>,
        ),
      );
    }
  }, [editingTask]);

  const handleEditClick = useCallback(
    (task: Task) => {
      setEditingTaskId(task.id.toString());
    },
    [setEditingTaskId],
  );

  const handleSaveClick = useCallback(
    (taskId: string) => {
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
          customFields: Object.entries(localCustomFields).map(([name, value]) => ({
            name,
            value,
            type: customFields[name]?.type || "text",
          })),
        });
      }
      setEditingTaskId(null);
    },
    [
      localTitle,
      localPriority,
      localStatus,
      localCustomFields,
      editingTaskId,
      updateTask,
      customFields,
      setEditingTaskId,
    ],
  );

  const handleDeleteClick = useCallback((taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (taskToDelete) {
      deleteTask(Number(taskToDelete));
      setTaskToDelete(null);
    }
    setIsDeleteDialogOpen(false);
  }, [taskToDelete, deleteTask]);

  const handleAddField = useCallback(
    (field: CustomField) => {
      addCustomField(field);
    },
    [addCustomField],
  );

  const handleRemoveField = useCallback(
    (fieldName: string) => {
      removeCustomField(fieldName);
    },
    [removeCustomField],
  );

  const columns = [
    columnHelper.accessor({
      key: "title",
      sortFn: (a, b) => a.title.localeCompare(b.title),
    }),
    columnHelper.accessor({
      key: "status",
      sortFn: (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
    }),
    columnHelper.accessor({
      key: "priority",
      sortFn: (a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority),
    }),
    ...Object.keys(customFields).map((fieldName) =>
      columnHelper.accessor({
        key: fieldName as keyof Task,

        sortFn: (a, b) => {
          const aValue = a.customFields.find((f) => f.name === fieldName)?.value || "";
          const bValue = b.customFields.find((f) => f.name === fieldName)?.value || "";
          if (typeof aValue === "string" && typeof bValue === "string") {
            return aValue.localeCompare(bValue);
          }
          return aValue > bValue ? 1 : -1;
        },
      }),
    ),
    columnHelper.display({
      id: "actions",
      cell: (props) => (
        <Button onClick={() => handleEditClick(props)}>
          <Edit className="w-4 h-4" />
        </Button>
      ),
    }),
  ];
  const filteredTasks = tasks.filter((task) => {
    if (searchText) {
      return task.title.toLowerCase().includes(searchText.toLowerCase());
    }
    if (status !== "all") {
      return task.status === status;
    }
    if (priority !== "all") {
      return task.priority === priority;
    }
    return true;
  });

  const table = useReactTable<Task>({
    data: filteredTasks,
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

  const renderCell = (columnId: string, row: any) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return null;

    if (editingTaskId === row.original.id.toString()) {
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
              variant="outline"
              onClick={() => {
                handleSaveClick(row.original.id.toString());
              }}
            >
              Save
            </Button>
          );
        default:
          const field = row.original?.customFields?.find((f: CustomField) => f.name === columnId);
          if (field) {
            switch (field.type) {
              case "text":
                return (
                  <Input
                    value={String(localCustomFields[columnId] || "")}
                    onChange={(e) =>
                      setLocalCustomFields((prev) => ({
                        ...prev,
                        [columnId]: e.target.value,
                      }))
                    }
                  />
                );
              case "number":
                return (
                  <Input
                    type="number"
                    value={String(localCustomFields[columnId] || "")}
                    onChange={(e) =>
                      setLocalCustomFields((prev) => ({
                        ...prev,
                        [columnId]: Number(e.target.value),
                      }))
                    }
                  />
                );
              case "checkbox":
                return (
                  <input
                    type="checkbox"
                    checked={Boolean(localCustomFields[columnId])}
                    onChange={(e) =>
                      setLocalCustomFields((prev) => ({
                        ...prev,
                        [columnId]: e.target.checked,
                      }))
                    }
                  />
                );
              default:
                return null;
            }
          }
          return null;
      }
    } else {
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
              <Button variant="outline" onClick={() => handleEditClick(row.original)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="text-red-500"
                onClick={() => handleDeleteClick(row.original.id.toString())}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          );
        default:
          const field = row.original?.customFields?.find((f: CustomField) => f.name === columnId);
          if (field) {
            if (field.value === undefined || field.value === null || field.value === "") {
              return <FileQuestion className="w-4 h-4 text-gray-500" />;
            }
            return field.type === "checkbox" ? (
              <input type="checkbox" checked={Boolean(field.value)} disabled />
            ) : (
              String(field.value)
            );
          }
          return String(row.original[columnId as keyof Task] || "");
      }
    }
  };

  const renderSortIcon = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column || !("sortFn" in column) || !column.sortFn) {
      return null;
    }

    switch (true) {
      case table.sortColumnId === columnId && table.sortOrder === "asc":
        return <ArrowUp className="ml-2 w-4 h-4" />;
      case table.sortColumnId === columnId && table.sortOrder === "desc":
        return <ArrowDown className="ml-2 w-4 h-4" />;
      default:
        return <ArrowUpDown className="ml-2 w-4 h-4" />;
    }
  };

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      table.setPageSize(pageSize);
      table.setCurrentPage(1);
    },
    [table],
  );

  return (
    <div className="p-4">
      {titleError && (
        <div role="alert" aria-live="polite" className="text-red-500 mb-2">
          {titleError}
        </div>
      )}

      <div className="flex justify-between gap-2 mb-4">
        <TaskModal />
        <Button onClick={() => setIsCustomFieldDialogOpen(true)} aria-label="Manage Custom Fields">
          <Pencil className="w-4 h-4 mr-2" />
          Manage Custom Fields
        </Button>
      </div>

      <Dialog open={isCustomFieldDialogOpen} onOpenChange={setIsCustomFieldDialogOpen}>
        <DialogContent>
          <DialogTitle>Manage Custom Fields</DialogTitle>

          <CustomFieldsEditor
            customFields={customFields}
            onAddField={handleAddField}
            onRemoveField={handleRemoveField}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsCustomFieldDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Filters
        filters={{
          searchText,
          status,
          priority,
        }}
        onFilterChange={handleFilterChange}
      />

      {isHydrated ? (
        <TaskTable
          tasks={filteredTasks}
          columns={columns}
          renderCell={renderCell}
          renderSortIcon={renderSortIcon}
        />
      ) : (
        <TableLoader />
      )}
      <Pagination
        currentPage={table.currentPage}
        totalPages={table.totalPages}
        onPageChange={(page: number) => table.setCurrentPage(page)}
        onPageSizeChange={handlePageSizeChange}
        pageSize={table.pageSize}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default Tasks;
