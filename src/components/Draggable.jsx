    import React from 'react';
    import { useDraggable } from '@dnd-kit/core';

    function Draggable({ id, children }) {
        const { attributes, listeners, setNodeRef } = useDraggable({ id });

        return (
            <div ref={setNodeRef} {...listeners} {...attributes} style={{ padding: '8px', border: '1px solid #ccc', marginBottom: '4px', backgroundColor: 'white' }}>
                {children}
            </div>
        );
    }

    export default Draggable;
