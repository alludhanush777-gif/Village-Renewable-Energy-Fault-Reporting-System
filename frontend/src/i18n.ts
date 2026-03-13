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
