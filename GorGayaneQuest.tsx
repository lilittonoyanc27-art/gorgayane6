import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IceCream, 
  MapPin, 
  MessageSquare, 
  User, 
  Trophy, 
  ChevronRight, 
  RotateCcw,
  BookOpen,
  Sparkles,
  Navigation,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// --- Data ---
const CONJUGATIONS = {
  ir: {
    title: 'Ir (Գնալ)',
    forms: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
    pronouns: ['Yo', 'Tú', 'Él/Ella', 'Nosotros', 'Vosotros', 'Ellos/Ellas']
  },
  venir: {
    title: 'Venir (Գալ)',
    forms: ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen'],
    pronouns: ['Yo', 'Tú', 'Él/Ella', 'Nosotros', 'Vosotros', 'Ellos/Ellas']
  }
};

const QUEST_STEPS = [
  {
    speaker: 'Գայանե',
    text: 'Ողջույն Գոռ, ո՞ւր ես (գնում):',
    phrase: 'Hola Gor, ¿a dónde ___?',
    options: ['vas', 'vienes', 'va'],
    correct: 'vas',
    explanation: 'Gayane-ն հարցնում է Gor-ին (Tú), թե ուր է նա "գնում" (ir):'
  },
  {
    speaker: 'Գոռ',
    text: 'Ես (գնում եմ) այգի, ուզո՞ւմ ես գալ:',
    phrase: 'Yo ___ al parque, ¿quieres venir?',
    options: ['voy', 'vengo', 'vamos'],
    correct: 'voy',
    explanation: 'Gor-ը խոսում է իր մասին (Yo) և ասում է, որ "գնում է" (ir):'
  },
  {
    speaker: 'Գայանե',
    text: 'Այո՛, ես հիմա քեզ հետ (գալիս եմ):',
    phrase: '¡Sí! Yo ___ contigo ahora mismo.',
    options: ['vengo', 'voy', 'vienes'],
    correct: 'vengo',
    explanation: 'Երբ ինչ-որ մեկին միանում ենք, օգտագործում ենք "venir" (Yo vengo):'
  },
  {
    speaker: 'Գոռ',
    text: 'Մեր ընկերները նույնպես (գալիս են) ավելի ուշ:',
    phrase: 'Nuestros amigos también ___ más tarde.',
    options: ['vienen', 'van', 'venimos'],
    correct: 'vienen',
    explanation: 'Ընկերները (Ellos) "գալիս են" (venir) այնտեղ, որտեղ մենք ենք:'
  },
  {
    speaker: 'Գայանե',
    text: 'Իսկ Մարիան (գալի՞ս է) խնջույքին:',
    phrase: '¿Y María ___ a la fiesta?',
    options: ['viene', 'va', 'vengo'],
    correct: 'viene',
    explanation: 'Հարցնում ենք Մարիայի (Ella) "գալու" (venir) մասին:'
  },
  {
    speaker: 'Գոռ',
    text: 'Մենք բոլորս միասին (գնում ենք) կինոթատրոն:',
    phrase: 'Nosotros ___ al cine juntos.',
    options: ['vamos', 'venimos', 'vienen'],
    correct: 'vamos',
    explanation: 'Մենք (Nosotros) "գնում ենք" (ir) դեպի կինոթատրոն:'
  },
  {
    speaker: 'Գայանե',
    text: 'Դուք (գնո՞ւմ եք) աշխատանքի այսօր:',
    phrase: '¿Vosotros ___ al trabajo hoy?',
    options: ['vais', 'van', 'vas'],
    correct: 'vais',
    explanation: 'Դուք (Vosotros) "գնում եք" (ir) աշխատանքի:'
  },
  {
    speaker: 'Գոռ',
    text: 'Նրանք (գալիս են) Իսպանիայից այս շաբաթ:',
    phrase: 'Ellos ___ de España esta semana.',
    options: ['vienen', 'vienes', 'van'],
    correct: 'vienen',
    explanation: 'Նրանք (Ellos) այստեղ են "գալիս" (venir) Իսպանիայից:'
  },
  {
    speaker: 'Գայանե',
    text: 'Իմ եղբայրը (գնում է) համալսարան:',
    phrase: 'Mi hermano ___ a la universidad.',
    options: ['va', 'viene', 'voy'],
    correct: 'va',
    explanation: 'Եղբայրը (Él) "գնում է" (ir) համալսարան:'
  },
  {
    speaker: 'Գոռ',
    text: 'Ե՞րբ եք դուք (գալիս) տուն:',
    phrase: '¿Cuándo ___ vosotros a casa?',
    options: ['venís', 'vamos', 'viene'],
    correct: 'venís',
    explanation: 'Դուք (Vosotros) "գալիս եք" (venir) տուն:'
  }
];

