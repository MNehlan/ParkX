import React from 'react';
import '../styles/slot-grid.css';

const SlotGrid = ({ totalSlots, bookedSlots = [], onSlotSelect, selectedSlot }) => {
    // bookedSlots should be an array of slot numbers (e.g., [1, 5, 10])

    const slots = Array.from({ length: totalSlots }, (_, i) => i + 1);

    return (
        <div className="slot-grid-container">
            {slots.map(slotNum => {
                const isBooked = bookedSlots.includes(slotNum);
                const isSelected = selectedSlot === slotNum;

                let className = "slot-btn";
                if (isBooked) className += " booked";
                if (isSelected) className += " selected";
                if (!onSlotSelect && !isBooked) className += " read-only";

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
                        className={className}
                        style={{
                            // Keeping opacity override for complex logic if needed, but css handles most
                            opacity: isBooked && onSlotSelect ? 0.7 : 1
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
