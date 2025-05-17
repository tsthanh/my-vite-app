import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';

const withErrorBoundary = (Component) => {
  return (props) => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
};

export default withErrorBoundary;
