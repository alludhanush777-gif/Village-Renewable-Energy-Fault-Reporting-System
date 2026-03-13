import { ComplaintReport, ComplaintCategory, ApplianceLoad } from '../types';
import { dataLifecycle } from './dataLifecycle';

/**
 * Sentinel Reporter Service
 * Handles Offline-First logic, Photo Compression, and Neural Handshake.
 */
class ReporterService {
  private offlineQueue: ComplaintReport[] = [];

  /**
   * PILLAR 3: Intelligent Photo Pipeline
   * Simulates shrinking high-res photos to <50KB.
   */
  async compressPhoto(file: File): Promise<string> {
    console.log(`[Compression] Shrinking ${file.name} (${(file.size / 1024).toFixed(2)}KB) to <50KB...`);
    // Simulated compression delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return `https://sentinel-storage.cdn/compressed_${Math.random().toString(36).substr(2, 5)}.jpg`;
  }

  /**
   * PILLAR 4: The Neural Handshake
   * Submits fault and triggers Impact Matrix injection.
   */
  async submitFault(report: Partial<ComplaintReport>): Promise<ComplaintReport> {
    const ticketId = `VRF-${Math.floor(Math.random() * 90000) + 10000}`;
    
    const fullReport: ComplaintReport = {
      id: ticketId,
      userId: report.userId || 'USR-DEFAULT',
      villageId: report.villageId || 'VIL-DEFAULT',
      profile: report.profile || {
        fullName: 'Unknown',
        age: 0,
        gender: 'Other',
        phone: '',
        village: '',
        district: '',
        state: '',
        familyMembers: 1
      },
      solarSystem: report.solarSystem || {
        numPanels: 0,
        panelCapacity: '',
        batteryType: '',
        batteryCapacity: '',
        inverterModel: '',
        installationYear: 2024
      },
      category: report.category || 'NO_POWER',
      severity: report.severity || 'MEDIUM',
      startTime: report.startTime || 'Just now',
      frequency: report.frequency || 'First time',
      appliances: report.appliances || [],
      gps: report.gps || { lat: -1.2921, lng: 36.8219 },
      media: report.media || { photoUrls: [] },
      status: 'RECEIVED',
      createdAt: Date.now(),
      description: report.description
    };

    // Simulate Network Check
    const isOnline = navigator.onLine;

    if (!isOnline) {
      console.log('[Offline] Saving report to local cache (Hive/SQLite simulation)...');
      this.offlineQueue.push(fullReport);
      return { ...fullReport, status: 'RECEIVED' }; // Status remains received but locally saved
    }

    console.log(`[API] POST /api/v1/reporter/submit-fault -> ${ticketId}`);
    
    // Trigger Impact Matrix Injection via DataLifecycle
    // In a real app, this would be a backend call
    const mockUserMetadata = {
      userId: fullReport.userId,
      trustScore: 0.9,
      villageProfile: 'Omo Valley',
      hardwareDNA: {
        inverterModel: 'Growatt SPF 5000ES',
        batteryModel: 'Tesla Powerwall 2',
        criticalLoad: 'Residential' as const
      }
    };

    // This simulates the backend processing the report and updating the dashboard
    // await dataLifecycle.ingestReport(...)

    return { ...fullReport, status: 'UNDER_REVIEW' };
  }

  /**
   * PILLAR 7: Rural Connectivity Fallback
   * Generates a formatted SMS string for USSD/SMS fallback.
   */
  generateSmsFallback(report: Partial<ComplaintReport>): string {
    const code = report.category === 'NO_POWER' ? '1' : 
                 report.category === 'PANEL_DAMAGE' ? '2' : 
                 report.category === 'BATTERY_ISSUE' ? '3' : '0';
    return `SENTINEL*${report.userId}*${code}*${report.gps?.lat.toFixed(4)},${report.gps?.lng.toFixed(4)}`;
  }
}

export const reporterService = new ReporterService();
