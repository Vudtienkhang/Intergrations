import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import styles from './styles.module.scss';

function FaceRegister({ employeeId, onRegisterSuccess, onCancel }) {
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models'; 
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        startCamera();
      } catch (err) {
        console.error(err);
        setError('Không tải được mô hình nhận diện khuôn mặt');
      } finally {
        setLoading(false);
      }
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setError('Không thể truy cập camera');
      }
    };

    loadModels();

    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = async () => {
    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setError('Không nhận diện được khuôn mặt. Vui lòng thử lại');
      return;
    }

    onRegisterSuccess(detection.descriptor);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Quét khuôn mặt nhân viên</h3>

        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <p>Đang tải mô hình...</p>
        ) : (
          <>
            <video ref={videoRef} autoPlay muted width="300" height="225" className={styles.video} />
            <div className={styles.buttons}>
              <button onClick={handleCapture}>Lưu khuôn mặt</button>
              <button onClick={onCancel}>Hủy</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FaceRegister;
