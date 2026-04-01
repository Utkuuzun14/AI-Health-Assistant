// U.T.K.U. Health: Voice & Chat Driven SDUI Generator
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export const processChatToUI = async (userMessage) => {
    if (!GEMINI_API_KEY) {
        console.error("[GeminiChat] Missing API Key. Check your .env file.");
        return { reply: "API Anahtarı eksik.", sduiBlock: null };
    }

    try {
        const prompt = `
      Sen bir "AI Sağlık Asistanı" arayüz mimarısısın, adın U.T.K.U.
      Kullanıcı sana şikayetini veya ihtiyacını (örneğin "başım ağrıyor", "tansiyon takibi lazım") yazacak.
      Senin görevin iki şey yapmak:
      1. Onlara samimi ve kısa bir tıbbi asistan yanıtı vermek. (Örn: "Geçmiş olsun, baş ağrısı için size bir takip çizelgesi oluşturuyorum.")
      2. İhtiyacına uygun bir SDUI (Server-Driven UI) JSON nesnesi üretmek.

      LÜTFEN sadece şu formatta JSON döndür (başka açıklama veya markdown yapmadan):
      {
        "reply": "Kullanıcıya gösterilecek asistan mesajın.",
        "sduiBlock": {
          "type": "card",
          "props": { "style": "card", "elevation": 1, "accessibilityLabel": "AI Üretimi Takip Kartı" },
          "children": [
             { "type": "icon", "props": { "name": "Activity", "color": "secondary", "size": 32 } },
             { "type": "text", "props": { "style": "title", "content": { "en": "New Tracker", "tr": "Yeni Takip Kartı" } } }
          ]
        }
      }

      Kullanıcı mesajı: "${userMessage}"
    `;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();

        if (!data.candidates || !data.candidates[0]) {
             console.error("[GeminiChat] API Yanıt Hatası:", data);
             return { reply: "Bir sorun oluştu.", sduiBlock: null };
        }

        let aiResponseText = data.candidates[0].content.parts[0].text;
        aiResponseText = aiResponseText.replace(/```json|```/gi, "").trim();

        const result = JSON.parse(aiResponseText);
        
        if (result.sduiBlock) {
             result.sduiBlock.metadata = { iteration_weight: "World Record (250kg)", source: "Chat-Driven-SDUI" };
        }

        return result;
    } catch (error) {
        console.error("[GeminiChat] SDUI Üretim Hatası:", error);
        return { reply: "Bağlantı hatası oluştu.", sduiBlock: null };
    }
};
