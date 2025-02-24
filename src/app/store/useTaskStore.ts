import { DefaultTask, tasks } from "@/app/data/task";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  undoStack: Task[][];
  redoStack: Task[][];
  isHydrated: boolean;
  setEditingTaskId: (id: string | null) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: number, updatedTask: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  addCustomField: (field: CustomField) => void;
  removeCustomField: (fieldName: string) => void;
  undo: () => void;
  redo: () => void;
};

const getDefaultTasks = (): Task[] => {
  return tasks.map((task: DefaultTask) => {
    return {
      ...task,
      customFields: [] as CustomField[],
    };
  });
};
export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: getDefaultTasks(),
      customFields: {},
      editingTaskId: null,
      undoStack: [],
      redoStack: [],
      isHydrated: false,

      setEditingTaskId: (id) => set({ editingTaskId: id }),

      addTask: (task) => {
        set((state) => {
          const newTask = {
            id: state.tasks.length + 1,
            ...task,
            customFields: Object.values(state.customFields),
          };
          return {
            undoStack: [...state.undoStack, state.tasks],
            redoStack: [],
            tasks: [newTask, ...state.tasks],
          };
        });
      },

      updateTask: (id, updatedTask) => {
        set((state) => ({
          undoStack: [...state.undoStack, state.tasks],
          redoStack: [],
          tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)),
          editingTaskId: null,
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          undoStack: [...state.undoStack, state.tasks],
          redoStack: [],
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      addCustomField: (field) => {
        set((state) => ({
          undoStack: [...state.undoStack, state.tasks],
          redoStack: [],
          customFields: { ...state.customFields, [field.name]: field },
          tasks: state.tasks.map((task) => ({
            ...task,
            customFields: [...task.customFields, field],
          })),
        }));
      },

      removeCustomField: (fieldName) => {
        set((state) => ({
          undoStack: [...state.undoStack, state.tasks],
          redoStack: [],
          customFields: Object.fromEntries(
            Object.entries(state.customFields).filter(([key]) => key !== fieldName),
          ),
          tasks: state.tasks.map((task) => ({
            ...task,
            customFields: task.customFields.filter((field) => field.name !== fieldName),
          })),
        }));
      },

      undo: () => {
        set((state) => {
          if (state.undoStack.length === 0) return state;
          const previousState = state.undoStack[state.undoStack.length - 1];
          return {
            tasks: previousState,
            undoStack: state.undoStack.slice(0, -1),
            redoStack: [...state.redoStack, state.tasks],
          };
        });
      },

      redo: () => {
        set((state) => {
          if (state.redoStack.length === 0) return state;
          const nextState = state.redoStack[state.redoStack.length - 1];
          return {
            tasks: nextState,
            redoStack: state.redoStack.slice(0, -1),
            undoStack: [...state.undoStack, state.tasks],
          };
        });
      },
    }),

    {
      name: "task-store",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true; // Set hydration flag when store is restored
        }
      },
    },
  ),
);
