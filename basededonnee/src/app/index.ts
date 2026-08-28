interface Student {
  id: number;
  annee: number;
  nom: string;
  prenom: string;
  naissance: string;
  section: string;
  sexe: string;
  religion: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

interface EnfantResponse extends ApiResponse {
  enfant: Student;
}

export type { Student, ApiResponse, EnfantResponse };