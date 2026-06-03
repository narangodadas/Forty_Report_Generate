import { CheckCircle, Copy, X } from "lucide-react";
import { useState } from "react";

export default function SubmitPreview({ data, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="preview-overlay">
      <div className="preview-modal">
        <div className="preview-header">
          <div className="preview-title-row">
            <CheckCircle size={22} className="preview-success-icon" />
            <h2 className="preview-title">Form Submitted Successfully</h2>
          </div>
          <button onClick={onClose} className="preview-close-btn">
            <X size={18} />
          </button>
        </div>

        <p className="preview-subtitle">Here's the captured form data as JSON:</p>

        <div className="preview-code-wrapper">
          <button onClick={handleCopy} className="copy-btn">
            <Copy size={13} />
            {copied ? "Copied!" : "Copy"}
          </button>
          <pre className="preview-code">{JSON.stringify(data, null, 2)}</pre>
        </div>

        <button onClick={onClose} className="preview-done-btn">
          Done — Submit Another
        </button>
      </div>
    </div>
  );
}
