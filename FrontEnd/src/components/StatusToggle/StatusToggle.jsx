import React from 'react';
import {motion} from 'framer-motion';

function StatusToggle({isActive, onToggle}) {
  return (
    <button
      style={{
        width: 60,
        height: 30,
        backgroundColor: '#eee',
        borderRadius: 30,
        cursor: 'pointer',
        display: 'flex',
        padding: 5,
        justifyContent: isActive ? 'flex-end' : 'flex-start',
      }}
      onClick={onToggle}
    >
      <motion.div
        layout
        transition={{
          type: 'spring',
          duration: 0.3,
          bounce: 0.2,
        }}
        style={{
          width: 20,
          height: 20,
          backgroundColor: isActive ? '#4CAF50' : '#ccc',
          borderRadius: '50%',
        }}
      />
    </button>
  );
}

export default StatusToggle;
