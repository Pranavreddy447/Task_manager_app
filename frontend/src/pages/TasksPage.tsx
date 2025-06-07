// src/pages/TasksPage.tsx
import { useEffect, useState } from "react";
import axios from "../api/axios"; // our configured axios instance

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/tasks/");
        setTasks(res.data);
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li
              key={task.id}
              className="border p-3 rounded shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{task.title}</h2>
                <p className="text-sm text-gray-500">{task.description}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-white text-sm ${
                  task.completed ? "bg-green-600" : "bg-red-500"
                }`}
              >
                {task.completed ? "Done" : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
