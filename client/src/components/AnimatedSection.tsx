import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale-in' | 'bounce-in';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

export default function AnimatedSection({
  children,
  animation = 'fade-in',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className = '',
}: AnimatedSectionProps) {
  const { elementRef, isVisible } = useScrollAnimation({ threshold, triggerOnce: true });

  const animationClasses = {
    'fade-in': 'opacity-0 translate-y-8',
    'slide-up': 'opacity-0 translate-y-16',
    'slide-left': 'opacity-0 -translate-x-16',
    'slide-right': 'opacity-0 translate-x-16',
    'scale-in': 'opacity-0 scale-95',
    'bounce-in': 'opacity-0 scale-90',
  };

  const activeClasses = {
    'fade-in': 'opacity-100 translate-y-0',
    'slide-up': 'opacity-100 translate-y-0',
    'slide-left': 'opacity-100 translate-x-0',
    'slide-right': 'opacity-100 translate-x-0',
    'scale-in': 'opacity-100 scale-100',
    'bounce-in': 'opacity-100 scale-100',
  };

  const transitionClasses =
    animation === 'bounce-in'
      ? 'transition-all ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]'
      : 'transition-all ease-out';

  return (
    <div
      ref={elementRef}
      className={`${transitionClasses} ${
        isVisible ? activeClasses[animation] : animationClasses[animation]
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface StaggeredChildrenProps {
  children: ReactNode[];
  staggerDelay?: number;
  animation?: AnimatedSectionProps['animation'];
  className?: string;
}

export function StaggeredChildren({
  children,
  staggerDelay = 100,
  animation = 'fade-in',
  className = '',
}: StaggeredChildrenProps) {
  return (
    <>
      {children.map((child, index) => (
        <AnimatedSection
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          className={className}
        >
          {child}
        </AnimatedSection>
      ))}
    </>
  );
}
