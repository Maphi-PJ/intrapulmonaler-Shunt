/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Helper function for subscripts
export function chem(str: string | number) {
  const subs: {[key: string]: string} = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆',
    '7': '₇', '8': '₈', '9': '₉',
  };
  return String(str).replace(/\d/g, (d) => subs[d] || d);
}

interface CalcCorrect {
  pao2?: number;
  cao2?: number;
  shunt?: number;
  do2?: number;
}

export interface CalcQuestion {
  type: 'calc';
  title: string;
  correct: CalcCorrect;
}

export interface McQuestion {
  type: 'mc';
  title: string;
  options: string[];
  answer: number;
}

export interface CaseText {
  type: 'caseText';
  title: string;
  content: string[];
}

export interface Explanation {
  type: 'explanation';
  question: string;
  answer: string[];
}


export type QuizItem = CalcQuestion | McQuestion | CaseText | Explanation;

export const quizItems: QuizItem[] = [
  {
    type: 'caseText',
    title: 'Phase 1: Ausgangssituation nach Trauma',
    content: [
      'Ein 32-jähriger Patient wird nach einem Verkehrsunfall auf die Intensivstation aufgenommen. Er hat eine unkomplizierte Femurfraktur und multiple Prellmarken, ist hämodynamisch stabil und spontan atmend. Zum Zeitpunkt der Aufnahme bestehen keine Zeichen einer respiratorischen Insuffizienz.',
      'Er wird über eine Nasenbrille mit Raumluft beobachtet. Die initiale arterielle Blutgasanalyse zeigt einen normwertigen pH, eine normale Sauerstoffsättigung und ein unauffälliges PaO₂. Auch das Hämoglobin liegt mit 15 g/dL im Referenzbereich, die venösen Blutgaswerte entsprechen einer regelrechten Sauerstoffextraktion. Klinisch ist der Patient wach, orientiert, und zeigt eine normale Atemarbeit.',
      'In dieser frühen Phase des Aufenthaltes werden die Sauerstofftransportparameter bestimmt, um eine Ausgangsbasis für das weiteres Monitoring zu schaffen. Annahmen: FiO₂ = 0.21, PaCO₂ = 40 mmHg, PaO₂ = 95 mmHg, SaO₂ = 0.991, SvO₂ = 0.75, PvO₂ = 40 mmHg, Hb = 15 g/dL, PB = 760 mmHg, PH₂O = 47 mmHg, RQ = 0.8.'
    ]
  },
  {
    type: 'calc',
    title: `Frage 1: Berechnen Sie den alveolären O₂-Partialdruck (PAO₂) aus den vorliegenden Werten.`,
    correct: { pao2: 100 }
  },
  {
    type: 'calc',
    title: `Frage 2: Berechnen Sie den arteriellen O₂-Gehalt (CaO₂) auf Grundlage des gemessenen Hb, der arteriellen Sättigung und des PaO₂.`,
    correct: { cao2: 20.21 }
  },
  {
    type: 'calc',
    title: `Frage 3: Berechnen Sie die Shuntfraktion (Qs/Qt), indem Sie den arteriellen O₂-Gehalt mit dem endkapillären (Cc’O₂ = 20.41) und venösen O₂-Gehalt (CvO₂ = 15.2) vergleichen.`,
    correct: { shunt: 3.8 }
  },
  {
    type: 'caseText',
    title: 'Phase 2: ARDS-Entwicklung',
    content: [
      'Am zweiten Tag auf der Intensivstation verschlechtert sich der Zustand des Patienten. Er zeigt eine zunehmende Dyspnoe, die Atemfrequenz liegt bei 28/min, und er benötigt nun eine Sauerstoffgabe über eine Gesichtsmaske mit FiO₂ = 0,40. In der Auskultation sind feinblasige Rasselgeräusche basal beidseits hörbar. Das Thoraxröntgen zeigt neu aufgetretene, beidseitige Infiltrate, vereinbar mit einem beginnenden ARDS.',
      'Die arterielle Blutgasanalyse ergibt: PaO₂ = 60 mmHg, PaCO₂ = 45 mmHg, pH 7,35. Das Hämoglobin liegt stabil bei 14,5 g/dL. Die arterielle O₂-Sättigung (SaO₂) beträgt 0,88. Eine zentrale Blutgasanalyse (ScvO₂) ergibt eine venöse Sättigung von 0,65 mit einem PvO₂ von 40 mmHg.'
    ]
  },
  {
    type: 'calc',
    title: `Frage 4: Berechnen Sie den alveolären O₂-Partialdruck (PAO₂) unter den aktuellen Bedingungen (FiO₂=0.4, PaCO₂=45).`,
    correct: { pao2: 229 }
  },
  {
    type: 'calc',
    title: `Frage 5: Berechnen Sie den arteriellen O₂-Gehalt (CaO₂) mit den aktuellen Werten (Hb=14.5, SaO₂=0.88, PaO₂=60).`,
    correct: { cao2: 17.3 }
  },
  {
    type: 'calc',
    title: `Frage 6: Berechnen Sie die Shuntfraktion (Qs/Qt) aus dem arteriellen O₂-Gehalt und den gegebenen Werten für Cc’O₂ (20.4) und CvO₂ (12.7).`,
    correct: { shunt: 41 }
  },
  {
    type: 'explanation',
    question: `Frage 1: In Phase 2 wurde als erste Maßnahme eine Erhöhung des Frischgasflusses auf 40% vorgenommen. Der alveoläre Partialdruck ist zwar entsprechend dem Ergebnis in Frage 4 gestiegen, der arterielle O${chem(2)} Gehalt ist aber sogar gesunken. Wie lässt sich dies erklären?`,
    answer: [
      `Eine Erhöhung des PAO${chem(2)} hat kaum einen Einfluss in die Shunfraktion. Da das endkapilläre O${chem(2)} (CcO${chem(2)}) durch PAO${chem(2)} definiert wird und sowohl im Zähler als auch Nenner des Bruchs steht, verändert sich die Shuntgröße durch diese Variable nicht.`,
      `Was die Formel der Shunt Berechnung nicht direkt darstellt, ist der Anteil von Alveolen die durch das ARDS vollständig belüftet werden. Dies stellt sich nur indirekt in den Werten von PaO${chem(2)} und SaO${chem(2)} dar. Diese werden nicht berechnet, sondern können per BGA bzw. Monitoring entnommen werden und sind daher im Fallbeispiel bereits gegeben. Dabei wird der Shunt insbesondere durch das SaO${chem(2)} definiert. Dies zeigt sich anhand der beiden Formeln:`,
      `CaO${chem(2)} = (Hb · 1,34 · SaO${chem(2)}) + (0,003 · PaO${chem(2)})`,
      `CvO${chem(2)} = (Hb · 1,34 · SvO${chem(2)}) + (0,003 · PvO${chem(2)})`,
      `Hier ist der Einfluss des PaO${chem(2)} über den 0,003·PaO${chem(2)}-Term minimal. Entscheidend sind vor allem SaO${chem(2)} und SvO${chem(2)}, also die Sättigungen.`,
      `Zu Bedenken ist hier der sigmoidaler Verlauf der Sauerstoffbindungskurve, der uns sagt, dass ein krtischer PaO${chem(2)} Abfall sich erst relativ spät in der O${chem(2)} Sättigung darstellt, dafür dann aber umso schneller sinkt.`,
      `Das heißt ein Abfall des paO${chem(2)} von 700 mmHg auf 71mmHg bewirkt nur einen Abfall des SaO${chem(2)} von 100% auf 94%. Ein Abfall dagegen des PaO${chem(2)} von 60mmHg auf nur 45 mmHg bewirkt eine Erniedrigung des SaO${chem(2)} von 91% auf 80%.`
    ]
  },
  {
    type: 'explanation',
    question: `Frage 2: Welche physiologische Größe stellt das PAO${chem(2)} dar, das du mit der alveolären Gasgleichung berechnest? Wie kann man es in Bezug auf den arteriellen PaO${chem(2)} interpretieren?`,
    answer: [
      `PAO${chem(2)} ist der alveoläre O${chem(2)}-Partialdruck und stellt das theoretisch maximal erreichbare PaO${chem(2)} dar. Der Unterschied zwischen PAO${chem(2)} und PaO${chem(2)} ist der alveolo-arterielle O${chem(2)}-Gradient (A–a-Gradient), der Shunt, V/Q-Mismatch oder Diffusionsstörungen abbildet.`,
    ],
  },
  {
    type: 'explanation',
    question: `Frage 3: Warum führt eine Erhöhung von FiO${chem(2)} bei einem Patienten mit ARDS zunächst durchaus zu einem Anstieg von PaO${chem(2)} – aber nur in bestimmten Lungenarealen?`,
    answer: [
      `In teilventilierten Arealen: mehr O${chem(2)} diffundiert → Hb-Sättigung steigt → PaO${chem(2)} steigt.`,
      `In gut ventilierten Arealen: Hb bereits gesättigt → kein zusätzlicher Effekt.`,
      `In Shuntarealen (nicht ventilliert): kein Kontakt zu O${chem(2)} → FiO${chem(2)}-Erhöhung bringt nichts.`,
    ],
  },
  {
    type: 'explanation',
    question: `Frage 4: Was sagt es dir, wenn eine FiO${chem(2)}-Erhöhung keine weitere Verbesserung des PaO${chem(2)} bewirkt? Welche pathophysiologische Situation liegt dann vor?`,
    answer: [
      `Es liegt ein echter Shunt vor: ein Teil des Blutes fließt ohne Kontakt zu O${chem(2)} an den Alveolen vorbei und mischt sich venös ins arterielle Blut. Dadurch bleibt PaO${chem(2)} niedrig, egal wie hoch PAO${chem(2)} ist.`,
      `<br>`,
      `<strong>Zusatzkontext: Die klinische Wirkung der FiO${chem(2)}-Erhöhung</strong>`,
      `Die Relevanz von PAO${chem(2)} erklären wir nicht über den Shuntwert, sondern über die Balance zwischen endkapillärer Sättigung und gemischtem arteriellem Blut.`,
      `➡️ Heißt:`,
      `• Der Shuntwert bleibt rein mathematisch relativ unbeeindruckt, wenn man nur PAO${chem(2)} ändert.`,
      `• Aber klinisch entscheidend ist, wie sich die O${chem(2)}-Sättigung im endkapillären Blut durch PAO${chem(2)}-Erhöhung verbessert und wie dieses mit nicht oxygeniertem Blut vermischt wird.`,
      `• Das Mischungsverhältnis (Balance) bestimmt letztlich den PaO${chem(2)}, den wir messen und für den Patienten beurteilen.`,
      `👉 Man sieht sehr schön:`,
      `• PAO${chem(2)} steigt stark (100 → 230 mmHg).`,
      `• PaO${chem(2)} steigt (60 → 90 mmHg), also klinisch relevant!`,
      `• CaO${chem(2)} steigt mit, weil SaO${chem(2)} deutlich besser wird.`,
      `• Shuntfraktion (Qs/Qt) sinkt scheinbar (40,9 → 18,3 %), was in der Realität widerspiegelt, dass mehr Blut durch „rekrutierte“ Areale oxygeniert wird.`,
      `Das zeigt: Auch wenn sich CcO${chem(2)} in der Formel sowohl im Zähler als auch Nenner wiederfindet, wirkt die FiO${chem(2)}-Erhöhung klinisch auf PaO${chem(2)}, weil sie die Balance zwischen endkapillärem O${chem(2)} und gemischtem arteriellem Blut verschiebt.`,
    ],
  },
  {
    type: 'explanation',
    question: `Frage 5: Warum bringt in dieser Situation eine PaCO${chem(2)}-Senkung (z. B. durch Hyperventilation und rechnerisch höheres PAO${chem(2)}) keinen klinischen Vorteil?`,
    answer: [
      `Weil das Problem nicht im alveolären O${chem(2)}-Angebot liegt, sondern im Bypass des Blutes durch nicht ventilierte Areale. Ein höheres PAO${chem(2)} erreicht dieses Blut nie.`,
    ],
  },
  {
    type: 'explanation',
    question: `Frage 6: Welche intensivmedizinischen Maßnahmen sind zielführend, um das Shuntvolumen zu reduzieren und den PaO${chem(2)} wirklich zu verbessern?`,
    answer: [
      `PEEP/CPAP: hält Alveolen offen, rekrutiert kollabierte Areale → mehr Blut wird oxygeniert.`,
      `Bauchlage: reduziert dorsale Kompression, homogenisiert Ventilation → verbessert V/Q-Verhältnis.`,
      `Recruitment-Manöver: kurzzeitig hoher Druck, um Alveolen zu eröffnen.`,
    ],
  },
  {
    type: 'explanation',
    question: `Frage 7: Welche Balance entscheidet letztlich darüber, wie hoch der tatsächlich gemessene PaO${chem(2)} ist?`,
    answer: [
      `Es ist die Balance zwischen voll oxygeniertem endkapillärem Blut und nicht oxygeniertem venösem Blut.`,
      `Der Shuntwert selbst bleibt durch PAO${chem(2)}-Änderung weitgehend unverändert, aber klinisch entscheidend ist, wie sich die endkapilläre Sättigung verbessert und wie sich dieses Blut mit shuntendem, nicht oxygeniertem Blut mischt.`,
    ],
  },
  {
    type: 'caseText',
    title: 'Phase 3: Hämodynamische Instabilität',
    content: [
      'Am dritten Tag auf der ICU entwickelt der Patient plötzlich eine hämodynamische Instabilität. Ursache ist eine intraabdominelle Nachblutung, die zu einem Blutverlust von etwa 1,5 Litern führt. Klinisch zeigt sich eine Tachykardie von 125/min, Hypotonie (MAP 58 mmHg) und eine kühle Peripherie.',
      'Das Herzzeitvolumen (Q̇t) sinkt auf 3,5 L/min. Durch die Blutung fällt der Hb auf 8 g/dL. In der Folge reduziert sich auch der arterielle O₂-Gehalt (CaO₂).'
    ]
  },
  {
    type: 'mc',
    title: `Frage 7: Welche Auswirkungen haben die Faktoren ↓ Q̇t und ↓ Hb auf den globalen O₂-Transport (DO₂)?`,
    options: ["DO₂ steigt, da das Herz kompensatorisch schneller schlägt.", "DO₂ bleibt unverändert, da die Sauerstoffextraktion zunimmt.", "DO₂ sinkt kritisch, da beide Hauptkomponenten der DO₂-Formel reduziert sind.", "Nur der Hb-Abfall ist relevant, das Q̇t hat kaum Einfluss."],
    answer: 2
  },
  {
    type: 'mc',
    title: `Frage 8: Welche Aussage beschreibt am besten die Rolle des Hämoglobins (Hb) in der Sauerstoffversorgung und die Konsequenzen eines Hb-Abfalls im Schock?`,
    options: [
      "Das Hb trägt nur einen geringen Teil zum O₂-Transport bei, entscheidend ist der gelöste Sauerstoff im Plasma.",
      "Sinkt Hb, bleibt CaO₂ konstant, solange SaO₂ und PaO₂ stabil sind.",
      "Ein Abfall von 14,5 auf 8 g/dL reduziert CaO₂ massiv, auch wenn SaO₂ und PaO₂ gleich bleiben, und senkt damit direkt das O₂-Angebot (DO₂).",
      "Hb hat keinen Einfluss auf die O₂-Zufuhr (DO₂), da diese ausschließlich vom Herzzeitvolumen bestimmt wird."
    ],
    answer: 2
  },
  {
    type: 'explanation',
    question: `Frage 9: Vergleiche das O₂-Extraktionsverhältnis (O₂ER) des Patienten vor der Blutung mit dem nach der Blutung: Vorher: Hb 14,5 g/dL, SaO₂ 98 %, PaO₂ 100 mmHg, Q̇t 5,5 L/min, VO₂ = 250 mL/min. Nachher: Hb 8 g/dL, SaO₂ 95 %, PaO₂ 90 mmHg, Q̇t 3,5 L/min, VO₂ = 250 mL/min. Wie hoch ist das O₂ER jeweils, und was sagt dir die Veränderung?`,
    answer: [
      "<strong>Vorher:</strong>",
      "CaO₂ ≈ 19,3 mL/dL, DO₂ ≈ 1060 mL/min",
      "ΔC (a–v)O₂ ≈ 4,5 mL/dL, CvO₂ ≈ 14,8 mL/dL",
      "<strong>O₂ER ≈ 23 % (normal)</strong>",
      "",
      "<strong>Nachher:</strong>",
      "CaO₂ ≈ 10,5 mL/dL, DO₂ ≈ 366 mL/min",
      "ΔC (a–v)O₂ ≈ 7,1 mL/dL, CvO₂ ≈ 3,3 mL/dL",
      "<strong>O₂ER ≈ 68 % (kritisch erhöht)</strong>",
      "",
      "<strong>Erklärung:</strong> Der kombinierte Effekt aus Anämie (Hb ↓) und reduziertem Herzzeitvolumen (Q˙t↓) senkt die Sauerstoffzufuhr (D˙O2) drastisch. Bei konstant vorgegebenem V˙O2  steigt die extrahierte Fraktion entsprechend (O₂ER ↑), das gemischtvenöse O₂-Angebot fällt (äquivalent: SvO2 ≈ 76 % → ≈ 31 %). Eine O₂ER ~ 68 % zeigt eine aufgebrauchte Reserve und drohende Dysoxie an."
    ]
  },
  {
    type: 'explanation',
    question: `Frage 10: Warum ist O₂ER in diesem Fall ein besserer Marker für die Gewebeversorgung als PaO₂ oder SaO₂?`,
    answer: [
      "PaO₂ und SaO₂ können noch normal aussehen, obwohl kaum O₂ transportiert wird.",
      "O₂ER zeigt das Verhältnis Angebot/Verbrauch. Ein Wert von 68 % bedeutet: die Gewebe schöpfen fast alles aus, was geliefert wird.",
      "Damit ist O₂ER ein Frühmarker für eine drohende Gewebehypoxie."
    ]
  },
  {
    type: 'explanation',
    question: `Frage 11: Welche weiteren Faktoren (außer Hb und Qt) könnten O₂ER noch erhöhen?`,
    answer: [
      "↑ VO₂ (Fieber, Unruhe, Krämpfe)",
      "↓ SaO₂/PaO₂ (Hypoxämie, Shunt, ARDS)",
      "Mikrozirkulationsstörung (Sepsis, Schock)"
    ]
  },
  {
    type: 'explanation',
    question: `Frage 12: Welche klinischen Maßnahmen zielen darauf ab, O₂ER wieder zu normalisieren?`,
    answer: [
      "Hb anheben (Transfusion) → CaO₂↑",
      "Qt steigern (Volumen, Inotropie) → DO₂↑",
      "SaO₂ sichern (O₂-Gabe, PEEP) → CaO₂↑",
      "VO₂ senken (Analgesie, Sedierung, Fiebersenkung) → Verbrauch↓"
    ]
  },
  {
    type: 'caseText',
    title: 'Intervention',
    content: [
        'Da der Patient dyspnoisch wird und die Oxygenierung weiter kompromittiert ist, entscheidet sich das Team für eine Intubation und invasive Beatmung. Es wird ein BIPAP-Modus eingestellt, um den alveolären Rekrutierungseffekt zu nutzen. Zusätzlich erfolgt eine dorsoventrale Wechsellagerung, um die Ventilation-Perfusions-Verteilung zu verbessern. Sedativa werden zur Beatmungstoleranz verabreicht.'
    ]
  },
  {
    type: 'mc',
    title: `Frage 13: Welche dieser Maßnahmen wirken primär über eine Verbesserung des PAO₂ und damit des Cc′O₂, und welche beeinflussen indirekt den O₂-Verbrauch (VO₂)?`,
    options: ["PAO₂-Verbesserung durch Sedierung, VO₂-Senkung durch BIPAP.", "PAO₂-Verbesserung durch BIPAP/Lagerung, VO₂-Senkung durch Sedierung.", "Beide Maßnahmen verbessern ausschließlich den PAO₂.", "Die Lagerung senkt den VO₂, die Sedierung verbessert den PAO₂."],
    answer: 1
  },
  {
    type: 'caseText',
    title: 'Phase 4: Zustand nach Intervention',
    content: [
      'Nach 2 Stunden Beatmung, Transfusion und Volumengabe stabilisiert sich der Zustand. Hier die Werte zum Vergleich:',
      'Vor Intervention: Hb = 8 g/dL, SaO₂ = 0.85, PaO₂ = 55 mmHg, HF = 110 bpm.',
      'Nach Intervention: Hb = 9.5 g/dL, SaO₂ = 0.95, PaO₂ = 90 mmHg, HF = 90 bpm.'
    ]
  },
  {
    type: 'calc',
    title: `Frage 14: In der Zwischenzeit wurde ein erweitertes hämodynamisches Monitoring implementiert und eine Picco Messung durchgeführt. Dabei wurde ein Schlagvolumen von 61 ml gemessen. Berechnen Sie den neuen arteriellen O₂-Transport (DO₂) nach der Intervention.`,
    correct: { do2: 679 }
  },
  {
    type: 'caseText',
    title: 'Phase 5: Verschiebung der O₂-Bindungskurve',
    content: [
      'Im weiteren Verlauf entwickelt der Patient Fieber (Temp. 39,2 °C) und eine metabolische Azidose (pH 7,28). Dadurch verschiebt sich die Sauerstoffbindungskurve nach rechts: Der p50-Wert steigt über den Normalwert von 27 mmHg hinaus.',
      'Dies bedeutet: Bei gleichem PaO₂ ist die Hb-Sättigung geringer, gleichzeitig wird aber der O₂ im Gewebe leichter abgegeben.'
    ]
  },
  {
    type: 'mc',
    title: `Frage 15: Wie wirkt sich diese Rechtsverschiebung auf die Balance zwischen O₂-Bindung in der Lunge und O₂-Freisetzung im Gewebe aus, und welche Konsequenzen hat das für den Patienten mit vorbestehendem Shunt?`,
    options: ["Verbesserte O₂-Abgabe im Gewebe löst das Oxygenierungsproblem.", "Die O₂-Bindung in der Lunge wird erschwert, was die bereits niedrige SaO₂ weiter senkt.", "Die Kurvenverschiebung hat keine klinische Relevanz.", "Der PaO₂ steigt durch die Verschiebung automatisch an."],
    answer: 1
  },
  {
    type: 'caseText',
    title: 'Phase 6: Weitere Therapieoptionen',
    content: [
      'Die Nachblutung ist mittlerweile chirurgisch versorgt, Hb stabilisiert. Dennoch bleibt durch das ARDS ein signifikanter Shunt bestehen, sodass trotz maximaler FiO₂ nur ein begrenzter Anstieg des PaO₂ erreicht werden kann.'
    ]
  },
  {
    type: 'mc',
    title: `Frage 16: Angesichts der fortbestehenden Oxygenierungsstörung – welche weiteren intensivmedizinischen Maßnahmen kommen hier in Betracht?`,
    options: ["Erhöhung der Sedierungstiefe.", "Gabe von Schleifendiuretika.", "Beginn einer ECMO-Therapie (extrakorporale Membranoxygenierung).", "Wechsel auf eine nicht-invasive Beatmung."],
    answer: 2
  }
];