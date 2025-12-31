import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttl_seconds, setttl_seconds] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreatePaste = async () => {
    setError("");
    setResultUrl("");

    // UI validations
    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    if (ttl_seconds && Number(ttl_seconds) <= 0) {
      setError("Expiry must be greater than 0 seconds");
      return;
    }

    if (maxViews && Number(maxViews) <= 0) {
      setError("Max views must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl_seconds ? Number(ttl_seconds) : undefined,
          max_views: maxViews ? Number(maxViews) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create paste");
      }

      setResultUrl(data.url);
      setContent("");
      setttl_seconds("");
      setMaxViews("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(resultUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>PasteBin-Lite</h1>

        <textarea
          placeholder="Paste your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />

        <div style={styles.row}>
          <input
            type="number"
            min={1}
            placeholder="Expiry (seconds)"
            value={ttl_seconds}
            onChange={(e) => setttl_seconds(e.target.value)}
            style={styles.input}
          />

          <input
            type="number"
            min={1}
            placeholder="Max views"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            style={styles.input}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button
          onClick={handleCreatePaste}
          style={styles.button}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {resultUrl && (
          <div style={styles.result}>
            <p style={styles.resultLabel}>Your shareable link</p>

            <div style={styles.shareRow}>
              <input
                value={resultUrl}
                readOnly
                style={styles.shareInput}
              />

              <button
                onClick={copyToClipboard}
                style={styles.copyBtn}
              >
                Copy
              </button>
            </div>
          </div>
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
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    width: "100%",
    maxWidth: "720px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center" as const,
    marginBottom: "20px",
    fontSize: "28px",
    fontWeight: 600,
  },
  textarea: {
    width: "100%",
    height: "150px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    resize: "vertical" as const,
  },
  row: {
    display: "flex",
    gap: "12px",
    marginTop: "12px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    marginTop: "16px",
    width: "100%",
    padding: "12px",
    backgroundColor: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    marginTop: "10px",
    color: "#d32f2f",
    fontWeight: 500,
  },
  result: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#f5f7fa",
    borderRadius: "10px",
  },
  resultLabel: {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#555",
  },
  shareRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  shareInput: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    backgroundColor: "#fff",
    color: "#333",
  },
  copyBtn: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#764ba2",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    whiteSpace: "nowrap" as const,
  },
};
