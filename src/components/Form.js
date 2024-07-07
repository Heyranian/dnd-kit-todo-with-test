import React, { useState } from 'react';

const Form = ({ handleAddTask }) => {
    const [newTaskContent, setNewTaskContent] = useState('');

    const onSubmit = (e) => {
        e.preventDefault();
        if (newTaskContent.trim() === '') return; // Prevent submission if input is empty or whitespace
        handleAddTask(newTaskContent);
        setNewTaskContent('');
    };

    return (
        <form className='m-10' onSubmit={onSubmit} style={{ marginBottom: '16px' }}>
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
    );
};

export default Form;
