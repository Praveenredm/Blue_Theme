import React, { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PatientSidebar } from '@/components/navigation/PatientSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Bot,
  User,
  Heart,
  Shield,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  RefreshCcw
} from 'lucide-react';
import { ChatMessage, ChatOption } from '@/types';

type ChatMode = 'main' | 'symptoms' | 'insurance';

interface InsurerInfo {
  category: 'Government' | 'Public' | 'Private';
  website: string;
}

const indianInsurers: Record<string, InsurerInfo> = {
  'CGHS': { category: 'Government', website: 'https://cghs.gov.in/' },
  'ECHS': { category: 'Government', website: 'https://echs.gov.in/' },
  'National Insurance': { category: 'Public', website: 'https://nationalinsurance.nic.co.in/' },
  'United India Insurance': { category: 'Public', website: 'https://uiic.co.in/' },
  'Oriental Insurance': { category: 'Public', website: 'https://orientalinsurance.org.in/' },
  'New India Assurance': { category: 'Public', website: 'https://newindia.co.in/' },
  'HDFC ERGO': { category: 'Private', website: 'https://www.hdfcergo.com/' },
  'ICICI Lombard': { category: 'Private', website: 'https://www.icicilombard.com/' },
  'Bajaj Allianz': { category: 'Private', website: 'https://www.bajajallianz.com/' },
  'Reliance General': { category: 'Private', website: 'https://www.reliancegeneral.co.in/' },
  'Tata AIG': { category: 'Private', website: 'https://www.tataaig.com/' },
  'Apollo Munich': { category: 'Private', website: 'https://www.apollomunichinsurance.com/' },
  'Star Health': { category: 'Private', website: 'https://www.starhealth.in/' },
  'ManipalCigna': { category: 'Private', website: 'https://www.manipalcigna.com/' },
  'Max Bupa': { category: 'Private', website: 'https://www.maxbupa.com/' },
  'SBI General': { category: 'Private', website: 'https://www.sbigeneral.in/' },
  'Kotak Mahindra': { category: 'Private', website: 'https://www.kotakgeneralinsurance.com/' },
  'Cholamandalam MS': { category: 'Private', website: 'https://www.cholamsgeneral.in/' }
};

interface SymptomStep {
  question: string;
  options: ChatOption[];
}

const symptomFlow: SymptomStep[] = [
  {
    question: "Let's understand your symptoms better. What is your primary concern today?",
    options: [
      { id: 'headache', label: '🤕 Headache or Migraine', value: 'headache' },
      { id: 'chest', label: '💔 Chest Discomfort', value: 'chest_pain' },
      { id: 'stomach', label: '🤢 Stomach Issues', value: 'stomach' },
      { id: 'fatigue', label: '😴 Fatigue or Weakness', value: 'fatigue' },
      { id: 'respiratory', label: '🫁 Breathing Difficulties', value: 'respiratory' },
      { id: 'joint', label: '🦴 Joint or Muscle Pain', value: 'joint_pain' },
      { id: 'other', label: '❓ Other Symptoms', value: 'other' },
      { id: 'multiple', label: '🔢 Multiple Symptoms', value: 'multiple' },
      { id: 'none', label: '✅ No Symptoms', value: 'none' },
      { id: 'unsure', label: '❓ Not Sure / Just Checking', value: 'unsure' },
      { id: 'pregnancy', label: '🤰 Pregnancy-Related', value: 'pregnancy' },
      { id: 'mental', label: '🧠 Mental Health Concerns', value: 'mental_health' },
      { id: 'skin', label: '🩹 Skin Issues', value: 'skin' },
      { id: 'allergy', label: '🤧 Allergy Symptoms', value: 'allergy' },
      { id: 'infection', label: '🦠 Possible Infection', value: 'infection' }
    ]
  },
  {
    question: "How long have you been experiencing these symptoms?",
    options: [
      { id: 'today', label: 'Just started today', value: 'today' },
      { id: 'days', label: '2-3 days', value: 'few_days' },
      { id: 'week', label: 'About a week', value: 'week' },
      { id: 'longer', label: 'More than a week', value: 'longer' }
    ]
  },
  {
    question: "How would you rate the severity of your symptoms?",
    options: [
      { id: 'mild', label: '😊 Mild - Noticeable but manageable', value: 'mild' },
      { id: 'moderate', label: '😐 Moderate - Affecting daily activities', value: 'moderate' },
      { id: 'severe', label: '😣 Severe - Very difficult to manage', value: 'severe' }
    ]
  },
  {
    question: "Are you experiencing any of these additional symptoms?",
    options: [
      { id: 'fever', label: '🌡️ Fever', value: 'fever' },
      { id: 'nausea', label: '🤢 Nausea', value: 'nausea' },
      { id: 'dizziness', label: '😵 Dizziness', value: 'dizziness' },
      { id: 'shortness', label: '😤 Shortness of Breath', value: 'shortness_of_breath' },
      { id: 'swelling', label: '🦵 Swelling', value: 'swelling' },
      { id: 'bleeding', label: '🩸 Unusual Bleeding', value: 'bleeding' },
      { id: 'none', label: '✅ None of these', value: 'none' }
    ]
  }
];

