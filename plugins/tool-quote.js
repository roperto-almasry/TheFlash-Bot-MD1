const quotes = {
    motivational: [
        { text: "النجاح ليس نهائياً، والفشل ليس قاتلاً: الشجاعة للاستمرار هي ما يهم.", image: "https://i.imgur.com/Oi1Zkfj.png" },
        { text: "لا تنتظر الفرص، اصنعها.", image: "https://i.imgur.com/d8bAkZG.png" },
        { text: "الطريق إلى النجاح دائماً تحت الإنشاء.", image: "https://i.imgur.com/cB7Y9Uf.png" }
    ],
    wise: [
        { text: "الحكمة هي معرفة ما يجب أن تتجاهله.", image: "https://i.imgur.com/7uBpI1n.png" },
        { text: "العقل الكبير يناقش الأفكار؛ العقل المتوسط يناقش الأحداث؛ العقل الصغير يناقش الأشخاص.", image: "https://i.imgur.com/2hGMI9j.png" },
        { text: "الحكمة تأتي من التجربة، والتجربة غالباً ما تأتي من نقص الحكمة.", image: "https://i.imgur.com/wmBWe9g.png" }
    ],
    funny: [
        { text: "الحياة قصيرة، ابتسم بينما لا تزال تملك أسنانك.", image: "https://i.imgur.com/Ghd0zCg.png" },
        { text: "لا تأخذ الحياة على محمل الجد، فلن تخرج منها حياً.", image: "https://i.imgur.com/5kIzIu5.png" },
        { text: "إذا كنت تعتقد أن لا أحد يهتم بوجودك، حاول التوقف عن دفع الفواتير لعدة أشهر.", image: "https://i.imgur.com/EzdNaeA.png" }
    ]
};

const handler = async (m, { conn, command, args }) => {
    let category = args[0]?.toLowerCase();

    if (!['motivational', 'wise', 'funny'].includes(category)) {
        category = 'motivational'; // افتراضي إلى تحفيزي إذا لم يتم التحديد
    }

    const quote = getRandomQuote(category);

    const message = `📝 *اقتباس ${category === 'motivational' ? 'تحفيزي' : category === 'wise' ? 'حكيم' : 'مضحك'}*:\n"${quote.text}"`;

    await conn.sendButton(
        m.chat,
        message,
        '🌟 مولد الاقتباسات',
        quote.image,
        [
            ['🔄 اقتباس جديد', `.اقتباس ${category}`],
            ['💪 تحفيزي', '.اقتباس motivational'],
            ['📜 حكيم', '.اقتباس wise'],
            ['😂 مضحك', '.اقتباس funny']
        ],
        m
    );
};

const getRandomQuote = (category) => {
    const quotesList = quotes[category];
    return quotesList[Math.floor(Math.random() * quotesList.length)];
};

handler.command = ['اقتباس'];
export default handler;
