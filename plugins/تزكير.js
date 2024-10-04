const reminders = {};

const handler = async (m, { conn, command, args }) => {
    const chatId = m.chat;
    const userId = m.sender;

    if (command === 'تذكير') {
        // عرض التعليمات
        const message = `لإضافة تذكير، استخدم الأمر بالشكل التالي:
.تذكير_إضافة [نص التذكير] | [الوقت (HH:MM)] | [AM|PM] | [يومي|لمرة واحدة]`;
        return await conn.reply(chatId, message, m);
    }

    if (command === 'تذكير_إضافة') {
        const commandArgs = args.join(' ').split('|');
        const reminderText = commandArgs[0]?.trim();
        const time = commandArgs[1]?.trim();
        const period = commandArgs[2]?.trim().toUpperCase(); // تحويل إلى uppercase
        const repeat = commandArgs[3]?.trim();

        if (!reminderText || !time || !period || !repeat) {
            return await conn.reply(chatId, "يرجى تحديد نص التذكير والوقت بشكل صحيح.", m);
        }

        // تحويل الوقت إلى تنسيق 24 ساعة
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) {
            hours += 12; // إضافة 12 ساعة إذا كان الوقت PM
        } else if (period === 'AM' && hours === 12) {
            hours = 0; // تحويل 12 AM إلى 0
        }

        const reminderId = `${chatId}-${Date.now()}`;
        const reminderTime = new Date();
        reminderTime.setHours(hours, minutes, 0);

        // إذا كان الوقت في الماضي، أضف يومًا واحدًا للتذكير
        if (reminderTime < Date.now()) {
            reminderTime.setDate(reminderTime.getDate() + 1);
        }

        reminders[reminderId] = {
            chatId,
            userId,
            text: reminderText,
            time: reminderTime,
            repeat
        };

        await conn.reply(chatId, `📅 تم ضبط التذكير: "${reminderText}" في ${time} ${period} ${repeat === 'يومي' ? 'كل يوم' : 'مرة واحدة'}.`, m);

        // إعداد تذكير
        const timeoutDuration = reminderTime.getTime() - Date.now();
        setTimeout(async () => {
            const reminder = reminders[reminderId];
            if (reminder) {
                await conn.sendMessage(reminder.chatId, { text: `🔔 تذكير: ${reminder.text}`, mentions: [reminder.userId] });
                if (reminder.repeat === 'يومي') {
                    reminder.time.setDate(reminder.time.getDate() + 1); // إعداد التذكير ليوم غد
                    reminders[reminderId].time = reminder.time;
                    setTimeout(arguments.callee, 86400000); // تذكير بعد 24 ساعة
                } else {
                    delete reminders[reminderId]; // حذف التذكير إذا كان لمرة واحدة
                }
            }
        }, timeoutDuration);
    }
};

handler.help = ['تذكير', 'تذكير_إضافة'];
handler.tags = ['tools'];
handler.command = /^(تذكير|تذكير_إضافة)$/i;

export default handler;
