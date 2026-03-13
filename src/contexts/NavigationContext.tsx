import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ViewState = 'auth' | 'dashboard' | 'geospatial' | 'ai-assistant' | 'reporter' | 'tracker';

interface TeamStatus {
  role: string;
  msg: string;
}

interface NavigationContextType {
  view: ViewState;
  setView: (view: ViewState) => void;
  teamStatus: TeamStatus | null;
  setTeamStatus: (status: TeamStatus | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewState>('auth');
  const [teamStatus, setTeamStatus] = useState<TeamStatus | null>(null);

  return (
    <NavigationContext.Provider value={{ view, setView, teamStatus, setTeamStatus }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
