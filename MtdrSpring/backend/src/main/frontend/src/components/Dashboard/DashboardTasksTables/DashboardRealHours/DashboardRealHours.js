import './DashboardRealHours.css';
import { useState } from 'react';

export default function DashboardRealHours({ isHidden, confirm_Real_Hours }) {
    const [realHours, setRealHours] = useState(0);

    const handleConfirm = () => {
        const hours = parseFloat(realHours);
        if (isNaN(hours) || hours <= 0) {
            // Optionally display an error message to the user
            console.error("Please enter a positive number for real hours.");
            return; // Prevent confirm_Real_Hours from being called
        }
        confirm_Real_Hours(realHours);
        isHidden(true);
    };

    return (
        <div className='dashboard-real-hours-main-container'>
            <div className='dashboard-real-hours-center-container'>
                <div className='dashboard-real-hours-container'>
                    {/* Title */}
                    <p className='dashboard-real-hours-title-text'>Task Completion Time</p>

                    {/* Description */}
                    <p className='dashboard-real-hours-description-text'>How many hours did it takes to complete this task?</p>

                    {/* Label */}
                    <p className='dashboard-real-hours-label-text'>{"Actual Time (hours)"}</p>

                    {/* Input */}
                    <input
                        type="number"
                        placeholder='Real Hours'
                        className='dashboard-real-hours-input'
                        value={realHours}
                        onChange={(e) => setRealHours(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                confirm_Real_Hours(realHours);
                            }
                        }}
                    />

                    {/* Bottom Hours Reflect */}
                    <p className='dashboard-real-hours-reflect-text'>Estimated time was: {} hours</p>

                    {/* Buttons Cancel and Save */}
                    <div className='dashboard-real-hours-buttons-container'>
                        {/* Cancel Button */}
                        <button 
                            className='dashboard-real-hours-button-cancel'
                            onClick={() => isHidden(true)}
                        >
                            Cancel
                        </button>

                        {/* Save Button */}
                        <button
                            className='dashboard-real-hours-button-save'
                            onClick={() => {
                                isHidden(false);
                                handleConfirm();
                            }}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}