import React, { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { CheckCircle2, ListTodo, Loader2 } from 'lucide-react';
import { supabase } from './lib/supabase';
import { Task } from './types';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        fetchTasks();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'user_id' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, status: 'todo' }])
        .select()
        .single();

      if (error) throw error;
      setTasks([data, ...tasks]);
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleStatusChange = async (id: string, status: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, status } : task
      ));
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <ListTodo className="w-16 h-16 mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl font-bold mb-4">Task Management App</h1>
          <p className="text-gray-600 mb-6">Please connect to Supabase to continue</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Task Management</h1>
          </div>
        </header>

        <TaskForm onSubmit={handleCreateTask} />

        <div className="grid gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
            />
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <ListTodo className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No tasks yet. Create your first task above!</p>
            </div>
          )}
        </div>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;