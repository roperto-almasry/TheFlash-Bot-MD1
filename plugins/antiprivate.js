// Handler لأمر تفعيل أو تعطيل ميزة antiPrivate
export async function handler(m, { conn, isOwner }) {
  const command = m.text.trim().toLowerCase();

  // تحقق إذا كان المستخدم مالك البوت
  if (!isOwner) {
    return m.reply('*[❗] فقط مالك البوت يمكنه استخدام هذا الأمر.*');
  }

  const botSettings = global.db.data.settings[conn.user.jid] || {};

  if (command === '!antiprivate on') {
    botSettings.antiPrivate = true;
    await m.reply('*✅ تم تفعيل ميزة منع الرسائل الخاصة.*');
  } else if (command === '!antiprivate off') {
    botSettings.antiPrivate = false;
    await m.reply('*❌ تم إلغاء تفعيل ميزة منع الرسائل الخاصة.*');
  } else {
    await m.reply('*❓ استخدام: !antiprivate on أو !antiprivate off*');
  }
}

// Before handler لفحص ميزة antiPrivate وتفعيل الحظر
export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  
  // الكلمات التي يجب تجاهلها
  if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0;

  const botSettings = global.db.data.settings[conn.user.jid] || {};

  // إذا كانت ميزة منع الرسائل الخاصة مفعلة
  if (botSettings.antiPrivate && !isOwner && !isROwner) {
    await m.reply(`*[❗] مرحبا ياورع @${m.sender.split`@`[0]}, ممنوع الدخول للبوت خاص ياورع ابلع بلوك نيهههههههههها.*`, false, { mentions: [m.sender] });
    await conn.updateBlockStatus(m.chat, 'block');  // حظر المستخدم
  }
  return !1;
}
