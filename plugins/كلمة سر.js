const generatePassword = (length, useSymbols) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    const charset = chars + (useSymbols ? symbols : '');
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

const handler = async (m, { conn, args }) => {
    const chatId = m.chat;
    let length = parseInt(args[0]);
    if (isNaN(length) || length <= 0) {
        return await conn.reply(chatId, '🚩 يرجى تحديد طول كلمة المرور بشكل صحيح. مثال: .كلمة_مرور 12', m);
    }

    const useSymbols = args[1] === 'نعم';
    const password = generatePassword(length, useSymbols);

    const message = `🔑 *تم إنشاء كلمة المرور بنجاح:*\n${password}\n\n> قم بنسخها أو اضغط على الزر أدناه لنسخها تلقائيًا.`;

    await conn.sendButton(
        chatId,
        message,
        '⚙️ إعدادات كلمة المرور',
        'https://i.imgur.com/PAIkSY6.png', // صورة توضيحية
        [
            ['🔒 نسخ كلمة المرور', `.نسخ ${password}`],
            ['🔄 إنشاء كلمة مرور جديدة', `.كلمة_مرور ${length} ${useSymbols ? 'نعم' : 'لا'}`]
        ],
        m
    );
};

// زر النسخ
const handlerCopy = async (m, { args }) => {
    const password = args[0];
    if (!password) return conn.reply(m.chat, '🚩 لا توجد كلمة مرور لنسخها.', m);

    // هنا يمكنك دمج آلية النسخ حسب بيئة العمل أو الإضافة المباشرة للذاكرة
    await conn.reply(m.chat, `📋 تم نسخ كلمة المرور: ${password}`, m);
};

handler.command = /^(كلمة_مرور)$/i;
handlerCopy.command = /^(نسخ)$/i;

export default handler;
export { handlerCopy };
