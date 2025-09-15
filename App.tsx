import { useEffect, useRef, useState } from "react";
import { CreateMLCEngine } from "@mlc-ai/web-llm";

// Kleines, browserfreundliches Modell (später bei Bedarf größer/qualitativer)
const MODEL = "Llama-3.2-3B-Instruct-q4f32_1-MLC";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export default function App() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "system", content: "Du bist ein hilfreicher Assistent für Medizinstudierende." }
  ]);
  const [streamingText, setStreamingText] = useState("");
  const engineRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      // Modell laden (erster Start: großer Download; wir zeigen Fortschritt)
      const engine = await CreateMLCEngine(MODEL, {
        initProgressCallback: ({ progress }: any) => setProgress(Math.round((progress ?? 0) * 100)),
      });
      engineRef.current = engine;
      setReady(true);
    })();
  }, []);

  const send = async () => {
    if (!ready || !engineRef.current || !input.trim()) return;

    const nextMessages: Msg[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setStreamingText("");

    // Streaming-Antwort starten
    const chunks = await engineRef.current.chat.completions.create({
      messages: nextMessages,
      stream: true,
    });

    let acc = "";
    for await (const chunk of chunks) {
      const delta = chunk?.choices?.[0]?.delta?.content ?? "";
      acc += delta;
      setStreamingText(acc);
    }

    // finalen Assistenten-Beitrag an den Verlauf anhängen
    setMessages((prev) => [...prev, { role: "assistant", content: acc }]);
    setStreamingText("");
  };

  return (
    <main style={{ maxWidth: 860, margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>WebLLM-App (kein API-Key nötig)</h1>

      {!ready && (
        <p>Modell wird vorbereitet … {progress}%<br/>Bitte Tab geöffnet lassen (erster Start kann dauern).</p>
      )}

      {ready && (
        <>
          <div style={{ display: "grid", gap: 12 }}>
            {messages.filter(m => m.role !== "system").map((m, i) => (
              <div key={i} style={{
                background: m.role === "user" ? "#eef" : "#eee",
                padding: "10px 12px", borderRadius: 10
              }}>
                <strong>{m.role === "user" ? "Du" : "Assistent"}:</strong> {m.content}
              </div>
            ))}
            {streamingText && (
              <div style={{ background: "#eee", padding: "10px 12px", borderRadius: 10 }}>
                <strong>Assistent (schreibt):</strong> {streamingText}
              </div>
            )}
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Frage eingeben …"
              style={{ flex: 1, height: 80 }}
            />
            <button onClick={send} disabled={!ready || !input.trim()}>Senden</button>
          </div>
        </>
      )}
    </main>
  );
}
