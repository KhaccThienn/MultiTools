import React, { useContext, useEffect, useRef, useState } from 'react';
import InputFile from './InputFile';
import { AudioContext } from '@/context/AudioContext';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'; // Import đúng cách
import styles from "../css/Audio.module.css";  // Import CSS module
import AudioSpeedControl from './AudioSpeedControl';  // Import AudioSpeedControl component

export default function AudioDisplay({ mode }) {
  const { currentAudio, setInitialAudio, audioUrl, setAudioUrl, waveformRef, wavesurferRef } = useContext(AudioContext);
  const hoverRef = useRef(null);
  const timeRef = useRef(null);
  const durationRef = useRef(null);
  const [isPlay, setIsPlay] = useState(false);

  useEffect(() => {
    if (currentAudio) {
      if (currentAudio instanceof File) {
        const url = URL.createObjectURL(currentAudio);
        setAudioUrl(url);

        // Revoke URL khi không cần thiết
        return () => {
          URL.revokeObjectURL(url);
        };
      } else if (typeof currentAudio === "string") {
        setAudioUrl(currentAudio);
      }
    } else {
      setAudioUrl(null);
    }
  }, [currentAudio]);

  useEffect(() => {
    // Chỉ thực hiện nếu đang trong môi trường trình duyệt và có audioUrl
    if (typeof window !== 'undefined' && audioUrl) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Định nghĩa gradient cho waveform
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
      gradient.addColorStop(0, '#656666'); // Màu trên cùng
      gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666'); // Màu trên cùng
      gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // Đường trắng
      gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // Đường trắng
      gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1'); // Màu dưới cùng
      gradient.addColorStop(1, '#B1B1B1'); // Màu dưới cùng

      // Định nghĩa gradient cho progress
      const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
      progressGradient.addColorStop(0, '#EE772F'); // Màu trên cùng
      progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926'); // Màu trên cùng
      progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff'); // Đường trắng
      progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff'); // Đường trắng
      progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094'); // Màu dưới cùng
      progressGradient.addColorStop(1, '#F6B094'); // Màu dưới cùng

      // Tạo waveform với RegionsPlugin
      if (waveformRef.current && !wavesurferRef.current) {
        wavesurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: gradient,
          progressColor: progressGradient,
          barWidth: 2,
          url: audioUrl,
          plugins: [
            RegionsPlugin.create({
              dragSelection: {
                slop: 5,
              },
            }),
          ],
        });

        // Play/Pause khi click
        wavesurferRef.current.on('interaction', () => {
        });

        // Hiệu ứng hover
        if (hoverRef.current) {
          waveformRef.current.addEventListener('pointermove', (e) => {
            hoverRef.current.style.width = `${e.offsetX}px`;
          });
        }

        // Định dạng thời gian
        const formatTime = (seconds) => {
          const minutes = Math.floor(seconds / 60);
          const secondsRemainder = Math.round(seconds) % 60;
          const paddedSeconds = `0${secondsRemainder}`.slice(-2);
          return `${minutes}:${paddedSeconds}`;
        };

        // Cập nhật thời gian và duration
        if (timeRef.current && durationRef.current) {
          wavesurferRef.current.on('ready', () => {
            console.log('WaveSurfer is ready');
            durationRef.current.textContent = formatTime(wavesurferRef.current.getDuration());
          });
          wavesurferRef.current.on('audioprocess', (currentTime) => {
            timeRef.current.textContent = formatTime(currentTime);
          });
        }
      }

      // Cleanup khi component bị unmount hoặc audioUrl thay đổi
      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
          wavesurferRef.current = null;
        }
      };
    }
  }, [audioUrl, waveformRef, wavesurferRef]);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        paddingTop: "10px",
        height: "100%",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#2e2e2e",
        margin: '20px', // 20px margin around the container
      }}
    >
      {audioUrl ? (
        <>
          <div className={styles.waveform} ref={waveformRef}>
            <div className={styles.time} ref={timeRef}>0:00</div>
            <div className={styles.duration} ref={durationRef}>0:00</div>
            <div className={styles.hover} ref={hoverRef}></div>
          </div>

          <div className={styles.buttonGroup}>
            <div
              className={styles.loader}
              style={{
                transform: 'rotate(360deg)',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => wavesurferRef.current.skip(-15)}
            >
              -15s
            </div>

            <div
              className={styles.loader}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setIsPlay(!isPlay);
                wavesurferRef.current.playPause();
              }}
            >
              {isPlay ? (
                <div className={styles.loading}>
                  <div className={styles.load}></div>
                  <div className={styles.load}></div>
                  <div className={styles.load}></div>
                  <div className={styles.load}></div>
                </div>
              ) : (
                <div className={styles.play}></div>
              )}
            </div>

            <div
              className={styles.loader}
              style={{
                transform: 'rotate(360deg)',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => wavesurferRef.current.skip(15)}
            >
              +15s
            </div>
          </div>

          <AudioSpeedControl /> {/* Thêm component điều chỉnh tốc độ */}
        </>
      ) : (
        /* Input File Component */
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: '100%',
          }}
        >
          <InputFile setFile={setInitialAudio} type="Audio" />
        </div>
      )}
    </div>
  );
}
