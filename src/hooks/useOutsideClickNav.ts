import { useEffect, MutableRefObject } from 'react';

export const useOutsideClickNav = (
  ref: MutableRefObject<any>,
  triggerRef: MutableRefObject<any>,
  callback: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current && 
        !ref.current.contains(event.target) && 
        triggerRef.current && 
        !triggerRef.current.contains(event.target)
      ) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, triggerRef, callback]);
};