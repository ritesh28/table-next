import React, { useCallback, useEffect, useState } from 'react';

const useSize = <T extends React.RefObject<HTMLDivElement | null>>(target: T) => {
  const [size, setSize] = useState<DOMRect>();

  const updateSize = useCallback(() => {
    if (target.current) {
      const size = target.current.getBoundingClientRect();

      setSize(size);
    }
  }, [target]);

  useEffect(() => {
    const { current } = target;

    updateSize();

    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        updateSize();
      }
    });

    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }

      observer.disconnect();
    };
  }, [target, updateSize]);

  return size;
};

export { useSize };
