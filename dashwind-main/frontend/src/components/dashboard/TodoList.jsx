import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const initialTasks = [
  { id: 1, text: 'Review Q4 financial reports', completed: true },
  { id: 2, text: 'Schedule team standup meeting', completed: false },
  { id: 3, text: 'Update project documentation', completed: false },
  { id: 4, text: 'Prepare client presentation', completed: true },
  { id: 5, text: 'Code review for new features', completed: false },
];

export const TodoList = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
      setIsAdding(false);
    }
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <Card className="border-0 shadow-card h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">To-Do List</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {completedCount} of {tasks.length} completed
            </p>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {isAdding && (
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="flex-1"
              autoFocus
            />
            <Button size="sm" onClick={addTask}>Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="group flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-secondary"
          >
            <Checkbox 
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <span className={cn(
              "flex-1 text-sm transition-all",
              task.completed 
                ? "line-through text-muted-foreground" 
                : "text-foreground"
            )}>
              {task.text}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeTask(task.id)}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TodoList;