const insuranceFlow: SymptomStep[] = [
  {
    question: "I'm here to help you understand health insurance! First, how old are you?",
    options: [
      { id: 'young', label: '18-25 years', value: '18-25' },
      { id: 'adult', label: '26-40 years', value: '26-40' },
      { id: 'middle', label: '41-55 years', value: '41-55' },
      { id: 'senior', label: '56+ years', value: '56+' }
    ]
  },
  {
    question: "What's your current family situation?",
    options: [
      { id: 'single', label: '👤 Just me', value: 'single' },
      { id: 'couple', label: '👫 Me and spouse/partner', value: 'couple' },
      { id: 'family', label: '👨‍👩‍👧 Family with children', value: 'family' }
    ]
  },
  {
    question: "Do you have any pre-existing conditions that require regular care?",
    options: [
      { id: 'none', label: '✅ No pre-existing conditions', value: 'none' },
      { id: 'minor', label: '💊 Minor conditions (allergies, etc.)', value: 'minor' },
      { id: 'chronic', label: '🏥 Chronic conditions (diabetes, heart disease, etc.)', value: 'chronic' }
    ]
  },
  {
    question: "What's your monthly budget for health insurance?",
    options: [
      { id: 'low', label: '💵 Under ₹10000-15000/month', value: 'low' },
      { id: 'medium', label: '💵 ₹20000-₹25000/month', value: 'medium' },
      { id: 'high', label: '💵💵 ₹55000+/month', value: 'high' }
    ]
  }
];

