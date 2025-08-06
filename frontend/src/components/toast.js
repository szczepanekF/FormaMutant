import React, { useState, useEffect } from 'react';
import './toastnotification.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faX,
  faInfoCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

function ToastNotification({
  variant = 'success',
  message = '',
  open,
  onClose,
}) {
  const [isActive, setIsActive] = useState(false);
  const [icon, setIcon] = useState(faCheck);

  const defaultMessages = {
    success: 'Operation completed successfully',
    information: 'This is an informational message',
    error: 'An error occurred. Please try again',
  };

  const displayMessage = message || defaultMessages[variant];

  function handleClick() {
    setIsActive(false);
    onClose(false);
  }

  useEffect(() => {
    switch (variant) {
      case 'information':
        setIcon(faInfoCircle);
        break;
      case 'error':
        setIcon(faExclamationCircle);
        break;
      default:
        setIcon(faCheck);
    }
  }, [variant]);

  useEffect(() => {
    setIsActive(open);
  }, [open]);

  return (
    <div
      className={`toastContainer ${isActive ? 'active' : ''}`}
    >
      <div className="icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="message">
        <span className="head">
          {variant?.charAt(0).toUpperCase() + variant?.slice(1)}
        </span>
        <span className="saved">{displayMessage}</span>
      </div>
      <FontAwesomeIcon onClick={handleClick} className="closeBtn" icon={faX} />
    </div>
  );
}

export default ToastNotification;