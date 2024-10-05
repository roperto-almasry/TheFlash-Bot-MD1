const fetch = require('node-fetch');
const { FormData, Blob } = require('formdata-node');
const { fileTypeFromBuffer } = require('file-type');
const sharp = require('sharp');

const handler = async (m, { conn }) => {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) return conn.reply(m.chat, '🚩 رد على صورة فقط.', m);

    const media = await q.download();
    const { ext } = await fileTypeFromBuffer(media);
    if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return conn.reply(m.chat, '🚩 الصورة غير مدعومة.', m);
    if (media.length > 5 * 1024 * 1024) return conn.reply(m.chat, '🚩 حجم الصورة أكبر من 5MB.', m);

    const link = await uploadToImgbb(media);
    const thumbnail = await sharp(media).resize({ width: 300 }).toBuffer();
    const sizeInMB = (media.length / (1024 * 1024)).toFixed(2);
    const shortLink = await shortenUrl(link);

    const txt = `*» رابط الصورة:* ${link}\n*» حجم الصورة:* ${sizeInMB} MB\n\n> تم التحويل بنجاح ⚡🚀`;
    await conn.sendMessage(m.chat, { image: thumbnail, caption: txt });

    await conn.sendButton(
      m.chat,
      `🔗 الرابط المختصر: ${shortLink}`,
      '🌟 يمكنك استخدام الأزرار أدناه للمزيد من الخيارات',
      null,
      [
        ['📥 فتح الرابط', link],
        ['📥 تحميل الصورة الأصلية', link],
      ],
      m
    );
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '🌱 حدث خطأ أثناء معالجة الصورة.', m);
  }
};

const uploadToImgbb = async (buffer) => {
  const form = new FormData();
  form.append('image', new Blob([buffer]));

  const res = await fetch('https://api.imgbb.com/1/upload?key=f5a208d3f99e1fb3edb7f8775d28151d', {
    method: 'POST',
    body: form
  });

  const result = await res.json();
  if (result.success) return result.data.url;
  throw new Error('فشل رفع الصورة');
};

const shortenUrl = async (url) => {
  const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
  return await res.text();
};

handler.command = ['لرابط'];
module.exports = handler;
