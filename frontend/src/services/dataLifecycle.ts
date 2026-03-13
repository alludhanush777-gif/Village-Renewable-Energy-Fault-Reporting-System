import { RawFaultReport, UserMetadata, FaultTicket, FaultType } from '../types';
import { calculatePriorityScore } from '../utils/impactMatrix';

/**
 * Sentinel Data Lifecycle Engine
 * Handles Ingestion, Enrichment, Clustering, Scoring, and Verification.
 */
class DataLifecycleEngine {
  private activeTickets: Map<string, FaultTicket> = new Map();

  /**
   * 1. THE INGESTION & ENRICHMENT LOGIC
   * Attaches Solar System DNA to raw reports.
   */
  async ingestReport(report: RawFaultReport, userMetadata: UserMetadata): Promise<FaultTicket> {
    console.log(`[Ingestion] Processing report ${report.reportId} from user ${userMetadata.userId}`);

    // 2. THE "INTELLIGENCE LAYER" (Deduplication & Clustering)
    const existingTicket = this.findCluster(report.gps);
    
    if (existingTicket) {
      return this.updateCluster(existingTicket, report, userMetadata);
    }

    return this.createNewTicket(report, userMetadata);
  }

  /**
   * Spatial-Temporal Deduplication
   * Radius: 500m, Time: 60 mins
   */
  private findCluster(gps: { lat: number; lng: number }): FaultTicket | null {
    const RADIUS_KM = 0.5;
    const NOW = Date.now();

    for (const ticket of this.activeTickets.values()) {
      const distance = this.calculateDistance(gps, ticket.coordinates);
      const timeDiff = (NOW - new Date(ticket.timestamp).getTime()) / (1000 * 60);

      if (distance <= RADIUS_KM && timeDiff <= 60) {
        return ticket;
      }
    }
    return null;
  }

  private async createNewTicket(report: RawFaultReport, user: UserMetadata): Promise<FaultTicket> {
    const isCritical = user.hardwareDNA.criticalLoad !== 'Residential';
    
    const ticket: FaultTicket = {
      id: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      village: user.villageProfile,
      gridId: `GRID-${Math.floor(Math.random() * 9000) + 1000}`,
      type: report.category,
      priorityScore: calculatePriorityScore(report.category, 1, isCritical, user.trustScore),
      reports: 1,
      distanceKm: Math.floor(Math.random() * 50) + 5,
      sensorStatus: 'Warning',
      timestamp: new Date().toISOString(),
      affectedPopulation: 5, // Initial estimate
      sensorVerified: false,
      description: `Reported: ${report.category}. Hardware: ${user.hardwareDNA.inverterModel}`,
      coordinates: report.gps,
      hardwareDNA: user.hardwareDNA,
      impactTags: isCritical ? [user.hardwareDNA.criticalLoad] : []
    };

    this.activeTickets.set(ticket.id, ticket);
    
    // Trigger Sensor Verification Handshake (MQTT Simulation)
    this.triggerSensorVerification(ticket.id);

    return ticket;
  }

  private updateCluster(ticket: FaultTicket, report: RawFaultReport, user: UserMetadata): FaultTicket {
    ticket.reports += 1;
    ticket.affectedPopulation += 5;
    
    const isCritical = ticket.impactTags?.includes('Clinic') || ticket.impactTags?.includes('School') || user.hardwareDNA.criticalLoad !== 'Residential';
    
    ticket.priorityScore = calculatePriorityScore(
      ticket.type, 
      ticket.reports, 
      isCritical, 
      user.trustScore
    );

    if (user.hardwareDNA.criticalLoad !== 'Residential' && !ticket.impactTags?.includes(user.hardwareDNA.criticalLoad)) {
      ticket.impactTags = [...(ticket.impactTags || []), user.hardwareDNA.criticalLoad];
    }

    return ticket;
  }

  /**
   * Sensor Verification Handshake (MQTT)
   */
  private async triggerSensorVerification(ticketId: string) {
    console.log(`[MQTT] Requesting telemetry for ticket ${ticketId}...`);
    
    // Simulate network latency
    setTimeout(() => {
      const ticket = this.activeTickets.get(ticketId);
      if (ticket) {
        ticket.sensorVerified = true;
        ticket.sensorStatus = 'Critical';
        console.log(`[Verification] Ticket ${ticketId} SENSOR VERIFIED`);
        
        // Broadcast update via Socket
        const { socketService } = require('./socketService');
        socketService.emit({
          type: 'TICKET_UPDATED',
          payload: ticket,
          event: 'SENSOR_VERIFIED'
        });
      }
    }, 3000);
  }

  private calculateDistance(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
    const R = 6371; // Earth radius in km
    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLng = (p2.lng - p1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

export const dataLifecycle = new DataLifecycleEngine();
