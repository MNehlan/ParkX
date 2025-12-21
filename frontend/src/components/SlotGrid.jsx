import React from 'react';

const SlotGrid = ({ totalSlots, bookedSlots = [], onSlotSelect, selectedSlot }) => {
    // bookedSlots should be an array of slot numbers (e.g., [1, 5, 10])

    const slots = Array.from({ length: totalSlots }, (_, i) => i + 1);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)'
        }}>
            {slots.map(slotNum => {
                const isBooked = bookedSlots.includes(slotNum);
                const isSelected = selectedSlot === slotNum;

                let bgColor = '#10B981'; // Green (Available)
                if (isBooked) bgColor = '#EF4444'; // Red (Booked)
                if (isSelected) bgColor = '#3B82F6'; // Blue (Selected)

                return (
                    <button
                        key={slotNum}
                        type="button"
                        onClick={() => {
                            if (!isBooked && onSlotSelect) {
                                onSlotSelect(slotNum);
                            }
                        }}
                        disabled={isBooked && !onSlotSelect} // Disable if booked (unless we want to view detail later)
                        style={{
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            border: 'none',
                            background: bgColor,
                            color: 'white',
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            cursor: isBooked ? 'not-allowed' : (onSlotSelect ? 'pointer' : 'default'),
                            opacity: isBooked && onSlotSelect ? 0.7 : 1, // Dim booked slots in selection mode
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            transition: 'all 0.2s ease',
                            boxShadow: isSelected ? '0 0 0 4px rgba(59, 130, 246, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        {slotNum}
                    </button>
                );
            })}
        </div>
    );
};

export default SlotGrid;
