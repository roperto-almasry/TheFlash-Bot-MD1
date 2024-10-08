const fetch = require('node-fetch');

const handler = async (m, { conn, command, args }) => {
    const chatId = m.chat;
    const userText = args.join(' ');

    if (!userText) {
        return await conn.reply(chatId, '📝 يرجى كتابة النص الذي تريد ترجمته.', m);
    }

    const languageButtons = [
        [{ buttonText: { displayText: '🇬🇧 الإنجليزية' }, buttonId: 'en' }],
        [{ buttonText: { displayText: '🇫🇷 الفرنسية' }, buttonId: 'fr' }],
        [{ buttonText: { displayText: '🇪🇸 الإسبانية' }, buttonId: 'es' }],
    ];

    const message = '🌍 اختر اللغة التي تريد الترجمة إليها:';

    await conn.sendMessage(chatId, {
        text: message,
        buttons: languageButtons,
        headerType: 1
    }, m);

    conn.on('message', async (buttonResponse) => {
        const languageCode = buttonResponse.text;
        if (['en', 'fr', 'es'].includes(languageCode)) {
            try {
                const translatedText = await translateText(userText, languageCode);
                const resultMessage = ✅ النص المترجم:\n\n"${translatedText}";

                await conn.reply(chatId, resultMessage, m);
            } catch (error) {
                await conn.reply(chatId, '❌ حدث خطأ أثناء الترجمة.', m);
            }
        } else {
            await conn.reply(chatId, '⚠ اختر لغة صحيحة من الأزرار.', m);
        }
    });
};

// وظيفة الترجمة باستخدام LibreTranslate API (لا تحتاج مفتاح API)
const translateText = async (text, targetLang) => {
    const apiUrl = 'https://libretranslate.com/translate';
    
    const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
            q: text,
            source: 'auto', // الكشف التلقائي عن اللغة الأصلية
            target: targetLang,
        }),
        headers: { 'Content-Type': 'application/json' },
    });
    
    const data = await response.json();
    return data.translatedText;
};

handler.command = ['ترجمة'];
export default handler;
