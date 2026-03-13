const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

let client;
try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } else {
    console.warn("Sentinel Warning: Valid Twilio credentials not found. SMS will be mocked.");
  }
} catch (e) {
  console.warn("Sentinel Warning: Twilio initialization failed. SMS will be mocked.");
}

/**
 * Sends an SMS to a technician when a new fault is reported.
 * @param {string} technicianPhone - The technician's phone number.
 * @param {string} reporterName - The name of the person who reported the fault.
 * @param {string} villageName - The name of the village.
 * @param {string} faultType - The type of fault (e.g., Solar panel issue).
 */
const sendFaultAlert = async (technicianPhone, reporterName, villageName, faultType) => {
  try {
    if (!client) {
      console.log(`[MOCKED SMS] To: ${technicianPhone} | New fault reported by ${reporterName}: ${faultType} in ${villageName} has an issue. Please check.`);
      return { sid: 'mocked_sid_' + Date.now() };
    }
    const message = await client.messages.create({
      body: `New fault reported by ${reporterName}: ${faultType} in ${villageName} has an issue. Please check.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: technicianPhone
    });
    console.log(`Sentinel SMS Alert Sent: ${message.sid}`);
    return message;
  } catch (err) {
    console.error('Sentinel SMS Alert Failure:', err);
    throw err;
  }
};

module.exports = { sendFaultAlert };
