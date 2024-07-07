import React, { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

import Droppable from './components/Droppable';
import Draggable from './components/Draggable';

function App() {
  const [tasks, setTasks] = useState([
    { id: 'task-1', content: 'Task 1' },
    { id: 'task-2', content: 'Task 2' },
    { id: 'task-3', content: 'Task 3' },
  ]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over) {
      if (over.id === 'completed-tasks') {
        moveTask(active.id, setTasks, setCompletedTasks);
      } else if (over.id === 'tasks') {
        moveTask(active.id, setCompletedTasks, setTasks);
      } else {
        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        const overIndex = tasks.findIndex((task) => task.id === over.id);

        if (activeIndex !== overIndex) {
          const updatedTasks = [...tasks];
          updatedTasks.splice(activeIndex, 1);
          updatedTasks.splice(overIndex, 0, tasks[activeIndex]);

          setTasks(updatedTasks);
        }
      }
    }

    setActiveId(null);
  };

  const moveTask = (taskId, fromSetter, toSetter) => {
    fromSetter((prev) => {
      const taskIndex = prev.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) return prev;
      const task = prev[taskIndex];
      const updatedFrom = [...prev];
      updatedFrom.splice(taskIndex, 1);
      toSetter((prevTo) => [...prevTo, task]);
      return updatedFrom;
    });
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskContent.trim() === '') return;

    const newTask = {
      id: `task-${Date.now()}`,
      content: newTaskContent,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setNewTaskContent('');
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <h2>Tasks</h2>
      <form onSubmit={handleAddTask} style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          placeholder="Add a new task"
          style={{ padding: '8px', width: 'calc(100% - 18px)', marginRight: '8px' }}
        />
        <button type="submit" style={{ padding: '8px' }}>Add</button>
      </form>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '45%' }}>
          <Droppable id="tasks">
            {tasks.map((task) => (
              <Draggable key={task.id} id={task.id}>
                {task.content}
              </Draggable>
            ))}
          </Droppable>
        </div>
        <div style={{ width: '45%' }}>
          <h2>Completed Tasks</h2>
          <Droppable id="completed-tasks">
            {completedTasks.map((task) => (
              <Draggable key={task.id} id={task.id}>
                {task.content}
              </Draggable>
            ))}
          </Droppable>
        </div>
      </div>
      <DragOverlay>
        {activeId ? (
          <div className="dragging-item">
            {tasks.find((task) => task.id === activeId)?.content ||
              completedTasks.find((task) => task.id === activeId)?.content}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
