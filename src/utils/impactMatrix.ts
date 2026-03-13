import { FaultType, FaultTicket } from '../types';

const SEVERITY_WEIGHTS: Record<FaultType, number> = {
  'GRID FAILURE': 5.0,
  'PREDICTIVE ALERT': 3.5,
  'LOCALIZED ISSUE': 1.5,
};

/**
 * Sentinel Impact Matrix Algorithm
 * Score = (Base_Severity * Report_Count * Social_Weight) / (Reliability_Index * Trust_Factor)
 * 
 * Critical Pathing: If critical infrastructure (Clinic/School) is detected, score is forced to 10.0.
 */
export function calculatePriorityScore(
  type: FaultType,
  reportCount: number,
  isCritical: boolean = false,
  trustFactor: number = 1.0,
  reliabilityIndex: number = 1.0
): number {
  // Critical Pathing
  if (isCritical) return 10.0;

  const baseSeverity = SEVERITY_WEIGHTS[type];
  const socialWeight = 1.5; // Base social weight for villages
  
  // Formula implementation
  const rawScore = (baseSeverity * reportCount * socialWeight) / (reliabilityIndex * trustFactor);
  
  // Scale and clamp to 0.0 - 10.0
  const scaledScore = Math.min(9.9, (rawScore / 10) * 2); // Adjusted scaling for simulation
  
  return parseFloat(scaledScore.toFixed(1));
}

/**
 * Clustering Logic
 * Collapses multiple reports from the same grid/village into a single ticket.
 */
export function clusterReports(reports: any[]): FaultTicket[] {
  // In a real scenario, this would happen on the backend or via a stream processor.
  // Here we simulate the logic.
  const clusters: Record<string, any> = {};

  reports.forEach(report => {
    const key = report.gridId;
    if (!clusters[key]) {
      clusters[key] = {
        ...report,
        reports: 1,
        affectedPopulation: report.userAppliancesCount || 5, // Derived from user registration data
      };
    } else {
      clusters[key].reports += 1;
      clusters[key].affectedPopulation += (report.userAppliancesCount || 5);
    }
  });

  return Object.values(clusters).map(cluster => ({
    ...cluster,
    priorityScore: calculatePriorityScore(
      cluster.type,
      cluster.affectedPopulation,
      cluster.distanceKm,
      cluster.village.includes('Clinic') || cluster.village.includes('School')
    )
  })).sort((a, b) => b.priorityScore - a.priorityScore);
}
