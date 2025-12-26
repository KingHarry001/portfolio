import { useState, useCallback } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  return { notification, showNotification };
};

export default useNotification;