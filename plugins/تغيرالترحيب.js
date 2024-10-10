//import db from '../lib/database.js'

const botSettings = global.db.data.settings || {};

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner }) {
  if (m.isBaileys && m.fromMe) return !0;
  if (!m.isGroup) return !1;
  if (!m.message) return !0;

  const chat = global.db.data.chats[m.chat];

  // الأوامر لتفعيل أو تعطيل الترحيب بالأعضاء الجدد
  if (m.text === '!تفعيل_الترحيب' && (isOwner || isROwner)) {
    chat.welcomeMode = true;
    await m.reply('🎉 تم تفعيل ميزة الترحيب بالأعضاء الجدد.');
    return;
  }

  if (m.text === '!تعطيل_الترحيب' && (isOwner || isROwner)) {
    chat.welcomeMode = false;
    await m.reply('🚫 تم تعطيل ميزة الترحيب بالأعضاء الجدد.');
    return;
  }

  // تخصيص الرسالة الترحيبية
  if (m.text.startsWith('!تعديل_رسالة_الترحيب')) {
    const newMessage = m.text.split(' ').slice(1).join(' ');
    if (newMessage) {
      chat.welcomeMessage = newMessage;
      await m.reply(`✅ تم تحديث رسالة الترحيب إلى:\n${newMessage}`);
    } else {
      await m.reply('❌ يجب عليك إدخال رسالة جديدة.');
    }
    return;
  }

  // إرسال رسالة ترحيب إذا كانت الميزة مفعلة
  if (chat.welcomeMode && m.action === 'add') {
    const participant = m.participants[0];
    const welcomeMessage = chat.welcomeMessage || `🎉 أهلاً وسهلاً بك @${participant.split`@`[0]} في المجموعة!`;

    // التحقق مما إذا كان العضو الجديد مشرفًا
    if (m.participants[0].admin) {
      await conn.sendMessage(m.chat, { text: `🌟 مرحبًا @${participant.split`@`[0]}، أنت الآن مشرف في المجموعة!` }, { mentions: [participant] });
    } else {
      await conn.sendMessage(m.chat, { text: welcomeMessage }, { mentions: [participant] });
    }
  }

  return !1;
}
