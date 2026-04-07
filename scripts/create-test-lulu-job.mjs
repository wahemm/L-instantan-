/**
 * Script de test : crée un print job Lulu minimal pour déclencher
 * la page de paiement et pouvoir enregistrer sa CB.
 * Annuler le job juste après avoir sauvegardé la carte.
 */

import { PDFDocument, rgb } from "pdf-lib";

const LULU_API_BASE = "https://api.lulu.com";
const LULU_AUTH_URL = `${LULU_API_BASE}/auth/realms/glasstree/protocol/openid-connect/token`;
const LULU_POD_PACKAGE_ID = "0850X1100FCPRECW080CW444GXX";
const LULU_CLIENT_KEY = "a19307e0-e0fb-4ba1-b568-9c0e2c1cd130";
const LULU_CLIENT_SECRET = "mm2P7jxqSGzB6MlIuN400bIc7gLPlltu";

// Interior: 8.5" x 11" = 612 x 792 pts
// Cover for 24 pages: 1368 x 918 pts (from cover-dimensions API)
const INTERIOR_W = 612, INTERIOR_H = 792;
const COVER_W = 1368, COVER_H = 918;

async function getToken() {
  const res = await fetch(LULU_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${LULU_CLIENT_KEY}:${LULU_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`Auth failed: ${await res.text()}`);
  const { access_token } = await res.json();
  console.log("✅ Token obtenu");
  return access_token;
}

async function generateInteriorPDF() {
  const doc = await PDFDocument.create();
  for (let i = 0; i < 24; i++) {
    const page = doc.addPage([INTERIOR_W, INTERIOR_H]);
    // No text — avoid font embedding issues
    page.drawRectangle({ x: INTERIOR_W / 2 - 5, y: INTERIOR_H / 2 - 5, width: 10, height: 10, color: rgb(0.95, 0.95, 0.95) });
  }
  return Buffer.from(await doc.save());
}

async function generateCoverPDF() {
  const doc = await PDFDocument.create();
  const page = doc.addPage([COVER_W, COVER_H]);
  // No text — avoid font embedding issues
  page.drawRectangle({ x: 0, y: 0, width: COVER_W, height: COVER_H, color: rgb(0.95, 0.93, 0.90) });
  page.drawRectangle({ x: COVER_W / 2 - 60, y: COVER_H / 2 - 20, width: 120, height: 40, color: rgb(0.8, 0.78, 0.75) });
  return Buffer.from(await doc.save());
}

async function uploadPDF(buffer, filename) {
  const formData = new FormData();
  formData.append("file", new Blob([buffer], { type: "application/pdf" }), filename);
  const res = await fetch("https://tmpfiles.org/api/v1/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  const { data } = await res.json();
  return data.url.replace("tmpfiles.org/", "tmpfiles.org/dl/");
}

async function createPrintJob(token, interiorUrl, coverUrl) {
  const externalId = `test-cb-${Date.now()}`;
  const res = await fetch(`${LULU_API_BASE}/print-jobs/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      external_id: externalId,
      contact_email: "hugothomas@icloud.com",
      production_delay: 120,
      line_items: [{
        external_id: `${externalId}-item`,
        pod_package_id: LULU_POD_PACKAGE_ID,
        quantity: 1,
        title: "Test Album CB",
        interior: { source_url: interiorUrl },
        cover: { source_url: coverUrl },
      }],
      shipping_level: "MAIL",
      shipping_address: {
        name: "Test Linstantane",
        street1: "1 Rue du Test",
        city: "Paris",
        country_code: "FR",
        postcode: "75001",
        phone_number: "+33600000000",
        email: "hugothomas@icloud.com",
      },
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Create job failed (${res.status}): ${text}`);
  return JSON.parse(text);
}

(async () => {
  try {
    console.log("🚀 Création du print job test Lulu...\n");
    console.log("📄 Génération des PDFs (8.5×11\")...");
    const [interiorBuf, coverBuf] = await Promise.all([generateInteriorPDF(), generateCoverPDF()]);
    console.log("✅ PDFs générés");

    console.log("📤 Upload...");
    const [interiorUrl, coverUrl] = await Promise.all([
      uploadPDF(interiorBuf, "interior.pdf"),
      uploadPDF(coverBuf, "cover.pdf"),
    ]);
    console.log(`✅ Interior: ${interiorUrl}`);
    console.log(`✅ Cover:    ${coverUrl}`);

    const token = await getToken();

    console.log("\n📦 Création du print job...");
    const job = await createPrintJob(token, interiorUrl, coverUrl);

    console.log("\n✅ Print job créé !");
    console.log(`   ID:     ${job.id}`);
    console.log(`   Statut: ${job.status?.name}`);
    console.log("\n👉 Va sur https://www.lulu.com/account");
    console.log("   Cherche ce job → 'Pay' → entre ta CB → coche 'Save for future orders'");
    console.log("   Ensuite active les paiements automatiques dans Store Settings\n");
  } catch (err) {
    console.error("❌", err.message);
  }
})();
