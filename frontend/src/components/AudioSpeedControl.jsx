import React, { useContext, useEffect, useState } from 'react';
import { AudioContext } from '@/context/AudioContext';
import styles from "../css/Audio.module.css"; // Import CSS module

export default function AudioSpeedControl() {
  const { wavesurferRef } = useContext(AudioContext);
  const [playbackRate, setPlaybackRate] = useState(1.0); // State for audio speed

  // Effect to adjust playback rate whenever playbackRate changes
  useEffect(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.setPlaybackRate(playbackRate);
    }
  }, [playbackRate, wavesurferRef]);

  const handlePlaybackRateChange = (e) => {
    setPlaybackRate(parseFloat(e.target.value));
  };

  return (
    <div className={styles.audioControlContainer}>
      <label htmlFor="playbackRate" className={styles.playbackLabel}>
        {playbackRate.toFixed(1)}x
      </label>
      <input
        id="playbackRate"
        type="range"
        min="0.5"
        max="2.0"
        step="0.1"
        value={playbackRate}
        onChange={handlePlaybackRateChange}
        className={styles.playbackSlider}
      />
    </div>
  );
}
