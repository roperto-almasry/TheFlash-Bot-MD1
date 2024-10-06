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

const handler = async (m, { conn, command }) => {
    const chatId = m.chat;

    // إذا كان الأمر هو "لعبة"
    if (command === 'لعبة') {
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

        // هنا ننتظر من المستخدم الإجابة على السؤال
        conn.once('chat-update', async (chatUpdate) => {
            if (chatUpdate.messages && chatUpdate.messages.all()) {
                const msg = chatUpdate.messages.all()[0];
                if (msg.message && msg.message.text.startsWith('.إجابة ')) {
                    const userAnswer = parseInt(msg.message.text.split(' ')[1]);
                    if (userAnswer === randomQuestion.answer) {
                        await conn.reply(chatId, "🎉 تهانينا! إجابتك صحيحة!", msg);
                    } else {
                        await conn.reply(chatId, "❌ إجابتك خاطئة. حاول مرة أخرى!", msg);
                    }
                }
            }
        });
    }
};

handler.help = ['لعبة'];
handler.tags = ['fun'];
handler.command = /^(لعبة)$/i;

export default handler;
