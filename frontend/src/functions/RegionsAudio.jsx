import React, { useContext, useEffect } from 'react';
import { AudioContext } from '@/context/AudioContext';
import styles from "../css/Audio.module.css"; // Import CSS module

export default function RegionsAudio() {
  const { wavesurferRef } = useContext(AudioContext);

  useEffect(() => {
    if (wavesurferRef.current) {
      const addRegion = () => {
        wavesurferRef.current.addRegion({
          start: 10, // Thời gian bắt đầu (giây)
          end: 20,   // Thời gian kết thúc (giây)
          color: 'rgba(0, 123, 255, 0.2)', // Màu sắc của vùng
          drag: true,    // Cho phép kéo vùng
          resize: true,  // Cho phép thay đổi kích thước vùng
        });
        console.log('Region added');
      };

      // Kiểm tra xem WaveSurfer đã sẵn sàng chưa
      if (wavesurferRef.current.isReady || wavesurferRef.current.getDuration() > 0) {
        console.log('WaveSurfer already ready');
        addRegion();
      } else {
        console.log('Waiting for WaveSurfer to be ready');
        wavesurferRef.current.on('ready', addRegion);
      }

      // Lắng nghe sự kiện khi vùng được tạo hoặc thay đổi
      const onRegionCreated = (region) => {
        console.log('Region created:', region);
      };
      const onRegionUpdated = (region) => {
        console.log('Region updated:', region);
      };
      const onRegionRemoved = (region) => {
        console.log('Region removed:', region);
      };

      wavesurferRef.current.on('region-created', onRegionCreated);
      wavesurferRef.current.on('region-updated', onRegionUpdated);
      wavesurferRef.current.on('region-removed', onRegionRemoved);

      // Cleanup function
      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.un('ready', addRegion);
          wavesurferRef.current.un('region-created', onRegionCreated);
          wavesurferRef.current.un('region-updated', onRegionUpdated);
          wavesurferRef.current.un('region-removed', onRegionRemoved);
        }
      };
    }
  }, [wavesurferRef]);

  return (
    <div className={styles.regionsContainer}>
      <h3>Quản Lý Vùng Âm Thanh</h3>
      <p>Thêm, sửa, xóa các vùng âm thanh trực tiếp trên waveform.</p>
    </div>
  );
}
