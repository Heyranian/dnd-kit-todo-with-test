import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Form from './Form';

test('does not call handleAddTask if input is empty', () => {
    const handleAddTask = jest.fn();
    render(<Form handleAddTask={handleAddTask} />);

    const input = screen.getByPlaceholderText('Add a new task');
    const button = screen.getByRole('button', { name: /add/i });

    // Simulate form submission with empty input
    fireEvent.change(input, { target: { value: '' } });
    console.log('Input value before clicking:', input.value); // Debugging line
    fireEvent.click(button);
    console.log('handleAddTask calls:', handleAddTask.mock.calls); // Debugging line

    // Check that handleAddTask was not called
    expect(handleAddTask).not.toHaveBeenCalled();
});

test('calls handleAddTask on form submission and clears the input field', () => {
    const handleAddTask = jest.fn();
    render(<Form handleAddTask={handleAddTask} />);

    const input = screen.getByPlaceholderText('Add a new task');
    const button = screen.getByRole('button', { name: /add/i });

    // Simulate user typing in the input field
    fireEvent.change(input, { target: { value: 'New Task' } });
    expect(input.value).toBe('New Task');

    // Simulate form submission
    fireEvent.click(button);

    // Check that handleAddTask was called with the correct value
    expect(handleAddTask).toHaveBeenCalledWith('New Task');

    // Check that the input field is cleared
    expect(input.value).toBe('');
});

test('does not call handleAddTask if input is only whitespace', () => {
    const handleAddTask = jest.fn();
    render(<Form handleAddTask={handleAddTask} />);

    const input = screen.getByPlaceholderText('Add a new task');
    const button = screen.getByRole('button', { name: /add/i });

    // Simulate form submission with whitespace input
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);

    // Check that handleAddTask was not called
    expect(handleAddTask).not.toHaveBeenCalled();
});

test('input field can be typed into', () => {
    const handleAddTask = jest.fn();
    render(<Form handleAddTask={handleAddTask} />);

    const input = screen.getByPlaceholderText('Add a new task');

    // Simulate user typing in the input field
    console.log('Input value before typing:', input.value); // Debugging line
    fireEvent.change(input, { target: { value: 'Another Task' } });
    console.log('Input value after typing:', input.value); // Debugging line

    expect(input.value).toBe('Another Task');
});
