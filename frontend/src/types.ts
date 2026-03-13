export type FaultType = 'GRID FAILURE' | 'PREDICTIVE ALERT' | 'LOCALIZED ISSUE';
export type SensorStatus = 'Critical' | 'Warning' | 'Normal';

export interface UserMetadata {
  userId: string;
  trustScore: number;
  villageProfile: string;
  hardwareDNA: {
    inverterModel: string;
    batteryModel: string;
    criticalLoad: 'Clinic' | 'School' | 'Water Pump' | 'Residential';
  };
}

export interface RawFaultReport {
  reportId: string;
  userId: string;
  gps: { lat: number; lng: number };
  category: FaultType;
  mediaPayload: {
    photoUrls: string[];
    voiceNoteUrl?: string;
  };
  timestamp: number;
}

export interface FaultTicket {
  id: string;
  village: string;
  gridId: string;
  type: FaultType;
  priorityScore: number;
  reports: number;
  distanceKm: number;
  velocity?: number;
  sensorStatus: SensorStatus;
  timestamp: string;
  affectedPopulation: number;
  sensorVerified: boolean;
  description: string;
  impactTags?: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  hardwareDNA?: UserMetadata['hardwareDNA'];
}

export interface ImpactWeights {
  faultType: Record<FaultType, number>;
  priorityUserFactor: number; // e.g., multiplier for health clinics or schools
}

export type UserRole = 'Villager' | 'Technician' | 'Admin' | 'Developer' | 'Lead Commander';

export interface UserIdentity {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  village: string;
  district: string;
  role: UserRole;
  avatarUrl?: string;
  trustScore: number;
  credits: number;
  status: 'online' | 'offline';
}

export type ComplaintCategory = 
  | 'NO_POWER' 
  | 'PANEL_DAMAGE' 
  | 'BATTERY_ISSUE' 
  | 'INVERTER_FAULT' 
  | 'WIRING_ISSUE' 
  | 'OVERHEATING' 
  | 'UNKNOWN';

export type SeverityLevel = 'CRITICAL' | 'MEDIUM' | 'MINOR';

export interface ApplianceLoad {
  type: string;
  count: number;
  isCritical: boolean;
}

export interface SolarSystemDetails {
  numPanels: number;
  panelCapacity: string;
  batteryType: string;
  batteryCapacity: string;
  inverterModel: string;
  installationYear: number;
}

export interface VillagerProfile {
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  altPhone?: string;
  village: string;
  district: string;
  state: string;
  landmark?: string;
  familyMembers: number;
}

export interface ComplaintReport {
  id: string;
  userId: string;
  villageId: string;
  profile: VillagerProfile;
  solarSystem: SolarSystemDetails;
  category: ComplaintCategory;
  severity: SeverityLevel;
  startTime: string;
  frequency: string;
  description?: string;
  appliances: string[];
  gps: { lat: number; lng: number };
  media: {
    photoUrls: string[];
    voiceUrl?: string;
    sttTranscript?: string;
  };
  stepNotes?: Record<number, string>;
  status: 'RECEIVED' | 'UNDER_REVIEW' | 'TECHNICIAN_ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: number;
  priorityScore?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  intent?: string;
  tools?: string[];
  diagnosis?: string;
  recommendedKit?: string[];
}
