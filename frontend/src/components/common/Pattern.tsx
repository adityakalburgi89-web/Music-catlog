import React from 'react';

interface PatternProps {
  className?: string;
  children?: React.ReactNode;
}

export const Pattern: React.FC<PatternProps> = ({ className = '', children }) => {
  return (
    <div className={`pattern-bg-wrapper ${className}`}>
      <div className="pattern-container" />
      {children}
    </div>
  );
};

export default Pattern;
