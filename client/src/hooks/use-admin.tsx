import { useState, useEffect } from "react";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [pageUpCount, setPageUpCount] = useState(0);
  const [lastKeyTime, setLastKeyTime] = useState(0);

  useEffect(() => {
    // Check for admin mode in localStorage
    if (localStorage.getItem('adminMode') === 'true') {
      setIsAdmin(true);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PageUp') {
        const currentTime = Date.now();
        
        // Reset count if too much time has passed
        if (currentTime - lastKeyTime > 2000) {
          setPageUpCount(0);
        }
        
        const newCount = pageUpCount + 1;
        setPageUpCount(newCount);
        setLastKeyTime(currentTime);
        
        if (newCount >= 3) {
          if (!isAdmin) {
            // Show admin confirmation
            if (confirm('Enable Admin Mode? This will save your admin status locally.')) {
              localStorage.setItem('adminMode', 'true');
              setIsAdmin(true);
            }
          }
          setPageUpCount(0);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin, pageUpCount, lastKeyTime]);

  const disableAdminMode = () => {
    localStorage.removeItem('adminMode');
    setIsAdmin(false);
  };

  return { isAdmin, disableAdminMode };
}
