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

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
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

    const imgData = canvas.toDataURL("image/jpeg", 0.92);
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
  // Convert points to pixels at 150 DPI (lower to avoid canvas size limits in browsers)
  const DPI = 150;
  const W = Math.round((coverWidthPt / 72) * DPI);
  const H = Math.round((coverHeightPt / 72) * DPI);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Fill background
  ctx.fillStyle = coverPage.bgColor || "#0f172a";
  ctx.fillRect(0, 0, W, H);

  if (coverPage.photos[0]) {
    // The cover template is a spread image (back + spine + front).
    // Draw it across the full Lulu cover.
    try {
      const img = await loadImage(coverPage.photos[0]);
      if (coverPage.coverHue) ctx.filter = `hue-rotate(${coverPage.coverHue}deg)`;
      drawImageCover(ctx, img, 0, 0, W, H, 50, 50);
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
      0.95
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
