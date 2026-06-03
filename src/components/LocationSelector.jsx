import { Check, Building2 } from "lucide-react";

export default function LocationSelector({ locations, selectedSites, onToggle }) {
  return (
    <div className="field-group">
      <label className="field-label">
        Select Sites / Locations <span className="required">*</span>
      </label>
      <p className="field-hint">Select one or more sites to add alert entries</p>
      <div className="locations-grid">
        {locations.map((loc) => {
          const isSelected = selectedSites.includes(loc);
          return (
            <button
              key={loc}
              type="button"
              onClick={() => onToggle(loc)}
              className={`location-card ${isSelected ? "location-card-selected" : ""}`}
            >
              <div className="location-card-inner">
                <Building2 size={14} className="location-icon" />
                <span className="location-name">{loc}</span>
                {isSelected && (
                  <div className="location-check">
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
