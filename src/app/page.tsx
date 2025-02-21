import TaskModal from "@/app/components/TaskModal";
import Tasks from "@/app/components/Tasks";

export default function Home() {
  return (
    <div>
      <h1>Dashboard</h1>
      <TaskModal />

      <Tasks />
    </div>
  );
}
