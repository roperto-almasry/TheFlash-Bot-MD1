const reminders = {};

const handler = async (m, { conn, command, args }) => {
    const chatId = m.chat;
    const userId = m.sender;

    // معالجة الأمر "تذكير"
    if (command === 'تذكير') {
        const tutorialMessage = `
        ⚠️ **كيفية استخدام الأمر تذكير:**
        يمكنك استخدام هذا الأمر لإعداد تذكير لنفسك. 
        المثال: 
        \`.تذكير نص التذكير | الوقت بالدقائق\`
        
        على سبيل المثال:
        \`.تذكير اشرب ماء | 30\`  (هذا يعني تذكيرك بشرب الماء بعد 30 دقيقة)
        `;
        
        // إرسال الرسالة مع زر لإضافة التذكير
        await conn.sendButton(chatId, tutorialMessage, null, null, [
            ['إضافة تذكير ⏰', '.تذكير_إضافة']
        ], m);
    } 
    // معالجة الأمر "تذكير_إضافة"
    else if (command === 'تذكير_إضافة') {
        const reminderText = args[0] ? args[0].trim() : null;
        const reminderTime = args[1] ? parseInt(args[1].trim()) : null;

        if (!reminderText || !reminderTime || isNaN(reminderTime)) {
            return await conn.reply(chatId, "يرجى تحديد نص التذكير ووقت التذكير بالدقائق. مثال: .تذكير اشرب ماء | 30", m);
        }

        const reminderId = `${chatId}-${Date.now()}`;
        reminders[reminderId] = {
            chatId,
            userId,
            text: reminderText,
            time: Date.now() + reminderTime * 60000
        };

        // إرسال تأكيد مع زر لإلغاء التذكير
        await conn.sendButton(chatId, `📅 تم ضبط التذكير: "${reminderText}" بعد ${reminderTime} دقيقة.`, null, null, [
            ['إلغاء التذكير ❌', `.إلغاء_التذكير ${reminderId}`]
        ], m);

        setTimeout(async () => {
            const reminder = reminders[reminderId];
            if (reminder) {
                await conn.sendMessage(reminder.chatId, { text: `🔔 @${reminder.userId.split('@')[0]}، تذكير: ${reminder.text}`, mentions: [reminder.userId] }, { quoted: m });
                delete reminders[reminderId];
            }
        }, reminderTime * 60000);
    } 
    // معالجة الأمر "إلغاء_التذكير"
    else if (command === 'إلغاء_التذكير') {
        const reminderId = args[0];
        if (reminders[reminderId]) {
            delete reminders[reminderId];
            await conn.reply(chatId, "❌ تم إلغاء التذكير بنجاح.", m);
        } else {
            await conn.reply(chatId, "⚠️ لم يتم العثور على التذكير المطلوب.", m);
        }
    }
};

handler.help = ['تذكير', 'تذكير_إضافة [النص] | [الوقت بالدقائق]'];
handler.tags = ['tools'];
handler.command = /^(تذكير|تذكير_إضافة|إلغاء_التذكير)$/i;

export default handler;
