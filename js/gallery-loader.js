async function loadGallery() {
  const baseURL = 'https://raw.githubusercontent.com/yamalvarez/yy-foodtruck-site/main/content/gallery/';
  const files = ['video1.md', 'video2.md', 'video3.md']; // Add more if needed

  const fetchMarkdown = async (file) => {
    const res = await fetch(baseURL + file);
    return res.ok ? res.text() : '';
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

  results.forEach((text, index) => {
    const url = extractTikTokURL(text);
    if (url) {
      const embed = createTikTokEmbed(url);

      // Add to homepage carousel (only first 3)
      if (index < 3) {
        const carousel = document.getElementById('carousel');
        if (carousel) carousel.appendChild(embed.cloneNode(true));
      }

      // Add to full gallery (if available)
      const fullGallery = document.getElementById('gallery-container');
      if (fullGallery) fullGallery.appendChild(embed);
    }
  });

  // Load TikTok embed script
  const script = document.createElement('script');
  script.src = 'https://www.tiktok.com/embed.js';
  script.async = true;
  document.body.appendChild(script);
}

loadGallery();
