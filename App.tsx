/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {O2Balance, SimulationPhase} from './components/O2Balance';
import {Quiz} from './components/Quiz';

/**
 * An animated, educational component explaining the intrapulmonary shunt.
 */
export const App: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [page, setPage] = useState('shunt');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [initialO2Phase, setInitialO2Phase] = useState<
    SimulationPhase | undefined
  >(undefined);

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const handleNavigateToBalance = (phase: SimulationPhase) => {
    setInitialO2Phase(phase);
    setPage('balance');
  };

  const getInteractionProps = (groupName: string) => ({
    onMouseEnter: () => setHoveredElement(groupName),
    onMouseLeave: () => setHoveredElement(null),
  });

  const getHighlightClasses = (
    groupName: string | string[],
    baseClass: string,
    type: 'path' | 'label' = 'label',
  ) => {
    const groups = Array.isArray(groupName) ? groupName : [groupName];
    if (!hoveredElement) return baseClass;

    if (groups.includes(hoveredElement)) {
      return `${baseClass} ${
        type === 'path' ? 'highlight-path' : 'highlight-label'
      }`;
    }

    // Special handling for the main "shunt" group
    if (
      hoveredElement === 'shunt' &&
      (groups.includes('partial-shunt') || groups.includes('full-shunt'))
    ) {
      return `${baseClass} ${
        type === 'path' ? 'highlight-path' : 'highlight-label'
      }`;
    }

    return `${baseClass} dimmed`;
  };

  if (page === 'balance') {
    return (
      <O2Balance
        onBack={() => {
          setInitialO2Phase(undefined);
          setPage('shunt');
        }}
        initialPhase={initialO2Phase}
      />
    );
  }

  if (page === 'quiz') {
    return (
      <Quiz
        onBack={() => setPage('shunt')}
        onNavigateToBalance={handleNavigateToBalance}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col items-center justify-center p-4">
      <div
        className={`w-full max-w-6xl mx-auto ${
          isAnimating ? 'animating' : ''
        }`}>
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Intrapulmonary Arteriovenous Shunt
          </h1>
          <p className="text-md text-gray-600 mt-1">
            An animated visualization of blood flow and oxygen content
          </p>
        </header>

        <div className="relative w-full border-2 border-gray-200 rounded-lg bg-white shadow-lg overflow-hidden p-2">
          <svg
            viewBox="0 0 800 450"
            className={`w-full h-auto ${hoveredElement ? 'is-interacting' : ''}`}
            aria-labelledby="animation-title"
            role="img">
            <title id="animation-title">
              Animation of intrapulmonary shunt
            </title>
            {/* Static Diagram Elements */}
            <g id="static-diagram">
              {/* Alveoli */}
              <g
                id="gas-exchange-alveolus"
                transform="translate(400, 100)"
                stroke="#6b7280"
                strokeWidth="0.5">
                <circle cx="0" cy="0" r="20" fill="#e5e7eb" />
                <circle cx="-15" cy="15" r="15" fill="#e5e7eb" />
                <circle cx="15" cy="15" r="12" fill="#e5e7eb" />
              </g>
              <g
                id="partial-shunt-alveolus"
                transform="translate(400, 225)"
                stroke="#6b7280"
                strokeWidth="0.5">
                <circle cx="0" cy="0" r="20" fill="#d1d5db" />
                <circle cx="-15" cy="15" r="15" fill="#d1d5db" />
                <circle cx="15" cy="15" r="12" fill="#d1d5db" />
              </g>
              <g
                id="shunt-alveolus"
                transform="translate(400, 350)"
                stroke="#4b5563"
                strokeWidth="0.5">
                <circle cx="0" cy="0" r="20" fill="#9ca3af" />
                <circle cx="-15" cy="15" r="15" fill="#9ca3af" />
                <circle cx="15" cy="15" r="12" fill="#9ca3af" />
              </g>

              {/* Capillary networks */}
              <path
                d="M 350 100 C 360 70, 440 70, 450 100 C 440 130, 360 130, 350 100"
                fill="none"
                stroke="#ef4444"
                strokeOpacity="0.3"
                strokeWidth="20"
              />
              <path
                d="M 350 225 C 360 195, 440 195, 450 225 C 440 255, 360 255, 350 225"
                fill="none"
                stroke="#a855f7"
                strokeOpacity="0.3"
                strokeWidth="20"
              />
              <path
                d="M 350 350 C 360 320, 440 320, 450 350 C 440 380, 360 380, 350 350"
                fill="none"
                stroke="#3b82f6"
                strokeOpacity="0.3"
                strokeWidth="20"
              />
            </g>

            {/* Animated Blood Flow */}
            <g
              id="animated-flow"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round">
              {/* Inflow */}
              <path
                id="venous-in"
                className={getHighlightClasses('venous', 'flow-path', 'path')}
                d="M 0 225 H 180"
                stroke="#3b82f6"
                {...getInteractionProps('venous')}
              />
              {/* Top Path: Gas Exchange */}
              <path
                id="gas-exchange-deox"
                className={getHighlightClasses(
                  'gas-exchange',
                  'flow-path',
                  'path',
                )}
                d="M 180 225 C 220 225, 230 135, 280 115 L 350 100"
                stroke="#3b82f6"
                {...getInteractionProps('gas-exchange')}
              />
              <path
                id="gas-exchange-ox"
                className={getHighlightClasses(
                  'gas-exchange',
                  'flow-path oxygenated',
                  'path',
                )}
                d="M 350 100 L 450 100 L 520 115 C 570 135, 580 225, 620 225"
                stroke="#ef4444"
                {...getInteractionProps('gas-exchange')}
              />
              {/* Middle Path: Partial Shunt */}
              <path
                id="partial-shunt-deox"
                className={getHighlightClasses(
                  ['shunt', 'partial-shunt'],
                  'flow-path',
                  'path',
                )}
                d="M 180 225 H 350"
                stroke="#3b82f6"
                {...getInteractionProps('partial-shunt')}
              />
              <path
                id="partial-shunt-ox"
                className={getHighlightClasses(
                  ['shunt', 'partial-shunt'],
                  'flow-path partially-oxygenated',
                  'path',
                )}
                d="M 350 225 H 620"
                stroke="#a855f7"
                {...getInteractionProps('partial-shunt')}
              />
              {/* Bottom Path: Full Shunt */}
              <path
                id="full-shunt"
                className={getHighlightClasses(
                  ['shunt', 'full-shunt'],
                  'flow-path',
                  'path',
                )}
                d="M 180 225 C 220 225, 230 315, 280 335 L 520 335 C 570 315, 580 225, 620 225"
                stroke="#3b82f6"
                {...getInteractionProps('full-shunt')}
              />
              {/* Outflow */}
              <path
                id="arterial-out"
                className={getHighlightClasses('mixed', 'flow-path mixed', 'path')}
                d="M 620 225 H 800"
                stroke="#8b5cf6"
                {...getInteractionProps('mixed')}
              />
            </g>

            {/* Labels and Text */}
            <g className="label-group" fontSize="14" fill="#374151">
              {/* Alveolar Gas Equation */}
              <g transform="translate(260, 5)">
                <rect
                  x="0"
                  y="0"
                  width="280"
                  height="45"
                  rx="5"
                  fill="#f0f9ff"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <text
                  x="140"
                  y="28"
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="monospace"
                  fill="#0369a1">
                  PAO₂ = (P<tspan baselineShift="sub">B</tspan>-P
                  <tspan baselineShift="sub">H₂O</tspan>)×FiO₂ - (PaCO₂/RQ)
                </text>
              </g>
              <path
                d="M 400 50 V 65"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />

              {/* Alveoli Labels */}
              <text x="400" y="75" textAnchor="middle" fontStyle="italic">
                Oxygenated Alveolus
              </text>
              <text x="400" y="200" textAnchor="middle" fontStyle="italic">
                Partial oxygenated Alveolus
              </text>
              <text x="400" y="400" textAnchor="middle" fontStyle="italic">
                Non-oxygenated Alveolus
              </text>

              {/* Venous Inflow Label */}
              <g
                className={getHighlightClasses('venous', 'label venous-in')}
                textAnchor="middle"
                {...getInteractionProps('venous')}>
                <text x="80" y="195">
                  O₂ delivered to the lung
                </text>
                <text x="80" y="215" fontWeight="bold">
                  Q<tspan baselineShift="sub">t</tspan> × C
                  <tspan baselineShift="sub">ven</tspan>
                </text>
              </g>

              {/* Gas Exchange Path Labels */}
              <g
                className={getHighlightClasses(
                  'gas-exchange',
                  'label gas-exchange',
                )}
                textAnchor="middle"
                {...getInteractionProps('gas-exchange')}>
                <text x="250" y="75">
                  (Q<tspan baselineShift="sub">t</tspan> - Q
                  <tspan baselineShift="sub">s</tspan>) × C
                  <tspan baselineShift="sub">ven</tspan>
                </text>
              </g>
              <g
                className={getHighlightClasses('gas-exchange', 'label oxygenated')}
                textAnchor="middle"
                {...getInteractionProps('gas-exchange')}>
                <text x="560" y="75">
                  (Q<tspan baselineShift="sub">t</tspan> - Q
                  <tspan baselineShift="sub">s</tspan>) × C
                  <tspan baselineShift="sub">c'O₂</tspan>
                </text>
              </g>

              {/* Partial Shunt Path Labels */}
              <g
                className={getHighlightClasses(
                  ['shunt', 'partial-shunt'],
                  'label partial-shunt',
                )}
                textAnchor="middle"
                {...getInteractionProps('partial-shunt')}>
                <text x="265" y="250">
                  Q<tspan baselineShift="sub">s-partial</tspan> × C
                  <tspan baselineShift="sub">ven</tspan>
                </text>
              </g>
              <g
                className={getHighlightClasses(
                  ['shunt', 'partial-shunt'],
                  'label partially-oxygenated',
                )}
                textAnchor="middle"
                {...getInteractionProps('partial-shunt')}>
                <text x="535" y="250">
                  Q<tspan baselineShift="sub">s-partial</tspan> × C'
                  <tspan baselineShift="sub">O₂</tspan>
                </text>
              </g>

              {/* Full Shunt Path Labels */}
              <g
                className={getHighlightClasses(
                  ['shunt', 'full-shunt'],
                  'label full-shunt',
                )}
                textAnchor="middle"
                {...getInteractionProps('full-shunt')}>
                <text x="280" y="360">
                  Q<tspan baselineShift="sub">s-true</tspan> × C
                  <tspan baselineShift="sub">ven</tspan>
                </text>
              </g>

              {/* Arterial Outflow Label */}
              <g
                className={getHighlightClasses('mixed', 'label mixed')}
                textAnchor="middle"
                {...getInteractionProps('mixed')}>
                <text x="710" y="250">
                  DO₂ = Arterial O₂ transport
                </text>
                <text x="710" y="270">
                  Q<tspan baselineShift="sub">t</tspan> × C
                  <tspan baselineShift="sub">aO₂</tspan>
                </text>
              </g>

              {/* Formula Boxes */}
              <g transform="translate(560, 110)">
                <rect
                  x="-145"
                  y="-15"
                  width="290"
                  height="45"
                  rx="5"
                  fill="#fff1f2"
                  stroke="#f43f5e"
                  strokeWidth="1.5"
                />
                <text
                  y="10"
                  fontSize="12"
                  fontFamily="monospace"
                  fill="#881337"
                  textAnchor="middle">
                  C<tspan baselineShift="sub">c'O₂</tspan> = (1.34×Hb×1.0) +
                  (PAO₂×0.003)
                </text>
              </g>
              <g transform="translate(520, 350)">
                <rect
                  x="0"
                  y="0"
                  width="260"
                  height="70"
                  rx="5"
                  fill="#f5f3ff"
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                />
                <text
                  x="130"
                  y="20"
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#5b21b6">
                  Shunt Equation
                </text>
                <text
                  x="25"
                  y="48"
                  fontSize="12"
                  fontFamily="monospace"
                  fill="#4c1d95">
                  Q<tspan baselineShift="sub">s</tspan>/Q
                  <tspan baselineShift="sub">t</tspan> =
                </text>
                <text
                  x="160"
                  y="40"
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="monospace"
                  fill="#4c1d95">
                  C<tspan baselineShift="sub">c'O₂</tspan> - C
                  <tspan baselineShift="sub">aO₂</tspan>
                </text>
                <line
                  x1="100"
                  y1="49"
                  x2="220"
                  y2="49"
                  stroke="#4c1d95"
                  strokeWidth="1"
                />
                <text
                  x="160"
                  y="60"
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="monospace"
                  fill="#4c1d95">
                  C<tspan baselineShift="sub">c'O₂</tspan> - C
                  <tspan baselineShift="sub">ven</tspan>
                </text>
              </g>

              {/* Side Labels */}
              <text
                x="190"
                y="60"
                fontWeight="bold"
                fill="#c81d25"
                className={getHighlightClasses(
                  'gas-exchange',
                  'label gas-exchange',
                )}
                {...getInteractionProps('gas-exchange')}>
                GAS EXCHANGE
              </text>
              <text
                x="190"
                y="300"
                fontWeight="bold"
                fill="#0077be"
                className={getHighlightClasses(
                  'shunt',
                  'label shunt',
                )}
                {...getInteractionProps('shunt')}>
                SHUNT
              </text>
            </g>
          </svg>
        </div>

        <footer className="mt-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div
            className="w-full md:flex-1 p-4 bg-white border-2 border-gray-200 rounded-lg shadow-md"
            role="contentinfo"
            aria-label="Legend and formulas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  Legend
                </h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>
                    <b>
                      Q<sub>t</sub>
                    </b>{' '}
                    = Cardiac Output
                  </li>
                  <li>
                    <b>
                      Q<sub>s</sub>
                    </b>{' '}
                    = Shunt Flow
                  </li>
                  <li>
                    <b>
                      C<sub>ven</sub>
                    </b>{' '}
                    = Venous O₂ Content
                  </li>
                  <li>
                    <b>
                      C<sub>c'</sub>O<sub>2</sub>
                    </b>{' '}
                    = End-capillary O₂ Content
                  </li>
                  <li>
                    <b>
                      C<sub>a</sub>O<sub>2</sub>
                    </b>{' '}
                    = Arterial O₂ Content
                  </li>
                  <li>
                    <b>
                      P<sub>x</sub>O<sub>2</sub>
                    </b>{' '}
                    = Partial Pressure of O₂
                  </li>
                  <li>
                    <b>
                      S<sub>x</sub>O<sub>2</sub>
                    </b>{' '}
                    = O₂ Saturation
                  </li>
                  <li>
                    <b>Hb</b> = Hemoglobin
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  Key Formulas
                </h3>
                <ul className="space-y-2 text-sm text-gray-700 font-mono">
                  <li>
                    <b>
                      Shunt (Q<sub>s</sub>/Q<sub>t</sub>):
                    </b>
                    <div className="pl-2 text-xs">
                      (C<sub>c'</sub>O<sub>2</sub> - C<sub>a</sub>O<sub>2</sub>) /
                      (C<sub>c'</sub>O<sub>2</sub> - C<sub>ven</sub>)
                    </div>
                  </li>
                  <li>
                    <b>
                      O₂ Content (C<sub>x</sub>O<sub>2</sub>):
                    </b>
                    <div className="pl-2 text-xs">
                      (Hb×1.34×S<sub>x</sub>O<sub>2</sub>) + (P<sub>x</sub>O
                      <sub>2</sub>×0.003)
                    </div>
                  </li>
                  <li>
                    <b>
                      Alveolar Gas (PAO<sub>2</sub>):
                    </b>
                    <div className="pl-2 text-xs">
                      (P<sub>B</sub>-P<sub>H₂O</sub>)×FiO<sub>2</sub> -
                      (PaCO<sub>2</sub>/RQ)
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center gap-4">
            <button
              onClick={() => {
                setInitialO2Phase(undefined);
                setPage('balance');
              }}
              className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100"
              aria-label="Visualize O2 Balance Calculation">
              Visualize O₂ Balance
            </button>
            <button
              onClick={() => setPage('quiz')}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100"
              aria-label="Take the quiz">
              Take a Quiz
            </button>
            <button
              onClick={toggleAnimation}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100"
              aria-controls="animated-flow"
              aria-pressed={isAnimating}>
              {isAnimating ? 'Reset Animation' : 'Play Animation'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};