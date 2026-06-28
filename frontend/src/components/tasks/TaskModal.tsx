import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { createTask, updateTask } from "../../services/taskService";
import type { Task, TaskInput } from "../../services/taskService";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSuccess, task }: TaskModalProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskInput>({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      status: "todo",
      priority: "medium",
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
        status: task.status,
        priority: task.priority,
      });
    } else {
      reset({
        title: "",
        description: "",
        dueDate: "",
        status: "todo",
        priority: "medium",
      });
    }
  }, [task, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: TaskInput) => {
    setError("");
    setIsLoading(true);

    try {
      const payload = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      };

      if (task) {
        await updateTask(task.id, payload);
      } else {
        await createTask(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-md transform rounded-2xl border border-white/8 bg-[#18181B] p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h3 className="text-lg font-semibold text-white">
            {task ? "Edit Task" : "Add New Task"}
          </h3>
          <button type="button" className="rounded-lg p-1 text-zinc-400 hover:text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && <div className="mt-4 rounded-xl bg-rose-500/10 border border-rose-500/15 p-3 text-xs text-rose-400">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <Input
            label="Title *"
            placeholder="Follow up with client"
            error={errors.title?.message}
            {...register("title", { required: "Title is required" })}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-description" className="text-xs font-medium text-zinc-400">Description</label>
            <textarea
              id="task-description"
              placeholder="Provide details about the task..."
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none placeholder-zinc-500"
              {...register("description")}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-duedate" className="text-xs font-medium text-zinc-400">Due Date</label>
            <input
              id="task-duedate"
              type="datetime-local"
              className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
              {...register("dueDate")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-status" className="text-xs font-medium text-zinc-400">Status</label>
              <select
                id="task-status"
                className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
                {...register("status")}
              >
                <option value="todo" className="bg-[#18181B]">Todo</option>
                <option value="in_progress" className="bg-[#18181B]">In Progress</option>
                <option value="completed" className="bg-[#18181B]">Completed</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-priority" className="text-xs font-medium text-zinc-400">Priority</label>
              <select
                id="task-priority"
                className="w-full px-4 py-2.5 text-sm bg-white/3 border border-white/10 focus:border-[#6366F1] rounded-xl text-white outline-none"
                {...register("priority")}
              >
                <option value="low" className="bg-[#18181B]">Low</option>
                <option value="medium" className="bg-[#18181B]">Medium</option>
                <option value="high" className="bg-[#18181B]">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 pt-4 mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              {task ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
