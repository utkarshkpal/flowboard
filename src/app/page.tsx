import Tasks from "@/app/components/Tasks";
import UndoRedoToolbar from "@/app/components/Toolbar";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-primary text-center mb-8">FlowBoard</h1>
      <UndoRedoToolbar />
      <Tasks />
    </div>
  );
}
