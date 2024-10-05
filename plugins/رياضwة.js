const reminders = {};

const handler = async (m, { conn, command, args }) => {
    const chatId = m.chat;
    const userId = m.sender;

    if (command === 'منبه_الرياضة') {
        const message = `🏋️ منبه الرياضة اليومية:
هل ترغب في ضبط منبه لتذكيرك بالقيام بالرياضة يومياً في وقت محدد؟ يمكنك اختيار الوقت المناسب لك من خلال الزر أدناه.`;

        await conn.sendButton(
            chatId,
            message,
            '💪 تذكير الرياضة',
            'https://example.com/sport_reminder.jpg', // رابط الصورة
            [
                ['⏰ ضبط المنبه', '.ضبط_منبه']
            ],
            m
        );
    }

    // ضبط منبه الرياضة
    if (command === 'ضبط_منبه') {
        const time = args[0]?.trim();
        if (!time || !/^\d{1,2}:\d{2} (AM|PM)$/i.test(time)) {
            return await conn.reply(
                chatId,
                "يرجى تحديد الوقت بصيغة (hh:mm AM/PM). مثال: .ضبط_منبه 6:30 AM",
                m
            );
        }

        const reminderId = `${chatId}-${Date.now()}`;
        reminders[reminderId] = {
            chatId,
            userId,
            text: '🚴‍♂️ حان وقت القيام بالرياضة!',
            time,
        };

        await conn.reply(chatId, `✅ تم ضبط منبه الرياضة يومياً في الساعة ${time}.`, m);
    }
};

handler.help = ['منبه_الرياضة', 'ضبط_منبه [الوقت]'];
handler.tags = ['tools'];
handler.command = /^(منبه_الرياضة|ضبط_منبه)$/i;

export default handler;
