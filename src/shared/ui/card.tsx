import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement>;

export function Card({ children, className, ...props }: Readonly<CardProps>) {
  return (
    <section className={`card${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </section>
  );
}
