'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Track } from '@/lib/types';
import { recordTrackPlay } from '@/lib/record-play';
import { FavoriteButton } from './favorite-button';

interface MusicPlayerProps {
  tracks: Track[];
  initialIndex?: number;
  className?: string;
}

export function MusicPlayer({ tracks, initialIndex = 0, className = '' }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'one' | 'all'>('none');
  // Derived directly from tracks/currentIndex rather than synced via an
  // effect — it never needs to be anything other than tracks[currentIndex].
  const currentTrack = tracks[currentIndex];

  const shuffleArray = useCallback((arr: Track[]) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const handleNext = useCallback(() => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= tracks.length) {
      if (repeat === 'all' || (repeat === 'one' && isPlaying)) {
        nextIndex = 0;
      } else {
        return;
      }
    }
    if (isShuffle) {
      const shuffled = shuffleArray(tracks);
      const newIndex = shuffled.findIndex((t) => t.id === tracks[currentIndex].id) + 1;
      setCurrentIndex(newIndex % tracks.length);
    } else {
      setCurrentIndex(nextIndex);
    }
    setIsPlaying(true);
  }, [currentIndex, isPlaying, isShuffle, repeat, shuffleArray, tracks]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.duration > 0 ? (audio.currentTime / audio.duration) * 100 : 0);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.volume = volume;
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', handleNext);
    };
  }, [volume, handleNext]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !tracks[currentIndex]) return;

    const track = tracks[currentIndex];

    if (track.audio_url) {
      audio.src = track.audio_url;
    } else if (track.embed_url) {
      // Fallback to external open for embeds
      window.open(track.embed_url, '_blank');
      return;
    }

    audio.load();
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentIndex, tracks]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  // NOTE: handleNext is defined above as a memoized callback.
  // This duplicate implementation was removed to avoid build errors.


  const handlePrev = () => {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = tracks.length - 1;
    setCurrentIndex(prevIndex);
    setIsPlaying(true);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = (Number(e.target.value) / 100) * audio.duration;
      audio.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 100;
    setVolume(newVolume);
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const cycleRepeat = () => {
    setRepeat(repeat === 'none' ? 'one' : repeat === 'one' ? 'all' : 'none');
  };

  if (!tracks.length) return <p className="text-[color:var(--text-dark-muted)]">No tracks available</p>;

  return (
    <div className={`music-player bg-gradient-to-b from-[var(--bg-card)] to-pink-100 border border-[color:var(--border-soft)] rounded-2xl p-6 space-y-6 shadow-2xl ${className}`}>
      {/* Now Playing */}
      <div className="flex items-center gap-4">
        <img
          src="/ea.jpg" // Ewura Abena cover fallback
          alt={currentTrack?.title}
          className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-lg truncate">{currentTrack?.title}</h3>
          <p className="text-sm text-[color:var(--text-dark-muted)] truncate">Ewura Abena</p>
        </div>
        <FavoriteButton trackId={currentTrack?.id || ''} theme="light" />
      </div>

      {/* Audio/Embed */}
      {currentTrack?.audio_url ? (
        <audio
          ref={audioRef}
          className="w-full"
          preload="metadata"
          onPlay={() => recordTrackPlay(currentTrack?.id)}
        >
          <source src={currentTrack.audio_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <div className="h-20 flex items-center justify-center bg-[color:var(--soft-pearl)] rounded-xl text-sm text-[color:var(--text-dark-muted)]">
          Open external player: {currentTrack?.youtube_url ? <a href={currentTrack.youtube_url} target="_blank" className="text-[color:var(--royal-gold)] underline">YouTube</a> : 'No audio'}
        </div>
      )}

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-6">
          <button onClick={toggleShuffle} className={`p-2 rounded-full transition-all ${isShuffle ? 'bg-[color:var(--royal-gold)]/20 text-[color:var(--royal-gold)]' : 'text-[color:var(--text-dark-muted)] hover:text-[color:var(--kente-green)]'}`}>
            🔀
          </button>
          <button onClick={handlePrev} className="p-3 text-2xl hover:scale-110 transition-all">⏮</button>
            <button onClick={togglePlay} className="w-16 h-16 bg-[color:var(--royal-gold)]/20 hover:bg-[color:var(--royal-gold)]/40 rounded-full flex items-center justify-center text-2xl font-bold shadow-xl transition-all">
            {isPlaying ? '⏸' : '▶'}
          </button>
          <button onClick={handleNext} className="p-3 text-2xl hover:scale-110 transition-all">⏭</button>
          <button onClick={cycleRepeat} className={`p-2 rounded-full transition-all ${repeat !== 'none' ? 'bg-[color:var(--royal-gold)]/20 text-[color:var(--royal-gold)]' : 'text-[color:var(--text-dark-muted)] hover:text-[color:var(--kente-green)]'}`}>
            {repeat === 'one' ? '🔂' : repeat === 'all' ? '🔁' : '↻'}
          </button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{Math.floor(progress / 100 * duration / 60) || 0}:{Math.floor((progress / 100 * duration) % 60)?.toString().padStart(2, '0') || '0:00'}</span>
            <span>{Math.floor(duration / 60) || 0}:{Math.floor(duration % 60)?.toString().padStart(2, '0') || '0:00'}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-2 bg-[color:var(--border-soft)] rounded-lg appearance-none cursor-pointer accent-gold [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[color:var(--text-dark-muted)]">Vol</span>
          <input
            type="range"
            min="0"
            max="100"
            value={volume * 100}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-[color:var(--border-soft)] rounded-lg appearance-none cursor-pointer accent-gold [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>

      {/* Tracklist */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        <h4 className="font-semibold text-[color:var(--royal-gold)] uppercase tracking-wide text-xs">Playlist ({tracks.length} tracks)</h4>
        {tracks.map((track, index) => (
          <button
            key={track.id}
            onClick={() => setCurrentIndex(index)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group hover:bg-[color:var(--royal-gold)]/10 ${index === currentIndex ? 'bg-[color:var(--royal-gold)]/20 ring-2 ring-[color:var(--royal-gold)]/50' : ''}`}
          >
            <span className={`text-xl font-bold ${index === currentIndex ? 'text-[color:var(--royal-gold)]' : 'text-[color:var(--text-dark-muted)]'} flex-shrink-0`}>
              {index + 1}
            </span>
            <div className="min-w-0 flex-1 text-left">
              <p className="font-medium truncate">{track.title}</p>
              <p className="text-xs text-[color:var(--text-dark-muted)] truncate">Ewura Abena</p>
            </div>
            <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-[color:var(--royal-gold)] whitespace-nowrap flex-shrink-0">
              {track.duration_seconds ? `${Math.floor(track.duration_seconds / 60)}:${(track.duration_seconds % 60).toString().padStart(2, '0')}` : '--:--'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

