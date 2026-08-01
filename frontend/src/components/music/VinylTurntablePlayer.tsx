import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music2, Disc } from 'lucide-react';

// Import local mp3 audio file
import songSrc from '../../music/Three Voices One Fire.mp3';

// Import all real record player PNG element images from /imgs
import vinylRecordImg from '../../imgs/vinyl-record.png';
import mountImg from '../../imgs/mount.png';
import tonearmImg from '../../imgs/tonearm.png';
import counterweightImg from '../../imgs/counterweight.png';
import antiSkateImg from '../../imgs/anti-skate-control.png';

// Chroma-Key HTML5 Canvas Component to automatically strip green-screen backgrounds
const ChromaKeyImage: React.FC<{ src: string; alt: string; className?: string; title?: string }> = ({ src, alt, className, title }) => {
  const [cleanSrc, setCleanSrc] = useState<string>(src);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Auto Green-Screen Pixel Removal Algorithm
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Detect green-screen chroma key pixels
          if (g > 70 && g > r * 1.1 && g > b * 1.1) {
            data[i + 3] = 0; // Make pixel 100% transparent
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setCleanSrc(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error('Chroma key processing error:', err);
      }
    };
  }, [src]);

  return <img src={cleanSrc} alt={alt} className={className} title={title} />;
};

import { usePlayer } from '../../context/PlayerContext';

