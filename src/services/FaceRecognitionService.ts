import { FaceEmbedding, FaceComparisonResult } from '../types';

class FaceRecognitionService {
  private static SIMILARITY_THRESHOLD = 0.5;

  static async detectFace(imageUri: string): Promise<boolean> {
    try {
      return new Promise(resolve => {
        setTimeout(() => resolve(Math.random() > 0.1), 1000);
      });
    } catch (error) {
      console.error('Face detection error:', error);
      return false;
    }
  }

  static async extractEmbedding(imageUri: string): Promise<FaceEmbedding> {
    try {
      return new Promise(resolve => {
        setTimeout(() => {
          const embedding = Array.from({ length: 128 }, () => Math.random());
          resolve({ data: embedding });
        }, 1500);
      });
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

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  static euclideanDistance(
    embedding1: FaceEmbedding,
    embedding2: FaceEmbedding,
  ): number {
    const a = embedding1.data;
    const b = embedding2.data;

    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += Math.pow(a[i] - b[i], 2);
    }

    return Math.sqrt(sum);
  }

  static async compareFaces(
    capturedImageUri: string,
    referenceImageUri: string,
  ): Promise<FaceComparisonResult> {
    try {
      console.log('Detecting faces...');
      const [capturedHasFace, referenceHasFace] = await Promise.all([
        this.detectFace(capturedImageUri),
        this.detectFace(referenceImageUri),
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
        this.extractEmbedding(referenceImageUri),
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

  private static async preprocessImage(imageUri: string): Promise<any> {
    return null;
  }
}

export default FaceRecognitionService;
