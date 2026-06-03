import { X, Plus, MapPin } from "lucide-react";
import AlertEntry from "./AlertEntry";
import { createAlertEntry } from "../data/constants";

export default function SiteAlertSection({ site, alerts, onUpdate, onRemove }) {
  const addAlert = () => {
    onUpdate(site, [...alerts, createAlertEntry()]);
  };

  const updateAlert = (id, updated) => {
    onUpdate(site, alerts.map((a) => (a.id === id ? updated : a)));
  };

  const removeAlert = (id) => {
    onUpdate(site, alerts.filter((a) => a.id !== id));
  };

  return (
    <div className="site-section">
      <div className="site-section-header">
        <div className="site-title-row">
          <MapPin size={16} className="site-pin-icon" />
          <h3 className="site-title">{site}</h3>
          <span className="alert-count-pill">{alerts.length} alert{alerts.length !== 1 ? "s" : ""}</span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(site)}
          className="site-remove-btn"
          title="Remove this site"
        >
          <X size={16} />
        </button>
      </div>

      <div className="alerts-list">
        {alerts.map((entry, idx) => (
          <AlertEntry
            key={entry.id}
            entry={entry}
            index={idx}
            onUpdate={updateAlert}
            onRemove={removeAlert}
            canRemove={alerts.length > 1}
          />
        ))}
      </div>

      <button type="button" onClick={addAlert} className="add-more-btn">
        <Plus size={15} />
        Add More Alert
      </button>
    </div>
  );
}
