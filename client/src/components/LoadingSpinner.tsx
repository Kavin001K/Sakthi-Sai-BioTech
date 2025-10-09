import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({
  fullScreen = true,
  message = 'Loading...',
  size = 'md'
}: LoadingSpinnerProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const dotSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-8">
          {/* Animated Logo/Spinner */}
          <div className="relative">
            {/* Outer rotating circle */}
            <div className={`${sizeClasses[size]} relative animate-spin`}>
              <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary"></div>
            </div>

            {/* Inner pulsing circle */}
            <div className={`absolute inset-0 flex items-center justify-center ${sizeClasses[size]}`}>
              <div className="w-8 h-8 bg-primary rounded-full animate-pulse-slow"></div>
            </div>

            {/* Orbiting dots */}
            <div className={`absolute inset-0 flex items-center justify-center ${sizeClasses[size]}`}>
              <div className="relative w-full h-full animate-spin" style={{ animationDuration: '2s' }}>
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${dotSizeClasses[size]} bg-accent rounded-full`}></div>
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${dotSizeClasses[size]} bg-secondary rounded-full`}></div>
              </div>
            </div>
          </div>

          {/* Loading text with shimmer effect */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-center bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              {message}
            </h3>

            {/* Progress bar */}
            <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Loading dots animation */}
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Inline spinner (non-fullscreen)
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
      </div>
    </div>
  );
}
