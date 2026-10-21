import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToGemini, ChatMessage } from './services/geminiService';
import { MessageSquare, BookOpen, Trophy, Send, CigaretteOff, Heart, TrendingUp, Save, Edit2, PlayCircle } from 'lucide-react';
import { DAILY_CONTENT } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'summary'>('dashboard');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy tu coach basado en el método "Es fácil". ¿Estás listo para liberarte de la esclavitud del tabaco o tienes alguna duda que te impide dar el paso?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // State for settings
  const [quitDate, setQuitDate] = useState<string | null>(localStorage.getItem('quitDate'));
  const [dailyCost, setDailyCost] = useState<string>(localStorage.getItem('dailyCost') || '');
  const [isEditingCost, setIsEditingCost] = useState<boolean>(!localStorage.getItem('dailyCost'));
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, activeTab]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    const response = await sendMessageToGemini(chatHistory, inputMessage);
    
    setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const startQuitJourney = () => {
    const now = new Date().toISOString();
    setQuitDate(now);
    localStorage.setItem('quitDate', now);
    setChatHistory([
      { role: 'model', text: '¡Felicidades! Has tomado la decisión correcta. Recuerda: no estás renunciando a nada, te estás liberando. ¡YIPPEE! ¡ERES UN NO FUMADOR! ¿Cómo te sientes?' }
    ]);
    setActiveTab('chat');
  };

  const handleSaveCost = () => {
    if (dailyCost && !isNaN(parseFloat(dailyCost))) {
      localStorage.setItem('dailyCost', dailyCost);
      setIsEditingCost(false);
    }
  };

  const getQuitStats = () => {
    if (!quitDate) return null;
    const start = new Date(quitDate);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60)); // For health sliders

    const costPerDay = parseFloat(dailyCost) || 0;
    // Calculate money precisely based on fraction of days
    const daysFloat = diffMs / (1000 * 60 * 60 * 24);
    const moneySaved = (daysFloat * costPerDay).toFixed(2);

    return { days, hours, totalHours, moneySaved };
  };

  const getDailyContent = (days: number) => {
    // Rotate content based on days passed. If days is 0 or negative, show index 0.
    const index = Math.max(0, days) % DAILY_CONTENT.length;
    return DAILY_CONTENT[index];
  };

  const stats = getQuitStats();
  const dailyContent = getDailyContent(stats?.days || 0);

  // Health Slider Component
  const HealthSlider = ({ label, current, max, unit }: { label: string, current: number, max: number, unit: string }) => {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-xs font-semibold text-orange-600">{percentage.toFixed(0)}% Eliminado</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-1000 ease-out" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-slate-400 mt-1 text-right">
          {percentage >= 100 ? '¡Completamente limpio!' : 'Procesando limpieza...'}
        </p>
      </div>
    );
  };

  const Navigation = () => (
    <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 py-3 px-6 flex justify-between items-center z-50 md:static md:w-64 md:h-screen md:flex-col md:justify-start md:border-r md:border-t-0 md:py-8">
      <div className="hidden md:block text-2xl font-bold text-orange-500 mb-10 px-4">
        Es Fácil
      </div>
      
      <button 
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col md:flex-row items-center md:w-full md:px-4 md:py-3 md:mb-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'text-orange-600 md:bg-orange-50' : 'text-slate-500 hover:text-slate-800'}`}
      >
        <Trophy className="h-6 w-6 md:mr-3" />
        <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">Progreso</span>
      </button>

      <button 
        onClick={() => setActiveTab('chat')}
        className={`flex flex-col md:flex-row items-center md:w-full md:px-4 md:py-3 md:mb-2 rounded-lg transition-colors ${activeTab === 'chat' ? 'text-orange-600 md:bg-orange-50' : 'text-slate-500 hover:text-slate-800'}`}
      >
        <MessageSquare className="h-6 w-6 md:mr-3" />
        <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">Coach IA</span>
      </button>

      <button 
        onClick={() => setActiveTab('summary')}
        className={`flex flex-col md:flex-row items-center md:w-full md:px-4 md:py-3 md:mb-2 rounded-lg transition-colors ${activeTab === 'summary' ? 'text-orange-600 md:bg-orange-50' : 'text-slate-500 hover:text-slate-800'}`}
      >
        <BookOpen className="h-6 w-6 md:mr-3" />
        <span className="text-xs md:text-sm font-medium mt-1 md:mt-0">El Método</span>
      </button>
    </nav>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Navigation />
      
      <main className="flex-1 flex flex-col h-[calc(100vh-60px)] md:h-screen w-full relative overflow-hidden">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-40">
          <h1 className="text-xl font-bold text-slate-800">Es Fácil</h1>
          {stats && (
            <div className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {stats.days} días libre
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 pb-20">
              <header className="mb-4">
                <h2 className="text-3xl font-bold text-slate-900">Tu Libertad</h2>
                {!quitDate && <p className="text-slate-500 mt-2">Configura tu plan y comienza tu nueva vida.</p>}
              </header>

              {!quitDate ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-slate-100">
                  <CigaretteOff className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Comenzar mi vida sin tabaco</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                     Pulsa el botón cuando hayas fumado tu último cigarrillo y estés listo para ser libre.
                  </p>
                  
                  {/* Cost Configuration Initial */}
                  <div className="mb-6 max-w-xs mx-auto text-left bg-slate-50 p-4 rounded-xl">
                     <label className="block text-sm font-medium text-slate-700 mb-1">Gasto diario estimado (€/$)</label>
                     <input 
                        type="number" 
                        value={dailyCost}
                        onChange={(e) => setDailyCost(e.target.value)}
                        placeholder="Ej: 5.50"
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                     />
                     <p className="text-xs text-slate-500 mt-1">Incluye tabaco, papel, mecheros...</p>
                  </div>

                  <button 
                    onClick={() => {
                      if(!dailyCost) {
                        alert("Por favor, introduce tu gasto diario para calcular tus ahorros.");
                        return;
                      }
                      localStorage.setItem('dailyCost', dailyCost);
                      startQuitJourney();
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 flex items-center mx-auto"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Iniciar mi vida sin tabaco
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* TIEMPO LIBRE */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center space-x-2 mb-4 opacity-90">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <span className="font-medium text-lg">Tiempo Libre</span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <div className="text-5xl font-bold">{stats?.days}</div>
                      <div className="text-xl font-light opacity-80">días</div>
                    </div>
                    <div className="text-lg opacity-70 mt-1">{stats?.hours} horas sin fumar</div>
                    <div className="mt-4 text-xs bg-white/10 p-2 rounded inline-block">
                      ¡Eres un No Fumador!
                    </div>
                  </div>

                  {/* DINERO AHORRADO */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2 text-slate-500">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Dinero Ahorrado</span>
                      </div>
                      <button 
                        onClick={() => setIsEditingCost(!isEditingCost)}
                        className="text-slate-400 hover:text-slate-600"
                        title="Modificar gasto diario"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>

                    {isEditingCost ? (
                      <div className="mt-2 animate-fadeIn">
                        <label className="block text-xs text-slate-500 mb-1">Gasto diario (€/$):</label>
                        <div className="flex space-x-2">
                          <input 
                            type="number" 
                            value={dailyCost}
                            onChange={(e) => setDailyCost(e.target.value)}
                            className="flex-1 p-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="0.00"
                          />
                          <button 
                            onClick={handleSaveCost}
                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-slate-800 mt-2">{stats?.moneySaved} <span className="text-xl text-slate-500">€/$</span></div>
                        <div className="text-sm text-green-600 mt-1">Calculado a {dailyCost} €/$ por día</div>
                      </>
                    )}
                  </div>

                  {/* SALUD RECUPERADA (SLIDERS) */}
                  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm md:col-span-2">
                    <div className="flex items-center space-x-2 mb-6 text-slate-500">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Salud Recuperada</span>
                    </div>
                    
                    <div className="space-y-6">
                      <HealthSlider 
                        label="Eliminación de Monóxido de Carbono" 
                        current={stats?.totalHours || 0} 
                        max={48} // 48 hours to clear CO
                        unit="h"
                      />
                      
                      <HealthSlider 
                        label="Eliminación de Nicotina" 
                        current={stats?.totalHours || 0} 
                        max={72} // 72 hours to clear physical nicotine
                        unit="h"
                      />
                    </div>
                    
                    <div className="mt-4 bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
                      <span className="font-bold">Nota:</span> Estos gráficos muestran la desintoxicación física inicial. La reparación pulmonar continúa durante meses y años.
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full bg-white">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm md:text-base leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-orange-500 text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      {msg.text.split('\n').map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-slate-100 bg-white">
                <div className="flex items-center bg-slate-50 rounded-full border border-slate-200 px-4 py-2">
                  <input 
                    type="text" 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Pregunta a Allen... (ej: tengo ansiedad)"
                    className="flex-1 bg-transparent outline-none text-slate-800 placeholder-slate-400"
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isLoading}
                    className="ml-2 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUMMARY TAB (DYNAMIC DAILY CONTENT) */}
          {activeTab === 'summary' && (
            <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6 pb-20">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-900">El Método: Día {Math.max(1, stats?.days || 1)}</h2>
                {stats?.days && stats.days > 0 && (
                   <span className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">
                     Fase de libertad
                   </span>
                )}
              </div>
              
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 z-0"></div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-2xl text-orange-600 mb-4">{dailyContent.title}</h3>
                    <p className="text-slate-700 text-lg leading-relaxed">{dailyContent.body}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 rounded-2xl text-white shadow-md transform hover:scale-[1.01] transition-transform">
                  <h3 className="font-bold text-lg text-blue-100 mb-3 uppercase tracking-wide">Mantra Diario</h3>
                  <p className="text-2xl font-serif italic">"{dailyContent.mantra}"</p>
                  <p className="mt-4 text-sm text-blue-200">Repítelo cada vez que te acuerdes del tabaco.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-700 mb-2">Recuerda los básicos:</h4>
                  <ul className="list-disc list-inside text-slate-600 space-y-2">
                    <li>No envidies a los fumadores, compadécelos.</li>
                    <li>No estás haciendo un sacrificio, te estás curando.</li>
                    <li>No existe "solo un cigarrillo".</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;