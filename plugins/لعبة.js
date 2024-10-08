const games = {}; // لتخزين حالة اللعبة لكل محادثة

const handler = async (m, { conn, command }) => {
    const chatId = m.chat;
    const userId = m.sender;
    const players = games[chatId] || { player1: userId, player2: null, player1Choice: null, player2Choice: null };

    if (command === 'تحدي_صديق') {
        if (players.player2) {
            return await conn.reply(chatId, '⚠️ هناك لعبة قيد التشغيل بالفعل.', m);
        }
        
        const message = `🎮 @${userId.split('@')[0]} قام بتحديك في لعبة "حجر، ورقة، مقص"! اختر الآن:
        
        - حجر
        - ورقة
        - مقص`;
        
        games[chatId] = players; // حفظ حالة اللعبة

        await conn.sendButton(
            chatId,
            message,
            'تحدي الأصدقاء',
            'https://i.imgur.com/PAIkSY6.png', // رابط الصورة
            [
                ['🪨 حجر', '.اختيار حجر'],
                ['📄 ورقة', '.اختيار ورقة'],
                ['✂️ مقص', '.اختيار مقص']
            ],
            m
        );
    }

    if (command === 'اختيار') {
        const userChoice = m.text.split(' ')[1].trim();
        if (!['حجر', 'ورقة', 'مقص'].includes(userChoice)) {
            return await conn.reply(chatId, '⚠️ اختر إما حجر، ورقة، أو مقص.', m);
        }

        if (!players.player1Choice) {
            players.player1Choice = userChoice;
            await conn.reply(chatId, '📝 تم اختيارك! في انتظار اللاعب الثاني...', m);
        } else {
            players.player2Choice = userChoice;
            await conn.reply(chatId, `📝 تم اختيار كلا اللاعبين. الآن دعونا نرى من سيفوز!`, m);

            // حساب النتيجة
            const result = calculateWinner(players.player1Choice, players.player2Choice);
            const resultMessage = `نتائج اللعبة:
            - لاعب 1: ${players.player1Choice}
            - لاعب 2: ${players.player2Choice}
            
            النتيجة: ${result}`;

            await conn.reply(chatId, resultMessage, m);

            // إعادة تعيين اللعبة
            games[chatId] = { player1: userId, player2: null, player1Choice: null, player2Choice: null };
        }
    }
};

// حساب الفائز بناءً على الاختيارات
const calculateWinner = (choice1, choice2) => {
    if (choice1 === choice2) return '⚖️ تعادل!';
    
    if (
        (choice1 === 'حجر' && choice2 === 'مقص') ||
        (choice1 === 'ورقة' && choice2 === 'حجر') ||
        (choice1 === 'مقص' && choice2 === 'ورقة')
    ) {
        return '🎉 اللاعب 1 فاز!';
    } else {
        return '🎉 اللاعب 2 فاز!';
    }
};

handler.command = ['تحدي_صديق', 'اختيار'];
export default handler;
