import OpenAI from 'openai';

// OpenAI クライアントの初期化
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// システムプロンプトの定義
export const SYSTEM_PROMPT =
  'あなたは親切なチャットボットです。簡潔で分かりやすい日本語で回答してください。専門的な質問にも対応できますが、わかりやすく説明するよう心がけてください。';

// OpenAI API を呼び出す - システムプロンプトを追加
const res = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: message },
  ],
});
