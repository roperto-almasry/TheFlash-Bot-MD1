import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

let handler = async (m, { conn }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image/')) return conn.reply(m.chat, '🚩 رد على صورة فقط.', m);

    let media = await q.download();
    const { ext } = await fileTypeFromBuffer(media);
    if (!['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return conn.reply(m.chat, '🚩 الصورة غير مدعومة.', m);
    if (media.length > 5 * 1024 * 1024) return conn.reply(m.chat, '🚩 حجم الصورة أكبر من 5MB.', m);

    let link = await uploadToImgbb(media);
    let thumbnail = await sharp(media).resize({ width: 300 }).toBuffer();
    let sizeInMB = (media.length / (1024 * 1024)).toFixed(2);
    let shortLink = await shortenUrl(link);

    let txt = *» رابط الصورة:* ${link}\n*» حجم الصورة:* ${sizeInMB} MB\n\n> تم التحويل بنجاح ⚡🚀;
    await conn.sendMessage(m.chat, { image: thumbnail, caption: txt });
    await conn.reply(m.chat, 🔗 الرابط المختصر: ${shortLink}, m);

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, '🌱 حدث خطأ أثناء معالجة الصورة.', m);
  }
};

const uploadToImgbb = async (buffer) => {
  const form = new FormData();
  form.append('image', new Blob([buffer]));

  const res = await fetch(https://api.imgbb.com/1/upload?key=f5a208d3f99e1fb3edb7f8775d28151d, {
    method: 'POST',
    body: form
  });

  const result = await res.json();
  if (result.success) return result.data.url;
  throw new Error('فشل رفع الصورة');
};

const shortenUrl = async (url) => {
  const res = await fetch(https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)});
  return await res.text();
};

handler.command = ['لرابط'];
export default handler;
