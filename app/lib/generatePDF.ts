/**
 * PDF generator — rendu canvas pur (sans html2canvas)
 * Chaque page est dessinée à 200dpi équivalent (1654×2339px pour A4).
 */

// ── Types (miroir de create/page.tsx) ─────────────────────────────────────
interface TextEl {
  id: string;
  x: number; y: number; w: number;
  text: string;
  size: number;
  color: string;
  bold: boolean;
  italic: boolean;
  align: "left" | "center" | "right";
  font: "playfair" | "inter";
}
interface StickerEl {
  id: string;
  emoji: string;
  x: number; y: number; size: number;
}
export interface PDFPage {
  layoutId: string;
  photos: (string | null)[];
  photoPositions?: { x: number; y: number }[];
  bgColor: string;
  title?: string;
  subtitle?: string;
  caption?: string;
  texts?: TextEl[];
  stickers?: StickerEl[];
  coverHue?: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Samples the average color of each edge of an image (top/bottom/left/right).
 * Used to fill letterbox bands so they blend seamlessly with the cover image.
 *
 * Strategy: draw each edge into a 1-px-tall/wide strip on a tiny offscreen
 * canvas, then average the RGB values. Runs in <1ms even for large images.
 */
async function sampleEdgeColors(img: HTMLImageElement): Promise<{
  top: string; bottom: string; left: string; right: string;
}> {
  const SAMPLES = 60; // pixels to average along each edge

  const c = document.createElement("canvas");
  const cx = c.getContext("2d")!;

  function avg(data: Uint8ClampedArray): string {
    let r = 0, g = 0, b = 0;
    const n = data.length / 4;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i]; g += data[i + 1]; b += data[i + 2];
    }
    return `rgb(${Math.round(r / n)},${Math.round(g / n)},${Math.round(b / n)})`;
  }

  // Top edge — sample first row of pixels
  c.width = SAMPLES; c.height = 1;
  cx.drawImage(img, 0, 0, img.width, 1, 0, 0, SAMPLES, 1);
  const top = avg(cx.getImageData(0, 0, SAMPLES, 1).data);

  // Bottom edge — sample last row of pixels
  cx.clearRect(0, 0, SAMPLES, 1);
  cx.drawImage(img, 0, img.height - 1, img.width, 1, 0, 0, SAMPLES, 1);
  const bottom = avg(cx.getImageData(0, 0, SAMPLES, 1).data);

  // Left edge — sample first column of pixels
  c.width = 1; c.height = SAMPLES;
  cx.drawImage(img, 0, 0, 1, img.height, 0, 0, 1, SAMPLES);
  const left = avg(cx.getImageData(0, 0, 1, SAMPLES).data);

  // Right edge — sample last column of pixels
  cx.clearRect(0, 0, 1, SAMPLES);
  cx.drawImage(img, img.width - 1, 0, 1, img.height, 0, 0, 1, SAMPLES);
  const right = avg(cx.getImageData(0, 0, 1, SAMPLES).data);

  return { top, bottom, left, right };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number, y: number, w: number, h: number,
  posX = 50, posY = 50
) {
  const imgRatio = img.width / img.height;
  const slotRatio = w / h;
  let sw: number, sh: number, sx: number, sy: number;

  if (imgRatio > slotRatio) {
    sh = img.height;
    sw = sh * slotRatio;
    sy = 0;
    sx = (img.width - sw) * (posX / 100);
  } else {
    sw = img.width;
    sh = sw / slotRatio;
    sx = 0;
    sy = (img.height - sh) * (posY / 100);
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawTexts(ctx: CanvasRenderingContext2D, texts: TextEl[], W: number, H: number) {
  for (const el of texts) {
    if (!el.text) continue;
    ctx.save();
    const fStyle = `${el.italic ? "italic " : ""}${el.bold ? "bold " : ""}${el.size}px ${el.font === "playfair" ? "Georgia, serif" : "Arial, sans-serif"}`;
    ctx.font = fStyle;
    ctx.fillStyle = el.color;
    ctx.textBaseline = "top";
    ctx.textAlign = el.align;
    const x = (el.x / 100) * W;
    const y = (el.y / 100) * H;
    const maxW = (el.w / 100) * W;

    // Word wrap
    const words = el.text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxW && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);

    const lineH = el.size * 1.3;
    const textX = el.align === "center" ? x + maxW / 2 : el.align === "right" ? x + maxW : x;
    lines.forEach((line, i) => ctx.fillText(line, textX, y + i * lineH, maxW));
    ctx.restore();
  }
}

function drawStickers(ctx: CanvasRenderingContext2D, stickers: StickerEl[], W: number, H: number) {
  for (const el of stickers) {
    ctx.save();
    ctx.font = `${el.size}px serif`;
    ctx.textBaseline = "top";
    ctx.fillText(el.emoji, (el.x / 100) * W, (el.y / 100) * H);
    ctx.restore();
  }
}

// ── Page renderer ─────────────────────────────────────────────────────────

async function renderPage(
  ctx: CanvasRenderingContext2D,
  page: PDFPage,
  W: number,
  H: number,
  albumTitle: string
): Promise<void> {
  const GAP = 2;

  // High-quality image smoothing — preserves photo sharpness during the
  // scale-up to print resolution (otherwise interior photos look soft).
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Background
  ctx.fillStyle = page.bgColor || "#ffffff";
  ctx.fillRect(0, 0, W, H);

  const positions = page.photoPositions ?? page.photos.map(() => ({ x: 50, y: 50 }));

  // Load all photos up front
  const imgs: (HTMLImageElement | null)[] = await Promise.all(
    page.photos.map(async (src) => {
      if (!src) return null;
      try { return await loadImage(src); } catch { return null; }
    })
  );

  const { layoutId } = page;

  // ── Cover ──
  if (layoutId === "cover") {
    if (imgs[0]) {
      // Template Canva : image pleine page
      drawImageCover(ctx, imgs[0], 0, 0, W, H, 50, 50);
    } else {
      // Titre textuel
      const dark = ["#1e1e1e","#0f172a","#1a1a2e","#4a1942","#0c2340","#7c3aed","#be185d","#0369a1","#15803d","#b45309"].includes(page.bgColor || "");
      ctx.fillStyle = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)";
      ctx.fillRect(W * 0.1, H * 0.42, W * 0.8, 1);

      const title = page.title || albumTitle || "Mon Album";
      ctx.save();
      ctx.fillStyle = dark ? "#ffffff" : "#1e293b";
      ctx.font = `italic ${Math.round(W * 0.065)}px Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(title, W / 2, H / 2, W * 0.8);
      if (page.subtitle) {
        ctx.font = `${Math.round(W * 0.022)}px Arial, sans-serif`;
        ctx.fillStyle = dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";
        ctx.fillText(page.subtitle, W / 2, H / 2 + Math.round(W * 0.09), W * 0.7);
      }
      ctx.restore();
    }
  }

  // ── Full ──
  else if (layoutId === "full") {
    if (imgs[0]) drawImageCover(ctx, imgs[0], 0, 0, W, H, positions[0]?.x ?? 50, positions[0]?.y ?? 50);
  }

  // ── Two horizontal ──
  else if (layoutId === "two-h") {
    const h = (H - GAP) / 2;
    if (imgs[0]) drawImageCover(ctx, imgs[0], 0, 0, W, h, positions[0]?.x, positions[0]?.y);
    if (imgs[1]) drawImageCover(ctx, imgs[1], 0, h + GAP, W, h, positions[1]?.x, positions[1]?.y);
    else { ctx.fillStyle = "#f0ede8"; ctx.fillRect(0, h + GAP, W, h); }
  }

  // ── Two vertical ──
  else if (layoutId === "two-v") {
    const w = (W - GAP) / 2;
    if (imgs[0]) drawImageCover(ctx, imgs[0], 0, 0, w, H, positions[0]?.x, positions[0]?.y);
    else { ctx.fillStyle = "#f0ede8"; ctx.fillRect(0, 0, w, H); }
    if (imgs[1]) drawImageCover(ctx, imgs[1], w + GAP, 0, w, H, positions[1]?.x, positions[1]?.y);
    else { ctx.fillStyle = "#f0ede8"; ctx.fillRect(w + GAP, 0, w, H); }
  }

  // ── Three top (grande + 2 bas) ──
  else if (layoutId === "three-top") {
    const topH = H * (2 / 3);
    const botH = H - topH - GAP;
    const botW = (W - GAP) / 2;
    if (imgs[0]) drawImageCover(ctx, imgs[0], 0, 0, W, topH, positions[0]?.x, positions[0]?.y);
    else { ctx.fillStyle = "#f0ede8"; ctx.fillRect(0, 0, W, topH); }
    if (imgs[1]) drawImageCover(ctx, imgs[1], 0, topH + GAP, botW, botH, positions[1]?.x, positions[1]?.y);
    else { ctx.fillStyle = "#f0ede8"; ctx.fillRect(0, topH + GAP, botW, botH); }
    if (imgs[2]) drawImageCover(ctx, imgs[2], botW + GAP, topH + GAP, botW, botH, positions[2]?.x, positions[2]?.y);
    else { ctx.fillStyle = "#f0ede8"; ctx.fillRect(botW + GAP, topH + GAP, botW, botH); }
  }

  // ── Three left (grande gauche + 2 droite) ──
  else if (layoutId === "three-left") {
    const leftW = W / 2;
    const rightW = W - leftW - GAP;
    const rightH = (H - GAP) / 2;
    if (imgs[0]) drawImageCover(ctx, imgs[0], 0, 0, leftW, H, positions[0]?.x, positions[0]?.y);
    else { ctx.fillStyle = "#f0ede8"; ctx.fillRect(0, 0, leftW, H); }
    if (imgs[1]) drawImageCover(ctx, imgs[1], leftW + GAP, 0, rightW, rightH, positions[1]?.x, positions[1]?.y);
    else { ctx.fillStyle = "#f0ede8"; ctx.fillRect(leftW + GAP, 0, rightW, rightH); }
    if (imgs[2]) drawImageCover(ctx, imgs[2], leftW + GAP, rightH + GAP, rightW, rightH, positions[2]?.x, positions[2]?.y);
    else { ctx.fillStyle = "#f0ede8"; ctx.fillRect(leftW + GAP, rightH + GAP, rightW, rightH); }
  }

  // ── Grid 4 ──
  else if (layoutId === "grid4") {
    const hw = (W - GAP) / 2;
    const hh = (H - GAP) / 2;
    [[0,0],[hw+GAP,0],[0,hh+GAP],[hw+GAP,hh+GAP]].forEach(([x,y], i) => {
      if (imgs[i]) drawImageCover(ctx, imgs[i]!, x, y, hw, hh, positions[i]?.x, positions[i]?.y);
      else { ctx.fillStyle = "#f0ede8"; ctx.fillRect(x, y, hw, hh); }
    });
  }

  // ── Photo + texte ──
  else if (layoutId === "photo-text") {
    const photoH = H * 0.72;
    if (imgs[0]) drawImageCover(ctx, imgs[0], 0, 0, W, photoH, positions[0]?.x, positions[0]?.y);
    if (page.caption) {
      ctx.save();
      ctx.fillStyle = "#64748b";
      ctx.font = `italic ${Math.round(W * 0.025)}px Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(page.caption, W / 2, photoH + (H - photoH) / 2, W * 0.85);
      ctx.restore();
    }
  }

  // ── Text only ──
  else if (layoutId === "text-only") {
    if (page.caption) {
      ctx.save();
      ctx.fillStyle = "#475569";
      ctx.font = `italic ${Math.round(W * 0.032)}px Georgia, serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // word wrap simple
      const words = page.caption.split(" ");
      const lines: string[] = [];
      let cur = "";
      const maxW = W * 0.75;
      for (const w of words) {
        const test = cur ? `${cur} ${w}` : w;
        if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; } else { cur = test; }
      }
      if (cur) lines.push(cur);
      const lh = Math.round(W * 0.045);
      const startY = H / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((line, i) => ctx.fillText(line, W / 2, startY + i * lh));
      ctx.restore();
    }
  }

  // ── Textes & stickers libres ──
  drawTexts(ctx, page.texts ?? [], W, H);
  drawStickers(ctx, page.stickers ?? [], W, H);
}

// ── Public API ────────────────────────────────────────────────────────────

export async function generateAlbumPDF(
  pages: PDFPage[],
  albumTitle: string,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  // A4 à 200dpi équivalent
  const W = 1654;
  const H = 2339;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Import dynamique de jspdf pour éviter le SSR
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  for (let i = 0; i < pages.length; i++) {
    onProgress?.(i + 1, pages.length);

    ctx.clearRect(0, 0, W, H);
    await renderPage(ctx, pages[i], W, H, albumTitle);

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
  }

  return pdf.output("blob");
}

/**
 * Generate interior PDF for Lulu (A4, skip cover page)
 * All pages except the first (cover) page, at 300 DPI.
 */
export async function generateLuluInteriorPDF(
  pages: PDFPage[],
  albumTitle: string,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  // A4 at 300 DPI: 210×297mm = 2480×3508px
  const W = 2480;
  const H = 3508;
  // A4 in mm
  const W_MM = 210;
  const H_MM = 297;

  const interiorPages = pages.slice(1); // Skip cover
  if (interiorPages.length === 0) throw new Error("No interior pages");

  // Lulu requires even page count
  const needsBlank = interiorPages.length % 2 !== 0;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: [W_MM, H_MM] });

  const totalPages = interiorPages.length + (needsBlank ? 1 : 0);

  for (let i = 0; i < interiorPages.length; i++) {
    onProgress?.(i + 1, totalPages);

    ctx.clearRect(0, 0, W, H);
    await renderPage(ctx, interiorPages[i], W, H, albumTitle);

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, 0, W_MM, H_MM);
  }

  // Add blank page if needed for even count
  if (needsBlank) {
    pdf.addPage();
    // Leave blank white page
  }

  return pdf.output("blob");
}

/**
 * Generate cover PDF for Lulu.
 * Single landscape page: back cover + spine + front cover.
 * coverWidthPt and coverHeightPt come from the Lulu cover-dimensions API.
 */
export async function generateLuluCoverPDF(
  coverPage: PDFPage,
  albumTitle: string,
  coverWidthPt: number,
  coverHeightPt: number,
): Promise<Blob> {
  // Cover DPI tuning: Lulu recommends 300 DPI, but a full A4 spread at 300
  // DPI = ~22 MP which exceeds Safari iOS's 16 MP canvas hard limit (PDFs
  // would silently fail). 200 DPI = ~10 MP, well under the limit and a clear
  // visible upgrade over the old 150 DPI baseline (4× more pixels).
  // If we detect a canvas-size failure, we'll fall back to 150 DPI.
  let DPI = 200;
  let W = Math.round((coverWidthPt / 72) * DPI);
  let H = Math.round((coverHeightPt / 72) * DPI);
  // Safari iOS hard ceiling — be defensive
  if (W * H > 16_000_000) {
    DPI = 150;
    W = Math.round((coverWidthPt / 72) * DPI);
    H = Math.round((coverHeightPt / 72) * DPI);
  }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Crank canvas image quality to "high" — preserves sharpness when we
  // scale the cover PNG up to the print-resolution canvas. Default "low"
  // smoothing was making text/illustration edges look soft on the printed
  // cover.
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Fill background
  ctx.fillStyle = coverPage.bgColor || "#0f172a";
  ctx.fillRect(0, 0, W, H);

  if (coverPage.photos[0]) {
    // The cover template is a spread image (back + spine + front).
    // Draw it across the full Lulu cover, using "contain" fit so nothing
    // is cropped. The cover images are designed at ~1.44 ratio but Lulu's
    // cover is ~1.38, so there would be a ~2% crop per side with "cover"
    // fit — enough to clip edge text like "MARRAKECH". Instead we scale
    // the image to fit entirely within the canvas.
    //
    // The letterbox bands (top/bottom when the image is wider than the canvas)
    // are filled with the sampled average color of the adjacent image edge so
    // they blend seamlessly — no visible color mismatch even without bleed.
    try {
      const img = await loadImage(coverPage.photos[0]);

      // Sample edge colors BEFORE applying any hue filter so the samples
      // represent the raw image pixels. The filter will also be applied to
      // the fillRect calls, so the sampled colors + filter = correct match.
      const edgeColors = await sampleEdgeColors(img);

      if (coverPage.coverHue) ctx.filter = `hue-rotate(${coverPage.coverHue}deg)`;

      // "contain" fit — scale to fit entirely, centered
      const imgRatio = img.width / img.height;
      const slotRatio = W / H;
      let dw: number, dh: number, dx: number, dy: number;
      if (imgRatio > slotRatio) {
        // image wider → fit width, letterbox top/bottom
        dw = W;
        dh = Math.round(W / imgRatio);
        dx = 0;
        dy = Math.round((H - dh) / 2);
        // Fill top/bottom bands with the image's own edge color
        if (dy > 0) {
          ctx.fillStyle = edgeColors.top;
          ctx.fillRect(0, 0, W, dy);
          ctx.fillStyle = edgeColors.bottom;
          ctx.fillRect(0, dy + dh, W, H - dy - dh);
        }
      } else {
        // image taller → fit height, pillarbox left/right
        dh = H;
        dw = Math.round(H * imgRatio);
        dy = 0;
        dx = Math.round((W - dw) / 2);
        // Fill left/right bands with the image's own edge color
        if (dx > 0) {
          ctx.fillStyle = edgeColors.left;
          ctx.fillRect(0, 0, dx, H);
          ctx.fillStyle = edgeColors.right;
          ctx.fillRect(dx + dw, 0, W - dx - dw, H);
        }
      }

      ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh);
      ctx.filter = "none";
    } catch {
      // If image fails, just use background color
    }
  } else {
    // Text-based cover — draw title centered on right half (front cover)
    const frontX = W / 2;
    const frontW = W / 2;
    const dark = ["#1e1e1e","#0f172a","#1a1a2e","#4a1942","#0c2340","#7c3aed","#be185d","#0369a1","#15803d","#b45309"].includes(coverPage.bgColor || "");

    ctx.save();
    ctx.fillStyle = dark ? "#ffffff" : "#1e293b";
    ctx.font = `italic ${Math.round(frontW * 0.08)}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(coverPage.title || albumTitle || "Mon Album", frontX + frontW / 2, H / 2, frontW * 0.8);

    if (coverPage.subtitle) {
      ctx.font = `${Math.round(frontW * 0.025)}px Arial, sans-serif`;
      ctx.fillStyle = dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)";
      ctx.fillText(coverPage.subtitle, frontX + frontW / 2, H / 2 + Math.round(frontW * 0.12), frontW * 0.7);
    }
    ctx.restore();
  }

  // Draw texts and stickers
  drawTexts(ctx, coverPage.texts ?? [], W, H);
  drawStickers(ctx, coverPage.stickers ?? [], W, H);

  // Use canvas.toBlob for reliable JPEG extraction (toDataURL fails on large canvases)
  const jpegBytes = await new Promise<Uint8Array>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error("Canvas toBlob returned null"));
        blob.arrayBuffer().then(buf => resolve(new Uint8Array(buf)));
      },
      "image/jpeg",
      0.97  // High quality for the cover — most visible part of the album
    );
  });

  // Use pdf-lib for robust custom page sizes (jsPDF has a scale bug with large formats)
  const { PDFDocument } = await import("pdf-lib");
  const pdfDoc = await PDFDocument.create();
  const jpegImage = await pdfDoc.embedJpg(jpegBytes);
  const page = pdfDoc.addPage([coverWidthPt, coverHeightPt]);
  page.drawImage(jpegImage, { x: 0, y: 0, width: coverWidthPt, height: coverHeightPt });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
}
