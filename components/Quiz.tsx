/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {quizItems, chem, QuizItem} from '../quizData';
import { CheatSheetModal } from './CheatSheetModal';
import { ChevronDownIcon } from './icons';
import { SimulationPhase } from './O2Balance';

type Answers = {
  [key: string]: { [key: string]: string } | string;
};

type Feedback = {
  [key:number]: 'correct' | 'incorrect' | 'pending';
};

const getContextValues = (currentIndex: number) => {
    const values: {[key: string]: number} = {};
    const regexes: {[key: string]: RegExp} = {
        'FiO2': /FiO₂\s*=\s*([0-9.,]+)/i,
        'PB': /P(?:B)\s*=\s*([0-9.,]+)/i,
        'PH2O': /P(?:H₂O)\s*=\s*([0-9.,]+)/i,
        'PaCO2': /PaCO₂\s*=\s*([0-9.,]+)/i,
        'RQ': /RQ\s*=\s*([0-9.,]+)/i,
        'PaO2': /PaO₂\s*=\s*([0-9.,]+)/i,
        'SaO2': /SaO₂\s*=\s*([0-9.,]+)/i,
        'SvO2': /SvO₂\s*=\s*([0-9.,]+)/i,
        'PvO2': /PvO₂\s*=\s*([0-9.,]+)/i,
        'Hb': /Hb\s*=\s*([0-9.,]+)/i,
        'CvO2': /C(?:vO₂|vO2)\s*(?:=\s*|\()\s*([0-9.,]+)\)?/i,
        'CcO2': /C(?:c’O₂|cO₂|c'O₂)\s*(?:=\s*|\()\s*([0-9.,]+)\)?/i,
        'Qt': /Q̇t\s*=\s*([0-9.,]+)/i,
        'HF': /HF\s*=\s*([0-9.,]+)/i,
        'SV': /Schlagvolumen\s*von\s*([0-9.,]+)\s*ml/i,
    };

    // Go through all items up to and including the current question
    for (let i = 0; i <= currentIndex; i++) {
        const item = quizItems[i];
        let textToSearch = '';

        if (item.type === 'caseText') {
            textToSearch = item.content.join(' ');
        } else if (item.type === 'calc' || item.type === 'mc') {
            textToSearch = item.title;
        } else if (item.type === 'explanation') {
            textToSearch = item.question;
        }

        if (textToSearch) {
             for (const key in regexes) {
                // Use matchAll with a global flag to find all occurrences
                const globalRegex = new RegExp(regexes[key].source, 'gi');
                const matches = [...textToSearch.matchAll(globalRegex)];

                // If matches are found, use the last one to update the value.
                // This ensures that when parameters are updated (e.g. "before" and "after"),
                // the most recent value is used.
                if (matches.length > 0) {
                    const lastMatch = matches[matches.length - 1];
                    if (lastMatch && lastMatch[1]) {
                        values[key] = parseFloat(lastMatch[1].replace(',', '.'));
                    }
                }
            }
        }
    }
    return values;
};

export const Quiz: React.FC<{onBack: () => void, onNavigateToBalance: (phase: SimulationPhase) => void}> = ({onBack, onNavigateToBalance}) => {
  const [answers, setAnswers] = useState<Answers>({});
  const [feedback, setFeedback] = useState<Feedback>({});
  const [score, setScore] = useState(0);
  const [showFormulas, setShowFormulas] = useState<Set<number>>(new Set());
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [expandedExplanations, setExpandedExplanations] = useState<Set<number>>(new Set());
  
  const totalQuestions = quizItems.filter(item => item.type === 'calc' || item.type === 'mc').length;

  const handleCalcChange = (qIndex: number, field: string, value: string) => {
    setAnswers(prev => ({
        ...prev,
        [`q${qIndex}`]: {
            ...(prev[`q${qIndex}`] as object),
            [field]: value,
        }
    }));
  };

  const handleMcChange = (qIndex: number, value: string) => {
      setAnswers(prev => ({
          ...prev,
          [`q${qIndex}`]: value,
      }));
  };

  const checkAnswers = () => {
    let currentScore = 0;
    const newFeedback: Feedback = {};

    quizItems.forEach((q, i) => {
      if (q.type !== 'calc' && q.type !== 'mc') return;

      let isCorrect = false;
      const userAnswer = answers[`q${i}`];

      if (q.type === 'calc') {
        let allFieldsCorrect = true;
        if (!userAnswer) {
            allFieldsCorrect = false;
        } else {
            if (q.correct.pao2 !== undefined) {
                const val = parseFloat((userAnswer as any).pao2);
                if (isNaN(val) || Math.abs(val - q.correct.pao2) > 5) allFieldsCorrect = false;
            }
            if (q.correct.cao2 !== undefined) {
                const val = parseFloat((userAnswer as any).cao2);
                if (isNaN(val) || Math.abs(val - q.correct.cao2) > 0.5) allFieldsCorrect = false;
            }
            if (q.correct.shunt !== undefined) {
                const val = parseFloat((userAnswer as any).shunt);
                if (isNaN(val) || Math.abs(val - q.correct.shunt) > 3) allFieldsCorrect = false;
            }
            if (q.correct.do2 !== undefined) {
                const val = parseFloat((userAnswer as any).do2);
                if (isNaN(val) || Math.abs(val - q.correct.do2) > 20) allFieldsCorrect = false; // Higher tolerance for multi-step calc
            }
        }
        if (allFieldsCorrect) isCorrect = true;
      } else if (q.type === 'mc') {
        if (userAnswer && parseInt(userAnswer as string, 10) === q.answer) {
          isCorrect = true;
        }
      }

      if (isCorrect) {
        currentScore++;
        newFeedback[i] = 'correct';
      } else {
        newFeedback[i] = 'incorrect';
      }
    });

    setScore(currentScore);
    setFeedback(newFeedback);
  };

  const toggleFormula = (index: number) => {
    setShowFormulas(prev => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        return newSet;
    });
  };
  
  const toggleExplanation = (index: number) => {
    setExpandedExplanations(prev => {
        const newSet = new Set(prev);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        return newSet;
    });
  };

  const getFormulaDetails = (q: QuizItem, index: number) => {
    if (q.type !== 'calc') return null;

    const values = getContextValues(index);
    
    let formula = '';
    let example = '';
    let result = '';

    const { FiO2, PB, PH2O, PaCO2, RQ, Hb, SaO2, PaO2, CvO2, CcO2, Qt, HF, SV } = values;

    if (q.correct.pao2 !== undefined) {
      formula = `P${chem("AO2")} = (P_B - P${chem("H2")}O) × Fi${chem("O2")} - (Pa${chem("CO2")} / RQ)`;
      example = `= (${PB} - ${PH2O}) × ${FiO2} - (${PaCO2} / ${RQ})`;
      const calc = (PB - PH2O) * FiO2 - (PaCO2 / RQ);
      result = `≈ ${calc.toFixed(1)} mmHg`;
    } else if (q.correct.cao2 !== undefined) {
      formula = `C${chem("aO2")} = (Hb × 1.34 × Sa${chem("O2")}) + (Pa${chem("O2")} × 0.003)`;
      example = `= (${Hb} × 1.34 × ${SaO2}) + (${PaO2} × 0.003)`;
      const calc = (Hb * 1.34 * SaO2) + (PaO2 * 0.003);
      result = `≈ ${calc.toFixed(2)} mL/dL`;
    } else if (q.correct.shunt !== undefined) {
      // For shunt, we need CaO2 which is often the result of a previous question.
      // We look backwards from the current question to find the most recent CaO2 calculation's correct answer.
      let cao2_for_shunt: number | undefined;
      for (let i = index - 1; i >= 0; i--) {
        const prevItem = quizItems[i];
        if (prevItem.type === 'calc' && prevItem.correct.cao2 !== undefined) {
            cao2_for_shunt = prevItem.correct.cao2;
            break;
        }
      }

      // If no preceding CaO2 question is found, fall back to recalculating it from context.
      if (cao2_for_shunt === undefined) {
          cao2_for_shunt = (Hb * 1.34 * SaO2) + (PaO2 * 0.003);
      }

      formula = `Qs/Qt = (C${chem("c’O2")} - C${chem("aO2")}) / (C${chem("c’O2")} - C${chem("vO2")}) × 100`;
      example = `= (${CcO2} - ${cao2_for_shunt.toFixed(2)}) / (${CcO2} - ${CvO2}) × 100`;
      const calc = ((CcO2 - cao2_for_shunt) / (CcO2 - CvO2)) * 100;
      result = `≈ ${calc.toFixed(1)} %`;
    } else if (q.correct.do2 !== undefined) {
        const cao2 = (Hb * 1.34 * SaO2) + (PaO2 * 0.003);
        if (HF && SV) {
            const svInLiters = SV / 1000;
            const qt = HF * svInLiters;
            const do2 = qt * cao2 * 10;
            
            formula = `DO₂ = HF [bpm] × SV [L] × CaO₂ [mL/dL] × 10`;
            example = `CaO₂ ≈ ${cao2.toFixed(2)} | DO₂ = ${HF} × ${svInLiters.toFixed(3)} × ${cao2.toFixed(2)} × 10`;
            result = `≈ ${do2.toFixed(0)} mL/min`;
        } else {
            // Fallback for any other DO2 question that might exist
            const do2 = Qt * cao2 * 10;
            formula = `DO₂ = Q̇t [L/min] × CaO₂ [mL/dL] × 10`;
            example = `CaO₂ ≈ ${cao2.toFixed(2)} mL/dL | DO₂ = ${Qt} × ${cao2.toFixed(2)} × 10`;
            result = `≈ ${do2.toFixed(0)} mL/min`;
        }
    }
    return { formula, example, result };
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8 animate-fade-in">
        <div className="w-full max-w-7xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white">Interaktives Fallbeispiel</h1>
                <p className="text-md text-slate-400 mt-1">Lungen-Shunt & Oxygenierung</p>
            </header>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 sticky top-4 z-10 bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-slate-700">
                <div className="flex flex-wrap items-center gap-4">
                    <button
                        onClick={onBack}
                        className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500">
                        Zurück
                    </button>
                    <button
                        onClick={() => setIsCheatSheetOpen(true)}
                        className="px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                        Formel-Spickzettel
                    </button>
                    <button
                        onClick={checkAnswers}
                        className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500">
                        Alle prüfen
                    </button>
                </div>
                <div className="text-lg font-bold text-white">
                    Punkte: <span className="text-purple-400">{score}</span> / {totalQuestions}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {quizItems.map((item, i) => {
                    if (item.type === 'caseText') {
                        let phase: SimulationPhase = 'normal';
                        const titleLower = item.title.toLowerCase();
                        if (titleLower.includes('phase 1')) phase = 'normal';
                        else if (titleLower.includes('phase 2')) phase = 'ards';
                        else if (titleLower.includes('phase 3')) phase = 'shock';
                        else if (titleLower.includes('intervention')) phase = 'intervention';
                        else if (titleLower.includes('phase 5')) phase = 'acidosis';
                        else if (titleLower.includes('phase 6')) phase = 'ecmo';

                        return (
                            <div key={`text-${i}`} className="md:col-span-2 xl:col-span-3 bg-slate-800/50 border border-purple-500/30 rounded-xl shadow-lg p-5">
                                <h2 className="text-xl font-bold text-purple-400 mb-3">{item.title}</h2>
                                {item.content.map((paragraph, p_idx) => (
                                    <p key={p_idx} className="text-slate-300 leading-relaxed mb-2 last:mb-0">{paragraph}</p>
                                ))}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => onNavigateToBalance(phase)}
                                        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-all duration-200 transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 flex items-center gap-2"
                                        aria-label={`Visualisiere ${item.title} in der O₂-Bilanz`}
                                    >
                                        <span>Visualisiere in O₂-Bilanz</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )
                    }

                    if (item.type === 'explanation') {
                        const isExpanded = expandedExplanations.has(i);
                        return (
                            <div key={`exp-${i}`} className="md:col-span-1 bg-slate-800 rounded-xl shadow-lg p-5 flex flex-col gap-4 border border-slate-700 transition-all duration-300">
                                <button onClick={() => toggleExplanation(i)} className="w-full text-left flex justify-between items-start gap-2 group" aria-expanded={isExpanded}>
                                  <h3 className="font-bold text-teal-400 group-hover:text-teal-300">{item.question}</h3>
                                  <ChevronDownIcon className={`w-5 h-5 text-slate-400 transform transition-transform flex-shrink-0 mt-1 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                                {isExpanded && (
                                  <div className="text-slate-300 leading-relaxed space-y-3 animate-fade-in text-sm">
                                      {item.answer.map((paragraph, p_idx) => (
                                          <p key={p_idx} dangerouslySetInnerHTML={{ __html: paragraph.replace(/→/g, '<span class="text-teal-400 font-bold">→</span>') }}></p>
                                      ))}
                                  </div>
                                )}
                              </div>
                        );
                    }


                    // It's a question
                    const q = item;
                    return (
                        <div key={i} className="bg-slate-800 rounded-xl shadow-lg p-5 flex flex-col gap-4 border border-slate-700">
                            <h3 className="font-bold text-white"><span className="font-normal text-slate-300">{q.title}</span></h3>
                            
                            {q.type === 'calc' && (
                                <div className="flex flex-col gap-3">
                                    {q.correct.pao2 !== undefined && <label className="flex flex-col gap-1 text-sm text-slate-400">P{chem("AO2")} (mmHg): <input type="number" step="0.1" onChange={(e) => handleCalcChange(i, 'pao2', e.target.value)} className="bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500" /></label>}
                                    {q.correct.cao2 !== undefined && <label className="flex flex-col gap-1 text-sm text-slate-400">C{chem("aO2")} (mL/dL): <input type="number" step="0.1" onChange={(e) => handleCalcChange(i, 'cao2', e.target.value)} className="bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500" /></label>}
                                    {q.correct.shunt !== undefined && <label className="flex flex-col gap-1 text-sm text-slate-400">Qs/Qt (%): <input type="number" step="0.1" onChange={(e) => handleCalcChange(i, 'shunt', e.target.value)} className="bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500" /></label>}
                                    {q.correct.do2 !== undefined && <label className="flex flex-col gap-1 text-sm text-slate-400">DO₂ (mL/min): <input type="number" step="1" onChange={(e) => handleCalcChange(i, 'do2', e.target.value)} className="bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500" /></label>}
                                    <button onClick={() => toggleFormula(i)} className="text-sm text-purple-400 hover:text-purple-300 self-start mt-1">
                                        {showFormulas.has(i) ? 'Formel ausblenden' : 'Formel anzeigen'}
                                    </button>
                                    {showFormulas.has(i) && (
                                        <div className="text-xs bg-slate-900/50 p-3 rounded-md border border-slate-700 text-slate-300 flex flex-col gap-2">
                                            <p><strong>Formel:</strong> {getFormulaDetails(q, i)?.formula}</p>
                                            <p><strong>Beispiel:</strong> <span className="font-mono">{getFormulaDetails(q, i)?.example}</span></p>
                                            <p><strong>Ergebnis:</strong> <span className="font-mono">{getFormulaDetails(q, i)?.result}</span></p>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {q.type === 'mc' && (
                               <div className="flex flex-col gap-2">
                                    {q.options.map((opt, oi) => (
                                        <label key={oi} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-700/50 transition-colors cursor-pointer">
                                            <input type="radio" name={`q${i}`} value={oi} onChange={(e) => handleMcChange(i, e.target.value)} className="form-radio bg-slate-700 border-slate-500 text-purple-500 focus:ring-purple-500" />
                                            <span className="text-slate-300">{opt}</span>
                                        </label>
                                    ))}
                               </div>
                            )}
                            
                            {feedback[i] && (
                                <div className={`mt-2 font-bold text-center p-2 rounded-md ${feedback[i] === 'correct' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {feedback[i] === 'correct' ? 'Richtig' : 'Falsch'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <footer className="text-center mt-8 text-xs text-slate-500">
                Toleranz: ±5 (PAO₂), ±0.5 (CaO₂), ±3 (Qs/Qt), ±20 (DO₂)
            </footer>
        </div>
        {isCheatSheetOpen && <CheatSheetModal onClose={() => setIsCheatSheetOpen(false)} />}
    </div>
  );
};