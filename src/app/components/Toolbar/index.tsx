"use client";
import { Button } from "@/app/components/ui/button";
import { useTaskStore } from "@/app/store/useTaskStore";
import { Redo, Undo } from "lucide-react";
import { useEffect } from "react";
function UndoRedoToolbar() {
  const { undo, redo, undoStack, redoStack } = useTaskStore();
  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey) {
        undo();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === "z" && event.shiftKey) {
        redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="flex gap-4 p-4">
      <Button disabled={!canUndo} onClick={undo} className="px-4 py-2  rounded">
        <Undo aria-label="Undo" className="w-4 h-4 mr-2" />
      </Button>
      <Button disabled={!canRedo} onClick={redo} className="px-4 py-2  rounded">
        <Redo aria-label="Redo" className="w-4 h-4 mr-2" />
      </Button>
    </div>
  );
}

export default UndoRedoToolbar;
