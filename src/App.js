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
  const [inProgressTasks, setInProgressTasks] = useState([]);
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
        moveTask(active.id, setInProgressTasks, setCompletedTasks);
      } else if (over.id === 'in-progress-tasks') {
        moveTask(active.id, setTasks, setInProgressTasks);
        moveTask(active.id, setCompletedTasks, setInProgressTasks);
      } else if (over.id === 'tasks') {
        moveTask(active.id, setInProgressTasks, setTasks);
        moveTask(active.id, setCompletedTasks, setTasks);
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
      <form className='m-10' onSubmit={handleAddTask} style={{ marginBottom: '16px' }}>
        <input
          type="text"
          className='border-2 border-gray-700'
          value={newTaskContent}
          onChange={(e) => setNewTaskContent(e.target.value)}
          placeholder="Add a new task"
          style={{ padding: '8px', width: '180px', marginRight: '8px' }}
        />
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type="submit" style={{ padding: '8px' }}>Add</button>
      </form>
      <hr className='my-10' />
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ width: '30%' }}>
          <h2>Todo</h2>
          <Droppable id="tasks">
            {tasks.map((task) => (
              <Draggable key={task.id} id={task.id}>
                {task.content}
              </Draggable>
            ))}
          </Droppable>
        </div>
        <div style={{ width: '30%' }}>
          <h2>In Progress</h2>
          <Droppable id="in-progress-tasks">
            {inProgressTasks.map((task) => (
              <Draggable key={task.id} id={task.id}>
                {task.content}
              </Draggable>
            ))}
          </Droppable>
        </div>
        <div style={{ width: '30%' }}>
          <h2>Done</h2>
          <Droppable id="completed-tasks">
            {completedTasks.map((task) => (
              <Draggable className="border border-gray-700" key={task.id} id={task.id}>
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
              inProgressTasks.find((task) => task.id === activeId)?.content ||
              completedTasks.find((task) => task.id === activeId)?.content}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
