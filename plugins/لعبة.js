const handler = async (m, { conn, command }) => {
    const chatId = m.chat;

    // صورة توضيحية للعبة
    const gameImage = 'https://ibb.co/CzvbTTs'; // ضع رابط الصورة هنا

    // إذا كان الأمر هو "صخر"
    if (command === 'صخر') {
        // رسالة البداية مع الأزرار
        const message = `🪨✂️📄 مرحباً! اختر واحداً من الخيارات أدناه:`;    
        await conn.sendButton(
            chatId,
            message,
            '🌟 لعبة حجر ورقة مقص',
            gameImage,
            [
                ['🪨 حجر', '.اختيار حجر'],
                ['📄 ورقة', '.اختيار ورقة'],
                ['✂️ مقص', '.اختيار مقص']
            ],
            m
        );
    }

    // إضافة معالجات للأزرار
    if (m.text.startsWith('.اختيار')) {
        const userChoice = m.text.split(' ')[1]; // الحصول على الخيار المختار
        const botChoice = ['حجر', 'ورقة', 'مقص'][Math.floor(Math.random() * 3)]; // اختيار عشوائي للروبوت

        let resultMessage = `🤖 اخترت: ${botChoice}\n` +
                            `👤 اخترت: ${userChoice}\n`;

        // تحديد الفائز
        if (userChoice === botChoice) {
            resultMessage += "🤝 تعادل!";
        } else if (
            (userChoice === 'حجر' && botChoice === 'مقص') ||
            (userChoice === 'ورقة' && botChoice === 'حجر') ||
            (userChoice === 'مقص' && botChoice === 'ورقة')
        ) {
            resultMessage += "🎉 فزت!";
        } else {
            resultMessage += "😢 خسرت!";
        }

        // إرسال النتيجة
        await conn.reply(chatId, resultMessage, m);
    }
};

// إضافة الأوامر المتاحة
handler.command = ['صخر', 'اختيار']; // تأكد من إضافة الأمر "اختيار"
export default handler;
