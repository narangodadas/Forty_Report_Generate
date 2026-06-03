import { Trash2, ChevronDown } from "lucide-react";
import { ALERT_TYPES } from "../data/constants";

export default function AlertEntry({ entry, index, onUpdate, onRemove, canRemove }) {
  const handleChange = (field, value) => {
    onUpdate(entry.id, { ...entry, [field]: value });
  };

  return (
    <div className="alert-entry-card">
      <div className="alert-entry-header">
        <span className="alert-entry-badge">Alert #{index + 1}</span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="remove-btn"
            title="Remove this alert"
          >
            <Trash2 size={14} />
            <span>Remove</span>
          </button>
        )}
      </div>

      <div className="alert-fields-grid">
        {/* Alert Type */}
        <div className="field-group">
          <label className="field-label">
            Select Alert Type <span className="required">*</span>
          </label>
          <div className="select-wrapper">
            <select
              value={entry.alertType}
              onChange={(e) => handleChange("alertType", e.target.value)}
              className="field-select"
              required
            >
              <option value="">— Choose alert type —</option>
              {ALERT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="select-icon" />
          </div>
        </div>

        {/* Alert Count */}
        <div className="field-group">
          <label className="field-label">
            Enter Alert Count <span className="required">*</span>
          </label>
          <input
            type="number"
            min="0"
            value={entry.alertCount}
            onChange={(e) => handleChange("alertCount", e.target.value)}
            placeholder="e.g. 3"
            className="field-input"
            required
          />
        </div>
      </div>

      {/* Custom Alert Type */}
      {entry.alertType === "Other" && (
        <div className="field-group animate-slide-down">
          <label className="field-label">
            Enter Alert Type <span className="required">*</span>
          </label>
          <input
            type="text"
            value={entry.customAlertType}
            onChange={(e) => handleChange("customAlertType", e.target.value)}
            placeholder="Describe the alert type..."
            className="field-input"
            required
          />
        </div>
      )}

      {/* Description */}
      <div className="field-group">
        <label className="field-label">
          Description <span className="optional">(optional)</span>
        </label>
        <textarea
          value={entry.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Provide additional context or notes..."
          className="field-textarea"
          rows={3}
        />
      </div>
    </div>
  );
}
