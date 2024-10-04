const tasks = {};

const handler = async (m, { conn, command, args }) => {
    const chatId = m.chat;
    const userId = m.sender;

    if (command === 'المهام') {
        const message = `📝 قائمة المهام المتاحة:
1. إضافة مهمة: لإضافة مهمة جديدة إلى قائمة المهام الخاصة بك.
2. إلغاء مهمة: لإلغاء مهمة من القائمة.
3. عرض المهام: لعرض كل المهام الحالية.

يرجى اختيار أحد الأزرار أدناه لإجراء العملية المطلوبة.`;

        const imageUrl = 'https://forkgraph.zaid.pro/file/id5B2L8s8lxf'; // رابط الصورة المراد استخدامها

        await conn.sendMessage(
            chatId,
            {
                image: { url: imageUrl },
                caption: message,
                footer: '🌟 إدارة المهام',
                buttons: [
                    { buttonId: '.إضافة_مهمة', buttonText: { displayText: '➕ إضافة مهمة' }, type: 1 },
                    { buttonId: '.إلغاء_مهمة', buttonText: { displayText: '❌ إلغاء مهمة' }, type: 1 },
                    { buttonId: '.عرض_المهام', buttonText: { displayText: '📋 عرض المهام' }, type: 1 },
                ],
                headerType: 4
            },
            { quoted: m }
        );
    }

    // باقي الأوامر كما في الكود السابق (إضافة_مهمة، إلغاء_مهمة، عرض_المهام) ...
};

handler.help = ['المهام', 'إضافة_مهمة [النص] | [النوع]', 'إلغاء_مهمة [رقم المهمة]', 'عرض_المهام'];
handler.tags = ['tools'];
handler.command = /^(المهام|إضافة_مهمة|إلغاء_مهمة|عرض_المهام)$/i;

export default handler;
