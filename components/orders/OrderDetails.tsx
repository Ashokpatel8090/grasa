
"use client";

import { useState, useEffect } from "react";
import { BASE_URL } from "@/components/config/api";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type Product = {
  id: number;
  name: string;
  image?: string;
  description: string;
  category?: string;
  mrp?: string;
  effective_price?: string;
  discount_percent?: string;
};

type ShippingAddress = {
  id?: number;
  street: string;
  city: string;
  state: string;
  postal_code?: string;
  country?: string;
  landmark?: string;
};

type ReviewImage = {
  url: string;
  public_id: string;
};

type Review = {
  id: number | null;
  rating: number | null;
  review_text: string | null;
  images?: ReviewImage[];
};

type CancellationReason = {
  id: number | null;
  code: string | null;
  description: string | null;
};

type Item = {
  id: number;
  quantity: number;
  price_at_order: string;
  subtotal: string;
  taxes?: string;
  discount?: string;
  paid_amount?: string;
  product: Product;
  shipping_address: ShippingAddress;
  status?: string;
  reviews?: Review;
  cancellation_reason?: CancellationReason;
};

type PaymentTransaction = {
  id: number;
  gateway_txn_id: string;
  status: string;
  payment_gateway: string;
  amount: string;
};

type Order = {
  id: number;
  order_date: string;
  status: string;
  total_amount: string;
  currency: string;
  total_mrp?: string;
  offer_discount?: string;
  mhc_points?: string;
  notes?: string;
  payment_transaction?: PaymentTransaction;
  items: Item[];
};

// ─────────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────────
const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (r: number) => void;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "none",
            border: "none",
            fontSize: "28px",
            cursor: "pointer",
            color: star <= (hover || rating) ? "#f0a500" : "#d6d1c4",
            transition: "color 0.15s, transform 0.1s",
            padding: "2px",
            lineHeight: 1,
            transform: hover === star ? "scale(1.15)" : "scale(1)",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────
