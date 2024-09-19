import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ImageDisplay.css';

const ImageDisplay = ({ timer, totalDuration, fetchImageTrigger }) => {
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get('https://picsum.photos/400');
        setImageURL(response.request.responseURL); // Gets the final URL (follows routes)
      } catch (error) {
        console.error('Error fetching the image:', error);
      }
    };

    fetchImage();
  }, [fetchImageTrigger]); // Fetch image only when fetchImageTrigger changes (the reset button is clicked)

  const percentageCompleted = totalDuration > 0 ? ((totalDuration - timer) / totalDuration) * 100 : 0;
  const overlayHeight = `${100 - percentageCompleted}%`;

  return (
    <div className="image-container">
      {imageURL && (
        <>
          <img src={imageURL} alt="Random" className="image" />
          <div className="image-overlay" style={{ height: overlayHeight }}></div>
        </>
      )}
    </div>
  );
};

export default ImageDisplay;
