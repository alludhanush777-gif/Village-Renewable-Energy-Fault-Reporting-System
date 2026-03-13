const FaultReport = require('../models/FaultReport');
const User = require('../models/User');

/**
 * Simulates abnormal IoT data and generates a pending fault report.
 */
const startSimulator = () => {
  console.log('Sentinel IoT Simulator: Active');
  
  // Run every 5 minutes
  setInterval(async () => {
    try {
      const abnormalVoltage = (Math.random() * 10 + 10).toFixed(2); // 10V - 20V (Abnormal)
      
      // Find a technician and reporter to associate
      const technician = await User.findOne({ role: 'TECHNICIAN' });
      const reporter = await User.findOne({ role: 'REPORTER' });
      
      if (!technician || !reporter) return;

      const newFault = new FaultReport({
        reporterID: reporter._id,
        technicianID: technician._id,
        villageID: reporter.village,
        description: `IoT SENSOR ALERT: Abnormal voltage detected (${abnormalVoltage}V). Potential grid instability.`,
        location: {
          type: 'Point',
          coordinates: [36.2 + Math.random() * 0.1, 4.8 + Math.random() * 0.1]
        },
        status: 'PENDING',
        riskLevel: 'CRITICAL'
      });

      await newFault.save();
      console.log(`Sentinel IoT Alert: Fault generated for ${reporter.village}`);
      
    } catch (err) {
      console.error('IoT Simulator Breach:', err);
    }
  }, 5 * 60 * 1000); // 5 minutes
};

module.exports = { startSimulator };
