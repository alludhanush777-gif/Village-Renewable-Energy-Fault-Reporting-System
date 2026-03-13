import { ChatMessage, UserRole, FaultTicket } from '../types';

/**
 * Sentinel AI Core Service
 * Implements the Agentic Framework: Brain (LLM), Memory (RAG), and Tools.
 */
class AIService {
  private systemPrompt = `
    You are the Sentinel AI Assistant, the central brain for the Village Renewable Energy Platform.
    Persona: You are a patient, supportive village engineer. You avoid jargon.
    
    Instruction:
    1. Always prioritize safety. If a user says 'No lights' or 'Power is off', first check for safety hazards like exposed wires or burning smells.
    2. Ask only ONE question at a time to avoid overwhelming users.
    3. Use the tools provided to verify claims with IoT data.
    4. Provide technical accuracy while maintaining a helpful, human-focused tone.
    5. Support multiple languages (English, Hindi, Telugu) based on user input.
  `;

  private knowledgeBase = {
    'inverter_manuals': {
      'Growatt SPF 5000ES': 'Error 08: Bus Start Failure. Check control board. Error 04: Low Battery. Check PV input.',
      'Victron MultiPlus': 'Overload: Check connected appliances. Low Battery: Check SOC.'
    },
    'safety_protocols': 'Never touch exposed wires. Keep batteries in a well-ventilated area. Do not open the inverter casing while powered.'
  };

  /**
   * Main diagnostic endpoint simulation
   */
  async diagnose(message: string, role: UserRole = 'Villager', context?: any): Promise<ChatMessage> {
    console.log(`[AI Agent] Processing message from ${role}: ${message}`);
    
    // 1. Intent Recognition
    const intent = this.recognizeIntent(message, role);
    
    // 2. Tool Execution (Simulated)
    const toolsUsed: string[] = [];
    let toolOutput = '';

    if (intent === 'REPORTING' || intent === 'DIAGNOSTIC') {
      toolsUsed.push('get_iot_telemetry');
      toolOutput = 'IoT Data: Voltage drop detected (18.2V on 24V system). Temp: 42C.';
    }

    if (message.toLowerCase().includes('storm') || message.toLowerCase().includes('rain')) {
      toolsUsed.push('check_weather_history');
      toolOutput += ' Weather: Heavy thunderstorm reported 2 hours ago.';
    }

    // 3. RAG Knowledge Retrieval
    const knowledge = this.searchKnowledgeBase(message);

    // 4. LLM Reasoning (Simulated)
    const responseContent = this.generateResponse(message, intent, toolOutput, knowledge);

    return {
      id: `AI-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      role: 'assistant',
      content: responseContent,
      timestamp: Date.now(),
      intent,
      tools: toolsUsed,
      diagnosis: intent === 'DIAGNOSTIC' ? '85% probability of blown fuse due to heavy appliance overload.' : undefined,
      recommendedKit: intent === 'DIAGNOSTIC' ? ['10A Fuse', 'Digital Multimeter'] : undefined
    };
  }

  private recognizeIntent(message: string, role: UserRole): string {
    const msg = message.toLowerCase();
    if (role === 'Developer') return 'DEBUGGING';
    if (role === 'Technician') return 'MAINTENANCE';
    if (msg.includes('off') || msg.includes('power') || msg.includes('light')) return 'DIAGNOSTIC';
    if (msg.includes('how to') || msg.includes('safe')) return 'EDUCATION';
    return 'GENERAL';
  }

  private searchKnowledgeBase(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('inverter') || q.includes('error')) return this.knowledgeBase.inverter_manuals['Growatt SPF 5000ES'];
    if (q.includes('safe') || q.includes('wire')) return this.knowledgeBase.safety_protocols;
    return 'Standard village maintenance protocols.';
  }

  private generateResponse(message: string, intent: string, toolData: string, knowledge: string): string {
    if (intent === 'DEBUGGING') {
      return "I've analyzed the MQTT logs. The broker is rejecting connections due to client-ID limits. Please check the SSL certificates and ensure each node has a unique ID.";
    }

    if (intent === 'DIAGNOSTIC') {
      if (message.toLowerCase().includes('off')) {
        return "I'm sorry to hear the power is off. First, for your safety: are there any exposed wires or do you smell any burning? Please stay away from the battery bank.";
      }
      return `I see a voltage drop in your sector (${toolData}). Are there any trees touching the wires near your house? Also, please check if the inverter screen is showing any error codes like those in the manual: ${knowledge}`;
    }

    if (intent === 'EDUCATION') {
      return "Energy safety is vital. " + this.knowledgeBase.safety_protocols;
    }

    return "I am the Sentinel AI. How can I assist you with the village power grid today?";
  }

  /**
   * Generates the Pre-Diagnosis Summary for the Technician Dashboard
   */
  generatePreDiagnosisSummary(ticket: FaultTicket): string {
    return `AI Diagnosis: 85% probability of blown fuse due to heavy appliance overload. Recommended tool: 10A Fuse. Hardware DNA: ${ticket.hardwareDNA?.inverterModel || 'Unknown'}.`;
  }
}

export const aiService = new AIService();
