import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lỗi trong component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h3 style={{ color: 'red' }}>Đã có lỗi xảy ra: {this.state.error.message}</h3>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
