
async function loadGallery() {
  const repo = "yamalvarez/yy-foodtruck-site";
  const branch = "main";
  const apiUrl = `https://api.github.com/repos/${repo}/contents/content/gallery`;

  const galleryContainer = document.querySelector(".gallery-grid");

  try {
    const res = await fetch(apiUrl);
    const files = await res.json();

    for (const file of files) {
      if (file.name.endsWith(".md")) {
        const fileRes = await fetch(file.download_url);
        const content = await fileRes.text();

        const match = content.match(/video:\s*(.+)/i);
        if (match && match[1]) {
          const videoUrl = match[1].trim();
          const videoId = videoUrl.split("/").pop().split("?")[0];

          const block = document.createElement("blockquote");
          block.className = "tiktok-embed";
          block.setAttribute("cite", videoUrl);
          block.setAttribute("data-video-id", videoId);
          block.style.maxWidth = "325px";
          block.style.minWidth = "200px";

          const section = document.createElement("section");
          section.innerText = "Loading…";

          block.appendChild(section);
          galleryContainer.appendChild(block);
        }
      }
    }

    // Re-trigger TikTok embed script
    const embedScript = document.createElement("script");
    embedScript.src = "https://www.tiktok.com/embed.js";
    document.body.appendChild(embedScript);
  } catch (err) {
    console.error("Error loading TikTok gallery:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadGallery);