export default function HealthAssistant() {
  const [mode, setMode] = useState<ChatMode>('main');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [userInput, setUserInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: "Hello! 👋 I'm your Refero AI Health Assistant. I'm here to help you with personalized health guidance. How can I assist you today?",
        options: [
          { id: 'symptoms', label: '🩺 Check my symptoms', value: 'symptoms' },
          { id: 'insurance', label: '🛡️ Health insurance help', value: 'insurance' }
        ],
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (content: string, options?: ChatOption[]) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'bot',
      content,
      options,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }]);
  };

  const handleOptionClick = (option: ChatOption) => {
    addUserMessage(option.label);

    if (mode === 'main') {
      if (option.value === 'symptoms') {
        setMode('symptoms');
        setCurrentStep(0);
        setTimeout(() => {
          addBotMessage(symptomFlow[0].question, symptomFlow[0].options);
        }, 500);
      } else if (option.value === 'insurance') {
        setMode('insurance');
        setCurrentStep(0);
        setTimeout(() => {
          addBotMessage(
            "Health insurance is a type of coverage that pays for medical and surgical expenses. It protects you from high healthcare costs and ensures you can access necessary care. Let me help you find the right plan! 💪",
          );
          setTimeout(() => {
            addBotMessage(insuranceFlow[0].question, insuranceFlow[0].options);
          }, 1000);
        }, 500);
      }
      return;
    }

    const flow = mode === 'symptoms' ? symptomFlow : insuranceFlow;
    setAnswers(prev => ({ ...prev, [`step${currentStep}`]: option.value }));

    if (currentStep < flow.length - 1) {
      setCurrentStep(prev => prev + 1);
      setTimeout(() => {
        addBotMessage(flow[currentStep + 1].question, flow[currentStep + 1].options);
      }, 500);
    } else {
      // Final analysis
      setTimeout(() => {
        if (mode === 'symptoms') {
          generateSymptomAnalysis(option.value);
        } else {
          generateInsuranceRecommendation();
        }
      }, 500);
    }
  };

  const generateSymptomAnalysis = (lastAnswer: string) => {
    const severity = answers['step2'] || 'mild';
    const isSevere = severity === 'severe' || answers['step0'] === 'chest_pain';

    if (isSevere) {
      addBotMessage(
        "⚠️ **Important: Based on your symptoms, I recommend seeking medical attention soon.**\n\nYour symptoms may require professional evaluation. I suggest:\n\n1. **Contact your primary care physician** as soon as possible\n2. If experiencing severe chest pain or difficulty breathing, **call 911 or go to the ER**\n3. Keep a record of your symptoms and when they occur\n\nWould you like me to help you request a referral to a specialist?",
        [
          { id: 'referral', label: '📋 Request a referral', value: 'referral' },
          { id: 'restart', label: '🔄 Start over', value: 'restart' }
        ]
      );
    } else {
      addBotMessage(
        "✅ **Good news!** Based on your responses, your symptoms appear manageable with home care.\n\n**Recommendations:**\n\n• 💧 Stay well hydrated\n• 😴 Get adequate rest (7-9 hours)\n• 🍎 Maintain a balanced diet\n• 💊 Over-the-counter pain relief if needed\n\n**Watch for these red flags:**\n• Symptoms worsening significantly\n• High fever (above 101°F)\n• Difficulty breathing\n• Severe pain\n\nIf any of these occur, please seek medical attention promptly.",
        [
          { id: 'more', label: '❓ Ask another question', value: 'restart' },
          { id: 'referral', label: '📋 Request a doctor visit anyway', value: 'referral' }
        ]
      );
    }
  };

  const generateInsuranceRecommendation = () => {
    const budget = answers['step3'] || 'medium';
    const conditions = answers['step2'] || 'none';

    let planType = 'Bronze';
    let recommendation = '';

    if (conditions === 'chronic' || budget === 'high') {
      planType = 'Gold or Platinum';
      recommendation = "Given your healthcare needs, I recommend a **Gold or Platinum plan** with lower deductibles and comprehensive coverage.";
    } else if (conditions === 'minor' || budget === 'medium') {
      planType = 'Silver';
      recommendation = "A **Silver plan** would be a great balance of coverage and cost for you.";
    } else {
      planType = 'Bronze or Catastrophic';
      recommendation = "A **Bronze or Catastrophic plan** offers lower premiums while protecting against major medical expenses.";
    }

    addBotMessage(
      `🛡️ **Your Insurance Recommendation**\n\n${recommendation}\n\n**Next Steps:**\n\n1. 📝 Gather your documents (ID, income proof, SSN)\n2. 🌐 Visit healthcare.gov or your state marketplace\n3. 📅 Open enrollment typically runs Nov 1 - Jan 15\n4. 💬 Consider speaking with a licensed insurance broker\n\n**Key Terms to Know:**\n• **Premium**: Monthly payment\n• **Deductible**: Amount you pay before insurance kicks in\n• **Copay**: Fixed amount for services\n• **Coinsurance**: Your share after deductible`,
      [
        { id: 'restart', label: '🔄 Start a new conversation', value: 'restart' }
      ]
    );
  };

  const processMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    let matchedInsurer: { name: string; category: string; website: string } | null = null;

    // Check for exact insurer name match
    for (const [name, info] of Object.entries(indianInsurers)) {
      if (lowerMessage.includes(name.toLowerCase())) {
        matchedInsurer = { name, ...info };
        break;
      }
    }

    if (matchedInsurer) {
      // Supported insurer
      addBotMessage(
        `✅ Yes, we support **${matchedInsurer.name}** (${matchedInsurer.category} sector).\n\nOfficial website: [${matchedInsurer.website}](${matchedInsurer.website})`
      );
    } else if (lowerMessage.includes('insurance') || lowerMessage.includes('insurer') || lowerMessage.includes('accept') || lowerMessage.includes('support')) {
      if (lowerMessage.includes('what') || lowerMessage.includes('list') || lowerMessage.includes('supported') || lowerMessage.includes('options')) {
        // List supported insurances
        const supportedList = Object.keys(indianInsurers).map(name => `• ${name} (${indianInsurers[name].category})`).join('\n');
        addBotMessage(
          `🛡️ We support the following major Indian health insurance providers:\n\n${supportedList}\n\nFor official websites and more details, please visit their respective sites.`
        );
      } else {
        // Unrecognized or unsupported
        const alternatives = ['Star Health', 'Max Bupa', 'HDFC ERGO', 'ICICI Lombard'];
        addBotMessage(
          `❌ I'm sorry, I couldn't identify that insurance provider in our supported list.\n\nWe support major Indian insurers. Here are some popular alternatives:\n• ${alternatives.join('\n• ')}\n\nPlease check our full list by asking "What insurances do you support?"`
        );
      }
    } else {
      // Not insurance related
      addBotMessage(
        "I'm here to help with health insurance questions and symptom checking. Please ask about specific insurance providers or use the options above for guided assistance."
      );
    }
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    addUserMessage(userInput);
    processMessage(userInput);
    setUserInput('');
  };

  const handleRestart = () => {
    setMode('main');
    setCurrentStep(0);
    setAnswers({});
    setMessages([{
      id: '1',
      type: 'bot',
      content: "Hello! 👋 I'm your Refero.ai AI Health Assistant. I'm here to help you with personalized health guidance. How can I assist you today?",
      options: [
        { id: 'symptoms', label: '🩺 Check my symptoms', value: 'symptoms' },
        { id: 'insurance', label: '🛡️ Health insurance help', value: 'insurance' }
      ],
      timestamp: new Date()
    }]);
  };

  return (
    <DashboardLayout sidebar={<PatientSidebar />} title="AI Health Assistant">
      <div className="max-w-3xl mx-auto">
        <Card className="h-[calc(100vh-12rem)]">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Refero.ai Health Assistant</h3>
                <div className="flex items-center gap-1 text-sm text-chart-2">
                  <span className="h-2 w-2 rounded-full bg-chart-2"></span>
                  Online
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>
          </div>

          <ScrollArea className="h-[calc(100%-5rem)] p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.type === 'bot' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {message.type === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'bot'
                        ? 'bg-card border border-border'
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: message.content
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\n/g, '<br />') 
                        }}
                      />
                    </div>
                    {message.options && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.options.map((option) => (
                          <Button
                            key={option.id}
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => {
                              if (option.value === 'restart') {
                                handleRestart();
                              } else {
                                handleOptionClick(option);
                              }
                            }}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ask about insurance providers or type your question..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!userInput.trim()}>
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
