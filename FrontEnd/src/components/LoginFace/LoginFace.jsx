import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from 'axios';

function FaceLogin({ onLoginSuccess, toast, navigate }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loadingCamera, setLoadingCamera] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        setLoadingModels(false);
      } catch (error) {
        console.error("Lỗi tải model face-api:", error);
        toast.error("Lỗi tải mô hình nhận diện khuôn mặt");
      }
    };
    loadModels();

    return () => {
      stopVideo();
    };
  }, [toast]);

  const startVideo = async () => {
    setLoadingCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Lỗi mở webcam:", err);
      toast.error("Không thể mở webcam");
      setLoadingCamera(false);
    }
  };

  const stopVideo = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setLoadingCamera(false);
  };

  const handleFaceLogin = async () => {
    if (loadingModels) {
      toast.info('Đang tải mô hình, vui lòng đợi...');
      return;
    }
    await startVideo();

    setTimeout(async () => {
      if (!videoRef.current) {
        stopVideo();
        return;
      }

      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detections) {
        toast.error('Không phát hiện khuôn mặt. Vui lòng thử lại.');
        stopVideo();
        return;
      }

      const faceDescriptor = Array.from(detections.descriptor);

      try {
        const res = await axios.post('http://localhost:3000/api/loginByFace', { faceDescriptor });
        localStorage.setItem('user', JSON.stringify(res.data));
        toast.success('Đăng nhập bằng khuôn mặt thành công!');
        stopVideo();
        if (onLoginSuccess) onLoginSuccess();
        else navigate('/dashboardadmin');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Đăng nhập bằng khuôn mặt thất bại');
        stopVideo();
      }
    }, 3000);
  };

  return (
    <div>
      <button type="button" disabled={loadingCamera} onClick={handleFaceLogin}>
        {loadingCamera ? 'Đang mở camera...' : 'Đăng nhập bằng khuôn mặt'}
      </button>
      {loadingCamera && (
        <button type="button" onClick={stopVideo} style={{ marginLeft: '10px' }}>
          Tắt camera
        </button>
      )}
      <video ref={videoRef} autoPlay muted width="320" height="240" />
    </div>
  );
}

export default FaceLogin;
