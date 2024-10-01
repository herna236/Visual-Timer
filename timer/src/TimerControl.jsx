import React, { useState, useEffect } from 'react'; // Import React and hooks for managing state and side effects
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation and useNavigate for programmatic navigation
import api from './api/axiosConfig'; // Import API configuration for making requests
import ImageDisplay from './ImageDisplay'; // Import ImageDisplay component for showing images
import Howler from 'react-howler'; // Import Howler for playing audio
import './TimerControl.css'; // Import CSS styles for the TimerControl component

const TimerControl = () => {
  // State variables for managing timer and UI state
  const [timer, setTimer] = useState(0); // Timer countdown value in seconds
  const [isActive, setIsActive] = useState(false); // Tracks if the timer is currently running
  const [inputMinutes, setInputMinutes] = useState(''); // Input for minutes
  const [inputSeconds, setInputSeconds] = useState(''); // Input for seconds
  const [totalDuration, setTotalDuration] = useState(0); // Total duration for the timer
  const [pausedTime, setPausedTime] = useState(null); // Tracks time when the timer is paused
  const [isTimeUp, setIsTimeUp] = useState(false); // Indicates if the timer has finished
  const [soundPlaying, setSoundPlaying] = useState(false); // Tracks if the alarm sound is playing  ** might need to look at this
  const [hasStarted, setHasStarted] = useState(false); // Indicates if the timer has started
  const [playSound, setPlaySound] = useState(true); // Toggle for sound playback
  const [fetchImageTrigger, setFetchImageTrigger] = useState(false); // Trigger to fetch a new image
  const [alarmStopped, setAlarmStopped] = useState(false); // Tracks if the alarm has been stopped

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Effect to check for authentication token and user ID in local storage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      console.error('Token or UserId is missing'); // Log if missing
    } else {
      console.log('Retrieved token:', token); // Log the retrieved token
      console.log('Retrieved userId:', userId); // Log the retrieved user ID
    }
  }, []);

  useEffect(() => {
    // Effect to manage the countdown timer
    let interval = null; // Variable to hold the interval reference
    if (isActive) {
      // If the timer is active, set an interval to decrement the timer every second
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 0) {
            return prevTimer - 1; // Decrement timer
          } else {
            // When time is up
            clearInterval(interval); // Clear the interval
            setIsActive(false); // Stop the timer
            setIsTimeUp(true); // Set time up state
            if (playSound) {
              setSoundPlaying(true); // Trigger sound playback if enabled
            }
            return 0; // Reset timer to 0
          }
        });
      }, 1000);
    } else if (!isActive && timer !== 0) {
      // If the timer is not active and the timer is not zero, clear the interval, prevent countdown and memory leaks
      clearInterval(interval);
    }
    return () => clearInterval(interval); // Cleanup the interval on unmount or when dependencies change
  }, [isActive, timer, playSound]);

  const startTimer = async () => {
    // Function to start the timer based on user input
    const minutes = parseInt(inputMinutes, 10) || 0; // Parse input minutes
    const seconds = parseInt(inputSeconds, 10) || 0; // Parse input seconds
    const duration = minutes * 60 + seconds; // Convert to total seconds

    if (duration > 0) {
      try {
        // Fetch authentication details
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          throw new Error('No authentication token or userId found.'); // Error if missing
        }

        // Check user status via API
        const response = await api.get(`/user-status/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log(response.data);

        // Check trial period constraints
        if (response.data.trialPeriodOver && response.data.hasPaid === false && duration > 60) {
          alert('Your trial period is over. You can only use timers for 60 seconds or less with the unpaid version.');
          return; // Exit if trial period constraints are not met
        }

        // Start the timer via API call
        await api.post('/start-timer', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Set timer states
        setTimer(duration);
        setTotalDuration(duration);
        setIsActive(true);
        setPausedTime(null);
        setIsTimeUp(false);
        setSoundPlaying(false);
        setHasStarted(true);
        setAlarmStopped(false);

      } catch (error) {
        // Handle errors from API calls
        console.error('Error details:', error.response ? error.response.data : error.message);
        alert('Error starting timer: ' + (error.response?.data.message || 'An error occurred'));
      }
    } else {
      alert('Please enter a valid duration.'); // Alert for invalid duration
    }
  };
  const pauseTimer = () => {
    setIsActive(false); // Stop the timer
    setPausedTime(timer); // Store current time
    console.log('Paused time set to:', timer); // Log the paused time
  };

  const resumeTimer = () => {
    if (pausedTime !== null) { // Check if there was a paused time
      setTimer(pausedTime); // Set the timer to the paused time
    }
    setIsActive(true); // Start the timer again
  };

  const resetTimer = () => {
    // Function to reset the timer to initial state
    setIsActive(false); // Stop the timer
    setTimer(0); // Reset timer to 0
    setTotalDuration(0); // Reset total duration
    setPausedTime(null); // Clear paused time
    setIsTimeUp(false); // Reset time up state
    setSoundPlaying(false); // Stop sound playback
    setHasStarted(false); // Reset started state
    setFetchImageTrigger(prev => !prev); // Trigger a new image fetch
    setAlarmStopped(false); // Reset alarm stopped state
  };

  const stopSound = () => {
    // Function to stop the alarm sound
    setSoundPlaying(false); // Stop playing sound
    setAlarmStopped(true); // Mark alarm as stopped
  };

  const handleSoundToggle = () => {
    // Function to toggle sound playback
    setPlaySound(!playSound); // Toggle the play sound state
  };

  const handleLogout = () => {
    // Function to log out the user
    localStorage.removeItem('token'); // Remove token from local storage
    localStorage.removeItem('userId'); // Remove user ID from local storage
    navigate('/'); // Navigate to the home page
  };

  return (
    <div className="timer-control-container"> {/* Main container for the TimerControl component */}
      <div className="navbar"> {/* Navigation bar */}
        <Link to="/Profile">
          <button className="profile-button">Profile</button>
        </Link>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {!hasStarted && ( // Render input controls only if timer has not started
        <div className="input-controls">
          <label>
            Minutes:
            <input
              type="number"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)} // Update minutes input state
              placeholder="0"
              min="0"
              className="time-input"
            />
          </label>
          <label>
            Seconds:
            <input
              type="number"
              value={inputSeconds}
              onChange={(e) => setInputSeconds(e.target.value)} // Update seconds input state
              placeholder="0"
              min="0"
              max="59"
              className="time-input"
            />
          </label>

          <button onClick={startTimer}>Start</button> {/* Button to start the timer */}
          <div className="sound-toggle"> {/* Toggle for alarm sound */}
            <label>
              <input
                type="checkbox"
                checked={playSound} // Checkbox state linked to playSound
                onChange={handleSoundToggle} // Toggle sound playback
              />
              Play Alarm Sound
            </label>
          </div>
        </div>
      )}

      {hasStarted && !isTimeUp && ( // Render control buttons while timer is active
        <div className="timer-button-container">
          {isActive ? (
            <button onClick={pauseTimer}>Pause</button> // Button to pause the timer
          ) : pausedTime !== null ? (
            <button onClick={resumeTimer}>Resume</button> // Button to resume the timer if paused
          ) : null}
          <button onClick={resetTimer}>Reset</button> {/* Button to reset the timer */}
        </div>
      )}

      {hasStarted && ( // Display remaining time when the timer has started
        <div className="timer-info">
          <span>Time left: {timer} seconds</span> {/* Display remaining time */}
        </div>
      )}

      <div className="image-display-container"> {/* Container for image display */}
        <ImageDisplay key={fetchImageTrigger} timer={timer} totalDuration={totalDuration} fetchImageTrigger={fetchImageTrigger} />
      </div>

      {isTimeUp && ( // Display message when the timer reaches zero
        <div className="time-up-container">
          {playSound && !alarmStopped ? ( // If sound is enabled and not stopped
            <>
              <div className="stop-alarm-message">Press stop alarm to turn off alert</div>
              <br />
              <button onClick={stopSound} className="stop-alarm-button">Stop Alarm</button> {/* Button to stop the alarm sound */}
              <Howler
                src="/alarm.mp3" // Audio source for the alarm
                playing={true} // Set to true to play the sound
                loop={true} // Loop the sound
                volume={1} // Set volume
              />
            </>
          ) : (
            <div>
              <br />
              <div className="times-up-message">Time's Up! Press Reset for a new timer.</div> {/* Message when time is up */}
              <br />
              <button onClick={resetTimer} className="reset-button">Reset</button> {/* Button to reset the timer */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimerControl;
