import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ImageDisplay from '../ImageDisplay';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a mock instance of axios
const mock = new MockAdapter(axios);

describe('ImageDisplay Component', () => {
  afterEach(() => {
    mock.reset(); // Reset mock after each test
  });

  test('fetches and displays an image', async () => {
    // Mock the axios GET request
    const mockImageUrl = 'https://picsum.photos/id/400/400';
    mock.onGet('https://picsum.photos/400').reply(200, {
      request: {
        responseURL: mockImageUrl,
      },
    });

    render(<ImageDisplay timer={30} totalDuration={60} fetchImageTrigger={true} />);

    // Wait for the image to appear in the document
    const img = await screen.findByAltText('Random');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockImageUrl);
  });

  test('displays overlay based on timer', async () => {
    const mockImageUrl = 'https://picsum.photos/id/400/400';
    mock.onGet('https://picsum.photos/400').reply(200, {
      request: {
        responseURL: mockImageUrl,
      },
    });

    render(<ImageDisplay timer={30} totalDuration={60} fetchImageTrigger={true} />);

    // Wait for the image to appear
    await screen.findByAltText('Random');

    // Calculate expected overlay height
    const percentageCompleted = ((60 - 30) / 60) * 100; // 50%
    const overlayHeight = `${100 - percentageCompleted}%`;

    // Check if the overlay is styled correctly
    const overlay = screen.getByText(/Random/i).closest('div').querySelector('.image-overlay');
    expect(overlay).toHaveStyle(`height: ${overlayHeight}`);
  });

  test('does not crash if there is an error fetching the image', async () => {
    mock.onGet('https://picsum.photos/400').reply(500); // Simulate a server error

    render(<ImageDisplay timer={30} totalDuration={60} fetchImageTrigger={true} />);

    // Check that no image is displayed
    const img = screen.queryByAltText('Random');
    expect(img).not.toBeInTheDocument();
  });
});
