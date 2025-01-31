import React from 'react';
import { Clock, Flag } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <div className={`px-2 py-1 rounded-full text-sm ${priorityColors[task.priority]}`}>
          <Flag className="w-4 h-4 inline-block mr-1" />
          {task.priority}
        </div>
      </div>
      
      <p className="text-gray-600 mb-4">{task.description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-4 h-4 mr-1" />
          {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
        </div>
        
        <div className="flex gap-2">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}