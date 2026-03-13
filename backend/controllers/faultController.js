const FaultReport = require('../models/FaultReport');
const User = require('../models/User');
const { sendFaultAlert } = require('../services/smsService');

const createFault = async (req, res) => {
  try {
    const { villageID, description, location, images, voiceNote, riskLevel } = req.body;
    
    const newFault = new FaultReport({
      reporterID: req.user.id,
      villageID,
      description,
      location,
      images,
      voiceNote,
      riskLevel
    });

    // Find a technician for this village (simplified logic)
    const technician = await User.findOne({ role: 'TECHNICIAN', village: villageID }) || await User.findOne({ role: 'TECHNICIAN' });
    
    if (technician) {
      newFault.technicianID = technician._id;
      const reporter = await User.findById(req.user.id);
      
      // Trigger SMS Alert
      await sendFaultAlert(technician.phone, reporter.name, villageID, description.substring(0, 30));
    }

    await newFault.save();
    res.json(newFault);
  } catch (err) {
    console.error('Create Fault Error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

const getFaults = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'TECHNICIAN') query = { technicianID: req.user.id };
    if (req.user.role === 'REPORTER') query = { reporterID: req.user.id };

    const faults = await FaultReport.find(query).populate('reporterID', 'name').populate('technicianID', 'name');
    res.json(faults);
  } catch (err) {
    console.error('Get Faults Error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = { createFault, getFaults };
