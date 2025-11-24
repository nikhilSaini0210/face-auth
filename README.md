🔐 Face Authentication App
A React Native mobile application that implements custom face recognition for user authentication without relying on device biometric APIs. Built with TypeScript, React Native CLI, and ML Kit for Android.


📱 Features

Custom Face Recognition - Implements face detection and matching without using native biometric APIs
Real-time Camera - Front-facing camera with live preview and capture
Face Detection - Uses ML Kit to detect faces in images
Face Comparison - Compares captured face with stored reference using embeddings
Similarity Scoring - Provides match percentage using cosine similarity
Beautiful UI - Clean, modern interface with smooth animations
Error Handling - Comprehensive error handling and user feedback

🎯 How It Works

Reference Image Setup - Store a reference face image for comparison
Face Capture - User captures their face using front camera
Face Detection - ML Kit detects faces in both images
Feature Extraction - Extracts facial features (landmarks, bounds, angles)
Embedding Generation - Creates 128-dimensional face embeddings
Similarity Calculation - Computes cosine similarity between embeddings
Authentication Result - Shows success/failure based on similarity threshold (≥50%)

🏗️ Architecture

src/
├── components/          # Reusable UI components
│   └── Face/
│       ├── LoadingOverlay.tsx
│       └── PrimaryButton.tsx
├── screens/            # Screen components
│   └── Face/
│       ├── FaceauthScreen.tsx    # Home screen
│       ├── CameraScreen.tsx       # Camera capture screen
│       └── ResultScreen.tsx       # Result display screen
├── services/           # Business logic
│   └── FaceRecognitionService.ts  # Face detection & comparison
├── types/              # TypeScript type definitions
│   └── index.ts
└── assets/
    └── images/
        └── reference_face.jpg  # Reference face image