/* Kept — light studies.
   Placeholder imagery for V1: each image slot renders a quiet study of natural light
   (window light, slatted blinds, leaf shadows) falling across a warm interior surface.
   Replace a slot with photography by swapping its <canvas data-study> for an <img>. */
(function () {
  "use strict";

  // ---- Scene definitions (all coordinates are fractions of width/height) ----
  var SCENES = {
    kitchen: {
      seed: 11, wall: "#C9BFAD",
      plane: { y: 0.64, depth: 0.06, top: "#C2B8A6", front: "#A39A89", doors: 4 },
      light: {
        color: "255,236,204", alpha: 0.92, blur: 0.012,
        polys: [
          [[0.10, 0.12], [0.58, 0.05], [0.60, 0.64], [0.13, 0.64]],
          [[0.13, 0.64], [0.60, 0.64], [0.86, 0.70], [0.26, 0.70]]
        ],
        grid: { cols: 2, rows: 3, bar: 0.05 },
        leaves: { n: 30, box: [0.34, 0.02, 0.64, 0.36], r: 0.028 }
      },
      shadow: { dx: 0.035, dy: -0.012 },
      objects: [
        { type: "vase", x: 0.68, w: 0.11, h: 0.17, color: "#978B78" },
        { type: "bowl", x: 0.28, w: 0.17, h: 0.045, color: "#E5DDCF" }
      ]
    },
    linen: {
      seed: 23, wall: "#CFC6B6",
      light: {
        color: "255,240,214", alpha: 0.8, blur: 0.016,
        polys: [[[-0.1, 0.02], [1.1, -0.22], [1.1, 0.95], [-0.1, 1.2]]],
        slats: { count: 8, bar: 0.46 }
      },
      shadow: { dx: 0.03, dy: 0.03 },
      objects: [{ type: "stack", x: 0.2, w: 0.6, h: 0.3, base: 0.66, color: "#ECE6DA" }]
    },
    living: {
      seed: 37, wall: "#C6BCAA",
      plane: { y: 0.76, top: "#A28C70", planks: true },
      light: {
        color: "255,236,206", alpha: 0.9, blur: 0.012,
        polys: [
          [[0.46, 0.08], [0.86, 0.12], [0.86, 0.76], [0.46, 0.76]],
          [[0.40, 0.76], [0.84, 0.76], [1.08, 1.02], [0.30, 1.02]]
        ],
        grid: { cols: 2, rows: 4, bar: 0.045 }
      },
      shadow: { dx: -0.03, dy: -0.01 },
      objects: [{ type: "table", x: 0.1, w: 0.26, h: 0.14, color: "#7F705D" }]
    },
    bathroom: {
      seed: 41, wall: "#C9C6BC", tiles: 0.085,
      plane: { y: 0.70, depth: 0.05, top: "#D2CDC2", front: "#AFA89B", doors: 2 },
      light: {
        color: "255,244,224", alpha: 0.8, blur: 0.011,
        polys: [[[0.10, 0.10], [0.74, 0.20], [0.74, 0.66], [0.10, 0.56]]],
        slats: { count: 7, bar: 0.45 }
      },
      shadow: { dx: 0.03, dy: -0.01 },
      objects: [
        { type: "bottle", x: 0.62, w: 0.065, h: 0.15, color: "#7E8E7E" },
        { type: "stack", x: 0.18, w: 0.22, h: 0.08, color: "#EAE5DB" }
      ]
    },
    empty: {
      seed: 53, wall: "#CBC3B3",
      plane: { y: 0.70, top: "#B4A994", planks: true },
      light: {
        color: "255,238,210", alpha: 0.95, blur: 0.012,
        polys: [
          [[0.54, 0.14], [0.84, 0.10], [0.84, 0.64], [0.54, 0.68]],
          [[0.40, 0.72], [0.76, 0.72], [0.98, 0.95], [0.46, 0.97]]
        ],
        grid: { cols: 1, rows: 2, bar: 0.05 }
      },
      objects: [{ type: "door", x: 0.1, w: 0.25, top: 0.2, color: "#DDD4C4" }]
    },
    balcony: {
      seed: 67, wall: "#C2BBAD",
      plane: { y: 0.74, top: "#B6AFA2", tilesFloor: true },
      light: {
        color: "255,243,222", alpha: 0.88, blur: 0.01,
        polys: [
          [[0.10, 0.06], [0.66, 0.06], [0.66, 0.74], [0.10, 0.74]],
          [[0.10, 0.74], [0.66, 0.74], [0.98, 1.02], [0.22, 1.02]]
        ],
        grid: { cols: 3, rows: 1, bar: 0.035 },
        leaves: { n: 70, box: [0.04, 0.0, 0.70, 0.55], r: 0.024 }
      }
    },
    afternoon: {
      seed: 79, wall: "#C1B39C",
      plane: { y: 0.80, top: "#957C5F", planks: true },
      light: {
        color: "255,212,164", alpha: 0.92, blur: 0.006,
        polys: [
          [[0.30, 0.26], [0.60, 0.18], [0.64, 0.80], [0.33, 0.80]],
          [[0.33, 0.80], [0.64, 0.80], [0.80, 1.02], [0.40, 1.02]]
        ],
        grid: { cols: 3, rows: 2, bar: 0.04 },
        leaves: { n: 14, box: [0.44, 0.18, 0.62, 0.42], r: 0.012 }
      },
      shadow: { dx: 0.02, dy: -0.02 },
      objects: [
        { type: "sofa", x: 0.05, w: 0.24, h: 0.26, color: "#857761" },
        { type: "table", x: 0.72, w: 0.07, h: 0.17, color: "#64584A" }
      ]
    },
    vanity: {
      seed: 83, wall: "#CAC4B8",
      plane: { y: 0.66, depth: 0.05, top: "#D8D2C6", front: "#ADA597", doors: 2 },
      light: {
        color: "255,242,220", alpha: 0.78, blur: 0.012,
        polys: [[[0.38, 0.02], [1.02, 0.12], [1.02, 0.66], [0.38, 0.56]]],
        slats: { count: 6, bar: 0.5 }
      },
      shadow: { dx: -0.03, dy: 0.0 },
      objects: [
        { type: "mirror", x: 0.18, w: 0.64, top: 0.10, bottom: 0.52, color: "#D6D3CB" },
        { type: "bowl", x: 0.34, w: 0.30, h: 0.06, color: "#EAE6DE" },
        { type: "bottle", x: 0.74, w: 0.05, h: 0.12, color: "#8E9C86" }
      ]
    }
  };

  // ---- Helpers ----
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
  function bilinear(p, u, v) { return lerp(lerp(p[0], p[1], u), lerp(p[3], p[2], u), v); }
  function layer(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function poly(ctx, pts, W, H) {
    ctx.beginPath();
    pts.forEach(function (p, i) { ctx[i ? "lineTo" : "moveTo"](p[0] * W, p[1] * H); });
    ctx.closePath();
  }
  function quad(ctx, P, u0, u1, v0, v1, W, H) {
    poly(ctx, [bilinear(P, u0, v0), bilinear(P, u1, v0), bilinear(P, u1, v1), bilinear(P, u0, v1)], W, H);
    ctx.fill();
  }

  var supportsFilter = (function () {
    try { var c = layer(1, 1).getContext("2d"); c.filter = "blur(2px)"; return c.filter === "blur(2px)"; }
    catch (e) { return false; }
  })();

  function blurred(src, px) {
    var out = layer(src.width, src.height), o = out.getContext("2d");
    if (supportsFilter) {
      o.filter = "blur(" + px + "px)";
      o.drawImage(src, 0, 0);
    } else {
      // Fallback: downsample then upsample for a soft edge
      var f = Math.max(2, Math.round(px / 1.5));
      var s = layer(Math.max(1, Math.round(src.width / f)), Math.max(1, Math.round(src.height / f)));
      var sc = s.getContext("2d");
      sc.imageSmoothingQuality = "high";
      sc.drawImage(src, 0, 0, s.width, s.height);
      o.imageSmoothingQuality = "high";
      o.drawImage(s, 0, 0, out.width, out.height);
    }
    return out;
  }

  // Object silhouettes. Each path is drawn with its base on the scene plane.
  function objectPath(ctx, o, W, H, planeY, ox, oy) {
    ox = ox || 0; oy = oy || 0;
    var x = (o.x + ox) * W, w = o.w * W, base = ((o.base || planeY) + oy) * H, h = (o.h || 0) * H;
    ctx.beginPath();
    switch (o.type) {
      case "vase":
        ctx.moveTo(x + w * 0.38, base - h);
        ctx.lineTo(x + w * 0.62, base - h);
        ctx.bezierCurveTo(x + w * 0.62, base - h * 0.78, x + w * 1.02, base - h * 0.62, x + w * 0.96, base - h * 0.3);
        ctx.bezierCurveTo(x + w * 0.92, base - h * 0.08, x + w * 0.78, base, x + w * 0.5, base);
        ctx.bezierCurveTo(x + w * 0.22, base, x + w * 0.08, base - h * 0.08, x + w * 0.04, base - h * 0.3);
        ctx.bezierCurveTo(x - w * 0.02, base - h * 0.62, x + w * 0.38, base - h * 0.78, x + w * 0.38, base - h);
        break;
      case "bowl":
        ctx.moveTo(x, base - h);
        ctx.lineTo(x + w, base - h);
        ctx.bezierCurveTo(x + w * 0.96, base - h * 0.2, x + w * 0.72, base, x + w * 0.5, base);
        ctx.bezierCurveTo(x + w * 0.28, base, x + w * 0.04, base - h * 0.2, x, base - h);
        break;
      case "bottle":
        ctx.moveTo(x + w * 0.36, base - h);
        ctx.lineTo(x + w * 0.64, base - h);
        ctx.lineTo(x + w * 0.64, base - h * 0.78);
        ctx.quadraticCurveTo(x + w, base - h * 0.74, x + w, base - h * 0.6);
        ctx.lineTo(x + w, base);
        ctx.lineTo(x, base);
        ctx.lineTo(x, base - h * 0.6);
        ctx.quadraticCurveTo(x, base - h * 0.74, x + w * 0.36, base - h * 0.78);
        break;
      case "stack":
      case "table":
      case "sofa":
        ctx.rect(x, base - h, w, h);
        break;
      default:
        return false;
    }
    ctx.closePath();
    return true;
  }

  function drawObject(ctx, o, W, H, planeY, R) {
    var x = o.x * W, w = o.w * W, base = (o.base || planeY) * H, h = (o.h || 0) * H;
    ctx.save();
    if (o.type === "door") {
      var top = o.top * H, bottom = planeY * H;
      ctx.fillStyle = "rgba(40,32,22,0.18)";
      ctx.fillRect(x - W * 0.012, top - W * 0.012, w + W * 0.024, bottom - top + W * 0.012);
      ctx.fillStyle = o.color;
      ctx.fillRect(x, top, w, bottom - top);
      ctx.fillStyle = "rgba(255,248,232,0.45)";
      poly(ctx, [[o.x + o.w * 0.35, o.top], [o.x + o.w, o.top], [o.x + o.w, planeY], [o.x + o.w * 0.55, planeY]], W, H);
      ctx.fill();
      ctx.restore();
      return;
    }
    if (o.type === "mirror") {
      var mt = o.top * H, mb = o.bottom * H;
      ctx.fillStyle = "rgba(60,52,40,0.22)";
      ctx.fillRect(x - 3, mt - 3, w + 6, mb - mt + 6);
      ctx.fillStyle = o.color;
      ctx.fillRect(x, mt, w, mb - mt);
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      poly(ctx, [[o.x + o.w * 0.1, o.top], [o.x + o.w * 0.3, o.top], [o.x + o.w * 0.05, o.bottom], [o.x, o.bottom]], W, H);
      ctx.fill();
      ctx.restore();
      return;
    }
    // Contact shadow
    ctx.fillStyle = "rgba(40,30,20,0.22)";
    ctx.beginPath();
    ctx.ellipse(x + w / 2 + w * 0.08, base, w * 0.62, Math.max(2, H * 0.008), 0, 0, Math.PI * 2);
    ctx.fill();

    if (o.type === "stack") {
      var layers = 3, lh = h / layers, tones = [o.color, "#E0D8CA", "#F1ECE3"];
      for (var i = 0; i < layers; i++) {
        var inset = (R() * 0.04 + 0.01) * w * (i % 2 ? 1 : -1);
        ctx.fillStyle = tones[i % tones.length];
        ctx.fillRect(x + inset, base - lh * (i + 1), w, lh * 0.94);
        ctx.fillStyle = "rgba(60,50,38,0.12)";
        ctx.fillRect(x + inset, base - lh * i - lh * 0.1, w, lh * 0.08);
      }
    } else if (o.type === "sofa") {
      ctx.fillStyle = o.color;
      ctx.fillRect(x, base - h, w, h * 0.55);
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(x, base - h * 0.45, w, h * 0.45);
      ctx.fillStyle = o.color;
      ctx.fillRect(x - w * 0.03, base - h * 0.62, w * 0.1, h * 0.62);
      ctx.fillRect(x + w * 0.93, base - h * 0.62, w * 0.1, h * 0.62);
      ctx.fillRect(x, base - h * 0.45, w, h * 0.36);
    } else if (o.type === "table") {
      ctx.fillStyle = o.color;
      ctx.fillRect(x, base - h, w, Math.max(3, h * 0.12));
      var leg = Math.max(2, w * 0.05);
      ctx.fillRect(x + w * 0.06, base - h, leg, h);
      ctx.fillRect(x + w * 0.94 - leg, base - h, leg, h);
    } else {
      objectPath(ctx, o, W, H, planeY);
      ctx.fillStyle = o.color;
      ctx.fill();
      // soft form shading
      ctx.clip();
      ctx.fillStyle = "rgba(30,24,16,0.16)";
      ctx.fillRect(x + w * 0.55, base - h, w * 0.5, h);
    }
    ctx.restore();
  }

  // ---- Renderer ----
  function render(canvas) {
    var s = SCENES[canvas.getAttribute("data-study")];
    if (!s) return;
    var rect = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = Math.max(2, Math.round(rect.width * dpr)), H = Math.max(2, Math.round(rect.height * dpr));
    if (canvas.width === W && canvas.height === H && canvas.dataset.done) return;
    canvas.width = W; canvas.height = H;
    var ctx = canvas.getContext("2d"), R = rng(s.seed);
    var planeY = s.plane ? s.plane.y : 1;

    // Wall
    ctx.fillStyle = s.wall;
    ctx.fillRect(0, 0, W, H);

    if (s.tiles) {
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.lineWidth = Math.max(1, W * 0.002);
      var t = s.tiles * W;
      for (var tx = t; tx < W; tx += t) { ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx, planeY * H); ctx.stroke(); }
      for (var ty = t; ty < planeY * H; ty += t) { ctx.beginPath(); ctx.moveTo(0, ty); ctx.lineTo(W, ty); ctx.stroke(); }
    }

    // Plane: benchtop, floor or vanity
    if (s.plane) {
      var p = s.plane, py = p.y * H, depth = (p.depth || 0) * H;
      ctx.fillStyle = p.top;
      ctx.fillRect(0, py, W, H - py);
      if (depth) {
        ctx.fillStyle = p.front;
        ctx.fillRect(0, py + depth, W, H - py - depth);
        ctx.fillStyle = "rgba(255,250,240,0.35)";
        ctx.fillRect(0, py + depth - Math.max(1, H * 0.002), W, Math.max(1, H * 0.002));
        if (p.doors) {
          ctx.fillStyle = "rgba(30,24,16,0.14)";
          for (var d = 1; d < p.doors; d++) ctx.fillRect((W / p.doors) * d, py + depth, Math.max(1, W * 0.003), H);
        }
      }
      ctx.fillStyle = "rgba(255,250,240,0.25)";
      ctx.fillRect(0, py, W, Math.max(1, H * 0.0025));
      if (p.planks || p.tilesFloor) {
        var vx = W * 0.5, vy = py - H * 0.9;
        ctx.strokeStyle = p.planks ? "rgba(50,34,18,0.16)" : "rgba(255,255,255,0.22)";
        ctx.lineWidth = Math.max(1, W * 0.0025);
        ctx.save(); ctx.beginPath(); ctx.rect(0, py, W, H - py); ctx.clip();
        for (var k = -12; k <= 24; k++) {
          var bx = (k / 12) * W;
          ctx.beginPath(); ctx.moveTo(bx, H); ctx.lineTo(vx + (bx - vx) * ((py - vy) / (H - vy)), py); ctx.stroke();
        }
        if (p.tilesFloor) {
          for (var fy = 0; fy < 5; fy++) {
            var yy = py + (H - py) * Math.pow(fy / 5, 1.6);
            ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(W, yy); ctx.stroke();
          }
        }
        ctx.restore();
      }
      // floor falloff
      ctx.fillStyle = "rgba(40,28,16,0.10)";
      ctx.fillRect(0, py + (H - py) * 0.55, W, H);
    }

    // Objects
    (s.objects || []).forEach(function (o) { drawObject(ctx, o, W, H, planeY, R); });

    // Light layer
    var L = layer(W, H), l = L.getContext("2d");
    l.fillStyle = "#fff";
    s.light.polys.forEach(function (P) { poly(l, P, W, H); l.fill(); });
    l.globalCompositeOperation = "destination-out";
    l.fillStyle = "#000";
    s.light.polys.forEach(function (P) {
      var g = s.light.grid, sl = s.light.slats, i;
      if (g) {
        for (i = 1; i < g.cols; i++) quad(l, P, i / g.cols - g.bar / 2, i / g.cols + g.bar / 2, 0, 1, W, H);
        for (i = 1; i < g.rows; i++) quad(l, P, 0, 1, i / g.rows - g.bar / 2, i / g.rows + g.bar / 2, W, H);
      }
      if (sl) {
        for (i = 0; i < sl.count; i++) {
          var v0 = i / sl.count;
          quad(l, P, 0, 1, v0, v0 + sl.bar / sl.count, W, H);
        }
      }
    });
    var lv = s.light.leaves;
    if (lv) {
      for (var n = 0; n < lv.n; n++) {
        var cx = (lv.box[0] + R() * (lv.box[2] - lv.box[0])) * W;
        var cy = (lv.box[1] + R() * (lv.box[3] - lv.box[1])) * H;
        var rr = lv.r * W * (0.5 + R());
        l.beginPath();
        l.ellipse(cx, cy, rr, rr * (0.28 + R() * 0.2), R() * Math.PI, 0, Math.PI * 2);
        l.fill();
        if (R() > 0.6) { // stems
          l.fillRect(cx, cy, Math.max(1, W * 0.0025), rr * 1.6);
        }
      }
    }
    // Objects block the light: cut their silhouettes, offset, from the light layer
    if (s.shadow) {
      (s.objects || []).forEach(function (o) {
        if (objectPath(l, o, W, H, planeY, s.shadow.dx, s.shadow.dy)) l.fill();
      });
    }
    l.globalCompositeOperation = "source-over";

    var soft = blurred(L, Math.max(2, s.light.blur * W));
    var sc = soft.getContext("2d");
    sc.globalCompositeOperation = "source-in";
    sc.fillStyle = "rgb(" + s.light.color + ")";
    sc.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = s.light.alpha * 0.6;
    ctx.globalCompositeOperation = "screen";
    ctx.drawImage(soft, 0, 0);
    ctx.globalAlpha = s.light.alpha * 0.55;
    ctx.globalCompositeOperation = "soft-light";
    ctx.drawImage(soft, 0, 0);
    ctx.restore();

    // Room falloff (natural vignette)
    var vg = ctx.createRadialGradient(W * 0.5, H * 0.45, Math.min(W, H) * 0.25, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
    vg.addColorStop(0, "rgba(30,22,14,0)");
    vg.addColorStop(1, "rgba(30,22,14,0.26)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    // Film grain
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = ctx.createPattern(grain(), "repeat");
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    canvas.dataset.done = "1";
  }

  var grainTile;
  function grain() {
    if (grainTile) return grainTile;
    grainTile = layer(128, 128);
    var g = grainTile.getContext("2d"), img = g.createImageData(128, 128), R = rng(7);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = Math.round(R() * 255);
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return grainTile;
  }

  // ---- Public API ----
  function renderAll() {
    document.querySelectorAll("canvas[data-study]").forEach(function (c) {
      try { render(c); } catch (e) { /* a failed study leaves the linen frame behind it */ }
    });
  }

  var timer;
  function onResize() { clearTimeout(timer); timer = setTimeout(renderAll, 150); }

  window.KeptStudies = { renderAll: renderAll };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderAll);
  else renderAll();
  window.addEventListener("resize", onResize);
})();
