

"use client";

import { useState, useEffect } from "react";
import { BASE_URL } from "@/components/config/api";
import { X, Loader2, CheckCircle2, Star, Download, AlertCircle, Edit2 } from "lucide-react";

// ── TypeScript Types ──────────────────────────────────────────────────────────
type ReviewImage = {
  id?: number;
  url: string;
  public_id: string;
};

type Review = {
  id: number | null;
  product_id?: number | null;
  user_id?: number | null;
  order_id?: number | null;
  rating: number | null;
  review_text: string | null;
  is_verified_purchase?: boolean | null;
  status?: string | null;
  images?: ReviewImage[] | null;
};

type Product = {
  id: number;
  name: string;
  image?: string;
  description: string;
  category?: string;
  mrp?: string;
  effective_price?: string;
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

type Item = {
  id: number;
  quantity: number;
  price_at_order: string;
  subtotal: string;
  product: Product;
  shipping_address: ShippingAddress;
  status?: string;
  reviews?: Review;
};

type PaymentTransaction = {
  id: number;
  gateway_txn_id: string;
  status: string;
  payment_gateway: string;
  amount: string;
  currency?: string;
};

type CancellationReason = {
  id: number;
  code: string;
  description: string;
};

type Order = {
  id: number;
  order_date: string;
  status: string;
  total_amount: string;
  currency: string;
  total_mrp?: string;
  discount_amount?: string;
  mhc_points?: string;
  offer_discount?: string;
  payment_transaction?: PaymentTransaction;
  items: Item[];
};

// ── Cookie Utility ────────────────────────────────────────────────────────────
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
};

// ── Helper Functions ──────────────────────────────────────────────────────────
const hasValidReview = (review: Review | undefined | null): boolean => {
  if (!review) return false;
  return (
    review.id !== null &&
    review.rating !== null &&
    review.rating !== undefined
  );
};

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (r: number) => void;
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
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
            fontSize: "26px",
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

