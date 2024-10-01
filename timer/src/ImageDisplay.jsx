import React, { useEffect, useState } from 'react'; // Import React and hooks for state and side effects
import axios from 'axios'; // Import Axios for making HTTP requests
import './ImageDisplay.css'; // Import CSS styles for the component

const ImageDisplay = ({ timer, totalDuration, fetchImageTrigger }) => {
  const [imageURL, setImageURL] = useState(''); // State to hold the image URL

  useEffect(() => {
    const fetchImage = async () => {
      try {
        // Fetch a random image from the external API
        const response = await axios.get('https://picsum.photos/400');
        setImageURL(response.request.responseURL); // Set the image URL from the response
      } catch (error) {
        console.error('Error fetching the image:', error); // Log any errors that occur during the fetch
      }
    };

    fetchImage(); // Call the fetchImage function to get a new image
  }, [fetchImageTrigger]); // Dependency array: re-run the effect when fetchImageTrigger changes

  // Calculate the percentage of the timer completed with info passed from timer component
  const percentageCompleted = totalDuration > 0 ? ((totalDuration - timer) / totalDuration) * 100 : 0;
  // Calculate the overlay height based on the percentage completed
  const overlayHeight = `${100 - percentageCompleted}%`;

  return (
    <div className="image-container"> {/* Container for the image and overlay */}
      {imageURL && ( // Render the image and overlay only if imageURL is set
        <>
          <img src={imageURL} alt="Random" className="image" /> {/* Image element */}
          <div className="image-overlay" style={{ height: overlayHeight }}></div> {/* Overlay element with dynamic height */}
        </>
      )}
    </div>
  );
};

export default ImageDisplay;
