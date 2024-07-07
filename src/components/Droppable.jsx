import React from 'react';
import { useDroppable } from '@dnd-kit/core';

function Droppable({ id, children }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} style={{ padding: '16px', border: '2px dashed #ccc', minHeight: '100px' }}>
            {children}
        </div>
    );
}

export default Droppable;
