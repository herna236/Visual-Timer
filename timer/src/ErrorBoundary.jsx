import React, { Component } from 'react'; // Import React and the Component class

// Define the ErrorBoundary class extending React.Component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props); // Call the parent constructor
    // Initialize state to track if an error has occurred
    this.state = { hasError: false };
  }

  // Lifecycle method that updates state when an error is caught
  static getDerivedStateFromError() {
    return { hasError: true }; // Set hasError to true when an error is detected
  }

  // Lifecycle method that handles the error when it occurs
  componentDidCatch(error, info) {
    console.error('Error caught in ErrorBoundary:', error, info); // Log the error details to the console
  }

  // Render method to display UI based on error state
  render() {
    if (this.state.hasError) {
      // If an error has occurred, display a fallback UI
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    // If no error, render the child components
    return this.props.children;
  }
}

export default ErrorBoundary; // Export the ErrorBoundary component for use in other parts of the application
