const reminders = {};

const handler = async (m, { conn, command, args }) => {
    const chatId = m.chat;
    const userId = m.sender;

    if (command === 'تذكير') {
        const reminderArgs = args.join(' ').split('|');
        const reminderText = reminderArgs[0]?.trim();
        const reminderTime = reminderArgs[1]?.trim();

        if (!reminderText || !reminderTime) {
            return await conn.reply(chatId, "يرجى تحديد نص التذكير والوقت. مثال: .تذكير اشرب ماء | 30 دقيقة", m);
        }

        const reminderId = `${chatId}-${Date.now()}`;
        const timeInMilliseconds = convertTimeToMilliseconds(reminderTime); // تحويل الوقت إلى ملي ثانية

        if (!timeInMilliseconds) {
            return await conn.reply(chatId, "يرجى تحديد وقت صحيح (مثل: 30 دقيقة أو 2 ساعة)", m);
        }

        reminders[reminderId] = {
            chatId,
            userId,
            text: reminderText,
            time: Date.now() + timeInMilliseconds
        };

        await conn.reply(chatId, `✅ تم ضبط التذكير: "${reminderText}" بعد ${reminderTime}.`, m);

        setTimeout(async () => {
            const reminder = reminders[reminderId];
            if (reminder) {
                await conn.sendMessage(reminder.chatId, { text: `🔔 تذكير: ${reminder.text}` }, { quoted: m });
                delete reminders[reminderId];
            }
        }, timeInMilliseconds);
    }
};

function convertTimeToMilliseconds(timeString) {
    const timeParts = timeString.match(/(\d+)\s*(دقيقة|ساعة)/);
    if (!timeParts) return null;

    const value = parseInt(timeParts[1], 10);
    const unit = timeParts[2];

    return unit === 'دقيقة' ? value * 60000 : unit === 'ساعة' ? value * 3600000 : null;
}

handler.help = ['تذكير [النص] | [الوقت]'];
handler.tags = ['tools'];
handler.command = /^(تذكير)$/i;

export default handler;
