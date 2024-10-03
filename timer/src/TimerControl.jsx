import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api/axiosConfig';
import ImageDisplay from './ImageDisplay';
import Howler from 'react-howler';
import './TimerControl.css';

const TimerControl = () => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');
  const [totalDuration, setTotalDuration] = useState(0);
  const [pausedTime, setPausedTime] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [playSound, setPlaySound] = useState(true);
  const [fetchImageTrigger, setFetchImageTrigger] = useState(false);
  const [alarmStopped, setAlarmStopped] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      console.error('Token or UserId is missing');
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(interval);
            setIsActive(false);
            setIsTimeUp(true);
            if (playSound) {
              setSoundPlaying(true);
            }
            return 0;
          }
        });
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer, playSound]);

  const startTimer = async () => {
    const minutes = parseInt(inputMinutes, 10) || 0;
    const seconds = parseInt(inputSeconds, 10) || 0;
    const duration = minutes * 60 + seconds;

    if (duration > 0) {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          throw new Error('No authentication token or userId found.');
        }

        const response = await api.get(`/user-status/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
          //check for trial, has paid and length of timer/ do not allow over 60 seconds if trial period is over and hasnt paid
        if (response.data.trialPeriodOver && response.data.hasPaid === false && duration > 60) {
          alert('Your trial period is over. You can only use timers for 60 seconds or less with the unpaid version.');
          return;
        }

        await api.post('/start-timer', {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTimer(duration);
        setTotalDuration(duration);
        setIsActive(true);
        setPausedTime(null);
        setIsTimeUp(false);
        setSoundPlaying(false);
        setHasStarted(true);
        setAlarmStopped(false);
      } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        alert('Error starting timer: ' + (error.response?.data.message || 'An error occurred'));
      }
    } else {
      alert('Please enter a valid duration.');
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
    setPausedTime(timer);
  };

  const resumeTimer = () => {
    if (pausedTime !== null) {
      setTimer(pausedTime);
    }
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimer(0);
    setTotalDuration(0);
    setPausedTime(null);
    setIsTimeUp(false);
    setSoundPlaying(false);
    setHasStarted(false);
    setFetchImageTrigger((prev) => !prev);
    setAlarmStopped(false);
  };

  const stopSound = () => {
    setSoundPlaying(false);
    setAlarmStopped(true);
  };

  const handleSoundToggle = () => {
    setPlaySound(!playSound);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <div className="timer-control-container">
      <div className="navbar">
        <Link to="/Profile">
          <button className="profile-button">Profile</button>
        </Link>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {!hasStarted && (
        <div className="input-controls">
          <label>
            Minutes:
            <input
              type="number"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
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
              onChange={(e) => setInputSeconds(e.target.value)}
              placeholder="0"
              min="0"
              max="59"
              className="time-input"
            />
          </label>

          <button onClick={startTimer}>Start</button>
          <div className="sound-toggle">
            <label>
              <input
                type="checkbox"
                checked={playSound}
                onChange={handleSoundToggle}
              />
              Play Alarm Sound
            </label>
          </div>
        </div>
      )}

      {hasStarted && !isTimeUp && (
        <div className="timer-button-container">
          {isActive ? (
            <button onClick={pauseTimer}>Pause</button>
          ) : pausedTime !== null ? (
            <button onClick={resumeTimer}>Resume</button>
          ) : null}
          <button onClick={resetTimer}>Reset</button>
        </div>
      )}

      {hasStarted && (
        <div className="timer-info">
          <span>Time left: {timer} seconds</span>
        </div>
      )}

      <div className="image-display-container">
        <ImageDisplay
          key={fetchImageTrigger}
          timer={timer}
          totalDuration={totalDuration}
          fetchImageTrigger={fetchImageTrigger}
        />
      </div>

      {isTimeUp && (
        <div className="time-up-container">
          {playSound && !alarmStopped ? (
            <>
              <div className="stop-alarm-message">Press stop alarm to turn off alert</div>
              <br />
              <button onClick={stopSound} className="stop-alarm-button">Stop Alarm</button>
              <Howler
                src="/alarm.mp3"
                playing={true}
                loop={true}
                volume={1}
              />
            </>
          ) : (
            <div>
              <br />
              <div className="times-up-message">Time's Up! Press Reset for a new timer.</div>
              <br />
              <button onClick={resetTimer} className="reset-button">Reset</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimerControl;
