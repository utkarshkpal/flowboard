import TaskModal from "@/app/components/TaskModal";
import Tasks from "@/app/components/Tasks";

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <TaskModal />

      <Tasks />
    </div>
  );
}
