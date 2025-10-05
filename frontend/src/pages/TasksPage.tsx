// src/pages/TasksPage.tsx
import { useEffect, useState } from "react";
import axios from "../api/axios"; // our configured axios instance
import { Plus, Trash } from "lucide-react";
import { TASK_LABELS } from "../components/Tasks/Constants";

type Task = {
  id: number,
  uuid: string;
  title: string;
  description: string;
  status: number | string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskInput, setTaskInput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openMiniForm, setOpenMiniForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/tasks/");
      console.log(res.data);
      
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks...", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskTitle: string) => {
    try {
      const body = {
        title: taskTitle
      }
      const res = await axios.post("/tasks/", body);
      setOpenMiniForm(false)
      setTaskInput(null);
      fetchTasks();
    } catch (error) {
      console.error("Failed to add task", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteTask = async (id: number | string) => {
    try {
      const res = await axios.delete(`/tasks/${id}/`);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task", error);
    } finally {
      setLoading(false);
    }
  }


  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTask(taskInput);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskInput(e.target.value);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul className="space-y-2">
            {tasks.map((task, index) => (
              <li
                key={index}
                className="border p-3 rounded shadow flex justify-between items-center"
              >
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-semibold">{task.title}</h2>
                  <p className="text-sm text-gray-500">{task?.description}</p>
                </div>
                <div className="flex gap-2">
                  <span
                      className={`px-2 py-1 rounded text-white text-sm ${TASK_LABELS[task.status].color}`}
                  >
                    {TASK_LABELS[task.status].label}
                  </span>
                  <Trash className="cursor-pointer" height={20} width={20} onClick={()=>handleDeleteTask(task.uuid)}/>
                </div>
                
              </li>
            ))}
            {openMiniForm && (
              <input
                className="w-full border p-3 rounded shadow flex justify-between items-center"
                onChange={handleChange}
                onKeyDown={handleKeyPress}
                onBlur={()=>setOpenMiniForm(false)}
                value={taskInput}
              />
            )}
          </ul>
          <div 
            onClick={()=>setOpenMiniForm(true)} 
            className="border p-3 rounded shadow flex gap-2 items-center mt-2 bg-gray-400 cursor-pointer hover:opacity-[0.9]">
              <Plus height={20} width={20}/>Add Task
          </div>
        </>
        
      )}
    </div>
  );
}
