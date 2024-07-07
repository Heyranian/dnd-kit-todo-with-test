import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Draggable from './Draggable';

describe('Draggable component', () => {

    it('renders children', () => {
        const { getByText } = render(<Draggable id="test-id">Hello, world!</Draggable>);
        const draggableElement = getByText('Hello, world!');
        expect(draggableElement).toBeInTheDocument();
    });


    it('handles custom props', () => {
        const { getByTestId } = render(<Draggable id="test-id" data-testid="custom-draggable">Custom Draggable</Draggable>);
        const customDraggable = getByTestId('custom-draggable');
        expect(customDraggable).toBeInTheDocument();
    });

    it('handles missing id prop gracefully', () => {

        const { container } = render(<Draggable>Missing ID</Draggable>);
        expect(container.firstChild).toBeInTheDocument();
    });

});