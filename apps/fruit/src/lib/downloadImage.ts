function clickDownloadLink(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
}

/**
 * Saves an image under `filename`. The image host is another origin, where the browser ignores
 * the `download` name of a plain link, so the bytes are fetched first; when that is refused the
 * plain link still opens the image.
 */
export async function downloadImage(src: string, filename: string) {
  try {
    const response = await fetch(src);
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);
    const objectUrl = URL.createObjectURL(await response.blob());
    clickDownloadLink(objectUrl, filename);
    URL.revokeObjectURL(objectUrl);
  } catch {
    clickDownloadLink(src, filename);
  }
}
