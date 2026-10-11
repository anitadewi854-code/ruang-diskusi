export const formatDate = (iso) => new Date(iso).toLocaleString('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short'
})

// body dari API bisa berisi tag HTML; dibersihkan agar aman ditampilkan sebagai teks
export const plain = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

export const snippet = (html, max = 140) => {
  const text = plain(html)
  return text.length > max ? `${text.slice(0, max)}...` : text
}
