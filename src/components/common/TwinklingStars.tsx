import React, { useMemo } from 'react';

interface Star {
  id: number;
  top: number; // percentage
  left: number; // percentage
  size: number; // px
  opacity: number;
  animationClass: string;
  delay: string;
  duration: string;
  color: string;
  isCross?: boolean;
}

export const TwinklingStars: React.FC<{ count?: number; showShootingStars?: boolean }> = ({
  count = 95,
  showShootingStars = true
}) => {
  const stars = useMemo(() => {
    const starColors = [
      'bg-white',
      'bg-amber-300',
      'bg-amber-100',
      'bg-sky-200',
      'bg-amber-400',
      'bg-blue-100'
    ];

    const animationClasses = [
      'animate-twinkle',
      'animate-twinkle-fast',
      'animate-twinkle-slow'
    ];

    const generated: Star[] = [];
    for (let i = 0; i < count; i++) {
      const isCross = i % 14 === 0;
      const size = isCross ? (Math.random() * 4 + 4) : (Math.random() * 2.5 + 1);
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      const animationClass = animationClasses[Math.floor(Math.random() * animationClasses.length)];
      const delay = `${(Math.random() * 5).toFixed(2)}s`;
      const duration = `${(Math.random() * 3 + 1.5).toFixed(2)}s`;

      generated.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size,
        opacity: Math.random() * 0.7 + 0.3,
        animationClass,
        delay,
        duration,
        color,
        isCross
      });
    }
    return generated;
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background Starfield */}
      {stars.map((star) => {
        if (star.isCross) {
          return (
            <div
              key={star.id}
              className={`absolute flex items-center justify-center ${star.animationClass}`}
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                animationDelay: star.delay,
                animationDuration: star.duration
              }}
            >
              {/* 4-point Diamond Star */}
              <div 
                className="relative flex items-center justify-center"
                style={{ width: `${star.size}px`, height: `${star.size}px` }}
              >
                <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-amber-200 to-transparent" />
                <div className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fde68a]" />
              </div>
            </div>
          );
        }

        return (
          <div
            key={star.id}
            className={`absolute rounded-full ${star.color} ${star.animationClass}`}
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
              animationDuration: star.duration,
              boxShadow: star.size > 2 ? '0 0 6px rgba(251, 191, 36, 0.8)' : undefined
            }}
          />
        );
      })}

      {/* Occasional Shooting Stars Streaks */}
      {showShootingStars && (
        <>
          <div
            className="absolute top-20 left-10 w-36 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-white animate-shooting-star"
            style={{ animationDelay: '1.5s', animationDuration: '8s' }}
          />
          <div
            className="absolute top-1/3 left-1/4 w-44 h-[2px] bg-gradient-to-r from-transparent via-amber-200 to-white animate-shooting-star"
            style={{ animationDelay: '4.8s', animationDuration: '9s' }}
          />
          <div
            className="absolute top-2/3 left-1/3 w-32 h-[1.5px] bg-gradient-to-r from-transparent via-sky-300 to-white animate-shooting-star"
            style={{ animationDelay: '7.5s', animationDuration: '11s' }}
          />
        </>
      )}
    </div>
  );
};
