"use client";

import { Button } from "@/app/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Task, useTaskStore } from "@/app/store/useTaskStore";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import clsx from "clsx";
import { Plus } from "lucide-react";
import { useState } from "react";

const priorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
  { label: "None", value: "none" },
];

const statusOptions = [
  { label: "Not Started", value: "not_started" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export default function TaskModal({ task }: { task?: Task }) {
  const [title, setTitle] = useState(task?.title || "");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [status, setStatus] = useState(task?.status || "not_started");
  const [titleError, setTitleError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { addTask } = useTaskStore();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setIsDialogOpen(open);
  };

  const resetForm = () => {
    setTitle("");
    setPriority("medium");
    setStatus("not_started");
    setTitleError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let hasError = false;

    if (!title.trim()) {
      setTitleError("Title is required.");
      hasError = true;
    } else {
      setTitleError("");
    }

    if (hasError) return;

    addTask({ title, priority, status, customFields: [] });
    resetForm();
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={(open) => handleOpenChange(open)}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Create Task</DialogTitle>
        </VisuallyHidden>

        <h2 className="text-lg font-semibold mb-4">Create Task</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                placeholder="Task Title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) {
                    setTitleError("");
                  }
                }}
                className={clsx("mt-1", { "border-red-500": titleError })}
              />
              {titleError && (
                <p
                  id="title-error"
                  role="alert"
                  aria-live="polite"
                  className="text-red-500 text-xs mt-1"
                >
                  {titleError}
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <Select
                  onValueChange={(priority: Task["priority"]) => setPriority(priority)}
                  defaultValue={priority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <Select
                  onValueChange={(status: Task["status"]) => setStatus(status)}
                  defaultValue={status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-10">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
