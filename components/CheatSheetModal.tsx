/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {XMarkIcon} from './icons';

/**
 * A modal component that displays a "cheat sheet" of formulas and nomenclature for the quiz.
 */
export const CheatSheetModal: React.FC<{onClose: () => void}> = ({
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="cheatsheet-title">
      <div
        className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-3xl relative p-6 m-4 text-gray-200 border border-slate-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white z-10 p-2 rounded-full bg-transparent hover:bg-slate-700 transition-colors"
          aria-label="Close">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 id="cheatsheet-title" className="text-2xl font-bold text-white mb-6">
          Formeln & Nomenklatur
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Formulas Section */}
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3 border-b border-slate-600 pb-2">
              Formeln
            </h3>
            <div className="space-y-4 text-sm font-mono bg-slate-900/50 p-4 rounded-md">
              <div>
                <p className="font-bold">PAO<sub>2</sub></p>
                <p className="pl-2"> = (P<sub>b</sub> - 47) · FiO<sub>2</sub> - (PaCO<sub>2</sub> / RQ)</p>
              </div>
              <div>
                <p className="font-bold">CaO<sub>2</sub></p>
                <p className="pl-2"> = 1.34 · Hb · SaO<sub>2</sub> + 0.003 · PaO<sub>2</sub></p>
              </div>
               <div>
                <p className="font-bold">CvO<sub>2</sub></p>
                <p className="pl-2"> = 1.34 · Hb · SvO<sub>2</sub> + 0.003 · PvO<sub>2</sub></p>
                 <p className="text-xs text-slate-400 pl-2">(wenn SvO<sub>2</sub>/PvO<sub>2</sub> vorliegt)</p>
                 <p className="pl-2"><i>oder</i> = CaO<sub>2</sub> - (VO<sub>2</sub> / (Qt · 10))</p>
                 <p className="text-xs text-slate-400 pl-2">(wenn VO<sub>2</sub> bekannt)</p>
              </div>
              <div>
                <p className="font-bold">Cc'O<sub>2</sub></p>
                <p className="pl-2"> = 1.34 · Hb · 1.00 + 0.003 · PAO<sub>2</sub></p>
              </div>
              <div>
                <p className="font-bold">Q<sub>s</sub>/Q<sub>t</sub></p>
                <p className="pl-2"> = (Cc'O<sub>2</sub> - CaO<sub>2</sub>) / (Cc'O<sub>2</sub> - CvO<sub>2</sub>)</p>
              </div>
              <div>
                <p className="font-bold">Q<sub>s</sub></p>
                 <p className="pl-2">= Q<sub>t</sub> · (Q<sub>s</sub>/Q<sub>t</sub>)</p>
              </div>
            </div>
          </div>

          {/* Legend Section */}
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3 border-b border-slate-600 pb-2">
              Legende / Nomenklatur
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li><b>CaO<sub>2</sub></b> = arterieller O₂-Gehalt [mL/dL]</li>
              <li><b>CvO<sub>2</sub></b> = venöser O₂-Gehalt [mL/dL]</li>
              <li><b>Cc'O<sub>2</sub></b> = endkapillärer O₂-Gehalt [mL/dL]</li>
              <li><b>VO<sub>2</sub></b> = O₂-Verbrauch [mL/min]</li>
              <li><b>Q<sub>t</sub></b> = Herzzeitvolumen [L/min]</li>
              <li><b>Q<sub>s</sub></b> = Shuntfluss [L/min]</li>
              <li><b>Q<sub>s</sub>/Q<sub>t</sub></b> = Shuntfraktion [%]</li>
              <li><b>PAO<sub>2</sub></b> = alveolärer O₂-Partialdruck [mmHg]</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
