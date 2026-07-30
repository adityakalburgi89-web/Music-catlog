import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music2, Disc } from 'lucide-react';

// Import local mp3 audio file
import songSrc from '../../music/Three Voices One Fire.mp3';

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
    <div className="w-full max-w-md mx-auto">
      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={songSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Main Turntable Deck Base */}
      <div className="relative bg-[#f6f3eb] border-2 border-hairline rounded-2xl p-6 shadow-2xl overflow-hidden select-none">
        {/* Metal Screws / Top Details */}
        <div className="flex justify-between items-center mb-4 text-hairline px-2">
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d0c9b8] shadow-inner" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#d0c9b8] shadow-inner" />
          </div>
          <div className="text-[10px] font-mono tracking-widest text-muted uppercase font-semibold">
            CLAY-AUDIO • TT-2026
          </div>
        </div>

        {/* Turntable Platter & Vinyl Disc Area */}
        <div className="relative aspect-square w-full max-w-[320px] mx-auto flex items-center justify-center bg-[#e8e2d4] rounded-full p-3 shadow-inner border border-black/5">
          {/* Rotating Vinyl Record */}
          <div
            className={`relative w-full h-full rounded-full bg-[#111115] shadow-2xl flex items-center justify-center transition-transform duration-700 ${
              isPlaying ? 'animate-spin' : ''
            }`}
            style={{
              animationDuration: isPlaying ? (rpm === '45' ? '1.8s' : '2.5s') : '0s',
            }}
          >
            {/* Vinyl Record Grooves Texture */}
            <div className="absolute inset-2 rounded-full border border-white/5 opacity-80" />
            <div className="absolute inset-5 rounded-full border border-white/5 opacity-70" />
            <div className="absolute inset-9 rounded-full border border-white/5 opacity-60" />
            <div className="absolute inset-14 rounded-full border border-white/5 opacity-50" />
            <div className="absolute inset-20 rounded-full border border-white/5 opacity-40" />

            {/* Vinyl Center Label (White / Ochre) */}
            <div className="w-28 h-28 rounded-full bg-brand-peach border-4 border-[#111115] flex flex-col items-center justify-center p-2 text-center text-ink shadow-md z-10">
              <Disc className="w-5 h-5 text-primary mb-0.5 animate-pulse" />
              <span className="text-[10px] font-bold tracking-tight line-clamp-1 leading-none text-ink">
                Three Voices One Fire
              </span>
              <span className="text-[8px] font-medium text-slate-700 mt-0.5">Original Master</span>
              {/* Spindle Hole */}
              <div className="w-3.5 h-3.5 rounded-full bg-[#111115] mt-1.5 border border-white/30" />
            </div>
          </div>

          {/* Interactive Tonearm (Pivots onto Record when playing) */}
          <div
            className={`absolute top-4 right-4 w-32 h-44 pointer-events-none transition-transform duration-700 origin-top-right z-20 ${
              isPlaying ? 'rotate-[22deg]' : 'rotate-0'
            }`}
          >
            {/* Tonearm Base Joint */}
            <div className="absolute top-2 right-4 w-10 h-10 rounded-full bg-[#3a3a3a] border-2 border-slate-600 shadow-md flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-slate-200 shadow-inner" />
            </div>

            {/* Metallic Tonearm Rod */}
            <div className="absolute top-6 right-8 w-2 h-36 bg-gradient-to-b from-slate-400 via-slate-200 to-slate-500 rounded-full shadow-md transform -rotate-12" />

            {/* Stylus Headshell & Needle */}
            <div className="absolute bottom-2 right-[42px] w-5 h-7 bg-primary rounded-sm shadow-md border border-slate-700 flex flex-col items-center justify-end">
              <div className="w-1 h-2 bg-brand-pink" />
            </div>
          </div>
        </div>

        {/* Live Track Details Banner */}
        <div className="mt-5 p-3 rounded-xl bg-canvas border border-hairline flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`p-2 rounded-lg bg-brand-pink text-white shrink-0 ${isPlaying ? 'animate-bounce' : ''}`}>
              <Music2 className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h4 className="font-display font-semibold text-sm text-ink truncate">Three Voices One Fire</h4>
              <p className="text-xs text-muted font-medium truncate">Official Soundtrack</p>
            </div>
          </div>

          {/* Live Audio Equalizer Waveform Animation */}
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

          {/* Center Play/Pause Primary Dial */}
          <button
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-primary hover:bg-body-strong text-white shadow-lg flex items-center justify-center transition-all active:scale-90"
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
