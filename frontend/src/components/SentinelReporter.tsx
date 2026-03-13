import React, { useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { 
  ComplaintCategory, 
  SeverityLevel, 
  VillagerProfile, 
  SolarSystemDetails
} from '../types';
import { reporterService } from '../services/reporterService';
import { useNavigation } from '../contexts/NavigationContext';
import { useLanguage } from '../contexts/LanguageContext';

// Import Sub-components
import { PersonalInfoStep } from './reporter/PersonalInfoStep';
import { LocationStep } from './reporter/LocationStep';
import { SolarDetailsStep } from './reporter/SolarDetailsStep';
import { HouseholdInfoStep } from './reporter/HouseholdInfoStep';
import { IssueCategoryStep } from './reporter/IssueCategoryStep';
import { IssueDetailsStep } from './reporter/IssueDetailsStep';
import { EvidenceStep } from './reporter/EvidenceStep';
import { ReviewStep } from './reporter/ReviewStep';
import { SuccessStep } from './reporter/SuccessStep';

interface SentinelReporterProps {
  onBack: () => void;
}

export const SentinelReporter: React.FC<SentinelReporterProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const { teamStatus, setTeamStatus } = useNavigation();

  // Form State
  const [profile, setProfile] = useState<VillagerProfile>({
    fullName: '',
    age: 0,
    gender: 'Male',
    phone: '',
    altPhone: '',
    village: '',
    district: '',
    state: '',
    landmark: '',
    familyMembers: 1
  });

  const [solar, setSolar] = useState<SolarSystemDetails>({
    numPanels: 2,
    panelCapacity: '250W',
    batteryType: 'Gel',
    batteryCapacity: '150Ah',
    inverterModel: 'Growatt 5kVA',
    installationYear: 2022
  });

  const [issue, setIssue] = useState<{
    category: ComplaintCategory;
    severity: SeverityLevel;
    startTime: string;
    frequency: string;
    description: string;
    appliances: string[];
  }>({
    category: 'NO_POWER',
    severity: 'MEDIUM',
    startTime: '',
    frequency: 'First time',
    description: '',
    appliances: []
  });

  const [stepNotes, setStepNotes] = useState<Record<number, string>>({
    1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: ''
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [audio, setAudio] = useState<string | null>(null);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const steps = [
      { role: 'UX/UI Designer', msg: 'Validating accessibility compliance...' },
      { role: 'Distributed Systems Engineer', msg: 'Checking mesh network availability...' },
      { role: 'Database Architect', msg: 'Optimizing fault schema for storage...' },
      { role: 'Lead Architect', msg: 'Finalizing ticket generation...' }
    ];

    for (const s of steps) {
      setTeamStatus(s);
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      // Create backend fault report
      const response = await fetch('http://localhost:5000/api/faults', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sentinel_auth_token')}`
        },
        body: JSON.stringify({
          villageID: profile.village,
          description: issue.description,
          location: {
            type: 'Point',
            coordinates: [34.5, 3.2] // Static for now or GPS if enabled
          },
          images: photo ? [photo] : [],
          voiceNote: audio,
          riskLevel: severityToRisk(issue.severity)
        })
      });

      const data = await response.json();
      setTicketId(data._id);
      setStep(9); // Success step
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setTeamStatus(null);
    }
  };

  const severityToRisk = (sev: SeverityLevel) => {
    if (sev === 'CRITICAL') return 'CRITICAL';
    if (sev === 'MEDIUM') return 'MEDIUM';
    return 'LOW';
  };

  const renderStepNotes = (stepNum: number) => (
    <div className="mt-8 pt-8 border-t border-white/5">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2 mb-2 block">Additional Notes for this Step</label>
      <textarea 
        value={stepNotes[stepNum]}
        onChange={e => setStepNotes({...stepNotes, [stepNum]: e.target.value})}
        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none min-h-[80px] resize-none"
        placeholder="Type any extra details here..."
      />
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return <PersonalInfoStep profile={profile} setProfile={setProfile} nextStep={nextStep} renderStepNotes={renderStepNotes} />;
      case 2:
        return <LocationStep profile={profile} setProfile={setProfile} nextStep={nextStep} prevStep={prevStep} renderStepNotes={renderStepNotes} />;
      case 3:
        return <SolarDetailsStep solar={solar} setSolar={setSolar} nextStep={nextStep} prevStep={prevStep} renderStepNotes={renderStepNotes} />;
      case 4:
        return (
          <HouseholdInfoStep 
            profile={profile} 
            setProfile={setProfile} 
            appliances={issue.appliances} 
            setAppliances={(apps) => setIssue({...issue, appliances: apps})} 
            nextStep={nextStep} 
            prevStep={prevStep} 
            renderStepNotes={renderStepNotes} 
          />
        );
      case 5:
        return <IssueCategoryStep category={issue.category} setCategory={(cat) => setIssue({...issue, category: cat})} nextStep={nextStep} prevStep={prevStep} renderStepNotes={renderStepNotes} />;
      case 6:
        return (
          <IssueDetailsStep 
            severity={issue.severity} setSeverity={(sev) => setIssue({...issue, severity: sev})}
            startTime={issue.startTime} setStartTime={(time) => setIssue({...issue, startTime: time})}
            frequency={issue.frequency} setFrequency={(freq) => setIssue({...issue, frequency: freq})}
            description={issue.description} setDescription={(desc) => setIssue({...issue, description: desc})}
            nextStep={nextStep} prevStep={prevStep} renderStepNotes={renderStepNotes} 
          />
        );
      case 7:
        return (
          <EvidenceStep 
            photo={photo} setPhoto={setPhoto}
            audio={audio} setAudio={setAudio}
            nextStep={nextStep} prevStep={prevStep} renderStepNotes={renderStepNotes} 
          />
        );
      case 8:
        return (
          <ReviewStep 
            profile={profile} category={issue.category} severity={issue.severity} 
            handleSubmit={handleSubmit} isSubmitting={isSubmitting} prevStep={prevStep} 
            teamStatus={teamStatus} 
          />
        );
      case 9:
        return <SuccessStep ticketId={ticketId} onBack={onBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans">
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-gray-400 hover:text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">{t('reporter')}</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Village Link Active</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <Volume2 className="w-4 h-4 text-[#00A86B]" />
          <span className="text-[10px] font-black uppercase tracking-widest">Voice Guide: ON</span>
        </div>
      </header>
      <main className="flex-1 max-w-2xl mx-auto w-full p-8">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </main>
      <footer className="p-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-4">{t('offline')}</p>
        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
          {t('smsFallback')}
        </button>
      </footer>
    </div>
  );
};
