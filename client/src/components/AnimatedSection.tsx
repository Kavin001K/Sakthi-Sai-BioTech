import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ReactNode, memo } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fade-in' | 'fade-in-up' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale-in' | 'scale-fade' | 'zoom-in';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

const AnimatedSection = memo(function AnimatedSection({
  children,
  animation = 'fade-in',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className = '',
}: AnimatedSectionProps) {
  const { elementRef, isVisible } = useScrollAnimation({ threshold, triggerOnce: true });

  const animationClasses = {
    'fade-in': 'opacity-0',
    'fade-in-up': 'opacity-0 translate-y-8',
    'slide-up': 'opacity-0 translate-y-12',
    'slide-left': 'opacity-0 -translate-x-12',
    'slide-right': 'opacity-0 translate-x-12',
    'scale-in': 'opacity-0 scale-95',
    'scale-fade': 'opacity-0 scale-90',
    'zoom-in': 'opacity-0 scale-75',
  };

  const activeClasses = {
    'fade-in': 'opacity-100',
    'fade-in-up': 'opacity-100 translate-y-0',
    'slide-up': 'opacity-100 translate-y-0',
    'slide-left': 'opacity-100 translate-x-0',
    'slide-right': 'opacity-100 translate-x-0',
    'scale-in': 'opacity-100 scale-100',
    'scale-fade': 'opacity-100 scale-100',
    'zoom-in': 'opacity-100 scale-100',
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all ease-out ${
        isVisible ? activeClasses[animation] : animationClasses[animation]
      } ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: isVisible ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
});

export default AnimatedSection;

// Optimized staggered children without creating multiple AnimatedSections
interface StaggeredChildrenProps {
  children: ReactNode[];
  staggerDelay?: number;
  animation?: AnimatedSectionProps['animation'];
  className?: string;
}

export const StaggeredChildren = memo(function StaggeredChildren({
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
});
