export enum UserRole {
  SEEKER = 'SEEKER',
  EMPLOYER = 'EMPLOYER'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
  phone?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Job {
  id: string;
  title: string; // e.g., Garson, Aşçı
  companyName: string;
  description: string;
  salary: string;
  location: LocationData;
  employerId: string;
  employerName: string;
  postedAt: Date;
  isAiGenerated?: boolean; // To distinguish between internal DB jobs and Maps Grounding results
  mapsUri?: string; // If found via Google Maps Grounding
}

export interface SearchFilters {
  query: string;
  radiusKm: number;
}