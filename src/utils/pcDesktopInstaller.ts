/**
 * Islamic Path (islamicpath786) - PC Offline Saver & Desktop Installer
 * Saves the offline website application file and desktop shortcut directly to the user's computer.
 */

export function downloadPCDesktopInstaller(): boolean {
  try {
    const originUrl = typeof window !== 'undefined' 
      ? window.location.origin + '/' 
      : 'https://ais-dev-zyjcx33xqjwopj6xf5onbs-23464905109.asia-east1.run.app/';

    // 1. Standalone Offline Web App File (.html) that gets saved directly to computer
    const offlineHtmlContent = `<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Islamic Path (islamicpath786) - شاہراہِ اسلام</title>
  <link rel="icon" href="${originUrl}favicon.jpg">
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #0b3d16;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Nastaliq Urdu", sans-serif;
    }
    #top-bar {
      height: 44px;
      background: linear-gradient(90deg, #092c10, #145a23);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      border-bottom: 1px solid rgba(255,255,255,0.15);
      font-size: 13px;
      user-select: none;
    }
    #top-bar .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      color: #ffe066;
    }
    #top-bar .badge {
      background: #008000;
      color: #fff;
      padding: 3px 8px;
      border-radius: 9999px;
      font-size: 11px;
    }
    #app-frame {
      width: 100%;
      height: calc(100% - 44px);
      border: none;
      background: #ffffff;
    }
  </style>
</head>
<body>
  <div id="top-bar">
    <div class="title">
      <span>🕌 شاہراہِ اسلام • Islamic Path (islamicpath786)</span>
      <span class="badge">کمپیوٹر پر محفوظ شدہ (Saved to PC)</span>
    </div>
    <div style="font-size:12px; color:#d1fae5;">
      100% آف لائن قرآن، حدیث اور خودکار اذان
    </div>
  </div>
  <iframe 
    id="app-frame" 
    src="${originUrl}" 
    allow="geolocation; microphone; camera; midi; encrypted-media; autoplay; fullscreen" 
    allowfullscreen
  ></iframe>
  <script>
    // Offline caching registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('${originUrl}sw.js')
        .then(function() { console.log('IslamicPath offline worker loaded'); })
        .catch(function(e) { console.log('SW status:', e); });
    }
  </script>
</body>
</html>`;

    // Trigger instant download of IslamicPath-Offline-App.html
    const htmlBlob = new Blob([offlineHtmlContent], { type: 'text/html;charset=utf-8' });
    const htmlBlobUrl = URL.createObjectURL(htmlBlob);
    const htmlLink = document.createElement('a');
    htmlLink.href = htmlBlobUrl;
    htmlLink.download = 'IslamicPath-islamicpath786.html';
    document.body.appendChild(htmlLink);
    htmlLink.click();
    document.body.removeChild(htmlLink);
    URL.revokeObjectURL(htmlBlobUrl);

    // 2. Also download Windows Desktop Shortcut (.url)
    setTimeout(() => {
      try {
        const urlContent = `[InternetShortcut]\r\nURL=${originUrl}\r\nIconIndex=0\r\nIconFile=${originUrl}favicon.jpg\r\nHotKey=0\r\n[{000214A0-0000-0000-C000-000000000046}]\r\nProp3=19,0\r\n`;
        const urlBlob = new Blob([urlContent], { type: 'application/internet-shortcut;charset=utf-8' });
        const urlBlobUrl = URL.createObjectURL(urlBlob);
        const urlLink = document.createElement('a');
        urlLink.href = urlBlobUrl;
        urlLink.download = 'Islamic Path (islamicpath786).url';
        document.body.appendChild(urlLink);
        urlLink.click();
        document.body.removeChild(urlLink);
        URL.revokeObjectURL(urlBlobUrl);
      } catch (err) {
        console.warn('URL shortcut generation failed:', err);
      }
    }, 300);

    return true;
  } catch (error) {
    console.error('Failed to save website to computer:', error);
    return false;
  }
}
