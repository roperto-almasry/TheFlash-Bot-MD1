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

        await conn.sendButton(
            chatId,
            message,
            '🌟 إدارة المهام',
            null,
            [
                ['➕ إضافة مهمة', '.إضافة_مهمة'],
                ['❌ إلغاء مهمة', '.إلغاء_مهمة'],
                ['📋 عرض المهام', '.عرض_المهام']
            ],
            m
        );
    }

    // إضافة مهمة جديدة
    if (command === 'إضافة_مهمة') {
        const taskArgs = args.join(' ').split('|');
        const taskText = taskArgs[0]?.trim();
        const taskType = taskArgs[1]?.trim().toLowerCase();

        if (!taskText || (taskType !== 'يومية' && taskType !== 'أسبوعية')) {
            return await conn.reply(
                chatId,
                "يرجى تحديد نص المهمة ونوعها (يومية أو أسبوعية). مثال: .إضافة_مهمة قراءة كتاب | يومية",
                m
            );
        }

        const taskId = `${userId}-${Date.now()}`;
        tasks[taskId] = {
            userId,
            text: taskText,
            type: taskType,
        };

        await conn.reply(chatId, `✅ تم إضافة المهمة: "${taskText}" (${taskType}) بنجاح!`, m);
    }

    // إلغاء مهمة
    if (command === 'إلغاء_مهمة') {
        const userTasks = Object.entries(tasks).filter(([_, task]) => task.userId === userId);
        if (userTasks.length === 0) {
            return await conn.reply(chatId, "⚠️ لا توجد مهام لإلغائها.", m);
        }

        const taskId = args[0]?.trim();
        if (!taskId || !tasks[taskId]) {
            let message = 'يرجى تحديد رقم المهمة التي ترغب بإلغائها. المهام الحالية:\n';
            userTasks.forEach(([id, task], index) => {
                message += `${index + 1}. ${task.text} (${task.type})\n`;
            });

            return await conn.sendButton(
                chatId,
                message,
                '🗑️ إلغاء المهام',
                null,
                userTasks.map(([id], index) => [`إلغاء ${index + 1}`, `.إلغاء_مهمة ${id}`]),
                m
            );
        }

        delete tasks[taskId];
        await conn.reply(chatId, `❌ تم إلغاء المهمة بنجاح!`, m);
    }

    // عرض قائمة المهام
    if (command === 'عرض_المهام') {
        const userTasks = Object.values(tasks).filter(task => task.userId === userId);

        if (userTasks.length === 0) {
            return await conn.reply(chatId, "📋 لا توجد مهام حالياً.", m);
        }

        let message = '📝 قائمة المهام الحالية:\n';
        userTasks.forEach((task, index) => {
            message += `${index + 1}. ${task.text} (${task.type})\n`;
        });

        await conn.reply(chatId, message, m);
    }
};

handler.help = ['المهام', 'إضافة_مهمة [النص] | [النوع]', 'إلغاء_مهمة [رقم المهمة]', 'عرض_المهام'];
handler.tags = ['tools'];
handler.command = /^(المهام|إضافة_مهمة|إلغاء_مهمة|عرض_المهام)$/i;

export default handler;
