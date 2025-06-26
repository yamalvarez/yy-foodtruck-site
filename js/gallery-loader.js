async function loadGallery() {
  const baseURL = 'https://raw.githubusercontent.com/yamalvarez/yy-foodtruck-site/main/content/gallery/';
  const files = ['video1.md', 'video2.md', 'video3.md'];

  const fetchMarkdown = async (file) => {
    const res = await fetch(baseURL + file);
    if (!res.ok) {
      console.warn(`❌ Failed to load ${file}`);
      return '';
    }
    console.log(`✅ Loaded ${file}`);
    return res.text();
  };

  const extractTikTokURL = (text) => {
    const match = text.match(/https:\/\/www\.tiktok\.com\/@[^\s)]+/);
    return match ? match[0] : null;
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

  const carousel = document.getElementById('carousel');
  const fullGallery = document.getElementById('gallery-container'); // optional

  results.forEach((text, index) => {
    const url = extractTikTokURL(text);
    if (url) {
      const embed = createTikTokEmbed(url);

      if (carousel && index < 3) {
        carousel.appendChild(embed.cloneNode(true));
        console.log(`🎥 Appended to carousel: ${url}`);
      }

      if (fullGallery) {
        fullGallery.appendChild(embed);
      }
    } else {
      console.warn(`⚠️ No TikTok URL found in video${index + 1}.md`);
    }
  });

  // Force TikTok to re-scan embeds
  if (window.tiktok && window.tiktok.Embed) {
    window.tiktok.Embed.load();
    console.log('📦 TikTok embed reload triggered');
  } else {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    script.onload = () => console.log('📥 TikTok embed script loaded');
    document.body.appendChild(script);
  }
}

loadGallery();