const IconCalendar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconCard = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const IconReceipt = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconTruck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconStarFilled = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#f0a500" stroke="#f0a500" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconAlertCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconXCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconPencil = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);
const IconUpload = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  :root {
    --od-bg:            #ebecdf;
    --od-bg-card:       #f4f4f2;
    --od-bg-white:      #ffffff;
    --od-text-dark:     #1b1b1b;
    --od-text-mid:      #5c5c5c;
    --od-text-light:    #8a8a8a;
    --od-border:        #d6d1c4;
    --od-green-dark:    #124132;
    --od-lime:          #C5D82D;
    --od-red:           #b94040;
    --od-red-light:     #fdf0f0;
    --od-red-border:    #e8c5c5;
    --od-green-ok:      #2d6a4f;
    --od-green-light:   #edf5f0;
    --od-green-border:  #b4d9c8;
    --od-amber:         #7a5c00;
    --od-amber-light:   #fef9e6;
    --od-amber-border:  #e8d49a;
  }

  .od-page {
    min-height: 100vh;
    background: var(--od-bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--od-text-dark);
    padding: 2.5rem 1.25rem 5rem;
  }

  .od-container { max-width: 1100px; margin: 0 auto; }

  /* HEADER */
  .od-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--od-border);
  }
  .od-header-eyebrow {
    display: block;
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 700;
    color: var(--od-green-dark);
    margin-bottom: 0.5rem;
  }
  .od-header-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(1.8rem, 5vw, 3rem);
    font-weight: 700;
    line-height: 1.1;
    color: var(--od-text-dark);
    letter-spacing: -0.02em;
    margin: 0;
  }
  .od-meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1rem; margin-top: 0.75rem; }
  .od-meta-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: var(--od-text-mid);
  }

  /* STATUS BADGE */
  .od-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    border: 1.5px solid;
    flex-shrink: 0;
    align-self: flex-start;
  }
  .od-status--delivered  { background: var(--od-green-light); color: var(--od-green-ok); border-color: var(--od-green-border); }
  .od-status--processing { background: var(--od-amber-light); color: var(--od-amber);    border-color: var(--od-amber-border); }
  .od-status--cancelled  { background: var(--od-red-light);   color: var(--od-red);      border-color: var(--od-red-border);   }

  /* MAIN GRID */
  .od-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    align-items: start;
  }
  @media (min-width: 820px) {
    .od-grid { grid-template-columns: 340px 1fr; }
  }
  @media (min-width: 1024px) {
    .od-grid { grid-template-columns: 360px 1fr; }
  }

  /* PRODUCT CARD */
  .od-product-card {
    background: var(--od-bg-white);
    border: 1px solid var(--od-border);
    border-radius: 20px;
    overflow: hidden;
  }
  @media (min-width: 820px) {
    .od-product-card { position: sticky; top: 1.5rem; }
  }
  .od-product-image-wrap {
    background: var(--od-bg-card);
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .od-product-image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 1.5rem;
    mix-blend-mode: multiply;
  }
  .od-product-image-placeholder {
    opacity: 0.12;
    width: 80px;
    height: 80px;
  }
  .od-product-category-tag {
    position: absolute;
    top: 14px;
    left: 14px;
    background: var(--od-lime);
    color: var(--od-text-dark);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 999px;
    z-index: 1;
  }
  .od-product-info { padding: 1.5rem; }
  .od-product-name {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--od-text-dark);
    line-height: 1.3;
    margin: 0 0 0.6rem;
  }
  .od-product-desc {
    font-size: 13.5px;
    color: var(--od-text-mid);
    line-height: 1.7;
    margin: 0;
  }
  .od-product-qty-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid var(--od-border);
  }
  .od-qty-label {
    font-size: 11px;
    color: var(--od-text-light);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .od-qty-value {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--od-text-dark);
  }

  /* RIGHT COLUMN */
  .od-right-col { display: flex; flex-direction: column; gap: 1.25rem; }

  /* GENERIC CARD */
  .od-card {
    background: var(--od-bg-white);
    border: 1px solid var(--od-border);
    border-radius: 20px;
    padding: 1.75rem;
  }
  .od-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1.25rem; }
  .od-card-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: var(--od-bg-card);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .od-card-title {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--od-text-dark);
    margin: 0;
  }

  /* CANCELLED STATE CARD */
  .od-cancelled-card {
    background: var(--od-red-light);
    border: 1px solid var(--od-red-border);
    border-radius: 20px;
    padding: 1.5rem 1.75rem;
    animation: od-fade-in 0.3s ease;
  }
  .od-cancelled-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--od-red);
    margin: 0 0 0.4rem;
  }
  .od-cancelled-desc { font-size: 13.5px; color: #7a3030; margin: 0; }

  /* CANCEL OPTION CARD */
  .od-cancel-card {
    background: var(--od-red-light);
    border: 1px solid var(--od-red-border);
    border-radius: 20px;
    padding: 1.5rem 1.75rem;
  }
  .od-cancel-trigger-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .od-cancel-copy-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--od-text-dark);
    display: block;
    margin-bottom: 3px;
  }
  .od-cancel-copy-sub { font-size: 12px; color: var(--od-text-mid); }
  .od-btn-cancel-open {
    padding: 10px 22px;
    border-radius: 999px;
    border: 1.5px solid var(--od-red-border);
    background: transparent;
    color: var(--od-red);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s, color 0.18s;
    white-space: nowrap;
  }
  .od-btn-cancel-open:hover { background: var(--od-red); color: #fff; }

  .od-cancel-form {
    padding-top: 1.25rem;
    margin-top: 1.25rem;
    border-top: 1px solid var(--od-red-border);
    animation: od-fade-in 0.25s ease;
  }
  .od-cancel-form-heading {
    font-size: 13px;
    font-weight: 600;
    color: var(--od-red);
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 0.9rem;
  }
  .od-cancel-reasons { display: flex; flex-direction: column; gap: 8px; }
  .od-reason-label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    border: 1px solid var(--od-border);
    border-radius: 12px;
    cursor: pointer;
    background: var(--od-bg-white);
    transition: border-color 0.18s, background 0.18s;
  }
  .od-reason-label:hover { border-color: #b0aaa0; background: var(--od-bg-card); }
  .od-reason-label input {
    margin-top: 2px;
    accent-color: var(--od-red);
    flex-shrink: 0;
    cursor: pointer;
  }
  .od-reason-title { font-size: 13.5px; font-weight: 500; color: var(--od-text-dark); text-transform: capitalize; }
  .od-reason-desc  { font-size: 12px; color: var(--od-text-mid); margin-top: 2px; }
  .od-cancel-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 1rem;
    flex-wrap: wrap;
  }
  .od-btn-keep {
    padding: 10px 22px;
    border-radius: 999px;
    border: 1.5px solid var(--od-border);
    background: transparent;
    color: var(--od-text-mid);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
  }
  .od-btn-keep:hover:not(:disabled) { background: var(--od-bg-card); }
  .od-btn-keep:disabled { opacity: 0.5; cursor: not-allowed; }
  .od-btn-confirm-cancel {
    padding: 10px 24px;
    border-radius: 999px;
    border: none;
    background: var(--od-red);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.18s;
  }
  .od-btn-confirm-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
  .od-btn-confirm-cancel:not(:disabled):hover { opacity: 0.85; }

  /* TOAST */
  .od-toast {
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background: var(--od-text-dark);
    color: #fff;
    padding: 12px 24px;
    border-radius: 999px;
    font-size: 13.5px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    z-index: 9999;
    white-space: nowrap;
    max-width: 90vw;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    animation: od-toast-in 0.3s ease forwards;
  }
  .od-toast.success { border-left: 4px solid var(--od-lime); }
  .od-toast.error   { border-left: 4px solid var(--od-red); }
  @keyframes od-toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(16px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  @keyframes od-fade-in {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* PRICING TABLE */
  .od-price-table { width: 100%; border-collapse: collapse; }
  .od-price-table td { padding: 7px 0; font-size: 14px; vertical-align: middle; }
  .od-price-table td:last-child { text-align: right; font-weight: 500; }
  .od-price-table td:first-child { color: var(--od-text-mid); }
  .od-price-divider td { border-top: 1px solid var(--od-border); padding-top: 14px; }
  .od-price-total td { font-size: 1rem; font-weight: 700; padding-bottom: 0; }
  .od-strikethrough { text-decoration: line-through; color: var(--od-text-light) !important; font-weight: 400 !important; }
  .od-green-text    { color: var(--od-green-ok); }

  /* SUMMARY BANNER */
  .od-summary-banner {
    background: var(--od-text-dark);
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1.25rem;
  }
  .od-banner-label     { font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.14em; font-weight: 600; }
  .od-banner-amount    { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: var(--od-lime); line-height: 1; }
  .od-banner-saved     { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 4px; }
  .od-banner-txn       { text-align: right; }
  .od-banner-txn-label { font-size: 11px; color: rgba(255,255,255,0.4); }
  .od-banner-txn-val   { font-size: 13px; font-weight: 500; color: #fff; margin-top: 3px; word-break: break-all; }

  /* ADDRESS */
  .od-address-block {
    background: var(--od-bg-card);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .od-address-icon  { flex-shrink: 0; margin-top: 2px; opacity: 0.45; }
  .od-address-title { font-weight: 600; font-size: 13px; margin-bottom: 4px; }
  .od-address-text  { font-size: 13px; color: var(--od-text-mid); line-height: 1.65; }
  .od-address-text p { margin: 0; }

  /* REVIEW */
  .od-existing-review {
    background: var(--od-bg-card);
    border-radius: 14px;
    padding: 1.25rem;
    animation: od-fade-in 0.25s ease;
  }
  .od-review-stars        { display: flex; align-items: center; gap: 3px; margin-bottom: 0.7rem; }
  .od-review-star-filled  { color: #f0a500; font-size: 18px; }
  .od-review-star-empty   { color: #d6d1c4; font-size: 18px; }
  .od-review-rating-text  { font-size: 13px; color: var(--od-text-mid); font-weight: 500; margin-left: 6px; }
  .od-review-quote        { font-size: 14px; color: var(--od-text-mid); line-height: 1.7; font-style: italic; margin: 0; }
  .od-review-images       { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 1rem; }
  .od-review-thumb        { width: 72px; height: 72px; border-radius: 10px; object-fit: cover; border: 1px solid var(--od-border); }

  .od-review-success {
    background: var(--od-green-light);
    border: 1px solid var(--od-green-border);
    border-radius: 14px;
    padding: 1rem 1.25rem;
    font-size: 13.5px;
    color: var(--od-green-ok);
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: od-fade-in 0.25s ease;
  }

  .od-btn-write-review {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 26px;
    border-radius: 999px;
    background: var(--od-text-dark);
    color: var(--od-lime);
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    letter-spacing: 0.02em;
  }
  .od-btn-write-review:hover { background: #2d2d2d; }

  /* REVIEW FORM */
  .od-review-form-inner {
    background: var(--od-bg-card);
    border-radius: 16px;
    padding: 1.5rem;
    margin-top: 1.25rem;
    border: 1px solid var(--od-border);
    animation: od-fade-in 0.25s ease;
  }
  .od-form-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--od-text-mid);
    margin-bottom: 8px;
  }
  .od-review-textarea {
    width: 100%;
    min-height: 110px;
    padding: 12px 14px;
    border: 1.5px solid var(--od-border);
    border-radius: 12px;
    background: var(--od-bg-white);
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    color: var(--od-text-dark);
    resize: vertical;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 1.25rem;
    box-sizing: border-box;
  }
  .od-review-textarea:focus { border-color: #8a8a8a; }
  .od-review-textarea::placeholder { color: var(--od-text-light); }

  .od-upload-area { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 1.25rem; }
  .od-upload-box  { position: relative; width: 72px; height: 72px; }
  .od-upload-box input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  .od-upload-box-inner {
    width: 72px;
    height: 72px;
    border-radius: 12px;
    border: 1.5px dashed var(--od-border);
    background: var(--od-bg-white);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: var(--od-text-light);
    font-weight: 500;
    gap: 4px;
    transition: border-color 0.18s, background 0.18s;
    pointer-events: none;
  }
  .od-upload-box:hover .od-upload-box-inner { border-color: #8a8a8a; background: var(--od-bg-card); }
  .od-upload-preview {
    width: 72px;
    height: 72px;
    border-radius: 12px;
    border: 1px solid var(--od-border);
    object-fit: cover;
  }

  .od-review-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 10px;
    padding-top: 1rem;
    border-top: 1px solid var(--od-border);
    flex-wrap: wrap;
  }
  .od-btn-cancel-review {
    padding: 10px 22px;
    border-radius: 999px;
    border: 1.5px solid var(--od-border);
    background: transparent;
    color: var(--od-text-mid);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s;
  }
  .od-btn-cancel-review:hover { background: var(--od-bg-card); }
  .od-btn-submit-review {
    padding: 10px 24px;
    border-radius: 999px;
    border: none;
    background: var(--od-text-dark);
    color: var(--od-lime);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: opacity 0.18s;
    letter-spacing: 0.03em;
  }
  .od-btn-submit-review:hover { opacity: 0.82; }

  /* RESPONSIVE */
  @media (max-width: 600px) {
    .od-page            { padding: 1.25rem 1rem 4rem; }
    .od-card            { padding: 1.25rem; }
    .od-cancel-card     { padding: 1.25rem; }
    .od-cancelled-card  { padding: 1.25rem; }
    .od-summary-banner  { flex-direction: column; align-items: flex-start; padding: 1rem; }
    .od-banner-amount   { font-size: 1.75rem; }
    .od-banner-txn      { text-align: left; }
    .od-product-info    { padding: 1.25rem; }
    .od-header          { flex-direction: column; align-items: flex-start; }
    .od-cancel-actions  { flex-direction: column; }
    .od-cancel-actions button { width: 100%; justify-content: center; }
  }
  @media (max-width: 400px) {
    .od-cancel-trigger-row { flex-direction: column; align-items: flex-start; }
    .od-btn-cancel-open    { width: 100%; justify-content: center; }
  }
`;

// ─────────────────────────────────────────────
// TOAST COMPONENT
// ─────────────────────────────────────────────
type ToastType = "success" | "error" | null;

const Toast = ({ message, type }: { message: string; type: ToastType }) => {
  if (!type) return null;
  return <div className={`od-toast ${type}`}>{type === "success" ? "✓  " : "✕  "}{message}</div>;
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function OrderDetails({ order }: { order: Order }) {
  const item = order.items?.[0];
  const product = item?.product;
  const address = item?.shipping_address;
  const review = item?.reviews;
  const cancellationReason = item?.cancellation_reason;

  // ── Toast ──
  const [toast, setToast] = useState<{ message: string; type: ToastType }>({ message: "", type: null });
  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: null }), 3500);
  };

  // ── Review state ──
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState<ReviewImage[]>([]);
  const [uploading, setUploading] = useState(false);
  // BUG FIX: Track review locally so UI updates without page reload
  const [localReview, setLocalReview] = useState<Review | null>(
    review?.rating !== null && review?.rating !== undefined ? review : null
  );

  // ── Cancellation state ──
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancellationReasonsList, setCancellationReasonsList] = useState<CancellationReason[]>([]);
  const [selectedReasonId, setSelectedReasonId] = useState<number | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  // BUG FIX #1: Track cancellation locally → button disappears immediately after cancel
  const [localCancelled, setLocalCancelled] = useState(
    !!(cancellationReason && cancellationReason.id !== null)
  );
  const [localCancellationReason, setLocalCancellationReason] = useState<CancellationReason | null>(
    cancellationReason?.id ? cancellationReason : null
  );

  // ── Derived state ──
  const orderDate = new Date(order.order_date).getTime();
  const hoursSinceOrder = (Date.now() - orderDate) / (1000 * 60 * 60);
  const isWithin24Hours = hoursSinceOrder <= 24;

  // BUG FIX #2: Use localCancelled (not prop) so canCancel reacts to cancellation
  const isCancelled = localCancelled;
  const canCancel =
    !isCancelled &&
    order.status?.toLowerCase() !== "delivered" &&
    isWithin24Hours;

  const hasExistingReview = !!(localReview && localReview.rating !== null);
  // BUG FIX #3: Review section disappears when order is cancelled
  const shouldShowReviewSection =
    (order.status?.toLowerCase() === "delivered" && !isCancelled) || hasExistingReview;

  // ── Fetch cancellation reasons ──
  useEffect(() => {
    if (!canCancel) return;
    const token = getCookie("token");
    fetch(`${BASE_URL}/grasa/shop/cancellation-reasons`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then(setCancellationReasonsList)
      .catch(console.error);
  }, [canCancel]);

  // ── Image upload ──
  const handleImageUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${BASE_URL}/product-reviews/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setImages((prev) => [...prev, data]);
    } catch {
      showToast("Image upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  // ── Submit review ──
  const submitReview = async () => {
    if (rating === 0) { showToast("Please select a rating before submitting.", "error"); return; }
    try {
      const res = await fetch(`${BASE_URL}/product-reviews/products/${product?.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review_text: reviewText, order_item_id: item?.id, images }),
      });
      if (!res.ok) throw new Error();
      // BUG FIX: Update local review state — no page reload needed
      setLocalReview({ id: null, rating, review_text: reviewText, images });
      setShowReviewForm(false);
      showToast("Review submitted! Thank you.", "success");
    } catch {
      showToast("Failed to submit review. Please try again.", "error");
    }
  };

  // ── Cancel order ──
  const handleCancelOrder = async () => {
    if (!selectedReasonId) { showToast("Please select a cancellation reason.", "error"); return; }
    setIsCancelling(true);
    const token = getCookie("token");
    try {
      const response = await fetch(
        `${BASE_URL}/shop/orders/${order.id}/items/${item?.id}/cancel`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ cancellation_reason_id: selectedReasonId }),
        }
      );
      if (response.ok) {
        // BUG FIX #1: Immediately update local state — cancel button vanishes, cancelled card appears
        const selectedReason = cancellationReasonsList.find((r) => r.id === selectedReasonId) ?? null;
        setLocalCancellationReason(selectedReason);
        setLocalCancelled(true);
        setShowCancelForm(false);
        showToast("Order item cancelled successfully.", "success");
      } else {
        const err = await response.json().catch(() => ({}));
        showToast(`Failed to cancel: ${err.message || "Unknown error"}`, "error");
      }
    } catch {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setIsCancelling(false);
    }
  };

  // ── Helpers ──
  const statusClass = () => {
    if (isCancelled || order.status?.toLowerCase() === "cancelled") return "od-status--cancelled";
    if (order.status?.toLowerCase() === "delivered") return "od-status--delivered";
    return "od-status--processing";
  };

  const statusLabel = isCancelled ? "Cancelled" : order.status;

  const formattedDate = new Date(order.order_date).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <Toast message={toast.message} type={toast.type} />

      <div className="od-page">
        <div className="od-container">

          {/* ── HEADER ── */}
          <div className="od-header">
            <div>
              <span className="od-header-eyebrow">Order Details</span>
              <h1 className="od-header-title">Order #{order.id}</h1>
              <div className="od-meta">
                <span className="od-meta-item"><IconCalendar />{formattedDate}</span>
                <span className="od-meta-item">
                  <IconCard />
                  {order.payment_transaction?.payment_gateway || "Standard Checkout"}
                </span>
              </div>
            </div>
            <span className={`od-status-badge ${statusClass()}`}>
              {order.status?.toLowerCase() === "delivered" && !isCancelled && <IconCheck />}
              {isCancelled && <IconXCircle />}
              {statusLabel}
            </span>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="od-grid">

            {/* LEFT: PRODUCT CARD */}
            <div className="od-product-card">
              <div className="od-product-image-wrap">
                {product?.category && (
                  <span className="od-product-category-tag">{product.category}</span>
                )}
                {product?.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="od-product-image-placeholder">
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                      <rect x="40" y="60" width="120" height="100" rx="12" fill="#1b1b1b" />
                      <rect x="60" y="40" width="80" height="30" rx="8" fill="#1b1b1b" />
                      <circle cx="100" cy="115" r="18" fill="#ebecdf" />
                      <rect x="85" y="148" width="30" height="6" rx="3" fill="#ebecdf" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="od-product-info">
                <h2 className="od-product-name">{product?.name}</h2>
                {product?.description && <p className="od-product-desc">{product.description}</p>}
                <div className="od-product-qty-row">
                  <span className="od-qty-label">Quantity</span>
                  <span className="od-qty-value">× {item?.quantity}</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="od-right-col">

              {/* BUG FIX #1: Cancelled card shown when localCancelled = true */}
              {isCancelled && (
                <div className="od-cancelled-card">
                  <h3 className="od-cancelled-title"><IconXCircle />Order Cancelled</h3>
                  <p className="od-cancelled-desc">
                    <strong>Reason:</strong>{" "}
                    {localCancellationReason?.description ||
                      localCancellationReason?.code ||
                      cancellationReason?.description ||
                      cancellationReason?.code ||
                      "No reason provided."}
                  </p>
                </div>
              )}

              {/* BUG FIX #2: canCancel is false when localCancelled = true → this block is hidden */}
              {canCancel && (
                <div className="od-cancel-card">
                  {!showCancelForm ? (
                    <div className="od-cancel-trigger-row">
                      <div>
                        <span className="od-cancel-copy-title">Cancel this order?</span>
                        <span className="od-cancel-copy-sub">Available within 24 hours of placing.</span>
                      </div>
                      <button className="od-btn-cancel-open" onClick={() => setShowCancelForm(true)}>
                        Cancel Item
                      </button>
                    </div>
                  ) : (
                    <div className="od-cancel-form">
                      <div className="od-cancel-form-heading">
                        <IconAlertCircle />Why are you cancelling?
                      </div>
                      <div className="od-cancel-reasons">
                        {cancellationReasonsList.length > 0 ? (
                          cancellationReasonsList.map((reason) => (
                            <label key={reason.id} className="od-reason-label">
                              <input
                                type="radio"
                                name="cancel_reason"
                                value={reason.id ?? ""}
                                checked={selectedReasonId === reason.id}
                                onChange={() => setSelectedReasonId(reason.id)}
                              />
                              <div>
                                <div className="od-reason-title">{reason.code?.replace(/_/g, " ")}</div>
                                {reason.description && <div className="od-reason-desc">{reason.description}</div>}
                              </div>
                            </label>
                          ))
                        ) : (
                          <p style={{ fontSize: "13px", color: "var(--od-text-mid)" }}>Loading reasons…</p>
                        )}
                      </div>
                      <div className="od-cancel-actions">
                        <button className="od-btn-keep" onClick={() => setShowCancelForm(false)} disabled={isCancelling}>
                          Keep Order
                        </button>
                        <button
                          className="od-btn-confirm-cancel"
                          onClick={handleCancelOrder}
                          disabled={isCancelling || !selectedReasonId}
                        >
                          {isCancelling ? "Cancelling…" : "Confirm Cancellation"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PRICING */}
              <div className="od-card">
                <div className="od-card-header">
                  <div className="od-card-icon"><IconReceipt /></div>
                  <h3 className="od-card-title">Pricing Breakdown</h3>
                </div>
                <table className="od-price-table">
                  <tbody>
                    <tr>
                      <td>MRP (per unit)</td>
                      <td className="od-strikethrough">₹{product?.mrp ?? "—"}</td>
                    </tr>
                    <tr>
                      <td>Offer price</td>
                      <td>₹{product?.effective_price ?? "—"}</td>
                    </tr>
                    <tr>
                      <td>Quantity</td>
                      <td>× {item?.quantity}</td>
                    </tr>
                    {item?.taxes && (
                      <tr><td>Taxes</td><td>₹{item.taxes}</td></tr>
                    )}
                    {item?.discount && (
                      <tr><td>Discount</td><td className="od-green-text">− ₹{item.discount}</td></tr>
                    )}
                    <tr className="od-price-divider"><td colSpan={2} /></tr>
                    <tr className="od-price-total">
                      <td>Item subtotal</td>
                      <td>₹{item?.subtotal ?? "—"}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="od-summary-banner">
                  <div>
                    <div className="od-banner-txn-val">Total Paid</div>
                    <div className="od-banner-amount">₹{order.total_amount} {order.currency}</div>
                    {order.offer_discount && parseFloat(order.offer_discount) > 0 && (
                      <div className="od-banner-saved">You saved ₹{order.offer_discount} on this order</div>
                    )}
                  </div>
                  {order.payment_transaction && (
                    <div className="od-banner-txn">
                      <div className="od-banner-txn-val">Transaction ID</div>
                      <div className="od-banner-txn-val">{order.payment_transaction.gateway_txn_id}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* SHIPPING */}
              {address && (
                <div className="od-card">
                  <div className="od-card-header">
                    <div className="od-card-icon"><IconTruck /></div>
                    <h3 className="od-card-title">Shipping Details</h3>
                  </div>
                  <div className="od-address-block">
                    <div className="od-address-icon"><IconPin /></div>
                    <div>
                      <div className="od-address-title">Delivery Address</div>
                      <div className="od-address-text">
                        <p>{address.street}</p>
                        {address.landmark && <p>Landmark: {address.landmark}</p>}
                        <p>{address.city}, {address.state}{address.postal_code ? ` — ${address.postal_code}` : ""}</p>
                        {address.country && <p>{address.country}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* REVIEWS */}
              {shouldShowReviewSection && (
                <div className="od-card">
                  <div className="od-card-header">
                    <div className="od-card-icon" style={{ background: "#fef9e6" }}>
                      <IconStarFilled />
                    </div>
                    <h3 className="od-card-title">Rating &amp; Review</h3>
                  </div>

                  {hasExistingReview ? (
                    <div className="od-existing-review">
                      <div className="od-review-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={s <= (localReview?.rating ?? 0) ? "od-review-star-filled" : "od-review-star-empty"}>★</span>
                        ))}
                        <span className="od-review-rating-text">{localReview?.rating}/5</span>
                      </div>
                      {localReview?.review_text && (
                        <p className="od-review-quote">"{localReview.review_text}"</p>
                      )}
                      {localReview?.images && localReview.images.length > 0 && (
                        <div className="od-review-images">
                          {localReview.images.map((img, i) => (
                            <img key={i} src={img.url} alt="Review" className="od-review-thumb" />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : !showReviewForm ? (
                    <button className="od-btn-write-review" onClick={() => setShowReviewForm(true)}>
                      <IconPencil />Write a Product Review
                    </button>
                  ) : (
                    <div className="od-review-form-inner">
                      <span className="od-form-label">Your rating</span>
                      <StarRating rating={rating} setRating={setRating} />

                      <span className="od-form-label">Your review</span>
                      <textarea
                        className="od-review-textarea"
                        placeholder="What did you like or dislike? What should other shoppers know?"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                      />

                      <span className="od-form-label">Add photos (optional)</span>
                      <div className="od-upload-area">
                        <div className="od-upload-box">
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploading}
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                          />
                          <div className="od-upload-box-inner">
                            <IconUpload />
                            {uploading ? "Uploading…" : "Add Photo"}
                          </div>
                        </div>
                        {images.map((img, i) => (
                          <img key={i} src={img.url} alt="Preview" className="od-upload-preview" />
                        ))}
                      </div>

                      <div className="od-review-actions">
                        <button className="od-btn-cancel-review" onClick={() => setShowReviewForm(false)}>Cancel</button>
                        <button className="od-btn-submit-review" onClick={submitReview}>Submit Review</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}