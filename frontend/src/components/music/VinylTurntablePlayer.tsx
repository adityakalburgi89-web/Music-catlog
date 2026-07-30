import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music2, Disc } from 'lucide-react';

// Import local mp3 audio file
import songSrc from '../../music/Three Voices One Fire.mp3';

// Import all real record player PNG element images from /imgs
import vinylRecordImg from '../../imgs/vinyl-record.png';
import tonearmImg from '../../imgs/tonearm.png';
import counterweightImg from '../../imgs/counterweight.png';
import antiSkateImg from '../../imgs/anti-skate-control.png';
import pivotAssemblyImg from '../../imgs/Tonearm pivot and counterweight assembly.png';

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

export const VinylTurntablePlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [rpm, setRpm] = useState<'33' | '45'>('33');

  // Handle audio time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error('Audio playback error:', err);
      });
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
    <div className="w-full max-w-md mx-auto select-none">
      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={songSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main Square White Deck Plinth */}
      <div className="relative bg-[#f8f7f2] border-2 border-hairline rounded-[32px] p-6 shadow-2xl overflow-hidden">
        {/* RCA Jacks / Screws Detail Bar */}
        <div className="flex justify-between items-center mb-2 px-2">
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d5d0c2] shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#d5d0c2] shadow-inner" />
          </div>
          <div className="text-[10px] font-mono tracking-widest text-muted uppercase font-semibold">
            CLAY-AUDIO • VINYL-DECK-2026
          </div>
        </div>

        {/* Center Platter & Vinyl Disc Area */}
        <div className="relative aspect-square w-full max-w-[320px] mx-auto flex items-center justify-center">
          {/* Black Vinyl Record Disc */}
          <div
            className={`relative w-[280px] h-[280px] rounded-full shadow-2xl flex items-center justify-center transition-transform duration-700 ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{
              animationDuration: isPlaying ? (rpm === '45' ? '1.8s' : '2.5s') : '0s',
            }}
          >
            <ChromaKeyImage
              src={vinylRecordImg}
              alt="Vinyl Record"
              className="w-full h-full object-contain rounded-full drop-shadow-xl"
            />

            {/* Vinyl Center Label Overlay */}
            <div className="absolute w-24 h-24 rounded-full bg-brand-peach border-4 border-[#111115] flex flex-col items-center justify-center p-2 text-center text-ink shadow-md z-10">
              <Disc className="w-4 h-4 text-primary mb-0.5 animate-pulse" />
              <span className="text-[9px] font-bold tracking-tight line-clamp-1 leading-none text-ink">
                Three Voices One Fire
              </span>
              <span className="text-[7px] font-medium text-slate-700 mt-0.5">Master Cut</span>
              <div className="w-3 h-3 rounded-full bg-[#111115] mt-1 border border-white/40" />
            </div>
          </div>

          {/* 100% Perfectly Aligned Connected Tonearm Unit */}
          <div className="absolute top-1 right-2 w-32 h-52 pointer-events-none z-20">
            <div
              className={`relative w-full h-full transition-transform duration-700 origin-[82%_10%] z-20 ${
                isPlaying ? 'rotate-[20deg]' : 'rotate-0'
              }`}
            >
              {/* 1. Silver Circular Pivot Base Washer */}
              <ChromaKeyImage
                src={pivotAssemblyImg}
                alt="Pivot Base"
                className="absolute top-1 right-3 w-10 h-10 object-contain drop-shadow-sm z-10"
                title="Pivot Base"
              />

              {/* 2. Silver Counterweight Cylinder */}
              <ChromaKeyImage
                src={counterweightImg}
                alt="Counterweight"
                className="absolute top-1 right-[17px] w-6 h-6 object-contain drop-shadow-md z-30"
                title="Counterweight"
              />

              {/* 3. Cueing / Anti-Skate Lever */}
              <ChromaKeyImage
                src={antiSkateImg}
                alt="Anti-Skate Lever"
                className="absolute top-[36px] right-[28px] w-5 h-5 object-contain drop-shadow-sm z-25"
                title="Anti-Skate Lever"
              />

              {/* 4. Straight Black Tonearm Shaft & Stylus Cartridge */}
              <ChromaKeyImage
                src={tonearmImg}
                alt="Tonearm Shaft"
                className="absolute top-2 right-[18px] w-5 h-[180px] object-contain drop-shadow-2xl z-20"
                title="Tonearm Shaft"
              />
            </div>
          </div>
        </div>

        {/* Bottom Corner Dials */}
        <div className="flex justify-between items-center px-4 mt-2 mb-3">
          {/* Bottom-Left 3-Way Speed Dial */}
          <div className="w-9 h-9 rounded-full bg-[#e6e1d3] border border-black/10 flex items-center justify-center shadow-inner">
            <div className="w-5 h-5 rounded-full border border-black/20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            </div>
          </div>

          {/* Bottom-Right Start/Stop Dial Button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#e6e1d3] hover:bg-[#dfd9cb] border border-black/10 flex items-center justify-center shadow-md active:scale-95 transition-all"
            title={isPlaying ? 'Pause Turntable' : 'Start Turntable'}
          >
            <div className="w-6 h-6 rounded-full border-2 border-slate-700 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-3 h-3 text-slate-800" />
              ) : (
                <Play className="w-3 h-3 text-slate-800 ml-0.5" />
              )}
            </div>
          </button>
        </div>

        {/* Live Track Details Banner */}
        <div className="p-3 rounded-xl bg-canvas border border-hairline flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`p-2 rounded-lg bg-brand-pink text-white shrink-0 ${isPlaying ? 'animate-bounce' : ''}`}>
              <Music2 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-display font-semibold text-sm text-ink truncate">Three Voices One Fire</h4>
              <p className="text-xs text-muted font-medium truncate font-mono">Original Master Stream</p>
            </div>
          </div>

          {/* Equalizer Bar Animation */}
          {isPlaying && (
            <div className="flex items-end gap-1 h-5 px-2">
              <span className="w-1 bg-brand-pink rounded-full animate-[bounce_0.6s_infinite_100ms] h-4" />
              <span className="w-1 bg-brand-teal rounded-full animate-[bounce_0.6s_infinite_300ms] h-5" />
              <span className="w-1 bg-brand-ochre rounded-full animate-[bounce_0.6s_infinite_200ms] h-3" />
              <span className="w-1 bg-brand-lavender rounded-full animate-[bounce_0.6s_infinite_400ms] h-5" />
            </div>
          )}
        </div>

        {/* Scrubbing Timeline Progress Bar */}
        <div className="mt-4 space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-primary h-1.5 bg-surface-strong rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-muted font-medium">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Bottom Control Buttons Row */}
        <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-hairline">
          {/* RPM Speed Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-surface-soft p-1 rounded-lg border border-hairline">
            <button
              onClick={() => toggleRpm('33')}
              className={`px-2.5 py-1 rounded text-xs font-bold font-mono transition-all ${
                rpm === '33' ? 'bg-primary text-white shadow-sm' : 'text-body hover:text-ink'
              }`}
            >
              33 RPM
            </button>
            <button
              onClick={() => toggleRpm('45')}
              className={`px-2.5 py-1 rounded text-xs font-bold font-mono transition-all ${
                rpm === '45' ? 'bg-brand-pink text-white shadow-sm' : 'text-body hover:text-ink'
              }`}
            >
              45 RPM
            </button>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full bg-primary hover:bg-body-strong text-white shadow-lg flex items-center justify-center transition-all active:scale-90"
            title={isPlaying ? 'Pause Turntable' : 'Play Vinyl Record'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          {/* Volume Slider & Mute Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-md text-muted hover:text-ink transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 accent-primary h-1 bg-surface-strong rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
