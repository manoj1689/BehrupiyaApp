import * as faceapi from 'face-api.js';
import React, { useEffect, useState } from 'react';
import correct from "../../../public/images/New/correct.png";
import incorrect from "../../../public/images/New/Incorrect.png";

const FaceDetectionWithFaceAPI = ({ uploadedImage }) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isFaceDetected, setIsFaceDetected] = useState(false);

  const loadModels = async () => {
    try {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models/ssd_mobilenetv1_model-weights_manifest.json');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68_model-weights_manifest.json');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models/face_recognition_model-weights_manifest.json');
      console.log('Models loaded successfully');
      setModelsLoaded(true);
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleImageLoad = async (img) => {
    if (modelsLoaded && img) {
      const detections = await faceapi.detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceDescriptors();

      console.log('Detections:', detections);
      setIsFaceDetected(detections.length > 0);
    }
  };

  return (
    <div className="relative w-full h-full"> {/* Set relative positioning for the parent div */}
      {/* Show the correct image if a face is detected, otherwise show the incorrect image */}
      <img 
        src={isFaceDetected ? "/images/New/correct.png" : "/images/New/Incorrect.png" } 
        alt={isFaceDetected ? 'Correct' : 'Incorrect'} 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20" 
      />
      <img
        src={URL.createObjectURL(uploadedImage)}
        alt={uploadedImage.name}
        onLoad={(event) => handleImageLoad(event.target)}
        className="w-full h-full object-contain bg-gray-800"
      />
    </div>
  );
};

export default FaceDetectionWithFaceAPI;





