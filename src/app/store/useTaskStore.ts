import tasks from "@/app/data/task";
import { create } from "zustand";

export type Task = {
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
  status: "not_started" | "in_progress" | "completed";
};

type TaskStore = {
  tasks: Task[];
  editingTaskId: string | null;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: number, updatedTask: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  setEditingTaskId: (id: string | null) => void;
};

//todo : add global validation for task

export const useTaskStore = create<TaskStore>((set) => {
  const logChange = (action: string, beforeState: TaskStore, afterState: TaskStore) => {
    console.log(`%cAction: ${action}`, "color: blue; font-weight: bold;");
    console.log(
      "%cBefore State:",
      "color: red; font-weight: bold;",
      JSON.parse(JSON.stringify(beforeState)),
    );
    console.log(
      "%cAfter State:",
      "color: green; font-weight: bold;",
      JSON.parse(JSON.stringify(afterState)),
    );
  };

  return {
    tasks: tasks as Task[],
    editingTaskId: null,
    editingTask: null,
    setEditingTaskId: (id) =>
      set((state) => {
        const newState = { ...state, editingTaskId: id };
        logChange("setEditingTaskId", state, newState);
        return newState;
      }),
    addTask: (task) =>
      set((state) => {
        const newState = {
          ...state,
          tasks: [...state.tasks, { id: state.tasks.length + 1, ...task }],
        };
        logChange("addTask", state, newState);
        return newState;
      }),
    updateTask: (id, updatedTask) =>
      set((state) => {
        const newState = {
          ...state,
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
          editingTaskId: null,
        };
        logChange("updateTask", state, newState);
        return newState;
      }),
    deleteTask: (id) =>
      set((state) => {
        const newState = { ...state, tasks: state.tasks.filter((task) => task.id !== id) };
        logChange("deleteTask", state, newState);
        return newState;
      }),
  };
});
