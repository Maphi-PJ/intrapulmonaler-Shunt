/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState, useEffect} from 'react';

export const simulationPhases = {
  normal: {
    title: 'Oxygen Balance Calculation',
    description: 'A flowchart of O₂ Delivery (DO₂) vs. O₂ Consumption (VO₂)',
    button: 'Phase 1: Normal',
  },
  ards: {
    title: 'Pathophysiology of ARDS',
    description: 'Modeling the impact of increased intrapulmonary shunt',
    button: 'Phase 2: ARDS',
  },
  shock: {
    title: 'Bleeding & Hemorrhagic Shock',
    description: 'Modeling hemodynamic instability from blood loss',
    button: 'Phase 3: Bleeding',
  },
  intervention: {
    title: 'Therapeutic Intervention',
    description: 'Modeling ventilation, transfusion, and sedation effects',
    button: 'Phase 4: Intervention',
  },
  acidosis: {
    title: 'Metabolic Acidosis & Fever',
    description: 'Modeling the right-shift of the O₂-Hb dissociation curve',
    button: 'Phase 5: Right Shift',
  },
  ecmo: {
    title: 'ECMO Support',
    description:
      'Modeling extracorporeal membrane oxygenation for refractory hypoxemia',
    button: 'Phase 6: ECMO',
  },
};

export type SimulationPhase = keyof typeof simulationPhases;

const FlowchartNode: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  lines: string[];
  className?: string;
  titleSize?: string;
}> = ({
  x,
  y,
  width,
  height,
  title,
  lines,
  className = '',
  titleSize = '12px',
}) => (
  <g transform={`translate(${x}, ${y})`} className={className}>
    <rect
      x="0"
      y="0"
      width={width}
      height={height}
      rx="8"
      ry="8"
      fill="#fff"
      stroke="#d1d5db"
      strokeWidth="2"
    />
    <text
      x={width / 2}
      y="20"
      textAnchor="middle"
      fontWeight="bold"
      fontSize={titleSize}
      fill="#1f2937">
      {title}
    </text>
    {lines.map((line, index) => (
      <text
        key={index}
        x={width / 2}
        y={40 + index * 16}
        textAnchor="middle"
        fontSize="11px"
        fill="#4b5563"
        fontFamily="monospace">
        {line}
      </text>
    ))}
  </g>
);

const Connector: React.FC<{path: string; className?: string}> = ({
  path,
  className = '',
}) => (
  <path
    d={path}
    fill="none"
    stroke="#6b7280"
    strokeWidth="1.5"
    markerEnd="url(#arrowhead)"
    className={className}
  />
);

/**
 * An animated, educational component explaining the O2 balance calculation.
 */
