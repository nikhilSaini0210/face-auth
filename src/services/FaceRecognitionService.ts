import { FaceEmbedding, FaceComparisonResult } from '../types';
import FaceDetection from '@react-native-ml-kit/face-detection';
import RNFS from 'react-native-fs';

class FaceRecognitionService {
  private static SIMILARITY_THRESHOLD = 0.5;
  private static FACE_DETECTION_OPTIONS = {
    performanceMode: 'accurate',
    landmarkMode: 'all',
    classificationMode: 'all',
    minFaceSize: 0.15,
    contourMode: 'all',
  } as const;

  private static async getImagePath(imageUri: string): Promise<string> {
    try {
      let formattedUri = imageUri;
      if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
        try {
          const filename = `ref_${Date.now()}${Math.random()
            .toString(36)
            .slice(2, 8)}.jpg`;
          const toFile = `${RNFS.CachesDirectoryPath}/${filename}`;

          console.log(`detectFace: downloading http resource to ${toFile}`);

          const download = RNFS.downloadFile({ fromUrl: imageUri, toFile });
          const result = await download.promise;

          if (result.statusCode >= 200 && result.statusCode < 300) {
            formattedUri = `file://${toFile}`;
          } else {
            console.warn(
              'detectFace: failed to download reference image, status:',
              result.statusCode,
            );
            formattedUri = imageUri;
          }
        } catch (downloadError) {
          console.warn('detectFace: error downloading image:', downloadError);
          formattedUri = imageUri;
        }
      } else if (!imageUri.startsWith('file://')) {
        formattedUri = `file://${imageUri}`;
      }
      return formattedUri;
    } catch (error) {
      console.error('getImagePath error:', error);
      return imageUri;
    }
  }

  private static createFeatureVector(face: any): number[] {
    const features: number[] = [];

    const bbox = face.bounds ?? face.boundingBox ?? face.frame ?? {};
    const bx = typeof bbox.x === 'number' ? bbox.x : 0;
    const by = typeof bbox.y === 'number' ? bbox.y : 0;
    const bw = typeof bbox.width === 'number' ? bbox.width : 0;
    const bh = typeof bbox.height === 'number' ? bbox.height : 0;

    features.push(bx / 1000, by / 1000, bw / 1000, bh / 1000);

    features.push(
      (typeof face.headEulerAngleX === 'number' ? face.headEulerAngleX : 0) /
        180,
      (typeof face.headEulerAngleY === 'number' ? face.headEulerAngleY : 0) /
        180,
      (typeof face.headEulerAngleZ === 'number' ? face.headEulerAngleZ : 0) /
        180,
    );

    features.push(
      typeof face.smilingProbability === 'number' ? face.smilingProbability : 0,
      typeof face.leftEyeOpenProbability === 'number'
        ? face.leftEyeOpenProbability
        : 0,
      typeof face.rightEyeOpenProbability === 'number'
        ? face.rightEyeOpenProbability
        : 0,
    );

    const landmarkTypes = [
      'LEFT_EYE',
      'RIGHT_EYE',
      'NOSE_BASE',
      'LEFT_CHEEK',
      'RIGHT_CHEEK',
      'MOUTH_LEFT',
      'MOUTH_RIGHT',
      'BOTTOM_MOUTH',
      'LEFT_EAR',
      'RIGHT_EAR',
    ];

    landmarkTypes.forEach(type => {
      const landmark =
        face.landmarka?.[type] ??
        face.landmarks?.[type] ??
        face.landmark?.[type];
      const lx = landmark && typeof landmark.x === 'number' ? landmark.x : 0;
      const ly = landmark && typeof landmark.y === 'number' ? landmark.y : 0;
      features.push(lx / 1000, ly / 1000);
    });

    const contourTypes = [
      'FACE',
      'LEFT_EYEBROW_TOP',
      'LEFT_EYEBROW_BOTTOM',
      'LEFT_EYE',
      'RIGHT_EYE',
      'UPPER_LIP_TOP',
      'LOWER_LIP_BOTTOM',
      'NOSE_BRIDGE',
      'NOSE_BOTTOM',
    ];

    contourTypes.forEach(type => {
      const contour = face.contours?.[type] ?? face.contour?.[type];
      if (Array.isArray(contour) && contour.length > 0) {
        const first = contour[0] ?? { x: 0, y: 0 };
        const middle = contour[Math.floor(contour.length / 2)] ?? {
          x: 0,
          y: 0,
        };
        const last = contour[contour.length - 1] ?? { x: 0, y: 0 };

        features.push(
          (first.x ?? 0) / 1000,
          (first.y ?? 0) / 1000,
          (middle.x ?? 0) / 1000,
          (middle.y ?? 0) / 1000,
          (last.x ?? 0) / 1000,
          (last.y ?? 0) / 1000,
        );
      } else {
        features.push(0, 0, 0, 0, 0, 0);
      }
    });

    while (features.length < 128) {
      features.push(0);
    }

    return features.slice(0, 128);
  }

  static async detectFace(imageUri: string): Promise<boolean> {
    try {
      const formattedUri = await this.getImagePath(imageUri);

      console.log(`detectFace: using formattedUri: ${formattedUri}`);

      const faces = await FaceDetection.detect(
        formattedUri,
        this.FACE_DETECTION_OPTIONS,
      );

      console.log(
        `Detected ${faces?.length ?? 0} face(s) in image: ${formattedUri}`,
      );

      return Array.isArray(faces) && faces.length > 0;
    } catch (error) {
      console.error('Face detection error:', error);
      return false;
    }
  }

  static async extractEmbedding(imageUri: string): Promise<FaceEmbedding> {
    try {
      const formattedUri = await this.getImagePath(imageUri);

      console.log(`extractEmbedding: using formattedUri: ${formattedUri}`);

      const faces = await FaceDetection.detect(
        formattedUri,
        this.FACE_DETECTION_OPTIONS,
      );

      if (!Array.isArray(faces) || faces.length === 0) {
        throw new Error('No face detected for embedding extraction');
      }

      const face = faces[0];

      const embedding = this.createFeatureVector(face);

      console.log(
        `Extracted embedding of dimension ${embedding.length} from image: ${formattedUri}`,
      );

      return { data: embedding };
    } catch (error) {
      console.error('Embedding extraction error:', error);
      throw error;
    }
  }

  static cosineSimilarity(
    embedding1: FaceEmbedding,
    embedding2: FaceEmbedding,
  ): number {
    const a = embedding1.data;
    const b = embedding2.data;

    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);

    return denominator === 0 ? 0 : dotProduct / denominator;
  }

  static async compareFaces(
    capturedImageUri: string,
    referenceImageUri: string,
  ): Promise<FaceComparisonResult> {
    try {
      console.log('Detecting faces...');

      let refUri = referenceImageUri;
      if (typeof referenceImageUri === 'number') {
        refUri = `${referenceImageUri}` as any;
      }

      const [capturedHasFace, referenceHasFace] = await Promise.all([
        this.detectFace(capturedImageUri),
        this.detectFace(refUri),
      ]);

      if (!capturedHasFace) {
        throw new Error('No face detected in captured image');
      }

      if (!referenceHasFace) {
        throw new Error('No face detected in reference image');
      }

      console.log('Extracting face embeddings...');
      const [capturedEmbedding, referenceEmbedding] = await Promise.all([
        this.extractEmbedding(capturedImageUri),
        this.extractEmbedding(refUri),
      ]);

      console.log('Calculating similarity...');

      const similarity = this.cosineSimilarity(
        capturedEmbedding,
        referenceEmbedding,
      );

      const match = similarity >= this.SIMILARITY_THRESHOLD;

      console.log(`Match: ${match}, Similarity: ${similarity.toFixed(3)}`);

      return { match, similarity };
    } catch (error) {
      console.error('Face comparison error:', error);
      return { match: false, similarity: 0 };
    }
  }
}

export default FaceRecognitionService;
