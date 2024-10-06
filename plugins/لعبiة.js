const questions = [
    {
        question: "ما هو أكبر كوكب في المجموعة الشمسية؟",
        options: ["الأرض", "المريخ", "المشتري", "زحل"],
        answer: 2 // الرقم الذي يمثل الخيار الصحيح
    },
    {
        question: "ما هو أطول نهر في العالم؟",
        options: ["نهر الأمازون", "نهر النيل", "نهر اليانغتسي", "نهر المسيسيبي"],
        answer: 1
    },
    {
        question: "من هو مؤسس شركة مايكروسوفت؟",
        options: ["ستيف جوبز", "مارك زوكربيرغ", "بيل غيتس", "إيلون ماسك"],
        answer: 2
    }
];

const handler = async (m, { conn }) => {
    const chatId = m.chat;
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    const message = `❓ ${randomQuestion.question}`;

    await conn.sendButton(
        chatId,
        message,
        '🧠 اختر الإجابة الصحيحة',
        null,
        randomQuestion.options.map((option, index) => [option, `.إجابة ${index}`]),
        m
    );

    conn.on('text', (msg) => {
        if (msg.body.startsWith('.إجابة ')) {
            const userAnswer = parseInt(msg.body.split(' ')[1]);
            if (userAnswer === randomQuestion.answer) {
                conn.reply(chatId, "🎉 تهانينا! إجابتك صحيحة!", m);
            } else {
                conn.reply(chatId, "❌ إجابتك خاطئة. حاول مرة أخرى!", m);
            }
            // قم بإلغاء الاستماع بعد الإجابة
            conn.removeListener('text', this);
        }
    });
};

handler.help = ['لعبة', 'إجابة [رقم]'];
handler.tags = ['fun'];
handler.command = /^(لعبة)$/i;

export default handler;