export const O2Balance: React.FC<{
  onBack: () => void;
  initialPhase?: SimulationPhase;
}> = ({onBack, initialPhase}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [simulationPhase, setSimulationPhase] =
    useState<SimulationPhase>(initialPhase ?? 'normal');

  useEffect(() => {
    // Automatically start the animation when the component mounts.
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  const handlePhaseChange = (phase: SimulationPhase) => {
    // Reset and restart the animation when the phase changes.
    setIsAnimating(false);
    setSimulationPhase(phase);
    setTimeout(() => {
      setIsAnimating(true);
    }, 50);
  };

  const getNodeContent = (nodeId: string) => {
    // FIX: Corrected the type for `content` to match the nested object structure.
    const content: {
      [key in SimulationPhase]: Record<string, {title: string; lines: string[]}>;
    } = {
      normal: {
        do2: {title: 'O₂ Delivery (DO₂)', lines: ['DO₂ = Qt x CaO₂']},
        qt: {
          title: 'Cardiac Output (Qt)',
          lines: ['Qt = Heart Rate (HR) x Stroke Volume (SV)'],
        },
        cao2: {
          title: 'Arterial O₂ Content (CaO₂)',
          lines: ['CaO₂ = (SaO₂ x Hb x 1.34)', '+ (PaO₂ x 0.003)'],
        },
        vo2: {
          title: 'O₂ Consumption (VO₂)',
          lines: ['Fick: Qt x (CaO₂ - CvO₂)', 'Resp: MV x (FiO₂ - FeO₂)'],
        },
        cvo2: {
          title: 'Venous O₂ Content (CvO₂)',
          lines: ['CvO₂ = (SvO₂ x Hb x 1.34)', '+ (PvO₂ x 0.003)'],
        },
      },
      ards: {
        do2: {title: 'DO₂ (Compromised)', lines: ['DO₂ = Qt x CaO₂']},
        qt: {
          title: 'Cardiac Output (Qt)',
          lines: ['↑ HR (Tachycardia) x SV'],
        },
        cao2: {
          title: 'Arterial O₂ Content (CaO₂)',
          lines: ['(↓ SaO₂ x Hb x 1.34)', '+ (↓ PaO₂ x 0.003)'],
        },
        vo2: {
          title: 'O₂ Consumption (VO₂)',
          lines: ['↑ O₂ Extraction Ratio', 'VO₂ = Qt x (↓CaO₂ - ↓↓CvO₂)'],
        },
        cvo2: {
          title: 'Venous O₂ Content (CvO₂)',
          lines: ['↓↓ (SvO₂ x Hb x 1.34)', '+ (PvO₂ x 0.003)'],
        },
      },
      shock: {
        do2: {
          title: 'DO₂ (Critically Low)',
          lines: ['↓↓↓ DO₂ = ↓Qt x ↓CaO₂'],
        },
        qt: {
          title: 'Cardiac Output (Qt)',
          lines: ['↓ Qt = ↑ HR x ↓↓ SV'],
        },
        cao2: {
          title: 'Arterial O₂ Content (CaO₂)',
          lines: ['↓↓ (SaO₂ x ↓↓ Hb x 1.34)'],
        },
        vo2: {
          title: 'O₂ Consumption (VO₂)',
          lines: ['↑↑ O₂ Extraction Ratio', 'VO₂ ~ constant'],
        },
        cvo2: {
          title: 'Venous O₂ Content (CvO₂)',
          lines: ['↓↓↓ CvO₂ (Tissue Hypoxia)'],
        },
      },
      intervention: {
        do2: {title: 'DO₂ (Improving)', lines: ['↑↑ DO₂ = ↑ Qt x ↑ CaO₂']},
        qt: {
          title: 'Cardiac Output (Qt)',
          lines: ['↑ Qt = ↓ HR x ↑ SV (Volume)'],
        },
        cao2: {
          title: 'Arterial O₂ Content (CaO₂)',
          lines: ['↑ (↑SaO₂, ↑Hb, ↑PaO₂)'],
        },
        vo2: {
          title: 'O₂ Consumption (VO₂)',
          lines: ['↓ VO₂ (Sedation)'],
        },
        cvo2: {
          title: 'Venous O₂ Content (CvO₂)',
          lines: ['↑ CvO₂ (Improved O₂ER)'],
        },
      },
      acidosis: {
        do2: {
          title: 'O₂ Delivery (DO₂)',
          lines: ['DO₂ = Qt x ↓CaO₂'],
        },
        qt: {
          title: 'Cardiac Output (Qt)',
          lines: ['Maintained'],
        },
        cao2: {
          title: 'Arterial O₂ Content (CaO₂)',
          lines: ['↓ (↓SaO₂ at same PaO₂)'],
        },
        vo2: {
          title: 'O₂ Consumption (VO₂)',
          lines: ['↑ VO₂ (Fever)'],
        },
        cvo2: {
          title: 'Venous O₂ Content (CvO₂)',
          lines: ['↓ Facilitated O₂ Release'],
        },
      },
      ecmo: {
        do2: {title: 'DO₂ (ECMO Supported)', lines: ['ECMO provides DO₂']},
        qt: {
          title: 'Cardiac Output (Qt)',
          lines: ['Native Qt + ECMO Flow'],
        },
        cao2: {
          title: 'Art. O₂ Content (↑CaO₂)',
          lines: ['Determined by ECMO'],
        },
        vo2: {
          title: 'O₂ Consumption (VO₂)',
          lines: ['VO₂ = (Qnative + QECMO)', '× (CaO₂ - CvO₂)'],
        },
        cvo2: {
          title: 'Venous O₂ Content (CvO₂)',
          lines: ['High SvO₂ in ECMO return'],
        },
      },
    };
    return content[simulationPhase][nodeId] || content['normal'][nodeId];
  };

  const getNodeClass = (nodeId: string) => {
    const classes: {[key in SimulationPhase]: string} = {
      normal: '',
      ards: {
        do2: 'node-critical',
        qt: 'node-warning',
        cao2: 'node-critical',
        vo2: 'node-warning',
        cvo2: 'node-severe',
      }[nodeId],
      shock: {
        do2: 'node-critical',
        qt: 'node-critical',
        cao2: 'node-critical',
        vo2: 'node-warning',
        cvo2: 'node-critical',
      }[nodeId],
      intervention: {
        do2: 'node-improving',
        qt: 'node-improving',
        cao2: 'node-improving',
        vo2: 'node-improving',
        cvo2: 'node-improving',
      }[nodeId],
      acidosis: {
        do2: 'node-warning',
        qt: '',
        cao2: 'node-warning',
        vo2: 'node-warning',
        cvo2: 'node-severe',
      }[nodeId],
      ecmo: {
        do2: 'node-improving',
        qt: 'node-improving',
        cao2: 'node-improving',
        vo2: 'node-improving',
        cvo2: 'node-improving',
      }[nodeId],
    };
    return classes[simulationPhase] || '';
  };

  return (
    <div
      className="min-h-screen bg-gray-100 text-gray-800 font-sans flex flex-col items-center justify-center p-4 animate-fade-in"
      key="o2balance_flowchart">
      <div
        className={`w-full max-w-7xl mx-auto ${
          isAnimating ? 'animating-flowchart' : ''
        } ${simulationPhase}-model-active`}>
        <header className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {simulationPhases[simulationPhase].title}
          </h1>
          <p className="text-md text-gray-600 mt-1">
            {simulationPhases[simulationPhase].description}
          </p>
        </header>

        <div className="relative w-full border-2 border-gray-200 rounded-lg bg-white shadow-lg overflow-hidden p-2">
          <svg
            viewBox="0 0 1000 750"
            className="w-full h-auto"
            aria-labelledby="balance-title"
            role="img">
            <title id="balance-title">Flowchart of O2 Balance Calculation</title>
            <defs>
              <marker
                id="arrowhead"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
              </marker>
              <marker
                id="arrowhead-red"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
              </marker>
              <marker
                id="arrowhead-green"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
              </marker>
            </defs>
            <g className="lung-pathway">
              {/* Main Title */}
              <g
                className="flow-element"
                opacity={simulationPhase === 'ecmo' ? 0.3 : 1}>
                <text
                  x="500"
                  y="40"
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="bold"
                  fill="#374151">
                  O₂ Balance
                </text>
                <text
                  x="500"
                  y="65"
                  textAnchor="middle"
                  fontSize="16"
                  fill="#4b5563">
                  DO₂ vs VO₂
                </text>
              </g>

              {/* Connectors from Title */}
              <Connector
                path="M 500 80 C 450 90, 300 90, 250 110"
                className="connector"
              />
              <Connector
                path="M 500 80 C 550 90, 700 90, 750 110"
                className="connector"
              />

              {/* Column 1: DO2 */}
              <FlowchartNode
                x={150}
                y={110}
                width={200}
                height={70}
                title={getNodeContent('do2').title}
                lines={getNodeContent('do2').lines}
                titleSize="16px"
                className={`flow-element ${getNodeClass('do2')}`}
              />
              <Connector path="M 180 180 V 210" className="connector" />
              <Connector path="M 320 180 V 210" className="connector" />

              <FlowchartNode
                x={50}
                y={210}
                width={220}
                height={70}
                title={getNodeContent('qt').title}
                lines={getNodeContent('qt').lines}
                className={`flow-element ${getNodeClass('qt')}`}
              />

              <FlowchartNode
                x={300}
                y={210}
                width={200}
                height={85}
                title={getNodeContent('cao2').title}
                lines={getNodeContent('cao2').lines}
                className={`flow-element ${getNodeClass('cao2')}`}
              />
              <g opacity={simulationPhase === 'ecmo' ? 0.3 : 1}>
                <Connector path="M 80 280 V 320" className="connector" />
                <Connector path="M 240 280 V 320" className="connector" />

                <FlowchartNode
                  x={20}
                  y={320}
                  width={120}
                  height={180}
                  title="Heart Rate (HR)"
                  lines={[
                    'Regulated by:',
                    'Sympathetic Tone',
                    'via:',
                    ' • RAAS',
                    ' • Chemoreceptors',
                    ' • Baroreceptors',
                  ]}
                  className="flow-element"
                />

                <FlowchartNode
                  x={180}
                  y={320}
                  width={140}
                  height={70}
                  title="Stroke Volume (SV)"
                  lines={[
                    'Determined by:',
                    'Preload, Afterload,',
                    'Contractility',
                  ]}
                  className="flow-element"
                />
                {/* Connector from Stroke Volume splitting to Preload and Afterload */}
                <Connector
                  path="M 250 390 V 410 H 180 V 430"
                  className="connector"
                />
                <Connector
                  path="M 250 410 H 320 V 430"
                  className="connector"
                />

                <FlowchartNode
                  x={120}
                  y={430}
                  width={120}
                  height={100}
                  title="Preload"
                  lines={[
                    'Frank-Starling',
                    'Mechanism',
                    'Influenced by',
                    'venous return',
                  ]}
                  className="flow-element"
                />

                <FlowchartNode
                  x={260}
                  y={430}
                  width={120}
                  height={100}
                  title="Afterload"
                  lines={[
                    'Influenced by SVR',
                    '(Systemic Vascular',
                    'Resistance)',
                  ]}
                  className="flow-element"
                />
              </g>
              {/* Column 2: VO2 */}
              <FlowchartNode
                x={650}
                y={110}
                width={200}
                height={100}
                title={getNodeContent('vo2').title}
                titleSize="16px"
                lines={getNodeContent('vo2').lines}
                className={`flow-element ${getNodeClass('vo2')}`}
              />

              <Connector path="M 750 210 V 250" className="connector" />

              <FlowchartNode
                x={650}
                y={250}
                width={200}
                height={85}
                title={getNodeContent('cvo2').title}
                lines={getNodeContent('cvo2').lines}
                className={`flow-element ${getNodeClass('cvo2')}`}
              />
            </g>
            {/* Phase specific elements */}
            {simulationPhase === 'ards' && (
              <g className="animate-fade-in">
                <path
                  d="M 400 190 V 205"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-red)"
                />
                <g transform="translate(400, 150)">
                  <rect
                    x="-70"
                    y="-15"
                    width="140"
                    height="55"
                    fill="#fef2f2"
                    stroke="#ef4444"
                    strokeWidth="2"
                    rx="5"
                  />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="#b91c1c">
                    ↑↑ Shunt
                  </text>
                  <text
                    x="0"
                    y="25"
                    textAnchor="middle"
                    fontSize="11"
                    fill="#dc2626">
                    (V/Q Mismatch)
                  </text>
                </g>
              </g>
            )}
            {simulationPhase === 'shock' && (
              <g className="animate-fade-in">
                <path
                  d="M 215 300 L 215 285"
                  stroke="#dc2626"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead-red)"
                />
                <text
                  x="225"
                  y="295"
                  fill="#b91c1c"
                  fontSize="12"
                  fontWeight="bold">
                  ↓↓ Hb, ↓↓ Preload
                </text>
              </g>
            )}
            {simulationPhase === 'intervention' && (
              <g className="animate-fade-in">
                {/* Sedation intervention for VO2 */}
                <g transform="translate(550, 160)">
                  <text
                    x="45"
                    y="-5"
                    textAnchor="middle"
                    fill="#14532d"
                    fontSize="12"
                    fontWeight="bold">
                    Sedation
                  </text>
                  {/* Syringe Icon */}
                  <g transform="translate(45, 15) rotate(-45)">
                    <rect
                      x="-20"
                      y="-2"
                      width="25"
                      height="4"
                      rx="1"
                      fill="#9ca3af"
                    />
                    <rect
                      x="-22"
                      y="-3"
                      width="5"
                      height="6"
                      rx="1"
                      fill="#9ca3af"
                    />
                    <rect
                      x="5"
                      y="-3"
                      width="10"
                      height="6"
                      rx="1"
                      fill="#d1d5db"
                    />
                    {/* White liquid */}
                    <rect x="7" y="-2" width="6" height="4" fill="#f3f4f6" />
                    <line
                      x1="15"
                      y1="0"
                      x2="25"
                      y2="0"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                    />
                  </g>
                  <path
                    d="M 80 5 H 100"
                    stroke="#16a34a"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead-green)"
                  />
                </g>

                {/* Transfusion intervention for CaO2 */}
                <g transform="translate(330, 150)">
                  {/* Blood Bag Icon */}
                  <g transform="translate(0, 0) scale(0.8)">
                    <path
                      d="M 0 0 C -5 5, -5 25, 0 30 L 20 30 C 25 25, 25 5, 20 0 Z"
                      fill="#b91c1c"
                    />
                    <rect x="9" y="28" width="2" height="5" fill="#f1f5f9" />
                    <path
                      d="M 10 33 C 10 40, 15 40, 15 33"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="1.5"
                    />
                  </g>
                  <text
                    x="30"
                    y="15"
                    fill="#14532d"
                    fontSize="12"
                    fontWeight="bold">
                    Transfusion
                  </text>
                  <path
                    d="M 10 35 V 55"
                    stroke="#16a34a"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead-green)"
                  />
                </g>

                {/* Intubation intervention for CaO2 */}
                <g transform="translate(450, 150)">
                  {/* Tracheal Tube Icon */}
                  <g transform="translate(30, -15) scale(0.8)">
                    <path
                      d="M 0 0 Q 20 -5, 25 15 T 20 40"
                      stroke="#a5f3fc"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <ellipse
                      cx="21"
                      cy="32"
                      rx="6"
                      ry="3"
                      fill="#67e8f9"
                    />
                    <rect
                      x="-3"
                      y="-5"
                      width="6"
                      height="5"
                      fill="#e0f2fe"
                    />
                  </g>
                  <text
                    x="40"
                    y="30"
                    textAnchor="middle"
                    fill="#14532d"
                    fontSize="12"
                    fontWeight="bold">
                    Intubation
                  </text>
                  <path
                    d="M 40 40 V 55"
                    stroke="#16a34a"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead-green)"
                  />
                </g>
              </g>
            )}
            {simulationPhase === 'acidosis' && (
              <g className="animate-fade-in" transform="translate(420, 450)">
                <rect
                  x="-70"
                  y="-15"
                  width="240"
                  height="120"
                  fill="#fff"
                  stroke="#ca8a04"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x="50"
                  y="5"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#713f12">
                  O₂-Hb Dissociation Curve
                </text>
                <path
                  d="M -50 85 L 150 85"
                  stroke="#4b5563"
                  strokeWidth="1.5"
                />
                <path d="M -50 85 L -50 15" stroke="#4b5563" strokeWidth="1.5" />
                <text x="50" y="100" fontSize="10" fill="#4b5563">
                  PaO₂
                </text>
                <text
                  transform="translate(-60 50) rotate(-90)"
                  fontSize="10"
                  fill="#4b5563">
                  SaO₂
                </text>
                <path
                  d="M -40,80 C 10,80 30,25 100,20"
                  stroke="#6b7280"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 2"
                />
                <path
                  d="M -40,80 C 20,80 50,45 120,40"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  fill="none"
                />
                <text x="100" y="60" fontSize="10" fill="#ca8a04">
                  Right Shift
                </text>
              </g>
            )}
            {simulationPhase === 'ecmo' && (
              <g className="animate-fade-in">
                <rect
                  x="450"
                  y="600"
                  width="100"
                  height="60"
                  rx="8"
                  fill="#eff6ff"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
                <text
                  x="500"
                  y="625"
                  textAnchor="middle"
                  fontWeight="bold"
                  fill="#1e3a8a">
                  ECMO
                </text>
                <text
                  x="500"
                  y="645"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#1e40af">
                  Oxygenator
                </text>
                {/* Deoxygenated blood to ECMO from consumption pathway - REMOVED */}
                {/* Oxygenated blood from ECMO to Arterial side */}
                <path
                  d="M 450 630 H 400 V 295"
                  stroke="#ef4444"
                  fill="none"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead-red)"
                />
                {/* Oxygenated blood from ECMO to Venous side */}
                <path
                  d="M 550 630 H 750 V 335"
                  stroke="#2563eb"
                  fill="none"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            )}
          </svg>
        </div>

        <footer className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div
            className="w-full md:w-auto p-4 bg-white border-2 border-gray-200 rounded-lg shadow-md"
            role="contentinfo">
            <h3 className="font-bold text-lg mb-2 text-gray-900">Legend</h3>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-700">
              <li>
                <b>
                  Q<sub>t</sub>
                </b>
                : Cardiac Output
              </li>
              <li>
                <b>Hb</b>: Hemoglobin
              </li>
              <li>
                <b>MAP</b>: Mean Arterial Pressure
              </li>
              <li>
                <b>CVP</b>: Central Venous Pressure
              </li>
              <li>
                <b>SVR</b>: Systemic Vascular Resistance
              </li>
              <li>
                <b>MV</b>: Minute Ventilation
              </li>
              <li>
                <b>SaO₂/SvO₂</b>: Art./Ven. O₂ Sat.
              </li>
              <li>
                <b>PaO₂/PvO₂</b>: Art./Ven. O₂ Pressure
              </li>
              <li>
                <b>FiO₂/FeO₂</b>: Inspired/Expired O₂ Frac.
              </li>
            </ul>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(simulationPhases).map((phase) => (
                <button
                  key={phase}
                  onClick={() => handlePhaseChange(phase as SimulationPhase)}
                  className={`px-4 py-2 text-sm rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100 ${
                    simulationPhase === phase
                      ? 'bg-purple-600 text-white focus-visible:ring-purple-500'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus-visible:ring-gray-400'
                  }`}
                  aria-pressed={simulationPhase === phase}>
                  {simulationPhases[phase as SimulationPhase].button}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-100"
                aria-label="Go back to shunt animation">
                Back
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
