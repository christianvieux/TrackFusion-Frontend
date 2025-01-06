import React, { useEffect, useState } from "react";
import { Slider, Button } from "@nextui-org/react";
import { Volume2, Volume1, VolumeX } from "lucide-react";

const VolumeSlider = ({ className, onChange, defaultValue = 40, isDisabled=false, ...rest }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(defaultValue);
  const [previousVolume, setPreviousVolume] = useState(defaultValue);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      setIsMobile(/iphone|ipad|ipod|android/.test(userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleVolumeChange = (value) => {
    setCurrentVolume(value);
    setPreviousVolume(value);
    setIsMuted(value === 0);
    
    if (onChange) {
      onChange(value);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setCurrentVolume(previousVolume);
      setIsMuted(false);
      if (onChange) {
        onChange(previousVolume);
      }
    } else {
      setPreviousVolume(currentVolume);
      setCurrentVolume(0);
      setIsMuted(true);
      if (onChange) {
        onChange(0);
      }
    }
  };

  const VolumeIcon = () => {
    if (isMuted || currentVolume === 0) {
      return <VolumeX className="w-5 h-5" />;
    }
    if (currentVolume < 50) {
      return <Volume1 className="w-5 h-5" />;
    }
    return <Volume2 className="w-5 h-5" />;
  };

  if (isMobile) {
    return (
      <div className={`text-sm text-gray-500 py-2 text-wrap ${isDisabled ? "opacity-50" : ""} ${className}`}>
        Please use device volume controls
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        isIconOnly
        variant="light"
        onPress={handleMuteToggle}
        className="p-2 hover:!bg-transparent rounded-full transition-colors duration-200"
        isDisabled={isDisabled}
      >
        <VolumeIcon />
      </Button>
      <Slider
        isDisabled={isDisabled}
        aria-label="Volume"
        size="sm"
        className={className}
        defaultValue={defaultValue}
        value={currentVolume}
        onChange={handleVolumeChange}
        {...rest}
      />
    </div>
  );
};

export default VolumeSlider;