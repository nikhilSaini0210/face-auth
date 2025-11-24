export type Screen = 'home' | 'camera' | 'result';
export type ResultType = 'success' | 'failed' | null;

export interface FaceEmbedding {
  data: number[];
}

export interface FaceComparisonResult {
  match: boolean;
  similarity: number;
}

export type IconFamily =
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'AntDesign'
  | 'MaterialIcons';
