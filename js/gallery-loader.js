console.log("✅ gallery-loader.js is running");
async function loadGallery() {
  const baseURL = 'https://raw.githubusercontent.com/yamalvarez/yy-foodtruck-site/main/content/gallery/';
  const files = ['video1.md', 'video2.md', 'video3.md']; // Add more as needed

  const fetchMarkdown = async (file) => {
    try {
      const res = await fetch(baseURL + file);
      if (!res.ok) throw new Error(`❌ Failed to fetch ${file}`);
      console.log(`✅ Loaded ${file}`);
      return res.text();
    } catch (err) {
      console.error(err.message);
      return '';
    }
  };

  const extractTikTokURL = (text) => {
    const match = text.match(/https:\/\/www\.tiktok\.com\/@[^\s)]+/);
    return match ? match[0] : null;
  };

  const isTikTokVideoValid = async (url) => {
    try {
      const response = await fetch(`https://www.tiktok.com/oembed?url=${url}`);
      return response.ok;
    } catch {
      return false;
    }
  };

  const createTikTokEmbed = (url) => {
    const idMatch = url.match(/video\/(\d+)/);
    const videoId = idMatch ? idMatch[1] : '';
    const block = document.createElement('blockquote');
    block.className = 'tiktok-embed';
    block.setAttribute('cite', url);
    block.setAttribute('data-video-id', videoId);
    block.style = 'max-width: 325px; min-width: 200px;';
    block.innerHTML = '<section>Loading…</section>';
    return block;
  };

  const results = await Promise.all(files.map(fetchMarkdown));

  for (let i = 0; i < results.length; i++) {
    const text = results[i];
    const url = extractTikTokURL(text);
    if (url && await isTikTokVideoValid(url)) {
      const embed = createTikTokEmbed(url);

      // Add to homepage carousel (only first 3)
      if (i < 3) {
        const carousel = document.getElementById('carousel');
        if (carousel) {
          carousel.appendChild(embed.cloneNode(true));
          console.log(`🎥 Appended to carousel: ${url}`);
        }
      }

      // Add to full gallery (optional)
      const fullGallery = document.getElementById('gallery-container');
      if (fullGallery) fullGallery.appendChild(embed);
    } else {
      console.warn(`⚠️ Invalid or private TikTok video skipped: ${url}`);
    }
  }

  // Load TikTok embed script (after content)
  const script = document.createElement('script');
  script.src = 'https://www.tiktok.com/embed.js';
  script.async = true;
  document.body.appendChild(script);
  console.log('📥 TikTok embed script loaded');
}
