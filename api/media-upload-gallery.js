const { createClient } = require('@supabase/supabase-js');
const CLOUD_URL = process.env.BODA_CLOUD_URL;
const CLOUD_TOKEN = process.env.BODA_CLOUD_TOKEN;
const BUCKET = process.env.BODA_GALLERY_BUCKET || 'boda-gallery';
const ADMIN_TOKEN = process.env.BODA_ADMIN_TOKEN || 'boda2027';
const cloud = CLOUD_URL && CLOUD_TOKEN ? createClient(CLOUD_URL, CLOUD_TOKEN) : null;

function clean(name = 'media.mp4') {
  return String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 80) || 'media.mp4';
}
function mimeFor(filename = '', fallback = 'video/mp4') {
  const f = clean(filename);
  if (/\.webm$/i.test(f)) return 'video/webm';
  if (/\.m4v$/i.test(f)) return 'video/x-m4v';
  if (/\.mov$/i.test(f)) return 'video/quicktime';
  if (/\.png$/i.test(f)) return 'image/png';
  if (/\.webp$/i.test(f)) return 'image/webp';
  if (/\.(jpg|jpeg)$/i.test(f)) return 'image/jpeg';
  return fallback || 'video/mp4';
}

module.exports = async function handler(req, res) {
  try {
    if (!cloud) return res.status(500).json({ ok:false, error:'Cloud env vars missing' });
    if (String(req.query.key || '') !== ADMIN_TOKEN) return res.status(403).json({ ok:false, error:'Unauthorized' });
    const id = clean(req.query.id || 'event-media');
    const i = Number(req.query.i);
    const total = Number(req.query.total);
    const chunk = String(req.query.chunk || '');
    const filename = clean(req.query.filename || 'event-media.mp4');
    const mime = String(req.query.mime || mimeFor(filename));
    if (!Number.isInteger(i) || !Number.isInteger(total) || i < 0 || total < 1 || i >= total || total > 600) return res.status(400).json({ ok:false, error:'Invalid chunk index' });
    if (!chunk) return res.status(400).json({ ok:false, error:'Empty chunk' });

    const chunkPath = `gallery/_chunks/${id}/${String(i).padStart(4, '0')}.txt`;
    const { error: chunkError } = await cloud.storage.from(BUCKET).upload(chunkPath, Buffer.from(chunk, 'utf8'), {
      contentType:'text/plain; charset=utf-8', upsert:true, cacheControl:'0'
    });
    if (chunkError) throw chunkError;

    if (String(req.query.done || '') === '1') {
      let base64url = '';
      for (let n = 0; n < total; n++) {
        const partPath = `gallery/_chunks/${id}/${String(n).padStart(4, '0')}.txt`;
        const { data, error } = await cloud.storage.from(BUCKET).download(partPath);
        if (error) throw new Error(`Missing chunk ${n}: ${error.message}`);
        base64url += await data.text();
      }
      const buffer = Buffer.from(base64url, 'base64url');
      if (buffer.length > 30 * 1024 * 1024) return res.status(413).json({ ok:false, error:'Media file too large' });
      const objectPath = `gallery/${Date.now()}-${id}-${filename}`;
      const { error: uploadError } = await cloud.storage.from(BUCKET).upload(objectPath, buffer, {
        contentType:mimeFor(filename, mime), upsert:true, cacheControl:'31536000'
      });
      if (uploadError) throw uploadError;
      const { data: publicData } = cloud.storage.from(BUCKET).getPublicUrl(objectPath);
      return res.json({ ok:true, assembled:true, size:buffer.length, path:objectPath, url:publicData.publicUrl, mime:mimeFor(filename, mime) });
    }
    return res.json({ ok:true, chunk:i, total });
  } catch (error) {
    return res.status(500).json({ ok:false, error:error.message || 'Upload failed' });
  }
};
