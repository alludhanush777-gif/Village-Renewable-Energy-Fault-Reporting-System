import { FaultTicket, RawFaultReport, UserMetadata } from '../types';
import { dataLifecycle } from './dataLifecycle';

type MessageHandler = (data: any) => void;

class SocketService {
  private handlers: Set<MessageHandler> = new Set();
  private interval: any = null;

  subscribe(handler: MessageHandler) {
    this.handlers.add(handler);
    if (!this.interval && this.handlers.size > 0) {
      this.startSimulation();
    }
    return () => {
      this.handlers.delete(handler);
      if (this.handlers.size === 0 && this.interval) {
        this.stopSimulation();
      }
    };
  }

  emit(message: any) {
    this.handlers.forEach(h => h(message));
  }

  private startSimulation() {
    console.log('Starting Sentinel Data Lifecycle simulation...');
    this.interval = setInterval(async () => {
      if (Math.random() > 0.6) {
        const report = this.generateRawReport();
        const user = this.generateUserMetadata();
        
        const ticket = await dataLifecycle.ingestReport(report, user);
        
        // Broadcast NEW_PRIORITY_ALERT event
        this.handlers.forEach(h => h({ 
          type: 'NEW_TICKET', 
          payload: ticket,
          event: 'NEW_PRIORITY_ALERT'
        }));
      }
    }, 8000);
  }

  private stopSimulation() {
    console.log('Stopping socket simulation...');
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  private generateRawReport(): RawFaultReport {
    const categories: any[] = ['GRID FAILURE', 'PREDICTIVE ALERT', 'LOCALIZED ISSUE'];
    return {
      reportId: `REP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      userId: `USR-${Math.floor(Math.random() * 1000)}`,
      gps: {
        lat: -1.2921 + (Math.random() - 0.5) * 0.1,
        lng: 36.8219 + (Math.random() - 0.5) * 0.1
      },
      category: categories[Math.floor(Math.random() * categories.length)],
      mediaPayload: {
        photoUrls: ['https://picsum.photos/seed/fault/400/300'],
      },
      timestamp: Date.now()
    };
  }

  private generateUserMetadata(): UserMetadata {
    const criticalLoads: any[] = ['Clinic', 'School', 'Water Pump', 'Residential'];
    const load = criticalLoads[Math.floor(Math.random() * criticalLoads.length)];
    const villages = ['Omo Valley', 'Turkana North', 'Kajiado West', 'Marsabit East', 'Samburu Central'];

    return {
      userId: `USR-${Math.floor(Math.random() * 1000)}`,
      trustScore: 0.8 + Math.random() * 0.2,
      villageProfile: villages[Math.floor(Math.random() * villages.length)],
      hardwareDNA: {
        inverterModel: 'Growatt SPF 5000ES',
        batteryModel: 'Tesla Powerwall 2',
        criticalLoad: load
      }
    };
  }
}

export const socketService = new SocketService();
