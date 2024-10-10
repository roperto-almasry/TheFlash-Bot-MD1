const botSettings = global.db.data.settings || {};

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;

  const chat = global.db.data.chats[m.chat];

  // الأوامر لتفعيل أو تعطيل خاصية الحظر
  if (m.text === '!تفعيل_خاص' && (isOwner || isROwner)) {
    botSettings.antiPrivate = true;
    await m.reply('🚫 تم تفعيل ميزة الحظر في الخاص.');
    return;
  }

  if (m.text === '!تعطيل_خاص' && (isOwner || isROwner)) {
    botSettings.antiPrivate = false;
    await m.reply('✅ تم تعطيل ميزة الحظر في الخاص.');
    return;
  }

  // إذا كانت ميزة الحظر مفعلة
  if (botSettings.antiPrivate && !isOwner && !isROwner) {
    await m.reply(`*[❗] مرحبا @${m.sender.split`@`[0]}, يمنع استخدام البوت في الخاص! سيتم حظرك الآن.*`, false, { mentions: [m.sender] });
    await conn.updateBlockStatus(m.chat, 'block');
    return !1;
  }

  return !1;
}
