
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sample audio tracks
  const tracks = [
    {
      id: 1,
      title: "Cricket Match Commentary",
      artist: "Sports Channel",
      src: "https://soundbible.com/mp3/crowd-cheering-outdoor-stadium-02-sound-effect-53854599.mp3"
    },
    {
      id: 2,
      title: "Stadium Ambience",
      artist: "Sound Effects",
      src: "https://soundbible.com/mp3/Sports_Crowd-Lucas_Gonze-1642159696.mp3"
    }
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = tracks[currentTrackIndex];

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgress = () => {
    if (audioRef.current) {
      const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && audioRef.current.duration) {
      const newTime = (value[0] / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
      setVolume(value[0]);
    }
  };

  const handlePrevious = () => {
    setCurrentTrackIndex(prev => 
      prev === 0 ? tracks.length - 1 : prev - 1
    );
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentTrackIndex(prev => 
      prev === tracks.length - 1 ? 0 : prev + 1
    );
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col space-y-4">
      <audio 
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleProgress}
        onEnded={handleNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <Card className="bg-primary/5">
        <CardContent className="pt-6">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold">{currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span>
                {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
              </span>
              <span>
                {audioRef.current && audioRef.current.duration ? 
                  formatTime(audioRef.current.duration) : '0:00'}
              </span>
            </div>
            
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={handleProgressChange}
              className="cursor-pointer"
            />
            
            <div className="flex justify-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handlePrevious}
              >
                <SkipBack />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause /> : <Play />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNext}
              >
                <SkipForward />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioPlayer;
