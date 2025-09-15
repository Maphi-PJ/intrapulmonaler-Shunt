// api/generate.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Nur POST erlaubt" });

  // Body einlesen (damit es überall sicher klappt)
  let raw = "";
  for await (const chunk of req) raw += chunk;
  let dataIn = {};
  try { dataIn = raw ? JSON.parse(raw) : {}; } catch {
    return res.status(400).json({ error: "Ungültiges JSON" });
  }

  const prompt = dataIn.prompt || "";

  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"
      + `?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }]}]
        })
      }
    );
    const data = await r.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") ||
      (data?.error?.message ? `Fehler: ${data.error.message}` : "");
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
