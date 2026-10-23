import { Coupon } from "../models/Coupon.js";

// Public: only coupons that are active and inside their schedule window.
export async function listActiveCoupons(_req, res) {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      active: true,
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $exists: false } }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: null }, { endsAt: { $exists: false } }, { endsAt: { $gte: now } }] },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const OBJECT_ID_RX = /^[0-9a-f]{24}$/i;
const CODE_RX = /^[A-Za-z0-9_-]{3,24}$/;
const TYPES = new Set(["percent", "fixed", "shipping"]);

function num(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function cleanText(s) {
  return typeof s === "string" ? s.replace(/[<>]/g, "").trim() : "";
}

export function couponFields(body, { partial = false } = {}) {
  const fields = {};

  if (!partial || body.code !== undefined) {
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    if (!CODE_RX.test(code)) throw new Error("Code must be 3-24 letters, numbers, - or _");
    fields.code = code;
  }
  if (!partial || body.message !== undefined) {
    const message = cleanText(body.message);
    if (!message || message.length > 80) throw new Error("Message is required and must be 80 characters or fewer");
    fields.message = message;
  }
  if (!partial || body.type !== undefined) {
    const type = typeof body.type === "string" ? body.type : "percent";
    if (!TYPES.has(type)) throw new Error("Type must be percent, fixed or shipping");
    fields.type = type;
  }
  if (!partial || body.value !== undefined) {
    const value = num(body.value);
    if (value < 0 || value > 100000) throw new Error("Value must be between 0 and 100000");
    fields.value = Math.round(value * 100) / 100;
  }
  if (!partial || body.minOrder !== undefined) {
    const minOrder = num(body.minOrder);
    if (minOrder < 0) throw new Error("Minimum order cannot be negative");
    fields.minOrder = Math.round(minOrder);
  }
  if (!partial || body.maxDiscount !== undefined) {
    const maxDiscount = num(body.maxDiscount);
    if (maxDiscount < 0) throw new Error("Max discount cannot be negative");
    fields.maxDiscount = Math.round(maxDiscount);
  }
  if (!partial || body.active !== undefined) fields.active = Boolean(body.active);
  if (!partial || body.startsAt !== undefined) {
    fields.startsAt = body.startsAt ? new Date(body.startsAt) : null;
    if (fields.startsAt && Number.isNaN(fields.startsAt.getTime())) throw new Error("Invalid start date");
  }
  if (!partial || body.endsAt !== undefined) {
    fields.endsAt = body.endsAt ? new Date(body.endsAt) : null;
    if (fields.endsAt && Number.isNaN(fields.endsAt.getTime())) throw new Error("Invalid end date");
  }

  if (fields.startsAt && fields.endsAt && fields.startsAt >= fields.endsAt)
    throw new Error("End date must be after start date");

  return fields;
}

export async function adminListCoupons(_req, res) {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function adminCreateCoupon(req, res) {
  try {
    const coupon = await Coupon.create(couponFields(req.body ?? {}));
    res.status(201).json(coupon.toObject());
  } catch (error) {
    const status = error?.code === 11000 ? 409 : 400;
    res.status(status).json({ error: error?.code === 11000 ? "This coupon code already exists" : error.message });
  }
}

export async function adminUpdateCoupon(req, res) {
  if (!OBJECT_ID_RX.test(req.params.id)) return res.status(400).json({ error: "Invalid coupon" });
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $set: couponFields(req.body ?? {}, { partial: true }) },
      { new: true },
    ).lean();
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });
    res.json(coupon);
  } catch (error) {
    const status = error?.code === 11000 ? 409 : 400;
    res.status(status).json({ error: error?.code === 11000 ? "This coupon code already exists" : error.message });
  }
}

export async function adminDeleteCoupon(req, res) {
  if (!OBJECT_ID_RX.test(req.params.id)) return res.status(400).json({ error: "Invalid coupon" });
  const coupon = await Coupon.findByIdAndDelete(req.params.id).lean();
  if (!coupon) return res.status(404).json({ error: "Coupon not found" });
  res.json({ ok: true });
}
