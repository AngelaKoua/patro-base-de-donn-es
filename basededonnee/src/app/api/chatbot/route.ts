import { NextRequest, NextResponse } from 'next/server';
import { PLATFORM_KNOWLEDGE_BASE } from '@/lib/chatbot-knowledge';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const GEMINI_MODEL = 'gemini-3.6-flash';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "Le chatbot n'est pas configuré (clé API manquante)." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const message: string = (body?.message || '').toString().trim();
    const history: ChatMessage[] = Array.isArray(body?.history) ? body.history : [];

    if (!message) {
      return NextResponse.json({ success: false, message: 'Message requis' }, { status: 400 });
    }

    const contents = [
      ...history
        .filter((m) => m && (m.role === 'user' || m.role === 'model') && typeof m.content === 'string')
        .slice(-10)
        .map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: PLATFORM_KNOWLEDGE_BASE }] },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1536,
            thinkingConfig: { thinkingLevel: 'low' },
          },
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('Gemini API error:', res.status, errText);
      return NextResponse.json(
        { success: false, message: "Le chatbot est momentanément indisponible." },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply: string =
      data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('') ||
      "Désolé, je n'ai pas pu générer de réponse.";

    return NextResponse.json({ success: true, reply });
  } catch (err: unknown) {
    console.error('Chatbot route error:', err);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
