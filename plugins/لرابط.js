const tasks = {};

const handler = async (m, { conn, command, args }) => {
    const chatId = m.chat;
    const userId = m.sender;

    if (command === 'المهام') {
        const message = `📝 قائمة المهام المتاحة:
1. إضافة مهمة: لإضافة مهمة جديدة إلى قائمة المهام الخاصة بك.
2. إلغاء مهمة: لإلغاء مهمة من القائمة.
3. عرض المهام: لعرض كل المهام الحالية.
4. اكتمال المهمة: لتمييز مهمة كمنجزة.
5. إحصائيات المهام: لعرض الإحصائيات الحالية.

يرجى اختيار أحد الأزرار أدناه لإجراء العملية المطلوبة.`;

        const imageUrl = 'https://forkgraph.zaid.pro/file/id5B2L8s8lxf'; // رابط الصورة هنا

        await conn.sendButton(
            chatId,
            message,
            '🌟 إدارة المهام',
            imageUrl,
            [
                ['➕ إضافة مهمة', '.إضافة_مهمة'],
                ['❌ إلغاء مهمة', '.إلغاء_مهمة'],
                ['📋 عرض المهام', '.عرض_المهام'],
                ['✅ اكتمال المهمة', '.اكتمال_المهمة'],
                ['📊 إحصائيات المهام', '.إحصائيات_المهام']
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
            completed: false
        };

        await conn.reply(chatId, `✅ تم إضافة المهمة: "${taskText}" (${taskType}) بنجاح!`, m);
    }

    // إلغاء مهمة
    if (command === 'إلغاء_مهمة') {
        const userTasks = Object.entries(tasks).filter(([_, task]) => task.userId === userId && !task.completed);
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
            const status = task.completed ? '✅ منجزة' : '⏳ قيد العمل';
            message += `${index + 1}. ${task.text} (${task.type}) - ${status}\n`;
        });

        await conn.reply(chatId, message, m);
    }

    // اكتمال المهمة
    if (command === 'اكتمال_المهمة') {
        const userTasks = Object.entries(tasks).filter(([_, task]) => task.userId === userId && !task.completed);
        if (userTasks.length === 0) {
            return await conn.reply(chatId, "⚠️ لا توجد مهام يمكن وضع علامة اكتمال عليها.", m);
        }

        const taskId = args[0]?.trim();
        if (!taskId || !tasks[taskId]) {
            let message = 'يرجى تحديد رقم المهمة التي ترغب بوضع علامة اكتمال عليها. المهام الحالية:\n';
            userTasks.forEach(([id, task], index) => {
                message += `${index + 1}. ${task.text} (${task.type})\n`;
            });

            return await conn.sendButton(
                chatId,
                message,
                '✅ اكتمال المهام',
                null,
                userTasks.map(([id], index) => [`اكتمال ${index + 1}`, `.اكتمال_المهمة ${id}`]),
                m
            );
        }

        tasks[taskId].completed = true;
        await conn.reply(chatId, `✅ تم وضع علامة اكتمال على المهمة بنجاح!`, m);
    }

    // إحصائيات المهام
    if (command === 'إحصائيات_المهام') {
        const userTasks = Object.values(tasks).filter(task => task.userId === userId);
        const completedTasks = userTasks.filter(task => task.completed).length;
        const pendingTasks = userTasks.length - completedTasks;

        const message = `📊 إحصائيات المهام:
- إجمالي المهام: ${userTasks.length}
- المهام المنجزة: ${completedTasks}
- المهام القيد العمل: ${pendingTasks}`;

        await conn.reply(chatId, message, m);
    }
};

handler.help = ['المهام', 'إضافة_مهمة [النص] | [النوع]', 'إلغاء_مهمة [رقم المهمة]', 'عرض_المهام', 'اكتمال_المهمة [رقم المهمة]', 'إحصائيات_المهام'];
handler.tags = ['tools'];
handler.command = /^(المهام|إضافة_مهمة|إلغاء_مهمة|عرض_المهام|اكتمال_المهمة|إحصائيات_المهام)$/i;

export default handler;
