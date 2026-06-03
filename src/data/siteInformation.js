/**
 * siteInformation.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Master device data for all sites — used in Section 5 of the Incident Report.
 *
 * DATA SOURCE: Verified from provided network inventory sheet.
 * Fields: ip, location, os, patch, hardware
 * os      = FortiGate version (e.g. "7" = FortiOS 7.x)
 * patch   = FortiOS build version
 * hardware = FortiGate hardware model (e.g. 80F, 60F, 40F...)
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const SITE_INFORMATION = {

  // ── AGRO ────────────────────────────────────────────────────────────────────
  "Agro-HJS": {
    ip:       "10.40.24.254",
    location: "Agro-HJS",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 80F",
  },
  "Agro-Fertilizer": {
    ip:       "10.40.27.254",
    location: "Agro-Fertilizer",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 60F",
  },
  "Agro-Haychem Kottawa": {
    ip:       "10.40.1.254",
    location: "Agro-Haychem Kottawa",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 80F",
  },
  "Agro-Dambulla": {
    ip:       "10.40.38.254",
    location: "Agro-Dambulla",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Agro-Seeduwa": {
    ip:       "10.40.39.254",
    location: "Agro-Seeduwa",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Agro-Animal Health Sapugaskanda": {
    ip:       "10.40.4.254",
    location: "Agro-Animal Health Sapugaskanda",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Agro-Pannipitiya": {
    ip:       "10.40.72.254",
    location: "Agro-Pannipitiya",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Agro-Biotech Nanuoya": {
    ip:       "10.40.78.254",
    location: "Agro-Biotech Nanuoya",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Agro-Quality Seeds Boralanda": {
    ip:       "10.40.48.254",
    location: "Agro-Quality Seeds Boralanda",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Agro-Quality Seeds Landscaping Hokandara": {
    ip:       "10.40.71.254",
    location: "Agro-Quality Seeds Landscaping Hokandara",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Agro-Quality Seeds Boralanda 2": {
    ip:       "10.40.37.254",
    location: "Agro-Quality Seeds Boralanda 2",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Agro-Technica Ekala": {
    ip:       "10.40.6.254",
    location: "Agro-Technica Ekala",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Agro-Cocolife Pannala": {
    ip:       "10.40.73.254",
    location: "Agro-Cocolife Pannala",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Agro-Quality Seeds Bomiriya": {
    ip:       "10.40.59.254",
    location: "Agro-Quality Seeds Bomiriya",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  // Note: Agro-Quality Seeds Bangladesh had no entry in the provided sheet — kept as N/A
  "Agro-Quality Seeds Bangladesh": {
    ip:       "N/A",
    location: "Agro-Quality Seeds Bangladesh",
    os:       "N/A",
    patch:    "N/A",
    hardware: "N/A",
  },

  // ── FIBER ────────────────────────────────────────────────────────────────────
  "Fiber-Chas.P Madampe": {
    ip:       "10.40.8.254",
    location: "Fiber-Chas.P Madampe",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Fiber-Chas.P Naththandiya": {
    ip:       "10.40.44.254",
    location: "Fiber-Chas.P Naththandiya",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Fiber-Chas.P Galle": {
    ip:       "10.40.10.254",
    location: "Fiber-Chas.P Galle",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Fiber-Ravi Industries": {
    ip:       "10.40.14.254",
    location: "Fiber-Ravi Industries",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 80F",
  },
  "Fiber-Kuliyapitiya": {
    ip:       "10.40.29.254",
    location: "Fiber-Kuliyapitiya",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Fiber-Creative Polymat": {
    ip:       "10.40.12.254",
    location: "Fiber-Creative Polymat",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Fiber-Rileys Katana": {
    ip:       "10.40.15.254",
    location: "Fiber-Rileys Katana",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },
  "Fiber-Volanka Kotugoda": {
    ip:       "10.40.17.254",
    location: "Fiber-Volanka Kotugoda",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 80F",
  },

  // ── ADVANTIS ─────────────────────────────────────────────────────────────────
  "ADV-Hayleys Free Zone 1-Venus": {
    ip:       "10.40.41.254",
    location: "ADV-Hayleys Free Zone 1-Venus",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 60F",
  },
  "ADV-Hayleys Free Zone 2-Mecury": {
    ip:       "10.40.16.254",
    location: "ADV-Hayleys Free Zone 2-Mercury",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 40F",
  },
  "ADV-Logiwiz 1-Kelaniya (3PL Plus)": {
    ip:       "10.40.25.254",
    location: "ADV-Logiwiz 1-Kelaniya (3PL Plus)",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 80F",
  },
  "ADV-Logiwiz 1-Kotugoda": {
    ip:       "10.40.79.254",
    location: "ADV-Logiwiz 1-Kotugoda",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 80F",
  },
  "ADV-Logistic International": {
    ip:       "10.40.18.254",
    location: "ADV-Logistic International",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 60F",
  },
  "ADV-Logistic Projects and Engineering": {
    ip:       "10.40.11.254",
    location: "ADV-Logistic Projects and Engineering",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 80F",
  },
  "ADV-Expelogixs": {
    ip:       "10.40.53.254",
    location: "ADV-Expelogixs",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 40F",
  },
  "ADV-Cosco": {
    ip:       "10.40.51.253",
    location: "ADV-Cosco",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 80F",
  },
  "ADV-Logiwiz Kelanimulla": {
    ip:       "10.40.35.254",
    location: "ADV-Logiwiz Kelanimulla",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 40F",
  },
  "ADV-SLSC": {
    ip:       "10.40.43.254",
    location: "ADV-SLSC",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 100F",
  },

  // ── ALUMEX ────────────────────────────────────────────────────────────────────
  "Alumex Ho Makola": {
    ip:       "10.40.52.254",
    location: "Alumex Ho Makola",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 200F",
  },
  "Alumex Gonawala": {
    ip:       "10.40.74.254",
    location: "Alumex Gonawala",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 60F",
  },
  "Alumex Prime": {
    ip:       "10.40.84.254",
    location: "Alumex Prime",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 80F",
  },

  // ── AVENTURA ──────────────────────────────────────────────────────────────────
  "Aventura": {
    ip:       "10.40.2.254",
    location: "Aventura",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 40F",
  },

  // ── AMAYA ─────────────────────────────────────────────────────────────────────
  "Amaya Culture Club Dambulla": {
    ip:       "10.40.57.254",
    location: "Amaya Culture Club Dambulla",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 80F",
  },
  "Amaya Leisure WTC": {
    ip:       "10.40.56.254",
    location: "Amaya Leisure WTC",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 80F",
  },
  "Amaya Kandyan Resort": {
    ip:       "10.40.58.254",
    location: "Amaya Kandyan Resort",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 80F",
  },
  "Amaya Sunset Beach": {
    ip:       "10.40.3.254",
    location: "Amaya Sunset Beach",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 80F",
  },
  "Amaya Kingsbury": {
    ip:       "10.40.33.254",
    location: "Amaya Kingsbury",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 200F",
  },
  // Note: Amaya Maldives not in provided sheet — kept as N/A
  "Amaya Maldives": {
    ip:       "N/A",
    location: "Amaya Maldives",
    os:       "N/A",
    patch:    "N/A",
    hardware: "N/A",
  },

  // ── SOUTH ASIAN TEXTILES ──────────────────────────────────────────────────────
  "South Asian Textiles": {
    ip:       "10.40.101.254",
    location: "South Asian Textiles",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 400E",
  },

  // ── MABROC ────────────────────────────────────────────────────────────────────
  "Mabroc": {
    ip:       "10.40.28.254",
    location: "Mabroc",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 100F",
  },

  // ── FABRIC ────────────────────────────────────────────────────────────────────
  "Hayleys Fabric Wagawaththa": {
    ip:       "10.40.88.254",
    location: "Hayleys Fabric Wagawaththa",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 40F",
  },
  "Hayleys Fabric Neboda": {
    ip:       "10.40.164.254",
    location: "Hayleys Fabric Neboda",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 600E",
  },

  // ── DPL ───────────────────────────────────────────────────────────────────────
  "DPL-Kottawa": {
    ip:       "10.40.22.254",
    location: "DPL-Kottawa",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 100F",
  },
  "DPL-Thailand": {
    ip:       "10.40.30.39",
    location: "DPL-Thailand",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 100E",
  },
  "DPL-Sport Gloves Biyagama": {
    ip:       "10.40.54.254",
    location: "DPL-Sport Gloves Biyagama",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 100F",
  },
  "DPL-Hanwella": {
    ip:       "10.40.32.254",
    location: "DPL-Hanwella",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 60F",
  },
  "DPL-Uni Gloves Biyagama": {
    ip:       "10.40.26.254",
    location: "DPL-Uni Gloves Biyagama",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 60F",
  },
  "DPL-Premier Gloves Biyagama": {
    ip:       "10.40.23.254",
    location: "DPL-Premier Gloves Biyagama",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 80F",
  },

  // ── HAYCARB ───────────────────────────────────────────────────────────────────
  "Haycarb-Madampe": {
    ip:       "10.40.7.254",
    location: "Haycarb-Madampe",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 60F",
  },
  "Haycarb-Wewelduwa": {
    ip:       "10.40.5.254",
    location: "Haycarb-Wewelduwa",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 40F",
  },
  "Haycarb-Badalgama": {
    ip:       "10.40.9.254",
    location: "Haycarb-Badalgama",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 60F",
  },
  "Haycarb-HPM": {
    ip:       "192.168.10.254",
    location: "Haycarb-HPM",
    os:       "FortiOS 6",
    patch:    "6.4.4",
    hardware: "FortiGate 60E",
  },
  "Haycarb-MMC": {
    ip:       "10.80.109.254",
    location: "Haycarb-MMC",
    os:       "FortiOS 7",
    patch:    "7.2.7",
    hardware: "FortiGate 60E",
  },

  // ── MARTIN BOURE ──────────────────────────────────────────────────────────────
  "Martin Boure": {
    ip:       "10.40.61.254",
    location: "Martin Boure",
    os:       "FortiOS 7",
    patch:    "7.2.5",
    hardware: "FortiGate 60E",
  },
};
