import { useRouter } from "next/router";
import { useState } from "react";

export default function PasteViewPage() {
  const router = useRouter();
  const { id } = router.query;

  const pasteId = typeof id === "string" ? id : null;

  const [content, setContent] = useState<string | null>(null);
  const [remainingViews, setRemainingViews] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleViewPaste = async () => {
    if (!pasteId || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/pastes/${pasteId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Paste not found");
      }

      setContent(data.content);
      setRemainingViews(data.remaining_views ?? null);
      setExpiresAt(data.expires_at ?? null);

      if (data.expires_at) {
        const diff = Math.floor(
          (new Date(data.expires_at).getTime() - Date.now()) / 1000
        );
        setSecondsLeft(diff > 0 ? diff : 0);
      }
    } catch (err: any) {
      setError(err.message || "This paste does not exist or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>PasteBin-Lite</h1>

        {!content && !error && (
          <button
            style={styles.button}
            onClick={handleViewPaste}
            disabled={loading}
          >
            {loading ? "Loading..." : "View Paste"}
          </button>
        )}

        {error && <p style={styles.error}>{error}</p>}

        {content && (
          <>
            <pre style={styles.pasteBox}>{content}</pre>

            <div style={styles.meta}>
              <p>
                <strong>Remaining views:</strong>{" "}
                {remainingViews === null ? "Unlimited" : remainingViews}
              </p>

              <p>
                <strong>Time left:</strong>{" "}
                {expiresAt ? `${secondsLeft} seconds` : "No expiry"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "30px",
    width: "100%",
    maxWidth: "800px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    textAlign: "center" as const,
  },
  title: {
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
  },
  button: {
    backgroundColor: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 20px",
    fontSize: "16px",
    cursor: "pointer",
  },
  pasteBox: {
    backgroundColor: "#f5f7fa",
    borderRadius: "8px",
    padding: "20px",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#222",
    marginTop: "20px",
    textAlign: "left" as const,
  },
  meta: {
    marginTop: "14px",
    padding: "12px",
    backgroundColor: "#eef2ff",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#333",
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap" as const,
  },
  error: {
    color: "#d32f2f",
    fontWeight: "500",
    marginTop: "12px",
  },
};
