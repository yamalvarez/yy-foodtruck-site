async function loadGallery() {
  console.log("🚀 Starting loadGallery");

  const baseURL = 'https://raw.githubusercontent.com/yamalvarez/yy-foodtruck-site/main/content/gallery/';
  const files = ['video1.md', 'video2.md', 'video3.md'];

  const fetchMarkdown = async (file) => {
    const url = baseURL + file;
    console.log(`📥 Fetching: ${url}`);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`❌ Failed to fetch ${file}: ${res.status}`);
        return '';
      }
      const text = await res.text();
      console.log(`✅ Loaded ${file}`);
      return text;
    } catch (err) {
      console.error(`🔥 Error fetching ${file}`, err);
      return '';
    }
  };

  const extractTikTokURL = (text) => {
    const match = text.match(/https:\/\/www\.tiktok\.com\/@[^\s)]+/);
    console.log("🔍 Extracted URL:", match ? match[0] : "None");
    return match ? match[0] : null;
  };

  const createTikTokEmbed = (url) => {
    const idMatch = url.match(/video\/(\d+)/);
    const videoId = idMatch ? idMatch[1] : '';
    console.log("🎞️ Creating embed for:", videoId);
    const block = document.createElement('blockquote');
    block.className = 'tiktok-embed';
    block.setAttribute('cite', url);
    block.setAttribute('data-video-id', videoId);
    block.style = 'max-width: 325px; min-width: 200px;';
    block.innerHTML = '<section>Loading…</section>';
    return block;
  };

  const results = await Promise.all(files.map(fetchMarkdown));

  results.forEach((text, index) => {
    const url = extractTikTokURL(text);
    if (url) {
      const embed = createTikTokEmbed(url);

      const carousel = document.getElementById('carousel');
      if (carousel) {
        console.log("🧩 Appending to carousel:", url);
        carousel.appendChild(embed.cloneNode(true));
      } else {
        console.warn("❌ Carousel container not found");
      }

      const fullGallery = document.getElementById('gallery-container');
      if (fullGallery) {
        fullGallery.appendChild(embed);
      }
    } else {
      console.warn("⚠️ No valid TikTok URL found in file");
    }
  });

  const script = document.createElement('script');
  script.src = 'https://www.tiktok.com/embed.js';
  script.async = true;
  script.onload = () => console.log("📥 TikTok embed script loaded");
  document.body.appendChild(script);
}

loadGallery();
