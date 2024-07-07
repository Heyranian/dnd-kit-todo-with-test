import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

test('does not call handleAddTask if input is empty', () => {
    const handleAddTask = jest.fn();
    render(<Form handleAddTask={handleAddTask} />);

    const input = screen.getByPlaceholderText('Add a new task');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: '' } });
    console.log('Input value before clicking:', input.value); 
    fireEvent.click(button);
    console.log('handleAddTask calls:', handleAddTask.mock.calls);

    expect(handleAddTask).not.toHaveBeenCalled();
});

test('calls handleAddTask on form submission and clears the input field', () => {
    const handleAddTask = jest.fn();
    render(<Form handleAddTask={handleAddTask} />);

    const input = screen.getByPlaceholderText('Add a new task');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'New Task' } });
    expect(input.value).toBe('New Task');

    fireEvent.click(button);

    expect(handleAddTask).toHaveBeenCalledWith('New Task');

    expect(input.value).toBe('');
});

test('does not call handleAddTask if input is only whitespace', () => {
    const handleAddTask = jest.fn();
    render(<Form handleAddTask={handleAddTask} />);

    const input = screen.getByPlaceholderText('Add a new task');
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    expect(handleAddTask).not.toHaveBeenCalled();
});

test('input field can be typed into', () => {
    const handleAddTask = jest.fn();
    render(<Form handleAddTask={handleAddTask} />);

    const input = screen.getByPlaceholderText('Add a new task');

    console.log('Input value before typing:', input.value); 
    fireEvent.change(input, { target: { value: 'Another Task' } });
    console.log('Input value after typing:', input.value); 

    expect(input.value).toBe('Another Task');
});
