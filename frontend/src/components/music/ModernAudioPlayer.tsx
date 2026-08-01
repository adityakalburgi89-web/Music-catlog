import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import songSrc from '../../music/Three Voices One Fire.mp3';

export const ModernAudioPlayer: React.FC = () => {
  const { currentTrack, setPlayingState } = usePlayer();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);

  // Sync track playback when currentTrack changes
  useEffect(() => {
    if (audioRef.current) {
      if (currentTrack?.downloadUrl) {
        audioRef.current.src = currentTrack.downloadUrl;
      } else {
        audioRef.current.src = songSrc;
      }
      audioRef.current.currentTime = 0;
      if (currentTrack) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error('Playback error:', err));
      }
    }
  }, [currentTrack]);

  // Sync internal isPlaying state with PlayerContext
  useEffect(() => {
    setPlayingState(isPlaying);
  }, [isPlaying, setPlayingState]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Playback error:', err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        Math.max(0, audioRef.current.currentTime + seconds),
        duration
      );
    }
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 0.8];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioRef.current.muted = nextMute;
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const activeTitle = currentTrack?.title || 'Glow';
  const activeArtist = currentTrack?.artist || 'Echo';
  const activeArtwork = currentTrack?.artworkUrl;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remainingTime = Math.max(0, duration - currentTime);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      <audio
        ref={audioRef}
        src={currentTrack?.downloadUrl || songSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <style>{`
        .main-music-card {
          max-width: 420px;
          width: 320px;
          padding: 18px;
          border-radius: 35px;
          background: #000;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          gap: 14px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: white;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        @media (min-width: 640px) {
          .main-music-card {
            width: 380px;
          }
        }

        .track-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .album-art-container {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: linear-gradient(135deg, #ff9a9e, #fad0c4);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
          flex-shrink: 0;
          overflow: hidden;
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .album-art-container:hover {
          transform: scale(1.05);
        }

        .album-art-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .track-details {
          flex-grow: 1;
          overflow: hidden;
        }

        .track-title {
          font-size: 1.25em;
          font-weight: 600;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .artist-name {
          font-size: 0.9em;
          color: #d1d1d6;
          margin-top: 2px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        .volume-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          width: 38px;
          height: 32px;
        }

        .volume-bars .bar {
          width: 3px;
          background: linear-gradient(180deg, #00c6ff, #0072ff);
          border-radius: 2px;
          height: 6px;
          transition: height 0.2s ease;
        }

        .volume-bars.playing .bar {
          animation: bounce 0.8s infinite ease-in-out;
        }

        @keyframes bounce {
          0%, 100% {
            height: 6px;
          }
          50% {
            height: 26px;
          }
        }

        .playback-controls {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .time-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.8em;
          color: #8e8e93;
          font-family: monospace;
        }

        .progress-bar-container {
          width: 100%;
          height: 12px;
          position: relative;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
          position: relative;
          overflow: visible;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00c6ff, #0072ff);
          border-radius: 2px;
          transition: width 0.1s linear;
        }

        .progress-handle {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(0, 198, 255, 0.8);
          transition: left 0.1s linear;
          pointer-events: none;
        }

        .seek-input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 10;
        }

        .button-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 4px;
        }

        .main-control-btns {
          justify-content: center;
          align-items: center;
          display: flex;
          gap: 20px;
          flex-grow: 1;
        }

        .control-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: none;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          color: #fff;
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.12);
          transform: scale(1.08);
        }

        .control-button:active {
          transform: scale(0.95);
        }

        .control-button.radar-btn {
          width: 38px;
          height: 38px;
          font-size: 11px;
          font-weight: bold;
          font-family: monospace;
          background: rgba(255, 255, 255, 0.08);
        }
      `}</style>

      <div className="main-music-card">
        {/* Track Info Header */}
        <div className="track-info">
          <div className="album-art-container">
            {activeArtwork ? (
              <img
                src={activeArtwork}
                alt={activeTitle}
                className="album-art-img"
              />
            ) : (
              <div className="text-white font-bold text-xl">♪</div>
            )}
          </div>
          <div className="track-details">
            <div className="track-title" title={activeTitle}>
              {activeTitle}
            </div>
            <div className="artist-name" title={activeArtist}>
              {activeArtist}
            </div>
          </div>
          {/* Animated Volume Bars Equalizer */}
          <div className={`volume-bars ${isPlaying ? 'playing' : ''}`}>
            <div className="bar" style={{ animationDelay: '0s' }} />
            <div className="bar" style={{ animationDelay: '0.1s' }} />
            <div className="bar" style={{ animationDelay: '0.2s' }} />
            <div className="bar" style={{ animationDelay: '0.3s' }} />
            <div className="bar" style={{ animationDelay: '0.4s' }} />
            <div className="bar" style={{ animationDelay: '0.5s' }} />
            <div className="bar" style={{ animationDelay: '0.6s' }} />
            <div className="bar" style={{ animationDelay: '0.7s' }} />
          </div>
        </div>

        {/* Playback Controls & Progress Bar */}
        <div className="playback-controls">
          <div className="time-info">
            <span className="current-time">{formatTime(currentTime)}</span>
            <span className="remaining-time">
              {duration ? `-${formatTime(remainingTime)}` : '0:00'}
            </span>
          </div>

          <div className="progress-bar-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="progress-handle"
                style={{ left: `${progressPercent}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="seek-input"
              title="Seek track time"
            />
          </div>

          {/* Button Controls Row */}
          <div className="button-row">
            <div className="main-control-btns">
              {/* Skip Backwards Button */}
              <button
                onClick={() => handleSkip(-10)}
                className="control-button back"
                title="Rewind 10s"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={22}
                  height={22}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V8.753l6.267 3.636c.54.313 1.233-.066 1.233-.697v-2.94l6.267 3.636c.54.314 1.233-.065 1.233-.696V4.308c0-.63-.693-1.01-1.233-.696L8.5 7.248v-2.94c0-.63-.692-1.01-1.233-.696L1 7.248V4a.5.5 0 0 0-.5-.5" />
                </svg>
              </button>

              {/* Play / Pause Main Toggle */}
              <div className="play-pause-btns">
                <button
                  onClick={togglePlay}
                  className="control-button play-pause-button"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <svg
                      className="icon-pause"
                      xmlns="http://www.w3.org/2000/svg"
                      width={30}
                      height={30}
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
                    </svg>
                  ) : (
                    <svg
                      className="icon-play"
                      xmlns="http://www.w3.org/2000/svg"
                      width={30}
                      height={30}
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.596 8.697l-6.363 3.692c-.54.314-1.233-.065-1.233-.696V4.308c0-.63.693-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Skip Forwards Button */}
              <button
                onClick={() => handleSkip(10)}
                className="control-button next"
                title="Forward 10s"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={22}
                  height={22}
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.753l-6.267 3.636c-.54.313-1.233-.066-1.233-.697v-2.94l-6.267 3.636C.693 12.703 0 12.324 0 11.693V4.308c0-.63.693-1.01 1.233-.696L7.5 7.248v-2.94c0-.63.693-1.01 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5" />
                </svg>
              </button>
            </div>

            {/* Radar / Mute Toggle Button */}
            <button
              onClick={toggleMute}
              className="control-button radar-btn"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.707 7.5l1.147 1.146a.5.5 0 0 1-.708.708L12 8.207l-1.146 1.147a.5.5 0 0 1-.708-.708L11.293 7.5l-1.147-1.146a.5.5 0 0 1 .708-.708L12 6.793l1.146-1.147a.5.5 0 0 1 .708 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847" />
                </svg>
              )}
            </button>
            {/* Speed Toggle Button */}
            <button
              onClick={cycleSpeed}
              className="control-button radar-btn"
              title={`Playback Speed: ${speed}x (Click to cycle)`}
            >
              {speed}x
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
