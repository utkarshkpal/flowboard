import tasks from "@/app/data/task";
import { create } from "zustand";

export type CustomField = {
  name: string;
  type: "text" | "number" | "checkbox";
  value: string | number | boolean;
};

export type Task = {
  id: number;
  title: string;
  priority: "none" | "low" | "medium" | "high" | "urgent";
  status: "not_started" | "in_progress" | "completed";
  customFields: CustomField[];
};

type TaskStore = {
  tasks: Task[];
  customFields: Record<string, CustomField>;
  editingTaskId: string | null;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: number, updatedTask: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  setEditingTaskId: (id: string | null) => void;
  addCustomField: (field: CustomField) => void;
  removeCustomField: (fieldName: string) => void;
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

  const loadTasksFromLocalStorage = (): Task[] => {
    const tasksJSON = localStorage.getItem("tasks");
    const defaultTasks = tasks;
    const loadedTasks = tasksJSON ? JSON.parse(tasksJSON) : defaultTasks;
    loadedTasks.forEach((task: Task) => {
      if (!task.customFields) {
        task.customFields = [];
      }
    });
    return loadedTasks;
  };

  const loadCustomFieldsFromLocalStorage = (): Record<string, CustomField> => {
    const customFieldsJSON = localStorage.getItem("customFields");
    const fields = customFieldsJSON ? JSON.parse(customFieldsJSON) : {};
    return fields;
  };

  const saveTasksToLocalStorage = (tasks: Task[]) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const saveCustomFieldsToLocalStorage = (customFields: Record<string, CustomField>) => {
    localStorage.setItem("customFields", JSON.stringify(customFields));
  };

  return {
    tasks: loadTasksFromLocalStorage(),
    customFields: loadCustomFieldsFromLocalStorage(),
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
          tasks: [{ id: state.tasks.length + 1, ...task }, ...state.tasks],
        };

        logChange("addTask", state, newState);
        saveTasksToLocalStorage(newState.tasks);
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
        saveTasksToLocalStorage(newState.tasks);
        return newState;
      }),
    deleteTask: (id) =>
      set((state) => {
        const newState = { ...state, tasks: state.tasks.filter((task) => task.id !== id) };
        logChange("deleteTask", state, newState);
        saveTasksToLocalStorage(newState.tasks);
        return newState;
      }),
    addCustomField: (field) =>
      set((state) => {
        const newState = {
          ...state,
          customFields: { ...state.customFields, [field.name]: field },
          tasks: state.tasks.map((task) => {
            return {
              ...task,
              customFields: [...task.customFields, field],
            };
          }),
        };
        logChange("addCustomField", state, newState);
        saveTasksToLocalStorage(newState.tasks);
        saveCustomFieldsToLocalStorage(newState.customFields);
        return newState;
      }),
    removeCustomField: (fieldName) =>
      set((state) => {
        const newState = {
          ...state,
          customFields: Object.fromEntries(
            Object.entries(state.customFields).filter(([key]) => key !== fieldName),
          ),
          tasks: state.tasks.map((task) => ({
            ...task,
            customFields: task.customFields.filter((field) => field.name !== fieldName),
          })),
        };
        logChange("removeCustomField", state, newState);
        saveTasksToLocalStorage(newState.tasks);
        return newState;
      }),
  };
});
