// Draggable.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { DndContext } from '@dnd-kit/core';
import Draggable from './Draggable'; // Adjust the import path as per your project structure

test('renders Draggable component with children', () => {
    const { getByText } = render(
        <DndContext>
            <Draggable id="draggable-1">
                <div>Drag me</div>
            </Draggable>
        </DndContext>
    );

    expect(getByText('Drag me')).toBeInTheDocument();
});


