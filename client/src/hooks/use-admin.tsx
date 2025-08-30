import { useState, useEffect } from "react";

export function useAdmin() {
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [pageUpCount, setPageUpCount] = useState(0);
  const [lastKeyTime, setLastKeyTime] = useState(0);

  useEffect(() => {
    // Check for public mode in localStorage
    if (localStorage.getItem('publicMode') === 'true') {
      setIsPublicMode(true);
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
          if (!isPublicMode) {
            // Show public mode confirmation
            if (confirm('Switch to Public Form? This allows anyone to submit tickets.')) {
              localStorage.setItem('publicMode', 'true');
              setIsPublicMode(true);
            }
          }
          setPageUpCount(0);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPublicMode, pageUpCount, lastKeyTime]);

  const enablePublicMode = () => {
    localStorage.setItem('publicMode', 'true');
    setIsPublicMode(true);
  };

  const disablePublicMode = () => {
    localStorage.removeItem('publicMode');
    setIsPublicMode(false);
  };

  return { isPublicMode, enablePublicMode, disablePublicMode };
}
