import React, { useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';

import Droppable from './components/Droppable';
import Draggable from './components/Draggable';
import Form from './components/Form';

function App() {
  const [tasks, setTasks] = useState([
    { id: 'task-1', content: 'Task 1' },
    { id: 'task-2', content: 'Task 2' },
    { id: 'task-3', content: 'Task 3' },
  ]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
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



  const handleAddTask = (newTaskContent) => {
    if (newTaskContent.trim() === '') return;

    const newTask = {
      id: `task-${Date.now()}`,
      content: newTaskContent,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };



  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Form handleAddTask={handleAddTask} />
      <hr className='my-10' />
      <div style={{
        display: 'flex',
        // alignItems: "center",
        justifyContent: "center",
        gap: "24px"
      }}
      >
        <div className='border border-gray-400 p-2 shadow-lg' style={{ width: '20%' }}>
          <h2 className='my-4'>Todo</h2>
          <Droppable id="tasks">
            {tasks.map((task) => (
              <Draggable key={task.id} id={task.id}>
                {task.content}
              </Draggable>
            ))}
          </Droppable>
        </div>
        <div className='border border-gray-400 p-2 shadow-lg' style={{ width: '20%' }}>
          <h2 className='my-4'>In Progress</h2>
          <Droppable
            id="in-progress-tasks"
          >
            {inProgressTasks.map((task) => (
              <Draggable key={task.id} id={task.id}>
                {task.content}
              </Draggable>
            ))}
          </Droppable>
        </div>
        <div className='border border-gray-400 p-2 shadow-lg' style={{ width: '20%' }}>
          <h2 className='my-4'>Done</h2>
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