export const VinylTurntablePlayer: React.FC = () => {
  const { currentTrack, setPlayingState } = usePlayer();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const playTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isArmEngaged, setIsArmEngaged] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [rpm, setRpm] = useState<'33' | '45'>('33');

  const FADE_DURATION = 600;

  // Sync playback when currentTrack changes from PlayerContext
  useEffect(() => {
    if (currentTrack?.downloadUrl && audioRef.current) {
      audioRef.current.src = currentTrack.downloadUrl;
      audioRef.current.currentTime = 0;
      setIsArmEngaged(true);
      clearPlayTimeout();
      playTimeoutRef.current = setTimeout(() => {
        fadeIn();
        playTimeoutRef.current = null;
      }, 300);
    } else if (!currentTrack) {
      clearPlayTimeout();
      cancelFade();
      setIsArmEngaged(false);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [currentTrack]);

  // Sync internal isPlaying with PlayerContext
  useEffect(() => {
    setPlayingState(isPlaying);
  }, [isPlaying]);

  const cancelFade = () => {
    if (fadeRef.current !== null) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  };

  const clearPlayTimeout = () => {
    if (playTimeoutRef.current !== null) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cancelFade();
      clearPlayTimeout();
    };
  }, []);

  // Fade In Playback
  const fadeIn = () => {
    cancelFade();
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const targetVol = isMuted ? 0 : volume;
    const startVol = audio.volume;

    if (audio.paused) {
      audio.volume = 0;
    }

    const effectiveStartVol = audio.paused ? 0 : startVol;

    const startPlaybackAndFade = () => {
      setIsPlaying(true);
      const startTime = performance.now();

      const animateFadeIn = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / FADE_DURATION, 1);
        audio.volume = Math.min(1, Math.max(0, effectiveStartVol + (targetVol - effectiveStartVol) * progress));

        if (progress < 1) {
          fadeRef.current = requestAnimationFrame(animateFadeIn);
        } else {
          audio.volume = targetVol;
          fadeRef.current = null;
        }
      };

      fadeRef.current = requestAnimationFrame(animateFadeIn);
    };

    if (audio.paused) {
      audio.play().then(startPlaybackAndFade).catch((err) => {
        console.error('Audio playback error:', err);
      });
    } else {
      startPlaybackAndFade();
    }
  };

  // Fade Out Playback
  const fadeOut = () => {
    clearPlayTimeout();
    cancelFade();
    setIsArmEngaged(false);
    if (!audioRef.current) {
      setIsPlaying(false);
      return;
    }

    const audio = audioRef.current;
    if (audio.paused) {
      setIsPlaying(false);
      return;
    }

    const startVol = audio.volume;
    const startTime = performance.now();
    const targetVol = isMuted ? 0 : volume;

    const animateFadeOut = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / FADE_DURATION, 1);
      audio.volume = Math.max(0, startVol * (1 - progress));

      if (progress < 1) {
        audio.pause();
        audio.volume = targetVol;
        setIsPlaying(false);
        fadeRef.current = null;
      }
    };

    fadeRef.current = requestAnimationFrame(animateFadeOut);
  };

  // Handle audio time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Handle audio end
  const handleEnded = () => {
    clearPlayTimeout();
    cancelFade();
    setIsPlaying(false);
    setIsArmEngaged(false);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  };

  // Toggle play/pause (Arm swings onto disk first, song starts 300ms after needle makes contact)
  const togglePlay = () => {
    clearPlayTimeout();
    if (isArmEngaged || isPlaying) {
      setIsArmEngaged(false);
      fadeOut();
    } else {
      setIsArmEngaged(true);
      playTimeoutRef.current = setTimeout(() => {
        fadeIn();
        playTimeoutRef.current = null;
      }, 300);
    }
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cancelFade();
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    cancelFade();
    if (!audioRef.current) return;
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioRef.current.muted = nextMute;
  };

  // Toggle RPM speed
  const toggleRpm = (speed: '33' | '45') => {
    setRpm(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed === '45' ? 1.35 : 1.0;
    }
  };

  // Formatting helper (MM:SS)
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-sm mx-auto select-none">
      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={songSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Main Square White Deck Plinth */}
      <div className="relative bg-[#f8f7f2] border-2 border-hairline rounded-[28px] p-4 sm:p-5 shadow-xl overflow-hidden">
        {/* RCA Jacks / Screws Detail Bar */}
        <div className="flex justify-between items-center mb-1.5 px-1">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d5d0c2] shadow-inner" />
            <span className="w-2 h-2 rounded-full bg-[#d5d0c2] shadow-inner" />
          </div>
          <div className="text-[9px] font-mono tracking-widest text-muted uppercase font-semibold">
            CLAY-AUDIO • VINYL-DECK-2026
          </div>
        </div>

        {/* Center Platter & Vinyl Disc Area */}
        <div className="relative aspect-square w-full max-w-[250px] mx-auto flex items-center justify-center">
          {/* Black Vinyl Record Disc */}
          <div
            className="relative w-[220px] h-[220px] rounded-full shadow-xl flex items-center justify-center animate-spin"
            style={{
              animationPlayState: isArmEngaged || isPlaying ? 'running' : 'paused',
              animationDuration: rpm === '45' ? '1.8s' : '2.5s',
            }}
          >
            <ChromaKeyImage
              src={vinylRecordImg}
              alt="Vinyl Record"
              className="w-full h-full object-contain rounded-full drop-shadow-lg"
            />

            {/* Vinyl Center Label Overlay */}
            <div className="absolute w-20 h-20 rounded-full bg-brand-peach border-2 border-[#111115] flex flex-col items-center justify-center p-1.5 text-center text-ink shadow-md z-10 overflow-hidden">
              {currentTrack?.artworkUrl ? (
                <img src={currentTrack.artworkUrl} alt={currentTrack.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />
              ) : (
                <Disc className="w-3.5 h-3.5 text-primary mb-0.5 animate-pulse" />
              )}
              <span className="relative z-10 text-[8px] font-bold tracking-tight line-clamp-1 leading-none text-ink max-w-full px-1">
                {currentTrack ? currentTrack.title : 'Three Voices One Fire'}
              </span>
              <span className="relative z-10 text-[6.5px] font-semibold text-slate-800 mt-0.5 truncate max-w-full px-1">
                {currentTrack ? currentTrack.artist : 'Master Cut'}
              </span>
              <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#111115] mt-0.5 border border-white/40" />
            </div>
          </div>

          {/* Fixed Top-Right White Mounting Base Plate */}
          <div className="absolute top-0 right-0 w-24 h-36 pointer-events-none z-10">
            <ChromaKeyImage
              src={mountImg}
              alt="Tonearm Mount Base"
              className="w-full h-full object-contain drop-shadow-md"
              title="Tonearm Mount Base"
            />
          </div>

          {/* Rotating Tonearm Assembly */}
          <div className="absolute top-0 right-0 w-24 h-40 pointer-events-none z-20">
            <div
              className={`relative w-full h-full transition-transform duration-700 origin-[74%_10%] z-20 ${isArmEngaged ? 'rotate-[20deg]' : 'rotate-0'
                }`}
            >
              {/* 1. Silver Cylindrical Counterweight Knob */}
              <ChromaKeyImage
                src={counterweightImg}
                alt="Counterweight"
                className="absolute top-[3px] right-[8px] w-6 h-6 object-contain drop-shadow-md z-30"
                title="Counterweight"
              />

              {/* 2. Cueing / Anti-Skate Lever */}
              <ChromaKeyImage
                src={antiSkateImg}
                alt="Anti-Skate Lever"
                className="absolute top-[30px] right-[18px] w-4 h-4 object-contain drop-shadow-sm z-25"
                title="Anti-Skate Lever"
              />

              {/* 3. Black Metallic Tonearm Shaft */}
              <ChromaKeyImage
                src={tonearmImg}
                alt="Tonearm Shaft"
                className="absolute top-[5px] right-[10px] w-5 h-[140px] object-contain drop-shadow-xl z-20"
                title="Tonearm Shaft"
              />
            </div>
          </div>
        </div>

        {/* Bottom Corner Dials */}
        <div className="flex justify-between items-center px-2 mt-1 mb-2">
          {/* Bottom-Left 3-Way Speed Dial */}
          <div className="w-8 h-8 rounded-full bg-[#e6e1d3] border border-black/10 flex items-center justify-center shadow-inner">
            <div className="w-4 h-4 rounded-full border border-black/20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>
          </div>

          {/* Bottom-Right Start/Stop Dial Button */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-[#e6e1d3] hover:bg-[#dfd9cb] border border-black/10 flex items-center justify-center shadow-md active:scale-95 transition-all"
            title={isArmEngaged ? 'Pause Turntable' : 'Start Turntable'}
          >
            <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex items-center justify-center">
              {isArmEngaged ? (
                <Pause className="w-2.5 h-2.5 text-slate-800" />
              ) : (
                <Play className="w-2.5 h-2.5 text-slate-800 ml-0.5" />
              )}
            </div>
          </button>
        </div>

        {/* Live Track Details Banner */}
        <div className="p-2.5 rounded-xl bg-canvas border border-hairline flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-1.5 rounded-lg bg-brand-pink text-white shrink-0">
              <Music2 className="w-3.5 h-3.5" />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-display font-semibold text-xs text-ink truncate" title={currentTrack ? currentTrack.title : 'Three Voices One Fire'}>
                {currentTrack ? currentTrack.title : 'Three Voices One Fire'}
              </h4>
              <p className="text-[10px] text-muted font-medium truncate font-mono">
                {currentTrack ? currentTrack.artist : 'Original Master Stream'}
              </p>
            </div>
          </div>

          {/* Equalizer Bar Animation */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-4 px-1">
              <span className="w-1 bg-brand-pink rounded-full animate-[bounce_0.6s_infinite_100ms] h-3" />
              <span className="w-1 bg-brand-teal rounded-full animate-[bounce_0.6s_infinite_300ms] h-4" />
              <span className="w-1 bg-brand-ochre rounded-full animate-[bounce_0.6s_infinite_200ms] h-2.5" />
              <span className="w-1 bg-brand-lavender rounded-full animate-[bounce_0.6s_infinite_400ms] h-4" />
            </div>
          )}
        </div>

        {/* Scrubbing Timeline Progress Bar */}
        <div className="mt-2.5 space-y-0.5">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-primary h-1 bg-surface-strong rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Bottom Control Buttons Row */}
        <div className="mt-2.5 flex items-center justify-between gap-2 pt-2.5 border-t border-hairline">
          {/* RPM Speed Selector Buttons */}
          <div className="flex items-center gap-1 bg-surface-soft p-0.5 rounded-lg border border-hairline">
            <button
              onClick={() => toggleRpm('33')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${rpm === '33' ? 'bg-primary text-white shadow-sm' : 'text-body hover:text-ink'
                }`}
            >
              33 RPM
            </button>
            <button
              onClick={() => toggleRpm('45')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono transition-all ${rpm === '45' ? 'bg-brand-pink text-white shadow-sm' : 'text-body hover:text-ink'
                }`}
            >
              45 RPM
            </button>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-primary hover:bg-body-strong text-white shadow-md flex items-center justify-center transition-all active:scale-90"
            title={isArmEngaged ? 'Pause Turntable' : 'Play Vinyl Record'}
          >
            {isArmEngaged ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Volume Slider & Mute Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMute}
              className="p-1 rounded-md text-muted hover:text-ink transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-14 accent-primary h-1 bg-surface-strong rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
