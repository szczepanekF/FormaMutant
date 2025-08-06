import React, { useState } from 'react';
import ToastNotification from './toast';

function TEST() {
  // State for controlling the visibility of the toast
  const [toastOpen, setToastOpen] = useState(false);

  // Function to open the toast
  const showToast = () => {
    setToastOpen(true);

    // Close the toast after 3 seconds (3000 milliseconds)
    setTimeout(() => {
      setToastOpen(false);
    }, 3000);
  };

  return (
    <div>
      {/* Button to trigger the toast */}
      <button className="showToast" onClick={showToast}>
        Show Toast
      </button>

      {/* ToastNotification component */}
      <ToastNotification
        variant="information"
        message="Your custom message here" 
        duration={10000}
        open={toastOpen}
        onClose={(isOpen) => setToastOpen(isOpen)}
      />
    </div>
  );
}

export default TEST;