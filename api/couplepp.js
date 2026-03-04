import { createCanvas } from "canvas";

export default function handler(req, res) {
  try {
    // ==============================
    // 1️⃣ VALIDATION & SANITIZATION
    // ==============================
    const sanitize = (str) =>
      (str || "")
        .replace(/[^\w\s]/gi, "")
        .substring(0, 20)
        .trim();

    const name1 = sanitize(req.query.name1) || "Him";
    const name2 = sanitize(req.query.name2) || "Her";
    const style = req.query.style || "romantic";
    const premium = req.query.premium === "true";
    const format = req.query.format || "image"; // image | json

    const size = premium ? 1080 : 800;

    // ==============================
    // 2️⃣ CANVAS SETUP
    // ==============================
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    // ==============================
    // 3️⃣ BACKGROUND GRADIENTS
    // ==============================
    const gradient = ctx.createLinearGradient(0, 0, size, size);

    if (style === "dark") {
      gradient.addColorStop(0, "#141E30");
      gradient.addColorStop(1, "#243B55");
    } else if (style === "anime") {
      gradient.addColorStop(0, "#ff758c");
      gradient.addColorStop(1, "#ff7eb3");
    } else if (style === "luxury") {
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(1, "#434343");
    } else {
      gradient.addColorStop(0, "#ff4da6");
      gradient.addColorStop(1, "#ff9966");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // ==============================
    // 4️⃣ ROUNDED CORNERS
    // ==============================
    const radius = 80;
    ctx.globalCompositeOperation = "destination-in";
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";

    // ==============================
    // 5️⃣ AVATAR CIRCLES
    // ==============================
    const circleRadius = size / 6;
    const centerY = size / 3;

    ctx.fillStyle = "rgba(255,255,255,0.15)";

    ctx.beginPath();
    ctx.arc(size / 3, centerY, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc((size / 3) * 2, centerY, circleRadius, 0, Math.PI * 2);
    ctx.fill();

    // ==============================
    // 6️⃣ TEXT STYLING
    // ==============================
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 20;

    ctx.font = premium ? "bold 90px Arial" : "bold 65px Arial";

    let heart = "❤️";
    if (style === "dark") heart = "🖤";
    if (style === "anime") heart = "💖";
    if (style === "luxury") heart = "✨";

    const text = `${name1} ${heart} ${name2}`;

    ctx.fillText(text, size / 2, size * 0.75);
   // ==============================
// 7️⃣ WATERMARK PRO
// ==============================
    ctx.globalAlpha = 0.35;
    ctx.shadowBlur = 0;

    ctx.font = premium ? "28px Arial" : "22px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";

// hmm
    ctx.beginPath();
    ctx.moveTo(size * 0.35, size - 70);
    ctx.lineTo(size * 0.65, size - 70);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

// texte watermark :)
    ctx.fillText("by crazy", size / 2, size - 40);
    ctx.globalAlpha = 1;

    // ==============================
    // 8️⃣ RESPONSE
    // ==============================
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Content-Type", "image/png");

    if (format === "json") {
      return res.json({
        success: true,
        names: { name1, name2 },
        style,
        premium,
        size
      });
    }

    return res.send(canvas.toBuffer("image/png"));

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
}
