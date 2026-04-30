declare namespace React {
  type ReactNode = any;
  type FormEvent<T = any> = {
    currentTarget: T;
    preventDefault(): void;
  };
}

declare module "react" {
  export type ReactNode = any;
  export type FormEvent<T = any> = React.FormEvent<T>;
  export type HTMLAttributes<T = any> = any;
  export type ButtonHTMLAttributes<T = any> = any;
  export type InputHTMLAttributes<T = any> = any;
  export type SelectHTMLAttributes<T = any> = any;
  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useState<T>(initialValue: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
}

declare module "next/navigation" {
  export function useRouter(): {
    push(path: string): void;
    replace(path: string): void;
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}