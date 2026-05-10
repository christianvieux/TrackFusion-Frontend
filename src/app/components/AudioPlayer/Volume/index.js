"use client";

import { useEffect, useState } from "react";
import { Button, Slider } from "@heroui/react";
import { Volume2, Volume1, VolumeX } from "lucide-react";

export default function VolumeSlider({
  className = "",
  onChange,
  defaultValue = 0.8,
  isDisabled = false,
  ...props
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [volume, setVolume] = useState(defaultValue);
  const [previousVolume, setPreviousVolume] = useState(defaultValue);

  const isMuted = volume === 0;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/iphone|ipad|ipod|android/i.test(navigator.userAgent));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  function updateVolume(value) {
    setVolume(value);

    if (value > 0) {
      setPreviousVolume(value);
    }

    onChange?.(value);
  }

  function toggleMute() {
    updateVolume(isMuted ? previousVolume || defaultValue : 0);
  }

  function getVolumeIcon() {
      const Icon = isMuted ? VolumeX : volume < 0.5 ? Volume1 : Volume2

      return <Icon className="w-full h-full m-0 teeeeeest" />
  }

  if (isMobile) return null;

  return (
    <div
      className={`flex items-center gap-2 text-player-muted ${
        isDisabled ? "opacity-50" : ""
      } ${className}`}
    >
      <Button
        isIconOnly
        variant="light"
        aria-label={isMuted ? "Unmute volume" : "Mute volume"}
        onPress={toggleMute}
        isDisabled={isDisabled}
        className="size-5 min-w-0 bg-transparent p-0 text-player-muted hover:bg-transparent"
      >
        {getVolumeIcon()}
      </Button>

      <Slider
        aria-label="Volume"
        value={volume}
        minValue={0}
        maxValue={1}
        step={0.01}
        onChange={updateVolume}
        isDisabled={isDisabled}
        className="w-32 flex justify-center items-center"
        {...props}
      >
        <Slider.Track className="h-1 rounded-full bg-player-line border-0">
          <Slider.Fill className="rounded-full bg-player-muted" />
          <Slider.Thumb className="size-5 border-2 border-player-muted bg-player-accent" />
        </Slider.Track>
      </Slider>
    </div>
  );
}