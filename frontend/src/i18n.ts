import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: 'Sentinel Energy',
      command: 'Command',
      dashboard: 'Dashboard',
      geospatial: 'Geospatial',
      technicians: 'Technician Fleet',
      inventory: 'Inventory',
      analytics: 'Analytics',
      settings: 'Settings',
      reporter: 'Sentinel Reporter',
      reportFault: 'Report a Fault',
      trackComplaints: 'Track Complaints',
      tracker: 'Complaints Tracker',
      ticketDetails: 'Ticket Details',
      trackReports: 'Track your reports',
      searchPlaceholder: 'Search by Ticket ID or Category...',
      noReports: 'No reports found',
      statusUpdated: 'Status Updated',
      issueSummary: 'Issue Summary',
      hardwareContext: 'Hardware Context',
      timeline: 'Timeline',
      contactSupport: 'Contact Support',
      offline: 'No Internet? No Problem.',
      smsFallback: 'Send via SMS Fallback',
      nominal: 'All Systems Nominal',
      liveOps: 'Live Operations',
      morning: 'Good Morning',
      afternoon: 'Good Afternoon',
      evening: 'Good Evening'
    }
  },
  te: {
    translation: {
      title: 'సెంటినెల్ ఎనర్జీ',
      command: 'కమాండ్',
      dashboard: 'డ్యాష్‌బోర్డ్',
      geospatial: 'జియోస్పేషియల్',
      technicians: 'టెక్నీషియన్ ఫ్లీట్',
      inventory: 'ఇన్వెంటరీ',
      analytics: 'అనలిటిక్స్',
      settings: 'సెట్టింగులు',
      reporter: 'సెంటినెల్ రిపోర్టర్',
      reportFault: 'లోపాన్ని నివేదించండి',
      trackComplaints: 'ఫిర్యాదులను ట్రాక్ చేయండి',
      tracker: 'ఫిర్యాదుల ట్రాకర్',
      ticketDetails: 'టికెట్ వివరాలు',
      trackReports: 'మీ నివేదికలను ట్రాక్ చేయండి',
      searchPlaceholder: 'టికెట్ ID లేదా వర్గం ద్వారా శోధించండి...',
      noReports: 'నివేదికలు కనుగొనబడలేదు',
      statusUpdated: 'స్థితి నవీకరించబడింది',
      issueSummary: 'సమస్య సారాంశం',
      hardwareContext: 'హార్డ్‌వేర్ సందర్భం',
      timeline: 'టైమ్‌లైన్',
      contactSupport: 'మద్దతును సంప్రదించండి',
      offline: 'ఇంటర్నెట్ లేదా? పర్వాలేదు.',
      smsFallback: 'SMS ద్వారా పంపండి',
      nominal: 'అన్నీ సరిగ్గా ఉన్నాయి',
      liveOps: 'లైవ్ ఆపరేషన్స్',
      morning: 'శుభోదయం',
      afternoon: 'శుభ మధ్యాహ్నం',
      evening: 'శుభ సాయంత్రం'
    }
  },
  hi: {
    translation: {
      title: 'सेंटिनल एनर्जी',
      command: 'कमांड',
      dashboard: 'डैशबोर्ड',
      geospatial: 'जियोस्पेशियल',
      technicians: 'तकनीशियन बेड़े',
      inventory: 'इन्वेंटरी',
      analytics: 'एनालिटिक्स',
      settings: 'सेटिंग्स',
      reporter: 'सेंटिनल रिपोर्टर',
      reportFault: 'दोष की रिपोर्ट करें',
      trackComplaints: 'शिकायतों को ट्रैक करें',
      tracker: 'शिकायत ट्रैकर',
      ticketDetails: 'टिकट विवरण',
      trackReports: 'अपनी रिपोर्ट ट्रैक करें',
      searchPlaceholder: 'टिकट आईडी या श्रेणी के आधार पर खोजें...',
      noReports: 'कोई रिपोर्ट नहीं मिली',
      statusUpdated: 'स्थिति अपडेट की गई',
      issueSummary: 'मुद्दे का सारांश',
      hardwareContext: 'हार्डवेयर संदर्भ',
      timeline: 'टाइमलाइन',
      contactSupport: 'सहायता से संपर्क करें',
      offline: 'इंटरनेट नहीं है? कोई बात नहीं।',
      smsFallback: 'SMS के माध्यम से भेजें',
      nominal: 'सभी प्रणालियाँ सामान्य हैं',
      liveOps: 'लाइव ऑपरेशंस',
      morning: 'सुप्रभात',
      afternoon: 'शुभ दोपहर',
      evening: 'शुभ संध्या'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
