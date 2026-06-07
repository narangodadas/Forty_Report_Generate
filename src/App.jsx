import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, FileDown, RotateCcw, Loader2, Sun, Moon } from "lucide-react";
import { CATEGORIES, CATEGORY_LOCATIONS, createAlertEntry } from "./data/constants";
import LocationSelector  from "./components/LocationSelector";
import SiteAlertSection  from "./components/SiteAlertSection";
import DateTimePicker    from "./components/DateTimePicker";
import PasswordGate      from "./components/PasswordGate";
import { generateIncidentPDF } from "./utils/generateIncidentPDF";

const INITIAL_FORM = { category: "", trackingNumber: "", startDateTime: "", endDateTime: "" };

/** Returns true if current local time is 16:00 ≤ now < 20:00 */
function isOpenHour() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= 16 * 60 && mins < 20 * 60;
}

export default function App() {
  const [unlocked, setUnlocked]       = useState(() => isOpenHour());
  const [form, setForm]               = useState(INITIAL_FORM);
  const [selectedSites, setSelectedSites] = useState([]);
  const [siteAlerts, setSiteAlerts]   = useState({});
  const [errors, setErrors]           = useState({});
  const [generating, setGenerating]   = useState(false);
  const [dark, setDark]               = useState(false);
  const [scrollY, setScrollY]         = useState(0);
  const alertsRef                     = useRef(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  // Track scroll position for navigation buttons
  useEffect(() => {
    const update = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const showScrollUp   = scrollY > 200;
  const showScrollDown = selectedSites.length > 0 && maxScroll > 100 && scrollY < maxScroll - 100;

  const scrollToTop    = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToAlerts = () => alertsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  // Re-check access every minute (in case time window closes while open)
  useEffect(() => {
    const id = setInterval(() => {
      if (!isOpenHour() && unlocked && !sessionStorage.getItem("fit_noc_unlocked")) {
        setUnlocked(false);
      }
    }, 30000);
    return () => clearInterval(id);
  }, [unlocked]);

  const handleUnlock = () => {
    sessionStorage.setItem("fit_noc_unlocked", "1");
    setUnlocked(true);
  };

  // ── Form logic ──────────────────────────────────────────────────────────────
  const handleFormChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: "" }));
    if (field === "category") { setSelectedSites([]); setSiteAlerts({}); }
  };

  const toggleSite = (site) => {
    setSelectedSites((prev) => {
      if (prev.includes(site)) {
        setSiteAlerts((a) => { const c = { ...a }; delete c[site]; return c; });
        return prev.filter((s) => s !== site);
      }
      setSiteAlerts((a) => ({ ...a, [site]: [createAlertEntry()] }));
      return [...prev, site];
    });
  };

  const updateSiteAlerts = (site, alerts) => setSiteAlerts((p) => ({ ...p, [site]: alerts }));

  const removeSite = (site) => {
    setSelectedSites((p) => p.filter((s) => s !== site));
    setSiteAlerts((a) => { const c = { ...a }; delete c[site]; return c; });
  };

  const validate = () => {
    const errs = {};
    if (!form.category)              errs.category       = "Please select a category.";
    if (!form.trackingNumber.trim()) errs.trackingNumber  = "Tracking number is required.";
    if (!form.startDateTime)         errs.startDateTime   = "Start date & time is required.";
    if (!form.endDateTime)           errs.endDateTime     = "End date & time is required.";
    if (selectedSites.length === 0)  errs.sites           = "Please select at least one site.";
    let alertErr = false;
    selectedSites.forEach((site) => {
      (siteAlerts[site] || []).forEach((e) => {
        if (!e.alertType || !e.alertCount) alertErr = true;
        if (e.alertType === "Other" && !e.customAlertType?.trim()) alertErr = true;
      });
    });
    if (alertErr) errs.alerts = "Please complete all required alert fields.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      sites: selectedSites.map((site) => ({
        site,
        alerts: (siteAlerts[site] || []).map((entry) => ({
          alertType:   entry.alertType === "Other" ? entry.customAlertType : entry.alertType,
          alertCount:  Number(entry.alertCount),
          description: entry.description || null,
        })),
      })),
      submittedAt: new Date().toISOString(),
    };
    setGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 80));
      generateIncidentPDF(payload);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed. Check the console for details.");
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM); setSelectedSites([]); setSiteAlerts({}); setErrors({});
  };

  const locations    = form.category ? CATEGORY_LOCATIONS[form.category] || [] : [];
  const activeStep   = selectedSites.length > 0 ? 3 : form.category ? 2 : 1;

  // ── Password gate ───────────────────────────────────────────────────────────
  if (!unlocked) return <PasswordGate onUnlock={handleUnlock} />;

  // ── Main dashboard ──────────────────────────────────────────────────────────
  return (
    <div className="app-root">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="page-wrapper">

        {/* Top bar */}
        <div className="top-bar">
          <button className="theme-toggle" onClick={() => setDark((d) => !d)} type="button">
            {dark ? <Sun size={14} /> : <Moon size={14} />}
            <div className="theme-toggle-track">
              <div className="theme-toggle-thumb" />
            </div>
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </div>

        {/* Header */}
        <header className="page-header">
          <div className="header-eyebrow">
            <div className="header-eyebrow-dot" />
            Fentons IT — NOC
          </div>
          <h1 className="page-title">
            Incident <span className="page-title-accent">Alert</span> Tracker
          </h1>
          <p className="page-subtitle">
            Record and generate incident reports across all Hayleys Group sites
          </p>
        </header>

        {/* Steps */}
        <div className="steps-row">
          {[{n:1,label:"Core Info"},{n:2,label:"Select Sites"},{n:3,label:"Add Alerts"}].map(({n,label},i,arr)=>(
            <div key={n} className="step-item">
              <div className={`step-circle ${activeStep===n?"active":activeStep>n?"done":""}`}>
                {activeStep>n?"✓":n}
              </div>
              <span className={`step-label ${activeStep===n?"active":""}`}>{label}</span>
              {i<arr.length-1&&<div className="step-connector"/>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Card 1 */}
          <div className="form-card">
            <div className="card-section-label">
              <span className="section-number">01</span>
              Core Information
            </div>

            <div className="two-col-grid">
              <div className="field-group">
                <label className="field-label">Category <span className="required">*</span></label>
                <div className="select-wrapper">
                  <select
                    value={form.category}
                    onChange={(e) => handleFormChange("category", e.target.value)}
                    className={`field-select ${errors.category ? "field-error" : ""}`}
                  >
                    <option value="">— Select category —</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={16} className="select-icon" />
                </div>
                {errors.category && <p className="error-msg">{errors.category}</p>}
              </div>

              <div className="field-group">
                <label className="field-label">Tracking Number <span className="required">*</span></label>
                <input
                  type="text"
                  value={form.trackingNumber}
                  onChange={(e) => handleFormChange("trackingNumber", e.target.value)}
                  placeholder="e.g. TRK-2026-00142"
                  className={`field-input ${errors.trackingNumber ? "field-error" : ""}`}
                />
                {errors.trackingNumber && <p className="error-msg">{errors.trackingNumber}</p>}
              </div>
            </div>

            <div className="two-col-grid">
              <div>
                <DateTimePicker
                  label="Start Date and Time" value={form.startDateTime}
                  onChange={(v) => handleFormChange("startDateTime", v)}
                  required placeholder="Pick start date & time"
                  defaultHour="04" defaultMinute="00" defaultPeriod="PM"
                />
                {errors.startDateTime && <p className="error-msg">{errors.startDateTime}</p>}
              </div>
              <div>
                <DateTimePicker
                  label="End Date and Time" value={form.endDateTime}
                  onChange={(v) => handleFormChange("endDateTime", v)}
                  required placeholder="Pick end date & time"
                  defaultHour="04" defaultMinute="00" defaultPeriod="PM"
                />
                {errors.endDateTime && <p className="error-msg">{errors.endDateTime}</p>}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          {form.category && (
            <div className="form-card animate-fade-in">
              <div className="card-section-label">
                <span className="section-number">02</span>
                Site Selection — {form.category}
              </div>
              <LocationSelector locations={locations} selectedSites={selectedSites} onToggle={toggleSite} />
              {errors.sites && <p className="error-msg">{errors.sites}</p>}
            </div>
          )}

          {/* Card 3 */}
          {selectedSites.length > 0 && (
            <div className="form-card animate-fade-in" ref={alertsRef}>
              <div className="card-section-label">
                <span className="section-number">03</span>
                Alert Entries
              </div>
              {errors.alerts && <p className="error-msg mb-4">{errors.alerts}</p>}
              <div className="sites-list">
                {selectedSites.map((site) => (
                  <SiteAlertSection
                    key={site} site={site}
                    alerts={siteAlerts[site] || []}
                    onUpdate={updateSiteAlerts} onRemove={removeSite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="form-actions">
            <button type="button" onClick={handleReset} className="reset-btn">
              <RotateCcw size={15} /> Reset
            </button>
            <button type="submit" className="submit-btn" disabled={generating}>
              {generating
                ? <><Loader2 size={15} className="spin-icon" /> Generating PDF...</>
                : <><FileDown size={15} /> Download Incident Report</>
              }
            </button>
          </div>
        </form>
      </div>

      {/* Floating scroll navigation */}
      {(showScrollUp || showScrollDown) && (
        <div className="scroll-nav">
          {showScrollDown && (
            <button className="scroll-nav-btn" onClick={scrollToAlerts} title="Go to alerts section">
              <ChevronDown size={20} />
            </button>
          )}
          {showScrollUp && (
            <button className="scroll-nav-btn" onClick={scrollToTop} title="Back to top">
              <ChevronUp size={20} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
