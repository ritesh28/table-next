'use client';

import useResizeObserver from '@react-hook/resize-observer';
import { RefObject, useLayoutEffect, useState } from 'react';

export const useSize = (target: RefObject<HTMLElement>) => {
  const [size, setSize] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    if (target.current) {
      setSize(target.current.getBoundingClientRect());
    }
  }, [target]);

  if (typeof window !== 'undefined') {
    // Where the magic happens
    useResizeObserver(target, (entry) => setSize(entry.contentRect));
  }
  return size;
};
