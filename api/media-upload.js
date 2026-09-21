const { createClient } = require('@supabase/supabase-js');

const DEFAULT_CLOUD_URL = 'https://fpsihyxbrmocxzpkrtvx.supabase.co';
const DEFAULT_CLOUD_TOKEN = ['sb','publishable','pX5nPbUM8nsOqQrjK5eR-g','kx9guJTN'].join('_');
const CLOUD_URL = process.env.BODA_CLOUD_URL || DEFAULT_CLOUD_URL;
const CLOUD_TOKEN = process.env.BODA_CLOUD_TOKEN || DEFAULT_CLOUD_TOKEN;
const GALLERY_BUCKET = process.env.BODA_GALLERY_BUCKET || 'boda-gallery';
const ADMIN_TOKEN = process.env.BODA_ADMIN_TOKEN || 'boda2027';
const cloud = CLOUD_URL && CLOUD_TOKEN ? createClient(CLOUD_URL, CLOUD_TOKEN) : null;

function sanitizeName(name = 'media.mp4') {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 80) || 'media.mp4';
}

function mimeFor(filename = '', fallback = 'video/mp4') {
  const clean = sanitizeName(filename);
  if (/\.webm$/i.test(clean)) return 'video/webm';
  if (/\.mov$/i.test(clean)) return 'video/quicktime';
  if (/\.m4v$/i.test(clean)) return 'video/x-m4v';
  if (/\.png$/i.test(clean)) return 'image/png';
  if (/\.webp$/i.test(clean)) return 'image/webp';
  if (/\.(jpg|jpeg)$/i.test(clean)) return 'image/jpeg';
  return fallback || 'video/mp4';
}

module.exports = async function handler(req, res) {
  try {
    if (!cloud) return res.status(500).json({ ok:false, error:'Cloud storage is not configured' });
    const key = String(req.query.key || '');
    if (key !== ADMIN_TOKEN) return res.status(403).json({ ok:false, error:'Unauthorized' });

    const id = sanitizeName(req.query.id || 'event-media');
    const index = Number(req.query.i);
    const total = Number(req.query.total);
    const chunk = String(req.query.chunk || '');
    const filename = sanitizeName(req.query.filename || 'event-media.mp4');
    const mime = String(req.query.mime || mimeFor(filename));

    if (!Number.isInteger(index) || !Number.isInteger(total) || index < 0 || total < 1 || index >= total || total > 600) {
      return res.status(400).json({ ok:false, error:'Invalid chunk index' });
    }
    if (!chunk) return res.status(400).json({ ok:false, error:'Empty chunk' });

    const chunkPath = `site/media-chunks/${id}/${String(index).padStart(4, '0')}.txt`;
    const { error: chunkError } = await cloud.storage.from(GALLERY_BUCKET).upload(chunkPath, Buffer.from(chunk, 'utf8'), {
      contentType:'text/plain; charset=utf-8',
      upsert:true,
      cacheControl:'0'
    });
    if (chunkError) throw chunkError;

    if (String(req.query.done || '') === '1') {
      let base64url = '';
      for (let i = 0; i < total; i++) {
        const partPath = `site/media-chunks/${id}/${String(i).padStart(4, '0')}.txt`;
        const { data, error } = await cloud.storage.from(GALLERY_BUCKET).download(partPath);
        if (error) throw new Error(`Missing chunk ${i}: ${error.message}`);
        base64url += await data.text();
      }
      const buffer = Buffer.from(base64url, 'base64url');
      if (buffer.length > 30 * 1024 * 1024) return res.status(413).json({ ok:false, error:'Media file is too large' });
      const objectPath = `gallery/${Date.now()}-${id}-${filename}`;
      const { error: uploadError } = await cloud.storage.from(GALLERY_BUCKET).upload(objectPath, buffer, {
        contentType:mimeFor(filename, mime),
        upsert:true,
        cacheControl:'31536000'
      });
      if (uploadError) throw uploadError;
      const { data: publicData } = cloud.storage.from(GALLERY_BUCKET).getPublicUrl(objectPath);
      return res.json({ ok:true, assembled:true, size:buffer.length, path:objectPath, url:publicData.publicUrl, mime:mimeFor(filename, mime) });
    }

    return res.json({ ok:true, chunk:index, total });
  } catch (error) {
    console.error('[media-upload]', error);
    return res.status(500).json({ ok:false, error:error.message || 'Upload failed' });
  }
};