// ── Cancel Modal Component ───────────────────────────────────────────────────
const CancelModal = ({
  isOpen,
  onClose,
  onSuccess,
  orderId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orderId: number;
}) => {
  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && reasons.length === 0) {
      fetchReasons();
    }
  }, [isOpen]);

  const fetchReasons = async () => {
    try {
      const token = getCookie("token");
      const res = await fetch(`${BASE_URL}/grasa/shop/cancellation-reasons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setReasons(data);
      }
    } catch (err) {
      console.error("[v0] Failed to fetch cancellation reasons:", err);
    }
  };

  const handleCancel = async () => {
    if (!selectedReason) {
      setError("Please select a cancellation reason");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = getCookie("token");
      const res = await fetch(
        `${BASE_URL}/grasa/shop/orders/${orderId}/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cancellation_reason_id: selectedReason }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to cancel order");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("[v0] Cancel order error:", err);
      setError("Failed to cancel order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "2rem",
          maxWidth: "400px",
          width: "100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>
            Cancel Order
          </h2>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666", fontSize: "0.9rem" }}>
            Please select a reason for cancellation
          </p>
        </div>

        {success ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              padding: "2rem 0",
            }}
          >
            <CheckCircle2 size={48} style={{ color: "#2d6a4f" }} />
            <p
              style={{
                fontSize: "1rem",
                color: "#2d6a4f",
                textAlign: "center",
              }}
            >
              Order cancelled successfully!
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "0.75rem",
                }}
              >
                Cancellation Reason
              </label>
              <select
                value={selectedReason || ""}
                onChange={(e) => setSelectedReason(Number(e.target.value) || null)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #d6d1c4",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  fontFamily: "inherit",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231b1b1b' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.2em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="">Select a reason...</option>
                {reasons.map((reason) => (
                  <option key={reason.id} value={reason.id}>
                    {reason.description}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div
                style={{
                  background: "#fce8e6",
                  color: "#d93025",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                }}
              >
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={onClose}
                disabled={loading}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "1px solid #d6d1c4",
                  borderRadius: "8px",
                  background: "#fff",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  fontWeight: 600,
                }}
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                disabled={loading || !selectedReason}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#d93025",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading || !selectedReason ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  opacity: loading || !selectedReason ? 0.6 : 1,
                }}
              >
                {loading && (
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                )}
                {loading ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ── Edit Review Modal Component ──────────────────────────────────────────────
const EditReviewModal = ({
  item,
  review,
  isOpen,
  onClose,
  onSubmitSuccess,
}: {
  item: Item | null;
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}) => {
  // Handle null review - return early
  if (!isOpen || !review || !item) {
    return null;
  }

  const [rating, setRating] = useState(review?.rating ? review.rating : 0);
  const [reviewText, setReviewText] = useState(review?.review_text ? review.review_text : "");
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ReviewImage[]>(
    review?.images && Array.isArray(review.images) ? review.images : []
  );
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitEdit = async () => {
    if (rating === 0) {
      setSubmitError("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      setSubmitError("Please write a review");
      return;
    }

    try {
      setUploading(true);
      setSubmitError("");

      const token = getCookie("token");

      // Upload new images if any
      const uploadedNewImages: ReviewImage[] = [];

      for (const file of newImages) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(`${BASE_URL}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadedData = await uploadRes.json();
          uploadedNewImages.push({
            url: uploadedData.url,
            public_id: uploadedData.public_id,
          });
        }
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...uploadedNewImages];

      // Validate review has required IDs
      if (!review?.id) {
        setSubmitError("Review ID is missing");
        return;
      }

      // Submit review update
      const reviewPayload = {
        rating,
        review_text: reviewText,
        order_item_id: item.id,
        images: allImages,
      };

      const reviewRes = await fetch(
        `${BASE_URL}/product-reviews/products/${item.order_id}/reviews/${review.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewPayload),
        }
      );

      if (!reviewRes.ok) {
        throw new Error("Failed to update review");
      }

      console.log("[v0] Review updated successfully");
      setSubmitSuccess(true);
      setTimeout(() => {
        onSubmitSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("[v0] Review update error:", error);
      setSubmitError("Failed to update review. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>
            Edit Review
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {submitSuccess ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              padding: "2rem 0",
            }}
          >
            <CheckCircle2 size={48} style={{ color: "#2d6a4f" }} />
            <p
              style={{
                fontSize: "1rem",
                color: "#2d6a4f",
                textAlign: "center",
              }}
            >
              Review updated successfully!
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>
                {item.product.name}
              </p>
              <StarRating rating={rating} setRating={setRating} />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Your Review
              </label>
              <textarea
                value={reviewText}
                maxLength={100}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "0.75rem",
                  border: "1px solid #d6d1c4",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  resize: "vertical",
                }}
              />
              <div
  style={{
    textAlign: "right",
    fontSize: "0.75rem",
    color: "var(--od-text-light)",
    marginTop: "0.35rem",
  }}
>
  {reviewText.length}/100
</div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Current Images
              </label>
              {existingImages.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {existingImages.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #d6d1c4",
                      }}
                    >
                      <img
                        src={img.url}
                        alt={`existing-${idx}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        onClick={() => removeExistingImage(idx)}
                        style={{
                          position: "absolute",
                          top: "-2px",
                          right: "-2px",
                          background: "#d93025",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Add More Images (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #d6d1c4",
                  borderRadius: "8px",
                  width: "100%",
                }}
              />
              {newImages.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  {newImages.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #d6d1c4",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`new-preview-${idx}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        onClick={() => removeNewImage(idx)}
                        style={{
                          position: "absolute",
                          top: "-2px",
                          right: "-2px",
                          background: "#d93025",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {submitError && (
              <div
                style={{
                  background: "#fce8e6",
                  color: "#d93025",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                {submitError}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={onClose}
                disabled={uploading}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "1px solid #d6d1c4",
                  borderRadius: "8px",
                  background: "#fff",
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.6 : 1,
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                disabled={uploading}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#1b7a4f",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                {uploading && (
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                )}
                {uploading ? "Updating..." : "Update Review"}
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ── Review Modal Component ────────────────────────────────────────────────────
const ReviewModal = ({
  item,
  isOpen,
  onClose,
  onSubmitSuccess,
}: {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
}) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setSubmitError("Please select a rating");
      return;
    }

    if (!reviewText.trim()) {
      setSubmitError("Please write a review");
      return;
    }

    try {
      setUploading(true);
      setSubmitError("");

      const token = getCookie("token");

      // Upload images to your backend or cloudinary
      const uploadedImages: ReviewImage[] = [];

      for (const file of images) {
        const formData = new FormData();
        formData.append("file", file);

        // Adjust this endpoint based on your backend
        const uploadRes = await fetch(`${BASE_URL}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadedData = await uploadRes.json();
          uploadedImages.push({
            url: uploadedData.url,
            public_id: uploadedData.public_id,
          });
        }
      }

      // Submit review
      const reviewPayload = {
        rating,
        review_text: reviewText,
        order_item_id: item.id,
        images: uploadedImages,
      };

      const reviewRes = await fetch(
        `${BASE_URL}/product-reviews/products/${item.product.id}/reviews`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewPayload),
        }
      );

      if (!reviewRes.ok) {
        throw new Error("Failed to submit review");
      }

      console.log("[v0] Review submitted successfully");
      setSubmitSuccess(true);
      setTimeout(() => {
        onSubmitSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("[v0] Review submission error:", error);
      setSubmitError("Failed to submit review. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>
            Write Review
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {submitSuccess ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              padding: "2rem 0",
            }}
          >
            <CheckCircle2 size={48} style={{ color: "#2d6a4f" }} />
            <p
              style={{
                fontSize: "1rem",
                color: "#2d6a4f",
                textAlign: "center",
              }}
            >
              Review submitted successfully!
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>
                {item.product.name}
              </p>
              <StarRating rating={rating} setRating={setRating} />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Your Review
              </label>
              <textarea
                value={reviewText}
                maxLength={100}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                style={{
                  width: "100%",
                  minHeight: "100px",
                  padding: "0.75rem",
                  border: "1px solid #d6d1c4",
                  borderRadius: "8px",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  resize: "vertical",
                }}
              />
              <div
  style={{
    textAlign: "right",
    fontSize: "0.75rem",
    color: "var(--od-text-light)",
    marginTop: "0.35rem",
  }}
>
  {reviewText.length}/100
</div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Add Images (Optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  padding: "0.5rem",
                  border: "1px solid #d6d1c4",
                  borderRadius: "8px",
                  width: "100%",
                }}
              />
              {images.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        width: "60px",
                        height: "60px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #d6d1c4",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview-${idx}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        style={{
                          position: "absolute",
                          top: "-2px",
                          right: "-2px",
                          background: "#d93025",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {submitError && (
              <div
                style={{
                  background: "#fce8e6",
                  color: "#d93025",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                }}
              >
                {submitError}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={onClose}
                disabled={uploading}
                style={{
                  padding: "0.75rem 1.5rem",
                  border: "1px solid #d6d1c4",
                  borderRadius: "8px",
                  background: "#fff",
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.6 : 1,
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={uploading}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#C5D82D",
                  border: "none",
                  borderRadius: "8px",
                  cursor: uploading ? "not-allowed" : "pointer",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  opacity: uploading ? 0.6 : 1,
                }}
              >
                {uploading && (
                  <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                )}
                {uploading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ── Main OrderDetails Component ───────────────────────────────────────────────
export default function OrderDetails({ order }: { order: Order }) {
  const [reviewingItem, setReviewingItem] = useState<Item | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [reviewsUpdated, setReviewsUpdated] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");
  const [orderStatus, setOrderStatus] = useState(order.status);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    
    :root {
      --od-bg:           #ebecdf;
      --od-bg-card:      #f4f4f2;
      --od-bg-white:     #ffffff;
      --od-text-dark:    #1b1b1b;
      --od-text-mid:     #5c5c5c;
      --od-text-light:   #8a8a8a;
      --od-border:       #d6d1c4;
      --od-green-dark:   #124132;
      --od-lime:         #C5D82D;
      --od-red:          #b94040;
      --od-red-light:    #fdf0f0;
      --od-red-border:   #e8c5c5;
      --od-green-ok:     #2d6a4f;
      --od-green-light:  #edf5f0;
      --od-green-border: #b4d9c8;
      --od-amber:        #7a5c00;
      --od-amber-light:  #fef9e6;
      --od-amber-border: #e8d49a;
      --od-blue:         #1a56a0;
      --od-blue-light:   #eff6ff;
      --od-blue-border:  #bfdbfe;
    }

    .od-page {
      min-height: 100vh;
      background: var(--od-bg);
      font-family: 'DM Sans', sans-serif;
      color: var(--od-text-dark);
      padding: 2rem 1.25rem 5rem;
    }
    .od-container { max-width: 860px; margin: 0 auto; }

    .od-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 2rem;
      padding-bottom: 1.75rem;
      border-bottom: 1px solid var(--od-border);
    }
    .od-header-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
    }

    .od-master-card {
      background: var(--od-bg-white);
      border: 1px solid var(--od-border);
      border-radius: 22px;
      overflow: hidden;
    }

    .od-section {
      padding: 1.5rem 1.75rem;
      border-bottom: 1px solid var(--od-border);
    }
    .od-section:last-child { border-bottom: none; }

    .od-section-heading {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 1.25rem;
    }
    .od-section-title {
      font-size: 1rem;
      font-weight: 700;
      margin: 0;
    }

    .od-product-row {
      display: flex;
      gap: 1rem;
      padding: 1.1rem 0;
      border-bottom: 1px solid var(--od-bg-card);
      align-items: flex-start;
    }
    .od-product-row:last-child { border-bottom: none; }

    .od-product-thumb {
      width: 88px;
      height: 88px;
      border-radius: 12px;
      background: var(--od-bg-card);
      border: 1px solid var(--od-border);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }
    .od-product-thumb img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 6px;
    }

    .od-product-body { flex: 1; min-width: 0; }
    .od-product-name {
      font-size: 0.95rem;
      font-weight: 700;
      margin: 0 0 0.3rem;
    }
    .od-product-desc {
      font-size: 12px;
      color: var(--od-text-mid);
      margin: 0 0 0.6rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .od-review-section {
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--od-border);
    }

    .od-review-display {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .od-review-btn {
      padding: 0.5rem 1rem;
      background: var(--od-lime);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: opacity 0.2s;
    }
    .od-review-btn:hover { opacity: 0.9; }

    .od-price-table {
      width: 100%;
      border-collapse: collapse;
    }
    .od-price-table td {
      padding: 6px 0;
      font-size: 13.5px;
    }
    .od-price-table td:last-child { text-align: right; font-weight: 500; }
    .od-price-table td:first-child { color: var(--od-text-mid); }

    .od-summary-banner {
      background: var(--od-text-dark);
      border-radius: 14px;
      padding: 1.1rem 1.4rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-top: 1.1rem;
    }
    .od-banner-amount {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--od-lime);
    }

    .od-address-block {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      background: var(--od-bg-card);
      border-radius: 12px;
      padding: 1rem 1.1rem;
    }
    .od-address-title { font-weight: 600; font-size: 12.5px; margin-bottom: 4px; }
    .od-address-text { font-size: 12.5px; color: var(--od-text-mid); line-height: 1.7; }

    @keyframes spin { to { transform: rotate(360deg); } }
  
  
    @media (max-width: 768px) {
  .od-page {
    padding: 1rem 0.75rem 4rem;
  }

  .od-section {
    padding: 1rem;
  }

  .od-product-row {
    flex-direction: column;
  }

  .od-product-thumb {
    width: 100%;
    height: 220px;
  }

  .od-product-thumb img {
    object-fit: contain;
  }

  .od-summary-banner {
    flex-direction: column;
    align-items: flex-start;
  }

  .od-header {
    flex-direction: column;
    align-items: stretch;
  }

  .od-header-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .od-product-thumb {
    height: 180px;
  }

  .od-banner-amount {
    font-size: 1.4rem;
  }

  .od-section-title {
    font-size: 0.95rem;
  }
}

.od-review-layout {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.od-review-left {
  display: flex;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.od-review-images {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  max-width: 260px;
}

.od-review-image-box {
  width: 68px;
  height: 68px;
  min-width: 68px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--od-border);
  background: #fff;
}

.od-review-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.od-review-content {
  flex: 1;
  min-width: 0;
}

.od-review-text {
  font-size: 0.9rem;
  color: var(--od-text-mid);
  margin: 0 0 0.7rem;
  line-height: 1.7;
  word-break: break-word;
}

.od-review-stars {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.od-review-rating {
  font-size: 0.9rem;
  font-weight: 700;
  margin-left: 0.35rem;
}

.od-review-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.7rem;
}

.od-review-edit-btn {
  background: #fff;
  border: 1px solid var(--od-border);
  border-radius: 8px;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.od-review-edit-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.06);
}

.od-review-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  text-transform: capitalize;
}

/* MOBILE */
@media (max-width: 768px) {
  .od-review-layout {
    flex-direction: column;
  }

  .od-review-left {
    flex-direction: column;
    width: 100%;
  }

  .od-review-images {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    max-width: 100%;
    padding-bottom: 0.3rem;
  }

  .od-review-image-box {
    width: 74px;
    height: 74px;
    min-width: 74px;
  }

  .od-review-right {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .od-review-text {
    margin-top: 0.2rem;
    font-size: 0.88rem;
  }
}

/* SMALL MOBILE */
@media (max-width: 480px) {
  .od-review-images {
    display: grid;
    grid-template-columns: repeat(3, 74px);
    overflow-x: auto;
    gap: 0.55rem;
    width: 100%;
  }
}
    `;

  

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("deliver")) return "var(--od-green-ok)";
    if (s.includes("cancel")) return "var(--od-red)";
    return "var(--od-amber)";
  };

  const isOrderDelivered = orderStatus?.toLowerCase().includes("deliver");
  const isOrderProcessing = orderStatus?.toLowerCase().includes("processing");
  
  const getOrderAge = () => {
    const orderDate = new Date(order.order_date);
    const now = new Date();
    const hoursOld = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);
    return hoursOld;
  };

  const canCancelOrder = isOrderProcessing && getOrderAge() < 24;

  const handleDownloadInvoice = async () => {
    try {
      setInvoiceLoading(true);
      setInvoiceError("");

      const token = getCookie("token");
      const res = await fetch(
        `${BASE_URL}/grasa/shop/${order.id}/generate-invoice`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to generate invoice");
      }

      const data = await res.json();
      if (data.pdf_url) {
        // Open PDF in new tab
        window.open(data.pdf_url, "_blank");
      }
    } catch (err) {
      console.error("[v0] Invoice download error:", err);
      setInvoiceError("Failed to download invoice");
    } finally {
      setInvoiceLoading(false);
    }
  };

  return (
    <div className="od-page">
      <style>{styles}</style>
      <div className="od-container">
        {/* Header */}
        <div className="od-header">
          <div>
            <h1 className="od-header-title">Order #{order.id}</h1>
            <div
              style={{
                fontSize: "0.9rem",
                color: "var(--od-text-mid)",
                marginTop: "0.5rem",
              }}
            >
              {new Date(order.order_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            {invoiceError && (
              <div
                style={{
                  background: "#fce8e6",
                  color: "#d93025",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                }}
              >
                {invoiceError}
              </div>
            )}
            <button
              onClick={handleDownloadInvoice}
              disabled={invoiceLoading}
              style={{
                padding: "0.65rem 1.2rem",
                background: "var(--od-lime)",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: invoiceLoading ? "not-allowed" : "pointer",
                opacity: invoiceLoading ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                whiteSpace: "nowrap",
              }}
            >
              {invoiceLoading ? (
                <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Download size={18} />
              )}
              {invoiceLoading ? "Generating..." : "Download Invoice"}
            </button>
          </div>
        </div>

        {/* Master Card */}
        <div className="od-master-card">
          {/* Products Section */}
          <div className="od-section">
            <div className="od-section-heading">
              <h2 className="od-section-title">Order Items</h2>
            </div>

            {order.items.map((item) => {
              const hasReview = hasValidReview(item.reviews);
              const review = item.reviews;

              return (
                <div key={item.id} className="od-product-row">
                  <div className="od-product-thumb">
                    <img
                      src={item.product.image || "/placeholder.png"}
                      alt={item.product.name}
                    />
                  </div>
                  <div className="od-product-body">
                    <h3 className="od-product-name">{item.product.name}</h3>
                    <p className="od-product-desc">
                      {item.product.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "1rem",
                        fontSize: "0.9rem",
                        color: "var(--od-text-mid)",
                      }}
                    >
                      <span>Qty: {item.quantity}</span>
                      <span>₹{parseFloat(item.price_at_order).toLocaleString()}</span>
                    </div>

                    {/* Review Section */}
                    <div className="od-review-section">
                      {hasReview && review && review.id && review.rating !== null ? (
                        <div
  className="od-review-card"
  style={{
    background: "var(--od-bg-card)",
    borderRadius: "16px",
    padding: "1rem",
    marginTop: "1rem",
    width: "100%",
    overflow: "hidden",
    border: "1px solid rgba(214,209,196,0.7)",
  }}
>
  <div className="od-review-layout">
    {/* LEFT */}
    <div className="od-review-left">
      {/* IMAGES */}
      {review?.images && review.images.length > 0 && (
        <div className="od-review-images">
          {review.images.map((img, idx) => (
            <div key={idx} className="od-review-image-box">
              <img
                src={img.url}
                alt={`review-${idx}`}
                className="od-review-image"
              />
            </div>
          ))}
        </div>
      )}

      {/* CONTENT */}
      <div className="od-review-content">
        {/* REVIEW TEXT */}
        {review?.review_text && (
          <p className="od-review-text">
            {review.review_text}
          </p>
        )}

        {/* STARS */}
        <div className="od-review-stars">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < (review?.rating || 0) ? "#f0a500" : "none"}
              color={i < (review?.rating || 0) ? "#f0a500" : "#d6d1c4"}
            />
          ))}

          <span className="od-review-rating">
            {review?.rating}/5
          </span>
        </div>
      </div>
    </div>

    {/* RIGHT */}
    <div className="od-review-right">
      {/* EDIT */}
      {review?.id && (
        <button
          onClick={() => {
            setEditingReview(review);
            setEditingItem(item);
          }}
          className="od-review-edit-btn"
        >
          <Edit2 size={14} />
          Edit
        </button>
      )}

      {/* STATUS */}
      {review?.status && (
        <span
          className="od-review-status"
          style={{
            background:
              review.status === "approved"
                ? "var(--od-green-light)"
                : review.status === "pending"
                ? "var(--od-amber-light)"
                : "var(--od-red-light)",
            color:
              review.status === "approved"
                ? "var(--od-green-dark)"
                : review.status === "pending"
                ? "var(--od-amber)"
                : "var(--od-red)",
          }}
        >
          {review.status}
        </span>
      )}
    </div>
  </div>
</div>
                      ) : isOrderDelivered ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.85rem",
                            color: "var(--od-text-mid)",
                            cursor: "pointer",
                          }}
                          onClick={() => setReviewingItem(item)}
                        >
                          {[...Array(5)].map((_, index) => (
                            <Star key={index} size={16} color="#d6d1c4" />
                          ))}
                        </div>

                      ) : (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.85rem",
                            color: "var(--od-text-mid)",
                          }}
                        >
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Address Section */}
          {order.items[0]?.shipping_address && (
            <div className="od-section">
              <div className="od-section-heading">
                <h2 className="od-section-title">Shipping Address</h2>
              </div>
              <div className="od-address-block">
                <div className="od-address-text">
                  <p style={{ margin: 0 }}>
                    <strong>{order.items[0].shipping_address.street}</strong>
                  </p>
                  <p style={{ margin: 0 }}>
                    {order.items[0].shipping_address.city},{" "}
                    {order.items[0].shipping_address.state}{" "}
                    {order.items[0].shipping_address.postal_code}
                  </p>
                  <p style={{ margin: 0 }}>
                    {order.items[0].shipping_address.country}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Section */}
          <div className="od-section">
            <div className="od-section-heading">
              <h2 className="od-section-title">Price Summary</h2>
            </div>
            <table className="od-price-table">
  <tbody>
    {/* PRODUCTS */}
    {order.items.map((item) => (
      <tr key={item.id}>
        <td>{item.product.name}</td>
        <td>
          {item.quantity} × ₹
          {parseFloat(item.price_at_order).toLocaleString()}
        </td>
      </tr>
    ))}

    {/* SUBTOTAL */}
    <tr style={{ borderTop: "1px solid var(--od-border)" }}>
      <td style={{ paddingTop: "0.9rem" }}>Subtotal</td>
      <td style={{ paddingTop: "0.9rem" }}>
        ₹
        {order.items
          .reduce(
            (sum, item) =>
              sum +
              parseFloat(item.price_at_order) * item.quantity,
            0
          )
          .toLocaleString()}
      </td>
    </tr>

    {/* PRODUCT DISCOUNT */}
    {order.discount_amount &&
      parseFloat(order.discount_amount) > 0 && (
        <tr>
          <td style={{ color: "var(--od-green-ok)" }}>
            Coupon Discount
          </td>

          <td style={{ color: "var(--od-green-ok)" }}>
            -₹
            {parseFloat(order.discount_amount).toLocaleString()}
          </td>
        </tr>
      )}

    {/* OFFER DISCOUNT */}
    {order.offer_discount &&
      parseFloat(order.offer_discount) > 0 && (
        <tr>
          <td style={{ color: "var(--od-green-ok)" }}>
            Offer Discount
          </td>

          <td style={{ color: "var(--od-green-ok)" }}>
            -₹
            {parseFloat(order.offer_discount).toLocaleString()}
          </td>
        </tr>
      )}

    {/* MHC POINTS */}
    {order.mhc_points &&
      parseFloat(order.mhc_points) > 0 && (
        <tr>
          <td
            style={{
              color: "var(--od-green-ok)",
              fontWeight: 600,
            }}
          >
            MHC Points Used
          </td>

          <td
            style={{
              color: "var(--od-green-ok)",
              fontWeight: 700,
            }}
          >
            -₹
            {parseFloat(order.mhc_points).toLocaleString()}
          </td>
        </tr>
      )}

    {/* TOTAL MRP */}
    {/* {order.total_mrp && (
      <tr>
        <td
          style={{
            color: "var(--od-text-light)",
          }}
        >
          Total MRP
        </td>

        <td
          style={{
            color: "var(--od-text-light)",
            textDecoration: "line-through",
          }}
        >
          ₹{parseFloat(order.total_mrp).toLocaleString()}
        </td>
      </tr>
    )} */}
  </tbody>
</table>

           <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-[#1b1b1b] p-4 sm:p-5 md:p-6">
  
  {/* LEFT */}
  <div className="min-w-0">
    <div className="text-[11px] sm:text-xs font-medium tracking-[2px] text-white/50">
      TOTAL
    </div>

    <div className="mt-1 text-3xl sm:text-4xl font-bold text-[#C5D82D] leading-none">
      ₹{parseFloat(order.total_amount).toLocaleString()}
    </div>
  </div>

  {/* RIGHT */}
  <div className="min-w-0 text-right">
    <div className="text-[11px] sm:text-xs font-medium tracking-[2px] text-white/50">
      STATUS
    </div>

    <div
      className="mt-1 text-lg sm:text-xl font-bold capitalize leading-none"
      style={{
        color: getStatusColor(orderStatus),
      }}
    >
      {orderStatus}
    </div>
  </div>
</div>

            {/* Cancel Order Section */}
            {canCancelOrder && (
              <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--od-border)" }}>
                <button
                  onClick={() => setShowCancelModal(true)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    background: "#d93025",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Cancel Order
                </button>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--od-text-mid)",
                    marginTop: "0.5rem",
                    margin: "0.5rem 0 0 0",
                  }}
                >
                  You can cancel this order within 24 hours of ordering
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        item={reviewingItem!}
        isOpen={!!reviewingItem}
        onClose={() => setReviewingItem(null)}
        onSubmitSuccess={() => setReviewsUpdated(!reviewsUpdated)}
      />

      {/* Edit Review Modal */}
      <EditReviewModal
        item={editingItem!}
        review={editingReview!}
        isOpen={!!editingReview && !!editingItem}
        onClose={() => {
          setEditingReview(null);
          setEditingItem(null);
        }}
        onSubmitSuccess={() => setReviewsUpdated(!reviewsUpdated)}
      />

      {/* Cancel Modal */}
      <CancelModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSuccess={() => setOrderStatus("Cancelled")}
        orderId={order.id}
      />
    </div>
  );
}
