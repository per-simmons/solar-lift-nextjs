declare module '@splidejs/react-splide' {
  import { ComponentType, ReactNode, RefObject } from 'react';

  export interface SplideProps {
    options?: any;
    hasTrack?: boolean;
    children?: ReactNode;
    className?: string;
    ref?: RefObject<any>;
    [key: string]: any;
  }

  export interface SplideSlideProps {
    children?: ReactNode;
    className?: string;
    [key: string]: any;
  }

  export const Splide: ComponentType<SplideProps>;
  export const SplideSlide: ComponentType<SplideSlideProps>;
  export const SplideTrack: ComponentType<any>;
}

declare module '@splidejs/react-splide/css';
