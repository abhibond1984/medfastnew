export interface DoctorSearchParams {
  problem: string;
  location: string;
  useCurrentLocation: boolean;
  latitude?: number;
  longitude?: number;
}

export interface MapChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    phone?: string; // Added phone number
    address?: string; // Added address
    placeAnswerSources?: {
      reviewSnippets?: {
        snippet: string;
      }[];
    };
  };
}

export interface MedicineDetails {
  name: string;
  purpose: string;
  contents: string;
  dosageInstructions?: string;
  warnings?: string;
}

export interface PrescriptionAnalysisResult {
  medicines: MedicineDetails[];
  summary: string;
}

export enum AppMode {
  FIND_DOCTOR = 'FIND_DOCTOR',
  ANALYZE_PRESCRIPTION = 'ANALYZE_PRESCRIPTION',
  LOCAL_DIRECTORY = 'LOCAL_DIRECTORY',
}