export default function GorGayaneQuest() {
  const [view, setView] = useState<'intro' | 'learning' | 'playing' | 'results'>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showIceCream, setShowIceCream] = useState(false);

  const activeQuest = QUEST_STEPS[currentStep];

  const handleAnswer = (option: string) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const isCorrect = option === activeQuest.correct;
    
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
      setShowIceCream(true);
      setTimeout(() => setShowIceCream(false), 2000);
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setIsAnswering(false);
      if (currentStep < QUEST_STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setView('results');
      }
    }, isCorrect ? 2000 : 4000);
  };

  const restart = () => {
    setScore(0);
    setCurrentStep(0);
    setView('intro');
  };

  return (
    <div className="min-h-screen bg-sky-900 text-white font-sans p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background with requested colors: Blue, Sky Blue */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Blue layers */}
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/30 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-sky-400/20 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-sky-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        <AnimatePresence mode="wait">
          {view === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-12 md:p-20 rounded-[4rem] shadow-2xl text-center space-y-12"
            >
              <div className="space-y-6">
                <div className="flex justify-center gap-4">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="p-6 bg-sky-500 rounded-3xl shadow-xl shadow-sky-500/30"
                  >
                    <User className="w-12 h-12 text-white" />
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                    className="p-6 bg-blue-500 rounded-3xl shadow-xl shadow-blue-500/30"
                  >
                    <User className="w-12 h-12 text-white" />
                  </motion.div>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white leading-tight">
                   Gor & Gayane <br/> <span className="text-sky-400 font-black">La Misión</span>
                </h1>
                <p className="text-slate-300 font-bold text-xl leading-relaxed max-w-lg mx-auto">
                   Միացեք Գոռին և Գայանեին իրենց արկածներում: Սովորեք <span className="text-sky-400">Ir</span> և <span className="text-blue-400">Venir</span> բայերը և ստացեք պաղպաղակ:
                </p>
              </div>

              <button
                onClick={() => setView('learning')}
                className="w-full py-8 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-full font-black text-3xl uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-6 group"
              >
                Սովորել Բայերը
                <ChevronRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          )}

          {view === 'learning' && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 md:p-16 rounded-[4rem] shadow-2xl space-y-10"
            >
              <div className="flex items-center gap-4 text-sky-400 border-b border-white/10 pb-6">
                <BookOpen className="w-10 h-10" />
                <h2 className="text-4xl font-black uppercase tracking-tighter">Բայերի Խոնարհումը</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Object.entries(CONJUGATIONS).map(([key, data]) => (
                  <div key={key} className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6">
                    <h3 className={`text-3xl font-black mb-4 ${key === 'ir' ? 'text-sky-400' : 'text-blue-400'}`}>
                      {data.title}
                    </h3>
                    <div className="space-y-3">
                      {data.forms.map((form, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                          <span className="text-slate-500 font-bold uppercase text-xs">{data.pronouns[i]}</span>
                          <span className="text-2xl font-black text-white">{form}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-blue-500/10 rounded-3xl border border-blue-500/20 text-blue-300 font-bold flex items-center gap-4">
                 <Sparkles className="w-12 h-12 shrink-0 animate-pulse" />
                 <p>Հիշեք. <b>Ir</b> նշանակում է գնալ դեպի ինչ-որ տեղ, իսկ <b>Venir</b> նշանակում է գալ դեպի խոսողը:</p>
              </div>

              <button
                onClick={() => setView('playing')}
                className="w-full py-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black text-3xl uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20"
              >
                Սկսել Քվեստը!
              </button>
            </motion.div>
          )}

          {view === 'playing' && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center bg-white/5 backdrop-blur-xl px-10 py-6 rounded-[2.5rem] border border-white/10 shadow-xl">
                 <div className="flex flex-col">
                   <div className="text-[10px] font-black uppercase tracking-[0.4em] text-sky-400 mb-1">Քայլ</div>
                   <div className="text-4xl font-black">{currentStep + 1} <span className="text-white/20 text-xl">/ {QUEST_STEPS.length}</span></div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <div className="text-right">
                       <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Պաղպաղակներ 🍦</div>
                       <div className="text-3xl font-black">{score}</div>
                    </div>
                 </div>
              </div>

              <motion.div
                key={currentStep}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-white/10 backdrop-blur-2xl border border-white/20 p-12 md:p-16 rounded-[4rem] shadow-2xl space-y-12 relative overflow-hidden min-h-[500px] flex flex-col justify-center"
              >
                {/* Character Icon Floating */}
                <div className={`absolute top-12 right-12 p-8 rounded-full border-4 ${activeQuest.speaker === 'Գոռ' ? 'bg-sky-600 border-sky-400' : 'bg-blue-600 border-blue-400'} opacity-80`}>
                   <User className="w-12 h-12 text-slate-900" />
                </div>

                <div className="space-y-10 relative z-10">
                   <div className="space-y-4">
                      <div className={`inline-block px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest ${activeQuest.speaker === 'Գոռ' ? 'bg-sky-600 text-white' : 'bg-blue-600 text-white'}`}>
                        {activeQuest.speaker}-ը ասում է՝
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-4">
                        «{activeQuest.text}»
                      </h2>
                      <div className="text-5xl md:text-6xl font-black text-sky-300 tracking-tight bg-black/20 p-8 rounded-3xl border-2 border-white/5">
                        {activeQuest.phrase.split('___')[0]}
                        <span className="inline-block w-32 h-2 bg-current mx-2 mb-2 animate-pulse" />
                        {activeQuest.phrase.split('___')[1]}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {activeQuest.options.map((opt) => (
                        <button
                          key={opt}
                          disabled={isAnswering}
                          onClick={() => handleAnswer(opt)}
                          className={`p-8 rounded-[2.5rem] font-black text-4xl transition-all border-b-8 active:translate-y-2 active:border-b-0 flex flex-col items-center gap-2 ${
                            feedback === 'correct' && opt === activeQuest.correct
                              ? 'bg-emerald-500 border-emerald-700 text-slate-900 shadow-xl shadow-emerald-500/20'
                              : feedback === 'wrong' && opt === activeQuest.correct
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                              : feedback === 'wrong' && opt !== activeQuest.correct
                              ? 'bg-rose-500 border-rose-800 text-white shadow-xl shadow-rose-500/20'
                              : 'bg-white/5 border-white/10 hover:bg-white/20 text-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Feedback Overlay */}
                <AnimatePresence>
                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-md p-12 text-center ${feedback === 'correct' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}
                    >
                      <div className={`p-8 rounded-[3rem] border-4 shadow-2xl space-y-6 ${feedback === 'correct' ? 'bg-emerald-900 border-emerald-500 text-emerald-400' : 'bg-rose-900 border-rose-500 text-rose-400'}`}>
                        {feedback === 'correct' ? (
                          <div className="flex flex-col items-center gap-4">
                            <CheckCircle2 className="w-24 h-24" />
                            <h3 className="text-5xl font-black uppercase">ՃԻՇՏ Է!</h3>
                            <motion.div
                               initial={{ scale: 0, rotate: -45 }}
                               animate={{ scale: 1.2, rotate: 0 }}
                               className="bg-white/10 p-4 rounded-full"
                            >
                               <IceCream className="w-16 h-16 text-pink-400" />
                            </motion.div>
                            <p className="text-white font-bold">Դու ստացար պաղպաղակ!</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                            <XCircle className="w-24 h-24" />
                            <h3 className="text-5xl font-black uppercase">ՍԽԱԼ Է...</h3>
                            <div className="p-6 bg-black/20 rounded-2xl border-l-8 border-rose-500 text-left">
                               <p className="text-white font-bold text-xl">{activeQuest.explanation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {view === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 backdrop-blur-3xl border border-white/20 p-16 md:p-24 rounded-[5rem] shadow-2xl text-center space-y-12 max-w-2xl mx-auto overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-sky-400 to-blue-600" />
              
              <div className="space-y-8 relative z-10">
                 <div className="relative inline-block">
                    <div className="w-48 h-48 bg-gradient-to-br from-sky-400 via-blue-500 to-sky-600 rounded-[4rem] flex items-center justify-center mx-auto shadow-2xl relative z-10">
                       <Trophy className="w-24 h-24 text-white" />
                    </div>
                    {/* Floating Ice Creams */}
                    <div className="absolute inset-0 pointer-events-none">
                       {[...Array(5)].map((_, i) => (
                         <motion.div
                           key={i}
                           animate={{ 
                             y: [0, -30, 0],
                             x: [0, Math.sin(i) * 30, 0],
                             scale: [1, 1.2, 1]
                           }}
                           transition={{ duration: 3 + i, repeat: Infinity }}
                           className="absolute"
                           style={{ 
                             top: `${Math.random() * 100}%`, 
                             left: `${Math.random() * 100}%` 
                           }}
                         >
                           <IceCream className="w-8 h-8 text-pink-400 shadow-lg" />
                         </motion.div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h2 className="text-6xl font-black tracking-tighter uppercase text-white leading-none">
                       ¡Felicidades <br/> <span className="text-sky-400">Vencedores!</span>
                    </h2>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs underline decoration-sky-500 underline-offset-8 decoration-4">Առաքելության Ավարտ</p>
                 </div>

                 <div className="p-12 bg-white/5 rounded-[4rem] border-4 border-white/5 space-y-4">
                    <div className="text-[12px] font-black uppercase tracking-[0.5em] text-slate-500 whitespace-nowrap">Հավաքած Պաղպաղակներ</div>
                    <div className="text-9xl font-black text-white tracking-tighter flex justify-center items-end gap-2">
                       {score} <IceCream className="w-12 h-12 text-pink-400 mb-4" />
                    </div>
                    <div className="text-slate-500 font-black">/ {QUEST_STEPS.length}</div>
                 </div>

                 <p className="text-slate-200 font-bold text-2xl leading-relaxed">
                    {score === QUEST_STEPS.length ? "ՀՐԱՇԱԼԻ՜ Է: Դուք բոլոր պաղպաղակները հավաքեցիք! Դուք Ir և Venir բայերի վարպետ եք:" :
                     score >= 7 ? "Շատ լավ արդյունք է! Գոռը և Գայանեն հպարտ են ձեզնով:" :
                     "Լավ սկիզբ է, բայց ավելի շատ պաղպաղակ ուտելու համար պետք է կրկնել բայերը!"}
                 </p>

                 <div className="pt-8 grid grid-cols-1 gap-4">
                    <button
                      onClick={restart}
                      className="py-10 bg-gradient-to-r from-sky-400 to-blue-500 hover:scale-105 text-white rounded-full font-black text-3xl uppercase tracking-widest transition-all shadow-2xl flex items-center justify-center gap-6"
                    >
                      <RotateCcw className="w-10 h-10" />
                      Նորից Խաղալ
                    </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Animated Ice Creams on correct feedback in playing */}
      {showIceCream && (
        <motion.div
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: [1, 1.5, 0], y: [-100, -300, -500], opacity: [1, 1, 0] }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
        >
          <div className="flex gap-4">
            <IceCream className="w-32 h-32 text-pink-400 shadow-2xl" />
            <IceCream className="w-32 h-32 text-yellow-200 shadow-2xl" />
            <IceCream className="w-32 h-32 text-orange-400 shadow-2xl" />
          </div>
        </motion.div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        
        .font-sans {
          font-family: 'Inter', system-ui, sans-serif;
        }

        h1, h2, h3, button, span, p, div {
          font-family: 'Inter', sans-serif !important;
        }
      `}} />
    </div>
  );
}
