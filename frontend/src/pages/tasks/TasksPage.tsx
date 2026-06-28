import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, CheckSquare, Clock } from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { getTasks, deleteTask, updateTask } from "../../services/taskService";
import type { Task } from "../../services/taskService";
import TaskModal from "../../components/tasks/TaskModal";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getTasks();
      setTasks(data);
      setFilteredTasks(data);
    } catch {
      setError("Failed to fetch tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    let results = tasks;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.description && t.description.toLowerCase().includes(term))
      );
    }
    if (statusFilter !== "all") {
      results = results.filter((t) => t.status === statusFilter);
    }
    setFilteredTasks(results);
  }, [searchTerm, statusFilter, tasks]);

  const handleOpenAddModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        fetchTasks();
      } catch {
        alert("Failed to delete task.");
      }
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const newStatus = task.status === "completed" ? "todo" : "completed";
      await updateTask(task.id, { status: newStatus });
      fetchTasks();
    } catch {
      alert("Failed to update task status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Tasks</h1>
          <p className="text-sm text-zinc-400">Track and manage your sales tasks and follow-ups.</p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenAddModal}>
          Add Task
        </Button>
      </div>

      <Card className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex items-center w-full max-w-md bg-white/3 border border-white/8 rounded-xl px-3 py-2 focus-within:border-[#6366F1] transition-all">
          <Search className="h-4 w-4 text-zinc-500 mr-2.5" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 text-sm bg-white/3 border border-white/8 focus:border-[#6366F1] rounded-xl text-white outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all" className="bg-[#18181B]">All Statuses</option>
          <option value="todo" className="bg-[#18181B]">Todo</option>
          <option value="in_progress" className="bg-[#18181B]">In Progress</option>
          <option value="completed" className="bg-[#18181B]">Completed</option>
        </select>
      </Card>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#6366F1] border-t-transparent" />
        </div>
      ) : error ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center border-rose-500/20 bg-rose-500/3">
          <p className="text-sm text-rose-400 font-medium">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={fetchTasks}>Retry</Button>
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-zinc-400 mb-4">
            <CheckSquare className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No tasks found</h3>
          <p className="mt-1 text-sm text-zinc-400 max-w-xs">
            {searchTerm || statusFilter !== "all" ? "No results match filters." : "Create your first task to get started."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((t) => (
            <Card key={t.id} className="p-4 flex items-start gap-4 hoverable">
              <input
                type="checkbox"
                checked={t.status === "completed"}
                onChange={() => handleToggleComplete(t)}
                className="mt-1 h-5 w-5 rounded border-white/10 bg-white/3 text-[#6366F1] focus:ring-offset-0 focus:ring-[#6366F1] cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className={`text-base font-semibold ${t.status === "completed" ? "text-zinc-500 line-through" : "text-white"}`}>
                      {t.title}
                    </h3>
                    {t.description && <p className="text-sm text-zinc-400 mt-1">{t.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="p-1 text-zinc-400 hover:text-white" onClick={() => handleOpenEditModal(t)}>
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button type="button" className="p-1 text-zinc-400 hover:text-rose-400" onClick={() => handleDelete(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-zinc-500">
                  {t.dueDate && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Due: {new Date(t.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  <Badge variant={t.priority === "high" ? "lost" : t.priority === "medium" ? "proposal" : "new"}>
                    {t.priority}
                  </Badge>
                  <Badge variant={t.status === "completed" ? "won" : t.status === "in_progress" ? "proposal" : "new"}>
                    {t.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTasks}
        task={selectedTask}
      />
    </div>
  );
}
