import React, { useState, useEffect, useMemo } from 'react';
import {
  Leaf,
  Zap,
  Droplets,
  Recycle,
  HeartHandshake,
  ShieldCheck,
  Award,
  Sparkles,
  Plus,
  Building2,
  Home,
  CheckCircle2,
  ArrowRight,
  Printer,
  Share2,
  Calculator,
  Bot,
  Send,
  FileText,
  Lock,
  Unlock,
  BarChart3,
  Briefcase,
  Coins,
  Calendar,
  AlertTriangle,
  QrCode,
  Shield,
  Wrench,
  Vote,
  Menu,
  X,
  Wind,
  ArrowLeftRight,
  CheckSquare,
  HelpCircle,
  BookOpen,
  Lightbulb,
  PhoneCall,
} from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

// ============================================================================
// SAFE FIREBASE INITIALIZATION (ENVIRONMENT + OFFLINE PILOT FALLBACK)
// ============================================================================
const rawFirebaseConfig =
  typeof __firebase_config !== 'undefined' && __firebase_config
    ? typeof __firebase_config === 'string'
      ? JSON.parse(__firebase_config)
      : __firebase_config
    : null;

const appId =
  typeof __app_id !== 'undefined' && __app_id
    ? String(__app_id).replace(/[^a-zA-Z0-9_-]/g, '_')
    : 'slixai-unified-os';

let firebaseApp = null;
let auth = null;
let db = null;

if (rawFirebaseConfig && rawFirebaseConfig.apiKey) {
  try {
    firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(rawFirebaseConfig);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
  } catch (err) {
    console.warn('Firebase initialization skipped (running in local pilot mode):', err);
  }
}

// ============================================================================
// OFFICIAL BRAND LOGO COMPONENT (EXACT MATCH TO SLIX LOGO_2.PNG)
// ============================================================================
function SlixBrandLogo({ compact = false, subtitle = 'Unified ESG & Livability OS' }) {
  return (
    <div className="inline-flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-2xl shadow-xs border border-[#113D2E]/10 select-none">
      <svg
        width={compact ? 42 : 52}
        height={compact ? 32 : 40}
        viewBox="0 0 160 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SLIX ai official logo"
      >
        {/* Left lime-green leaf sprouting from the top of 'I' */}
        <path d="M79 44C64 38 56 24 62 9C75 13 82 26 79 44Z" fill="#84BD38" />
        <path
          d="M65 15C71 24 75 33 78 43"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Right deep forest-green leaf sprouting from the top of 'I' */}
        <path d="M81 44C82 24 94 12 112 9C113 27 100 39 81 44Z" fill="#065E29" />
        <path
          d="M106 15C97 23 89 32 82 43"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Condensed tall lime-green 'S' */}
        <path
          d="M42 63C42 56 37 52 31 52C25 52 21 56 21 62C21 68 25 71 32 75C40 79 44 84 44 93C44 103 38 109 30 109C22 109 16 103 16 94H23C23 99 26 102 30 102C34 102 37 99 37 93C37 87 34 84 27 80C19 76 14 71 14 62C14 52 21 45 31 45C41 45 49 52 49 63H42Z"
          fill="#73A82F"
        />

        {/* Condensed tall lime-green 'L' */}
        <path d="M56 46H64V101H78V108H56V46Z" fill="#73A82F" />

        {/* Condensed tall lime-green 'I' */}
        <path d="M83 46H91V108H83V46Z" fill="#73A82F" />

        {/* Condensed tall lime-green 'X' */}
        <path
          d="M98 46H106L113 69L120 46H128L117 76L129 108H121L113 84L105 108H97L109 76L98 46Z"
          fill="#73A82F"
        />

        {/* Lowercase forest-green 'ai' */}
        <text
          x="131"
          y="85"
          fill="#065E29"
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="19"
          letterSpacing="-0.3"
        >
          ai
        </text>
      </svg>

      {!compact && (
        <div className="hidden sm:block leading-tight border-l border-[#113D2E]/15 pl-2.5">
          <div className="text-[11px] font-extrabold tracking-wide text-[#113D2E]">
            SLIX.AI
          </div>
          <div className="text-[9px] font-semibold text-[#113D2E]/65">{subtitle}</div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MULTILINGUAL DICTIONARY (ENGLISH / MARATHI / HINDI)
// ============================================================================
const TRANSLATIONS = {
  en: {
    chooseType: '1. Select Edition',
    onboarding: '2. Onboard',
    dashboard: '3. ESG & Index',
    opsBot: '4. Ops & Bot',
    aiAdvisor: '5. AI Optimizer',
    simulator: '6. ROI Planner',
    peoplePulse: '7. People Pulse',
    commandCenter: '8. Rollout Hub',
    siriSaas: '9. Partners & MIS',
    helpGuide: 'Help & Playbook',
  },
  mr: {
    chooseType: '१. प्रकार निवडा',
    onboarding: '२. नोंदणी',
    dashboard: '३. ईएसजी निर्देशांक',
    opsBot: '४. ऑप्स व बॉट',
    aiAdvisor: '५. एआय सल्लागार',
    simulator: '६. आरओआय प्लॅनर',
    peoplePulse: '७. पल्स व रिवॉर्ड्स',
    commandCenter: '८. रोलआउट हब',
    siriSaas: '९. पार्टनर्स आणि एमआयएस',
    helpGuide: 'मदत आणि मार्गदर्शक',
  },
  hi: {
    chooseType: '१. प्रकार चुनें',
    onboarding: '२. पंजीकरण',
    dashboard: '३. ईएसजी इंडेक्स',
    opsBot: '४. ऑप्स और बॉट',
    aiAdvisor: '५. एआई सलाहकार',
    simulator: '६. आरओआई प्लानर',
    peoplePulse: '७. पल्स और रिवॉर्ड्स',
    commandCenter: '८. रोलआउट हब',
    siriSaas: '९. पार्टनर्स और एमआईएस',
    helpGuide: 'सहायता और गाइड',
  },
};

// ============================================================================
// DYNAMIC RBAC ROLES PER VERTICAL (RESIDENTIAL VS CORPORATE)
// ============================================================================
const RBAC_BY_VERTICAL = {
  residential: {
    super_admin: {
      key: 'super_admin',
      shortLabel: 'Super Admin',
      label: 'Super Admin (Siri Ventures)',
      allowedTabs: [
        'chooseType',
        'onboarding',
        'dashboard',
        'opsBot',
        'aiAdvisor',
        'simulator',
        'peoplePulse',
        'commandCenter',
        'siriSaas',
        'helpGuide',
      ],
      canViewSensitive: true,
    },
    mc_secretary: {
      key: 'mc_secretary',
      shortLabel: 'MC Secretary',
      label: 'MC / Hon. Secretary',
      allowedTabs: [
        'chooseType',
        'onboarding',
        'dashboard',
        'opsBot',
        'aiAdvisor',
        'simulator',
        'commandCenter',
        'helpGuide',
      ],
      canViewSensitive: true,
    },
    facility_manager: {
      key: 'facility_manager',
      shortLabel: 'Facility Mgr',
      label: 'Facility / Estate Manager',
      allowedTabs: ['dashboard', 'opsBot', 'aiAdvisor', 'helpGuide'],
      canViewSensitive: false,
    },
    resident: {
      key: 'resident',
      shortLabel: 'Resident',
      label: 'Resident (Owner / Tenant)',
      allowedTabs: ['peoplePulse', 'dashboard', 'helpGuide'],
      canViewSensitive: false,
    },
  },
  corporate: {
    asset_owner: {
      key: 'asset_owner',
      shortLabel: 'Owner / REIT',
      label: 'Asset Owner / REIT Portfolio',
      allowedTabs: [
        'chooseType',
        'onboarding',
        'dashboard',
        'opsBot',
        'aiAdvisor',
        'simulator',
        'peoplePulse',
        'commandCenter',
        'siriSaas',
        'helpGuide',
      ],
      canViewSensitive: true,
    },
    cre_head: {
      key: 'cre_head',
      shortLabel: 'CRE / Facility',
      label: 'CRE & Facility Head',
      allowedTabs: [
        'chooseType',
        'onboarding',
        'dashboard',
        'opsBot',
        'aiAdvisor',
        'simulator',
        'commandCenter',
        'helpGuide',
      ],
      canViewSensitive: true,
    },
    tenant_hr: {
      key: 'tenant_hr',
      shortLabel: 'Tenant HR/ESG',
      label: 'Tenant Corporate HR / ESG Lead',
      allowedTabs: ['dashboard', 'aiAdvisor', 'peoplePulse', 'commandCenter', 'helpGuide'],
      canViewSensitive: true,
    },
    employee: {
      key: 'employee',
      shortLabel: 'Employee',
      label: 'Corporate Employee / Occupant',
      allowedTabs: ['peoplePulse', 'dashboard', 'helpGuide'],
      canViewSensitive: false,
    },
  },
};

// ============================================================================
// UNIFIED SCORING ENGINE (ADAPTS TO RESIDENTIAL OR CORPORATE ENTITY)
// ============================================================================
function calculateUnifiedSlixMetrics(entity, pulses = []) {
  const isCorp = entity?.vertical === 'corporate';

  if (!isCorp) {
    // RESIDENTIAL GATED COMMUNITY SCORING
    const s = entity || {
      name: 'New Housing Society',
      city: 'Thane / Mumbai MMR',
      totalUnits: 240,
      solarKwp: 45,
      ledCoveragePct: 75,
      evBays: 6,
      solarWaterPct: 35,
      dgAmfSynced: true,
      dailyKld: 165,
      rwhPits: 4,
      stpReusePct: 65,
      iotSubMeterPct: 40,
      wetWasteKgDay: 180,
      owcOperational: true,
      segregationPct: 78,
      ewasteDrivesYr: 2,
      greenCoverPct: 26,
      nativeTrees: 95,
      fireNoc: true,
      liftLicense: true,
      structuralAudit: true,
      dgStackTest: true,
      maintenanceArLakhs: 3.8,
    };

    const units = Math.max(20, Number(s.totalUnits) || 240);
    const targetSolarKwp = Math.max(25, Math.round(units * 0.45));
    const targetEvBays = Math.max(4, Math.round(units * 0.06));
    const targetRwhPits = Math.max(2, Math.round(units / 45));

    const solarPts = Math.min(100, Math.round(((Number(s.solarKwp) || 0) / targetSolarKwp) * 100));
    const ledPts = Math.min(50, Math.round(((Number(s.ledCoveragePct) || 0) / 100) * 50));
    const evPts = Math.min(45, Math.round(((Number(s.evBays) || 0) / targetEvBays) * 45));
    const solarWaterPts = Math.min(35, Math.round(((Number(s.solarWaterPct) || 0) / 100) * 35));
    const dgPts = s.dgAmfSynced ? 20 : 6;
    const energyScore = solarPts + ledPts + evPts + solarWaterPts + dgPts;

    const stpPts = Math.min(95, Math.round(((Number(s.stpReusePct) || 0) / 100) * 95));
    const iotMeterPts = Math.min(75, Math.round(((Number(s.iotSubMeterPct) || 0) / 100) * 75));
    const rwhPts = Math.min(45, Math.round(((Number(s.rwhPits) || 0) / targetRwhPits) * 45));
    const kldPerFlat = (Number(s.dailyKld) || units * 0.7) / units;
    const kldEfficiencyPts = kldPerFlat <= 0.65 ? 35 : kldPerFlat <= 0.85 ? 24 : 14;
    const waterScore = stpPts + iotMeterPts + rwhPts + kldEfficiencyPts;

    const owcPts = s.owcOperational ? 85 : 15;
    const segPts = Math.min(75, Math.round(((Number(s.segregationPct) || 0) / 100) * 75));
    const ewastePts = Math.min(40, Math.round(((Number(s.ewasteDrivesYr) || 0) / 4) * 40));
    const wasteScore = owcPts + segPts + ewastePts;

    const greenPts = Math.min(60, Math.round(((Number(s.greenCoverPct) || 0) / 35) * 60));
    const treePts = Math.min(40, Math.round(((Number(s.nativeTrees) || 0) / Math.max(40, units * 0.5)) * 40));
    const avgPulse =
      pulses.length > 0
        ? pulses.reduce((a, b) => a + (Number(b.compositeScore) || 75), 0) / pulses.length
        : 74;
    const pulsePts = Math.min(50, Math.round((avgPulse / 100) * 50));
    const biodiversityScore = greenPts + treePts + pulsePts;

    const nocCount = [s.fireNoc, s.liftLicense, s.structuralAudit, s.dgStackTest].filter(Boolean).length;
    const governanceScore = nocCount * 22 + 32 + 30;

    const totalScore = Math.min(
      1000,
      energyScore + waterScore + wasteScore + biodiversityScore + governanceScore
    );
    const tier =
      totalScore >= 820
        ? 'Platinum'
        : totalScore >= 680
        ? 'Gold'
        : totalScore >= 520
        ? 'Silver'
        : 'Bronze';
    const tierMultiplier =
      tier === 'Platinum' ? 1.5 : tier === 'Gold' ? 1.3 : tier === 'Silver' ? 1.15 : 1.0;

    const safetyDim = Math.min(100, Math.round((nocCount / 4) * 94));
    const comfortDim = Math.min(100, Math.round(62 + (stpPts / 95) * 20 + (dgPts / 20) * 18));
    const mobilityDim = Math.min(100, Math.round(58 + (evPts / 45) * 26 + (greenPts / 60) * 16));
    const envHealthDim = Math.min(100, Math.round(((wasteScore + biodiversityScore) / 350) * 100));
    const socialDim = Math.min(100, Math.round(66 + Math.min(18, pulses.length * 4) + (avgPulse / 100) * 16));
    const govExpDim = Math.min(100, Math.round((governanceScore / 150) * 100));

    const livabilityScore = Math.round(
      safetyDim * 0.2 +
        comfortDim * 0.2 +
        mobilityDim * 0.15 +
        envHealthDim * 0.2 +
        socialDim * 0.15 +
        govExpDim * 0.1
    );

    const monthlyMintedOrgCredits = Math.round(
      ((totalScore / 10) * 0.6 + livabilityScore * 0.4) *
        tierMultiplier *
        Math.max(1, units / 50) *
        4 +
        pulses.length * 35
    );

    const annualSavingsLakhs = Number(
      (
        (Number(s.solarKwp) || 0) * 0.165 +
        ((Number(s.stpReusePct) || 0) / 100) * units * 0.022 +
        (s.owcOperational ? units * 0.014 : 0) +
        ((Number(s.iotSubMeterPct) || 0) / 100) * units * 0.018
      ).toFixed(2)
    );

    const annualCo2Tons = Math.round(
      (Number(s.solarKwp) || 0) * 1.25 +
        (s.owcOperational ? (Number(s.wetWasteKgDay) || 120) * 0.28 : 0) +
        (Number(s.evBays) || 0) * 2.4
    );

    return {
      isCorp: false,
      totalScore,
      tier,
      tierMultiplier,
      livabilityScore,
      monthlyMintedOrgCredits,
      annualSavingsLakhs,
      annualCo2Tons,
      secondaryMetricLabel: 'Maintenance AR',
      secondaryMetricValue: `₹${s.maintenanceArLakhs || 3.8}L`,
      pillars: [
        { id: 'energy', name: 'Energy & Carbon', score: energyScore, max: 250, icon: Zap, color: 'text-amber-600' },
        { id: 'water', name: 'Water Stewardship', score: waterScore, max: 250, icon: Droplets, color: 'text-sky-600' },
        { id: 'waste', name: 'Circular Waste', score: wasteScore, max: 200, icon: Recycle, color: 'text-emerald-600' },
        { id: 'bio', name: 'Biodiversity & Pulse', score: biodiversityScore, max: 150, icon: Leaf, color: 'text-lime-600' },
        { id: 'gov', name: 'Governance & Safety', score: governanceScore, max: 150, icon: ShieldCheck, color: 'text-indigo-600' },
      ],
      dimensions: [
        { name: 'Safety & Security', weight: '20%', score: safetyDim },
        { name: 'Comfort & Utilities', weight: '20%', score: comfortDim },
        { name: 'Mobility & Access', weight: '15%', score: mobilityDim },
        { name: 'Environment & Health', weight: '20%', score: envHealthDim },
        { name: 'Social Cohesion', weight: '15%', score: socialDim },
        { name: 'Governance Exp.', weight: '10%', score: govExpDim },
      ],
      diagnostics: [
        {
          id: 'res_solar',
          pillar: 'Energy & Carbon',
          parameter: 'Rooftop Solar PV (MERC Net-Metering)',
          currentVal: `${s.solarKwp || 0} kWp`,
          targetVal: `${targetSolarKwp} kWp`,
          gainPts: Math.max(0, 100 - solarPts),
          capexLakhs: Math.max(0, Number(((targetSolarKwp - (s.solarKwp || 0)) * 0.48).toFixed(1))),
          annualSaveLakhs: Math.max(0, Number(((targetSolarKwp - (s.solarKwp || 0)) * 0.165).toFixed(2))),
          paybackMonths: 34,
          simKey: 'opt1',
          aiAction: 'Add grid-tied rooftop solar under MERC Net-Metering to offset common lift & water pump daytime kWh.',
        },
        {
          id: 'res_iot',
          pillar: 'Water Stewardship',
          parameter: 'Apartment IoT Ultrasonic Sub-Metering',
          currentVal: `${s.iotSubMeterPct || 0}% flats`,
          targetVal: '100% flats',
          gainPts: Math.max(0, 75 - iotMeterPts),
          capexLakhs: Number(((units * 0.032) * (1 - (s.iotSubMeterPct || 0) / 100)).toFixed(1)),
          annualSaveLakhs: Number((units * 0.019 * (1 - (s.iotSubMeterPct || 0) / 100)).toFixed(2)),
          paybackMonths: 19,
          simKey: 'opt2',
          aiAction: 'Deploy LoRaWAN ultrasonic inlet meters with Pay-As-You-Consume billing; reduces tanker dependency by 25%.',
        },
        {
          id: 'res_stp',
          pillar: 'Water Stewardship',
          parameter: 'STP Treated Greywater Dual-Plumbing Reuse',
          currentVal: `${s.stpReusePct || 0}% reused`,
          targetVal: '95% reused',
          gainPts: Math.max(0, 95 - stpPts),
          capexLakhs: 4.5,
          annualSaveLakhs: 3.1,
          paybackMonths: 17,
          simKey: 'opt3',
          aiAction: 'Upgrade STP tertiary ultrafiltration so treated water supplies 100% of flushing & podium landscaping.',
        },
        {
          id: 'res_owc',
          pillar: 'Circular Waste',
          parameter: 'On-Site Organic Waste Composter (OWC)',
          currentVal: s.owcOperational ? 'Operational' : 'Not Installed',
          targetVal: '100% In-Vessel OWC',
          gainPts: Math.max(0, 85 - owcPts),
          capexLakhs: s.owcOperational ? 0 : 5.2,
          annualSaveLakhs: s.owcOperational ? 0 : 2.6,
          paybackMonths: 24,
          simKey: 'opt4',
          aiAction: 'Commission automated aerobic OWC + curing racks to unlock 5%–10% Municipal Property Tax rebate.',
        },
      ],
    };
  }

  // CORPORATE CAMPUS / IT PARK / COMMERCIAL REIT SCORING
  const c = entity || {
    name: 'Horizon One IT & Business Park',
    city: 'Mumbai / Thane MMR',
    glaSqFt: 520000,
    totalEmployees: 3800,
    renewablePowerPct: 52,
    solarKwp: 340,
    bmsChillerCop: 5.5,
    evChargingBays: 30,
    ledOccupancyPct: 86,
    stpZldReusePct: 84,
    iotWaterSubMeterPct: 72,
    rwhRechargeWells: 12,
    wasteDiversionPct: 85,
    eWasteCertifiedPct: 96,
    indoorCo2Ppm: 590,
    biophiliaDaylightPct: 70,
    ergonomicWellnessRooms: true,
    fireNoc: true,
    mpcbConsent: true,
    poshLabourCompliant: true,
    brsrGriMapped: true,
  };

  const gla = Math.max(25000, Number(c.glaSqFt) || 520000);
  const headcount = Math.max(100, Number(c.totalEmployees) || 3800);
  const targetSolarKwp = Math.max(100, Math.round(gla / 1200));
  const targetEvBays = Math.max(10, Math.round(headcount * 0.015));

  const renewablePts = Math.min(85, Math.round(((Number(c.renewablePowerPct) || 0) / 100) * 85));
  const solarPts = Math.min(55, Math.round(((Number(c.solarKwp) || 0) / targetSolarKwp) * 55));
  const bmsPts = Number(c.bmsChillerCop) >= 5.8 ? 50 : Number(c.bmsChillerCop) >= 5.0 ? 38 : 22;
  const evPts = Math.min(35, Math.round(((Number(c.evChargingBays) || 0) / targetEvBays) * 35));
  const ledPts = Math.min(25, Math.round(((Number(c.ledOccupancyPct) || 0) / 100) * 25));
  const energyScore = renewablePts + solarPts + bmsPts + evPts + ledPts;

  const stpPts = Math.min(90, Math.round(((Number(c.stpZldReusePct) || 0) / 100) * 90));
  const iotWaterPts = Math.min(65, Math.round(((Number(c.iotWaterSubMeterPct) || 0) / 100) * 65));
  const rwhPts = Math.min(45, Math.round(((Number(c.rwhRechargeWells) || 0) / 15) * 45));
  const waterScore = stpPts + iotWaterPts + rwhPts;

  const diversionPts = Math.min(90, Math.round(((Number(c.wasteDiversionPct) || 0) / 100) * 90));
  const ewastePts = Math.min(60, Math.round(((Number(c.eWasteCertifiedPct) || 0) / 100) * 60));
  const wasteScore = diversionPts + ewastePts;

  const co2 = Number(c.indoorCo2Ppm) || 600;
  const iaqPts = co2 <= 600 ? 75 : co2 <= 800 ? 58 : 35;
  const daylightPts = Math.min(55, Math.round(((Number(c.biophiliaDaylightPct) || 0) / 100) * 55));
  const wellnessPts = c.ergonomicWellnessRooms ? 30 : 10;
  const avgEx =
    pulses.length > 0
      ? pulses.reduce((a, b) => a + (Number(b.compositeScore) || 78), 0) / pulses.length
      : 78;
  const exPulsePts = Math.min(40, Math.round((avgEx / 100) * 40));
  const workplaceExScore = iaqPts + daylightPts + wellnessPts + exPulsePts;

  const compChecks = [c.fireNoc, c.mpcbConsent, c.poshLabourCompliant, c.brsrGriMapped].filter(Boolean).length;
  const governanceScore = compChecks * 50;

  const totalScore = Math.min(
    1000,
    energyScore + waterScore + wasteScore + workplaceExScore + governanceScore
  );
  const tier =
    totalScore >= 820
      ? 'Platinum'
      : totalScore >= 680
      ? 'Gold'
      : totalScore >= 520
      ? 'Silver'
      : 'Bronze';
  const tierMultiplier =
    tier === 'Platinum' ? 1.5 : tier === 'Gold' ? 1.3 : tier === 'Silver' ? 1.15 : 1.0;

  const iaqThermalDim = Math.min(100, Math.round((iaqPts / 75) * 60 + (bmsPts / 50) * 40));
  const daylightDim = Math.min(100, Math.round((daylightPts / 55) * 70 + (wellnessPts / 30) * 30));
  const commuteDim = Math.min(100, Math.round(58 + (evPts / 35) * 42));
  const safetyDim = Math.min(100, Math.round((compChecks / 4) * 95));
  const belongingDim = Math.min(100, Math.round(avgEx));
  const vigorDim = Math.min(100, Math.round(avgEx * 0.65 + iaqThermalDim * 0.35));

  const livabilityScore = Math.round(
    iaqThermalDim * 0.2 +
      daylightDim * 0.15 +
      commuteDim * 0.15 +
      safetyDim * 0.15 +
      belongingDim * 0.2 +
      vigorDim * 0.15
  );

  const monthlyMintedOrgCredits = Math.round(
    ((totalScore / 10) * 0.6 + livabilityScore * 0.4) *
      tierMultiplier *
      Math.max(1, gla / 100000) *
      12 +
      pulses.length * 45
  );

  const epiKwhSqFt = Number((18.5 - (totalScore / 1000) * 6.8).toFixed(1));
  const annualSavingsLakhs = Number(
    (
      (Number(c.solarKwp) || 0) * 0.175 +
      ((Number(c.stpZldReusePct) || 0) / 100) * (gla / 100000) * 3.4 +
      (Number(c.bmsChillerCop) >= 5.5 ? (gla / 100000) * 4.2 : 1.5)
    ).toFixed(2)
  );
  const annualCo2Tons = Math.round(
    (Number(c.solarKwp) || 0) * 1.28 +
      ((Number(c.renewablePowerPct) || 0) / 100) * (gla / 1000) * 1.45 +
      (Number(c.evChargingBays) || 0) * 3.1
  );

  return {
    isCorp: true,
    totalScore,
    tier,
    tierMultiplier,
    livabilityScore,
    monthlyMintedOrgCredits,
    annualSavingsLakhs,
    annualCo2Tons,
    secondaryMetricLabel: 'Building EPI',
    secondaryMetricValue: `${epiKwhSqFt} kWh/sf`,
    pillars: [
      { id: 'energy', name: 'Energy & BMS', score: energyScore, max: 250, icon: Zap, color: 'text-amber-600' },
      { id: 'water', name: 'Water & ZLD', score: waterScore, max: 200, icon: Droplets, color: 'text-sky-600' },
      { id: 'waste', name: 'Circular Waste', score: wasteScore, max: 150, icon: Recycle, color: 'text-emerald-600' },
      { id: 'ex', name: 'IEQ & Employee EX', score: workplaceExScore, max: 200, icon: Wind, color: 'text-lime-600' },
      { id: 'gov', name: 'BRSR & Safety', score: governanceScore, max: 200, icon: ShieldCheck, color: 'text-indigo-600' },
    ],
    dimensions: [
      { name: 'IAQ & Thermal Comfort', weight: '20%', score: iaqThermalDim },
      { name: 'Daylight & Biophilia', weight: '15%', score: daylightDim },
      { name: 'Green Commute & EV', weight: '15%', score: commuteDim },
      { name: 'Safety & Accessibility', weight: '15%', score: safetyDim },
      { name: 'Belonging & Purpose', weight: '20%', score: belongingDim },
      { name: 'Vigor & Happiness', weight: '15%', score: vigorDim },
    ],
    diagnostics: [
      {
        id: 'corp_bms',
        pillar: 'Energy & BMS',
        parameter: 'AI Chiller Plant & VAV Set-Point Reset',
        currentVal: `COP ${c.bmsChillerCop || 5.4}`,
        targetVal: 'COP 6.1 + CO2 VAV',
        gainPts: Math.max(0, 50 - bmsPts),
        capexLakhs: 6.5,
        annualSaveLakhs: 9.8,
        paybackMonths: 8,
        simKey: 'opt1',
        aiAction: 'Deploy AI occupancy-linked chilled water reset (+1.2°C during <45% floor load) & staggered 7:30 AM pre-cooling.',
      },
      {
        id: 'corp_ppa',
        pillar: 'Energy & BMS',
        parameter: 'Group Captive Green PPA / Carport Solar',
        currentVal: `${c.renewablePowerPct || 0}% Green Power`,
        targetVal: '85% RE100 Mix',
        gainPts: Math.max(0, 140 - (renewablePts + solarPts)),
        capexLakhs: 18.0,
        annualSaveLakhs: 14.5,
        paybackMonths: 15,
        simKey: 'opt2',
        aiAction: 'Execute Open-Access Green Power PPA to deliver auditable Scope 2 zero-carbon electricity for tenant SEBI BRSR Principle 6.',
      },
      {
        id: 'corp_iaq',
        pillar: 'IEQ & Employee EX',
        parameter: 'Demand-Controlled Fresh Air Ventilation (<600 ppm)',
        currentVal: `${co2} ppm CO2`,
        targetVal: '< 550 ppm CO2',
        gainPts: Math.max(0, 75 - iaqPts),
        capexLakhs: 4.2,
        annualSaveLakhs: 3.6,
        paybackMonths: 14,
        simKey: 'opt3',
        aiAction: 'Link floor-level PM2.5/CO2 sensors to AHU VFDs; boosts Employee Vigor & cognitive focus by +11%.',
      },
      {
        id: 'corp_zld',
        pillar: 'Water & ZLD',
        parameter: 'Cooling Tower Blowdown & STP Tertiary ZLD',
        currentVal: `${c.stpZldReusePct || 0}% Reused`,
        targetVal: '98% ZLD',
        gainPts: Math.max(0, 90 - stpPts),
        capexLakhs: 7.5,
        annualSaveLakhs: 6.4,
        paybackMonths: 14,
        simKey: 'opt4',
        aiAction: 'Route UF/RO treated STP permeate directly to HVAC cooling tower make-up, eliminating summer tanker reliance.',
      },
    ],
  };
}

// ============================================================================
// UNIFIED SLIX.AI SUPER-APP COMPONENT
// ============================================================================
export default function App() {
  // Active Edition Selected in Wizard Step 1 ('residential' | 'corporate')
  const [vertical, setVertical] = useState('residential');
  const [activeTab, setActiveTab] = useState('chooseType');
  const [lang, setLang] = useState('en');
  const [activeRoleKey, setActiveRoleKey] = useState('super_admin');
  const [roleLocked, setRoleLocked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showCertModal, setShowCertModal] = useState(false);

  // Unified Portfolio State (Both Residential Societies & Corporate Campuses)
  const [entities, setEntities] = useState([]);
  const [pulses, setPulses] = useState([]);
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [firebaseConnected, setFirebaseConnected] = useState(false);

  // Conversational SLIX Bot Guide Drawer
  const [botDrawerOpen, setBotDrawerOpen] = useState(true);
  const [guideChatInput, setGuideChatInput] = useState('');
  const [guideChatHistory, setGuideChatHistory] = useState([
    {
      id: 'init-uni-1',
      sender: 'bot',
      text: 'Namaste! Welcome to SLIX.ai (slixai.in). Let’s start at Step 1: tell me whether you are onboarding a Gated Community / Housing Society (RWA) or a Corporate Campus / IT Park!',
    },
  ]);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const roleMap = RBAC_BY_VERTICAL[vertical] || RBAC_BY_VERTICAL.residential;
  const currentRole = roleMap[activeRoleKey] || Object.values(roleMap)[0];

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // URL Deep-Link Support (?vertical=communities or ?vertical=workplace)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const v = (params.get('vertical') || '').toLowerCase();
      if (v === 'workplace' || v === 'corporate') {
        setVertical('corporate');
        setActiveRoleKey('asset_owner');
        setActiveTab('onboarding');
      } else if (v === 'communities' || v === 'residential') {
        setVertical('residential');
        setActiveRoleKey('super_admin');
        setActiveTab('onboarding');
      }
    } catch {
      // Ignore in sandboxed iframe
    }
  }, []);

  // Firebase Auth & Realtime Sync
  useEffect(() => {
    if (!auth || !db) return;
    let unsubEntities = null;
    let unsubPulses = null;

    signInAnonymously(auth).catch(() => {});

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      setFirebaseConnected(true);

      const entRef = collection(db, 'artifacts', appId, 'public', 'data', 'slix_entities');
      unsubEntities = onSnapshot(
        entRef,
        (snap) => {
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setEntities(list);
        },
        () => {}
      );

      const pulseRef = collection(db, 'artifacts', appId, 'public', 'data', 'slix_pulses');
      unsubPulses = onSnapshot(
        pulseRef,
        (snap) => {
          setPulses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        },
        () => {}
      );
    });

    return () => {
      unsubAuth();
      if (unsubEntities) unsubEntities();
      if (unsubPulses) unsubPulses();
    };
  }, []);

  const handleSelectVertical = (newVertical, jumpToOnboard = true) => {
    setVertical(newVertical);
    setActiveRoleKey(newVertical === 'corporate' ? 'asset_owner' : 'super_admin');
    setOnboardStep(1);
    setPeopleStep(1);
    if (jumpToOnboard) {
      setActiveTab('onboarding');
    }
    const matching = entities.filter((e) => e.vertical === newVertical);
    if (matching.length > 0) {
      setSelectedEntityId(matching[0].id);
    }
    triggerToast(
      newVertical === 'corporate'
        ? 'Switched to SLIX Workplace (Corporates, IT Parks & REITs)'
        : 'Switched to SLIX Communities (Gated Societies & RWAs)'
    );
  };

  // ============================================================================
  // ONBOARDING WIZARD FORMS (RESIDENTIAL + CORPORATE)
  // ============================================================================
  const [onboardStep, setOnboardStep] = useState(1);
  const [resForm, setResForm] = useState({
    name: '',
    city: 'Thane / Mumbai MMR',
    totalUnits: 240,
    secretaryName: '',
    secretaryPhone: '',
    solarKwp: 45,
    ledCoveragePct: 75,
    evBays: 6,
    solarWaterPct: 35,
    dgAmfSynced: true,
    dailyKld: 165,
    rwhPits: 4,
    stpReusePct: 65,
    iotSubMeterPct: 40,
    wetWasteKgDay: 180,
    owcOperational: true,
    segregationPct: 78,
    ewasteDrivesYr: 2,
    greenCoverPct: 26,
    nativeTrees: 95,
    fireNoc: true,
    liftLicense: true,
    structuralAudit: true,
    dgStackTest: true,
    maintenanceArLakhs: 3.8,
  });

  const [corpForm, setCorpForm] = useState({
    name: '',
    city: 'Mumbai / Thane MMR',
    assetType: 'IT / ITeS Business Park',
    glaSqFt: 520000,
    totalEmployees: 3800,
    tenantCount: 16,
    creLeadName: '',
    renewablePowerPct: 52,
    solarKwp: 340,
    bmsChillerCop: 5.5,
    evChargingBays: 30,
    ledOccupancyPct: 86,
    stpZldReusePct: 84,
    iotWaterSubMeterPct: 72,
    rwhRechargeWells: 12,
    wasteDiversionPct: 85,
    eWasteCertifiedPct: 96,
    indoorCo2Ppm: 590,
    biophiliaDaylightPct: 70,
    ergonomicWellnessRooms: true,
    fireNoc: true,
    mpcbConsent: true,
    poshLabourCompliant: true,
    brsrGriMapped: true,
  });

  const verticalEntities = useMemo(
    () => entities.filter((e) => e.vertical === vertical),
    [entities, vertical]
  );

  const activeEntity = useMemo(() => {
    if (verticalEntities.length === 0) return null;
    return verticalEntities.find((e) => e.id === selectedEntityId) || verticalEntities[0];
  }, [verticalEntities, selectedEntityId]);

  const entityPulses = useMemo(() => {
    if (!activeEntity) return [];
    return pulses.filter((p) => p.entityId === activeEntity.id);
  }, [pulses, activeEntity]);

  const previewMetrics = useMemo(
    () =>
      calculateUnifiedSlixMetrics(
        vertical === 'corporate'
          ? { ...corpForm, vertical: 'corporate' }
          : { ...resForm, vertical: 'residential' },
        []
      ),
    [vertical, corpForm, resForm]
  );

  const metrics = useMemo(
    () =>
      calculateUnifiedSlixMetrics(
        activeEntity ||
          (vertical === 'corporate'
            ? { ...corpForm, vertical: 'corporate' }
            : { ...resForm, vertical: 'residential' }),
        entityPulses
      ),
    [activeEntity, vertical, corpForm, resForm, entityPulses]
  );

  // ============================================================================
  // OPS & BOT, AI COPILOT, ROI SIMULATOR, PEOPLE PULSE & DUAL WALLETS
  // ============================================================================
  const [meetingTitle, setMeetingTitle] = useState(
    'Quarterly Sustainability, Governance & CapEx Review — FY 2026–27'
  );
  const [meetingNotes, setMeetingNotes] = useState(
    '1. Approved Solar + BMS/Sub-Metering upgrade package for Phase 1 deployment.\n2. Assigned 4h SLA work order to calibrate sensor & water pressure controls.\n3. Published verified ESG & Livability scorecard to all members/tenants.'
  );
  const [generatedMinutes, setGeneratedMinutes] = useState('');
  const [fulfilledItems, setFulfilledItems] = useState([]);

  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Help & Playbook Module State
  const [helpTopicTab, setHelpTopicTab] = useState('quickstart');
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const [simToggles, setSimToggles] = useState({
    opt1: true,
    opt2: true,
    opt3: false,
    opt4: true,
  });

  const [peopleStep, setPeopleStep] = useState(1);
  const [peopleForm, setPeopleForm] = useState({
    personName: '',
    unitOrTenant: '',
    s1: 8,
    s2: 8,
    s3: 8,
    s4: 7,
    s5: 9,
  });

  const [orgRedeemedCredits, setOrgRedeemedCredits] = useState(0);
  const [personalBonusMinted, setPersonalBonusMinted] = useState(0);
  const [personalRedeemedCredits, setPersonalRedeemedCredits] = useState(0);

  const [saasRates, setSaasRates] = useState({});
  const [partners, setPartners] = useState([
    {
      id: 'UPTR-01',
      name: 'SunGrid Renewables & PPA India',
      segment: 'Residential Solar & Corporate PPA',
      sla: 97,
      deployments: 21,
      gmvLakhs: 185.0,
      feePct: 5,
    },
    {
      id: 'UPTR-02',
      name: 'AquaSense LoRaWAN & ZLD Systems',
      segment: 'Ultrasonic Sub-Meters & STP ZLD',
      sla: 95,
      deployments: 18,
      gmvLakhs: 94.5,
      feePct: 7,
    },
    {
      id: 'UPTR-03',
      name: 'Enerlytics AI BMS & PureAir IAQ',
      segment: 'Chiller AI & WELL v2 Sensors',
      sla: 98,
      deployments: 12,
      gmvLakhs: 112.0,
      feePct: 6,
    },
  ]);

  const orgAvailableCredits = Math.max(0, metrics.monthlyMintedOrgCredits - orgRedeemedCredits);

  const personalCompositePct = Math.round(
    ((Number(peopleForm.s1) +
      Number(peopleForm.s2) +
      Number(peopleForm.s3) +
      Number(peopleForm.s4) +
      Number(peopleForm.s5)) /
      5) *
      10
  );

  const personalAvailableCredits = Math.max(
    0,
    Math.round(
      personalCompositePct * 2.3 +
        (metrics.totalScore / 10) * 1.15 +
        metrics.livabilityScore * 1.0 +
        personalBonusMinted -
        personalRedeemedCredits
    )
  );

  const simSummary = useMemo(() => {
    let addedPts = 0;
    let totalCapex = 0;
    let totalSave = 0;
    metrics.diagnostics.forEach((d) => {
      if (simToggles[d.simKey]) {
        addedPts += d.gainPts;
        totalCapex += d.capexLakhs;
        totalSave += d.annualSaveLakhs;
      }
    });
    const projectedScore = Math.min(1000, metrics.totalScore + addedPts);
    const projectedTier =
      projectedScore >= 820
        ? 'Platinum'
        : projectedScore >= 680
        ? 'Gold'
        : projectedScore >= 520
        ? 'Silver'
        : 'Bronze';
    const paybackMonths =
      totalSave > 0 ? Math.max(5, Math.round((totalCapex / totalSave) * 12)) : 0;
    return {
      addedPts,
      projectedScore,
      projectedTier,
      totalCapex: Number(totalCapex.toFixed(1)),
      totalSave: Number(totalSave.toFixed(2)),
      paybackMonths,
    };
  }, [metrics, simToggles]);

  // ============================================================================
  // ACTION HANDLERS
  // ============================================================================
  const handleSaveEntity = async (e) => {
    e.preventDefault();
    const isCorp = vertical === 'corporate';
    const baseData = isCorp ? corpForm : resForm;
    const cleanName =
      baseData.name.trim() ||
      (isCorp ? 'Horizon One IT & Business Park' : 'Emerald Greens Co-op Housing Society');
    const newId = `ent-${Date.now()}`;
    const record = {
      ...baseData,
      id: newId,
      vertical,
      name: cleanName,
      createdAtIso: new Date().toISOString(),
    };

    setEntities((prev) => [record, ...prev]);
    setSelectedEntityId(newId);
    setActiveTab('dashboard');
    triggerToast(`${cleanName} onboarded! Live ESG & ${isCorp ? 'Workplace EX' : 'Livability'} Index ready.`);

    if (db && firebaseConnected) {
      try {
        await setDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'slix_entities', newId),
          { ...record, createdAt: serverTimestamp() }
        );
      } catch (err) {
        console.warn('Saved locally:', err);
      }
    }
  };

  const handleFulfillMinutes = () => {
    const name = activeEntity?.name || (vertical === 'corporate' ? 'IT Park' : 'Housing Society');
    setGeneratedMinutes(
      `OFFICIAL MINUTES OF ${meetingTitle.toUpperCase()}\nEntity: ${name} (${
        vertical === 'corporate' ? 'Commercial / REIT Asset' : 'Co-op Housing Society'
      })\n\nRESOLUTIONS:\n${meetingNotes}\n\nDigitally Verified via SLIX.ai Governance Engine.`
    );
    setFulfilledItems(
      vertical === 'corporate'
        ? [
            { type: 'BMS Automation Directive', detail: 'Scheduled AI chiller set-point & pre-cooling curve' },
            { type: '4h SLA CAFM Work Order', detail: 'Assigned VAV CO2 damper & IAQ calibration ticket' },
            { type: 'SEBI BRSR Data Spine', detail: 'Published Principle 6 energy/water packet to tenant portals' },
          ]
        : [
            { type: 'Vendor Purchase Order', detail: 'Issued RFP/PO for Rooftop Solar & Ultrasonic Sub-Meters' },
            { type: '4h SLA Helpdesk Ticket', detail: 'Created STP pressure & lift sensor inspection ticket' },
            { type: 'CHS Statutory Register', detail: 'Updated Form-14 Nomination & Share Register entries' },
          ]
    );
    triggerToast('Minutes generated & 3 downstream workflows auto-executed!');
  };

  const handleRunAiCopilot = async (topic) => {
    setAiLoading(true);
    const name =
      activeEntity?.name ||
      (vertical === 'corporate' ? 'Horizon One IT Park' : 'Emerald Greens CHS');
    setTimeout(() => {
      setAiResponse(
        vertical === 'corporate'
          ? `SLIX AI BMS & BRSR Roadmap for ${name} (${topic}):\n\n` +
              `1. AI Chiller & VAV Set-Point Reset (Save ₹9.8L/yr | 8-Mo Payback): Shift peak chiller load to off-peak pre-cooling and modulate fresh-air dampers by CO2 sensors (<580 ppm).\n` +
              `2. Group Captive Green PPA (+65 ESG pts): Lift renewable power share to 85% to deliver auditable Scope 2 zero-carbon electricity for tenant SEBI BRSR Principle 6 filings.\n` +
              `3. Cooling Tower ZLD Reuse (Save ₹6.4L/yr): Route UF-treated STP water to chiller make-up to eliminate summer tanker costs.\n` +
              `4. Green Bond & Rental Premium: Reaching 820+ Platinum unlocks green-debt rate benefits and +6%–9% rental resilience.`
          : `SLIX AI RWA Strategic Roadmap for ${name} (${topic}):\n\n` +
              `1. Zero-CapEx Segregation & E-Waste Drive (+45 ESG pts): Enforce 100% wet/dry segregation via WhatsApp nudges to qualify for 5%–10% Municipal Property Tax rebates.\n` +
              `2. Apartment IoT Ultrasonic Sub-Metering (+50 ESG pts | 19-Mo Payback): Cut municipal tanker spend by 22%–28% within 60 days using Pay-As-You-Consume billing.\n` +
              `3. Rooftop Solar under MERC Net-Metering (+65 ESG pts | 34-Mo Payback): Offset common lift & water pump bills by 60%.\n` +
              `4. Platinum Multiplier (1.5x SLIX Credits): Passing these items in your AGM boosts monthly SLIX Credits for both Society Treasury and Residents.`
      );
      setAiLoading(false);
    }, 300);
  };

  const handlePeoplePulseSubmit = async (e) => {
    e.preventDefault();
    if (!activeEntity) return;
    const pId = `pls-${Date.now()}`;
    const record = {
      id: pId,
      entityId: activeEntity.id,
      vertical,
      personName:
        peopleForm.personName || (vertical === 'corporate' ? 'Corporate Employee' : 'Resident Member'),
      unitOrTenant:
        peopleForm.unitOrTenant || (vertical === 'corporate' ? 'Tower A — Floor 8' : 'A-1004'),
      compositeScore: personalCompositePct,
      createdAtIso: new Date().toISOString(),
    };
    setPulses((prev) => [record, ...prev]);
    setPersonalBonusMinted((prev) => prev + 150);
    triggerToast(`Pulse submitted! +150 personal SLIX Credits minted.`);

    if (db && firebaseConnected) {
      try {
        await setDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'slix_pulses', pId),
          { ...record, createdAt: serverTimestamp() }
        );
      } catch (err) {
        console.warn('Saved locally:', err);
      }
    }
  };

  const handleRoleSwitch = (newRoleKey) => {
    if (roleLocked) {
      const pin = window.prompt('Pilot Kiosk Lock Active. Enter 4-digit Pilot PIN (2026) to switch:');
      if (pin !== '2026') {
        triggerToast('Incorrect Pilot PIN.');
        return;
      }
      setRoleLocked(false);
    }
    setActiveRoleKey(newRoleKey);
    const rObj = roleMap[newRoleKey];
    if (rObj && !rObj.allowedTabs.includes(activeTab)) {
      setActiveTab(rObj.allowedTabs[0]);
    }
    triggerToast(`Switched active role to ${rObj.label}`);
  };

  const handleToggleKioskLock = () => {
    if (!roleLocked) {
      setRoleLocked(true);
      triggerToast('Kiosk Locked (PIN: 2026 to switch roles).');
    } else {
      const pin = window.prompt('Enter 4-digit Pilot PIN (2026) to unlock:');
      if (pin === '2026') {
        setRoleLocked(false);
        triggerToast('Kiosk Unlocked.');
      } else {
        triggerToast('Invalid PIN.');
      }
    }
  };

  // ============================================================================
  // NAVIGATION ITEMS & STEP-BY-STEP SLIX BOT COACH
  // ============================================================================
  const navItems = [
    { id: 'chooseType', label: t.chooseType, icon: ArrowLeftRight },
    { id: 'onboarding', label: t.onboarding, icon: Plus },
    { id: 'dashboard', label: t.dashboard, icon: BarChart3 },
    { id: 'opsBot', label: t.opsBot, icon: Bot },
    { id: 'aiAdvisor', label: t.aiAdvisor, icon: Sparkles },
    { id: 'simulator', label: t.simulator, icon: Calculator },
    { id: 'peoplePulse', label: t.peoplePulse, icon: HeartHandshake },
    { id: 'commandCenter', label: t.commandCenter, icon: ShieldCheck },
    { id: 'siriSaas', label: t.siriSaas, icon: Briefcase },
    { id: 'helpGuide', label: t.helpGuide, icon: HelpCircle },
  ].filter((item) => currentRole.allowedTabs.includes(item.id));

  const wizardCoach = useMemo(() => {
    const isCorp = vertical === 'corporate';
    if (activeTab === 'helpGuide') {
      return {
        badge: `${isCorp ? 'SLIX Workplace' : 'SLIX Communities'} • Interactive Help & Best-Practice Playbook`,
        headline: isCorp
          ? 'Learn how Asset Owners, CRE Heads, Tenant HRs & Employees maximize ROI on SLIX Workplace.'
          : 'Learn how Managing Committees, Facility Staff & Residents maximize rebates and scores on SLIX Communities.',
        tip: 'Switch between Role Guides, High-ROI Playbooks, and Scoring Formulas below—or click any "Try Now →" button to jump straight into that tool.',
        actions: [
          {
            label: isCorp ? 'Switch to Housing Society Guide' : 'Switch to Corporate Campus Guide',
            onClick: () => handleSelectVertical(isCorp ? 'residential' : 'corporate', false),
          },
          {
            label: 'Back to Live Dashboard →',
            onClick: () => setActiveTab(activeEntity ? 'dashboard' : 'onboarding'),
          },
        ],
      };
    }

    if (activeTab === 'chooseType') {
      return {
        badge: 'Wizard Step 1 of 9 • Choose Community / Premises Edition',
        headline:
          'Welcome! Are we onboarding a Gated Community / Housing Society or a Corporate Campus / IT Park?',
        tip: 'Choose your edition below—I will immediately tailor the onboarding form, ESG & Livability / Workplace EX scoring engine, roles, and SLIX Credits wallet.',
        actions: [
          {
            label: '1A. Gated Community / RWA →',
            onClick: () => handleSelectVertical('residential', true),
          },
          {
            label: '1B. Corporate Campus / IT Park →',
            onClick: () => handleSelectVertical('corporate', true),
          },
        ],
      };
    }

    if (activeTab === 'onboarding') {
      return {
        badge: `Wizard Step 2 of 9 • ${
          isCorp ? 'Corporate Campus' : 'Gated Community'
        } Baseline (Sub-Step ${onboardStep}/4)`,
        headline: isCorp
          ? 'Enter your IT Park / Corporate Building GLA, BMS Chiller COP, renewable power %, and IAQ.'
          : 'Enter your Housing Society flat count, rooftop solar kWp, STP water reuse %, and OWC status.',
        tip: 'Watch the live 1,000-point ESG & Livability preview update on the right as you adjust each parameter.',
        actions: [
          {
            label: isCorp ? 'Auto-Fill Demo IT Park' : 'Auto-Fill Demo Society',
            onClick: () => {
              if (isCorp) {
                setCorpForm((p) => ({
                  ...p,
                  name: 'Horizon One IT & Business Park',
                  city: 'Thane / Powai MMR',
                  creLeadName: 'Vikramaditya Rao',
                }));
              } else {
                setResForm((p) => ({
                  ...p,
                  name: 'Emerald Greens Co-op Housing Society',
                  city: 'Thane / Mumbai MMR',
                  secretaryName: 'Rajesh Kulkarni',
                }));
              }
              triggerToast('SLIX Bot filled pilot demo baseline!');
            },
          },
          ...(onboardStep < 4
            ? [{ label: `Next Sub-Step (${onboardStep + 1}/4) →`, onClick: () => setOnboardStep((s) => s + 1) }]
            : [
                {
                  label: 'Save & Launch Dashboard →',
                  onClick: (e) => handleSaveEntity(e || { preventDefault: () => {} }),
                },
              ]),
        ],
      };
    }

    if (activeTab === 'dashboard') {
      return {
        badge: `Wizard Step 3 of 9 • Live ${isCorp ? 'Asset ESG & Workplace EX' : 'Society ESG & Livability'} Index`,
        headline: activeEntity
          ? `${activeEntity.name} is rated ${metrics.tier} (${metrics.totalScore}/1000 ESG, ${metrics.livabilityScore}/100 ${
              isCorp ? 'Workplace EX' : 'Livability'
            }).`
          : 'Review your live ESG & Livability scorecard.',
        tip: `You have ${orgAvailableCredits.toLocaleString(
          'en-IN'
        )} Organization SLIX Credits minted. Next, run governance/minutes automation or inspect AI score boosters.`,
        actions: [
          {
            label: isCorp ? 'BRSR / Green Bond Certificate' : 'Board ESG Certificate',
            onClick: () => setShowCertModal(true),
          },
          { label: 'Next: Ops & SLIX Bot →', onClick: () => setActiveTab('opsBot') },
        ],
      };
    }

    if (activeTab === 'opsBot') {
      return {
        badge: 'Wizard Step 4 of 9 • Governance Minutes & AI Workflow Fulfillment',
        headline: isCorp
          ? 'Auto-fulfill Owner–Tenant ESG review minutes into BMS directives & tenant BRSR packets.'
          : 'Auto-fulfill General Body (AGM/EGM) minutes into Vendor POs, SLA tickets & CHS Registers.',
        tip: 'Click Auto-Fulfill Minutes to see how SLIX Bot turns meeting resolutions into tracked operational tasks.',
        actions: [
          { label: 'Auto-Fulfill Minutes Now', onClick: handleFulfillMinutes },
          { label: 'Next: AI Optimizer →', onClick: () => setActiveTab('aiAdvisor') },
        ],
      };
    }

    if (activeTab === 'aiAdvisor') {
      return {
        badge: 'Wizard Step 5 of 9 • AI Parameter & BMS Optimization Copilot',
        headline: 'I diagnosed every parameter to find your highest-ROI ESG & comfort upgrades.',
        tip: 'Generate an executive roadmap or push any recommendation straight into the ROI Planner.',
        actions: [
          {
            label: 'Generate AI 90-Day Roadmap',
            onClick: () => handleRunAiCopilot('90-Day Platinum & ROI Plan'),
          },
          { label: 'Next: ROI Planner →', onClick: () => setActiveTab('simulator') },
        ],
      };
    }

    if (activeTab === 'simulator') {
      return {
        badge: 'Wizard Step 6 of 9 • CapEx & Payback ROI Planner',
        headline: `Selected upgrades add +${simSummary.addedPts} ESG pts (${simSummary.projectedTier}) with a ${simSummary.paybackMonths}-month payback.`,
        tip: 'Toggle interventions to model total CapEx vs. annual utility savings.',
        actions: [{ label: 'Next: People Pulse & Wallet →', onClick: () => setActiveTab('peoplePulse') }],
      };
    }

    if (activeTab === 'peoplePulse') {
      return {
        badge: `Wizard Step 7 of 9 • ${isCorp ? 'Employee Experience (EX)' : 'Resident Green'} Pulse`,
        headline: isCorp
          ? 'Capture employee thermal/IAQ comfort, belonging & vigor to mint personal SLIX Credits.'
          : 'Complete the 2-minute household green self-check to mint personal SLIX Credits & maintenance rebates.',
        tip: `Personal Wallet Balance: ${personalAvailableCredits.toLocaleString('en-IN')} SLIX Credits.`,
        actions: [{ label: 'Next: Rollout Hub →', onClick: () => setActiveTab('commandCenter') }],
      };
    }

    return {
      badge: 'Wizard Step 8–9 • Pilot Rollout & Siri Ventures MIS',
      headline: 'Share your WhatsApp/Teams pulse invite or review unified SaaS & Partner MIS.',
      tip: 'Both residential societies and corporate campuses feed into Siri Ventures’ unified MIS console.',
      actions: [
        { label: 'Switch Edition (Step 1)', onClick: () => setActiveTab('chooseType') },
      ],
    };
  }, [
    vertical,
    activeTab,
    onboardStep,
    activeEntity,
    metrics,
    orgAvailableCredits,
    simSummary,
    personalAvailableCredits,
  ]);

  const handleGuideChatSubmit = (e) => {
    e.preventDefault();
    if (!guideChatInput.trim()) return;
    const msg = guideChatInput.trim();
    setGuideChatHistory((prev) => [...prev, { id: `u-${Date.now()}`, sender: 'user', text: msg }]);
    setGuideChatInput('');

    const lower = msg.toLowerCase();
    let reply = `${wizardCoach.headline} ${wizardCoach.tip}`;
    if (lower.includes('corporate') || lower.includes('office') || lower.includes('it park')) {
      handleSelectVertical('corporate', true);
      reply =
        'Switched to SLIX Workplace (Corporate Campuses, IT Parks & REITs) and opened Step 2 onboarding!';
    } else if (lower.includes('society') || lower.includes('residential') || lower.includes('rwa')) {
      handleSelectVertical('residential', true);
      reply =
        'Switched to SLIX Communities (Gated Societies & RWAs) and opened Step 2 onboarding!';
    } else if (lower.includes('next') || lower.includes('step')) {
      const idx = navItems.findIndex((n) => n.id === activeTab);
      const next = navItems[(idx + 1) % navItems.length];
      if (next) {
        setActiveTab(next.id);
        reply = `Moved forward to ${next.label}.`;
      }
    }

    setTimeout(() => {
      setGuideChatHistory((prev) => [...prev, { id: `b-${Date.now()}`, sender: 'bot', text: reply }]);
    }, 200);
  };

  // ============================================================================
  // EDITION-SPECIFIC HELP & PLAYBOOK DATA
  // ============================================================================
  const editionHelpContent = useMemo(() => {
    if (vertical === 'corporate') {
      return {
        title: 'SLIX Workplace — Enterprise & IT Park Usage Guide',
        subtitle:
          'How Asset Owners, CRE Heads, Tenant Corporate HRs, and Employees turn building telemetry and workplace comfort into investor-grade ESG & BRSR performance.',
        roleGuides: [
          {
            role: 'Asset Owner / REIT Portfolio Head',
            goal: 'Drive green-bond readiness, premium rentals (+6%–9%), and portfolio benchmarking.',
            steps: [
              'Onboard each commercial tower/park in Step 2 with GLA sq.ft., renewable PPA %, and chiller COP.',
              'Review the 1,000-point Asset ESG Score & EPI (kWh/sq.ft) on the Dashboard and export the BRSR / Green Bond Certificate.',
              'Use the ROI Planner (Step 6) to approve high-payback BMS & ZLD upgrades with <15 month payback.',
            ],
            ctaLabel: 'Open Campus Dashboard →',
            ctaTab: 'dashboard',
          },
          {
            role: 'CRE & Facility Management Head',
            goal: 'Cut HVAC/water OpEx by 12%–18% and automate governance minutes.',
            steps: [
              'Use AI Optimizer (Step 5) to apply chilled-water set-point resets and CO2 demand-controlled ventilation.',
              'Log Owner–Tenant ESG Committee notes in Ops & Bot (Step 4) to auto-dispatch CAFM work orders.',
              'Maintain 4/4 statutory NOCs (Fire, MPCB Consent, PoSH/Labour Welfare) for 200/200 governance points.',
            ],
            ctaLabel: 'Open AI BMS Optimizer →',
            ctaTab: 'aiAdvisor',
          },
          {
            role: 'Tenant Corporate HR / Sustainability Lead',
            goal: 'Capture Scope 2 leased-space data for SEBI BRSR Principle 6 & boost employee retention.',
            steps: [
              'Share the Employee EX Pulse link (Step 8) on Slack/Teams to achieve ≥70% occupant participation.',
              'Track thermal comfort, indoor CO2 (<600 ppm), belonging, and vigor across departments.',
              'Download tenant-ready BRSR Principle 3 & 6 data packets without manual spreadsheet chasing.',
            ],
            ctaLabel: 'Open Rollout Hub →',
            ctaTab: 'commandCenter',
          },
          {
            role: 'Corporate Employee / Occupant',
            goal: 'Voice workplace comfort feedback and earn personal SLIX Credits for green habits.',
            steps: [
              'Complete the 2-minute Workplace EX Pulse in Step 7 (thermal comfort, air quality, EV/metro commute).',
              'Instantly mint +150 personal SLIX Credits linked to your campus performance multiplier.',
              'Redeem credits in your Employee Wallet for EV fast-charging, metro passes, or organic cafeteria vouchers.',
            ],
            ctaLabel: 'Open Employee Pulse →',
            ctaTab: 'peoplePulse',
          },
        ],
        powerPlays: [
          {
            tag: 'Fastest OpEx Payback (8 Months)',
            title: 'AI Chiller Set-Point & Staggered Pre-Cooling',
            impact: 'Saves ₹8–12 Lakhs/yr + adds up to +50 ESG pts',
            howTo:
              'In Step 5 (AI Optimizer), select "AI Chiller Plant & VAV Set-Point Reset" and push it to the ROI Planner to model peak kVA demand reduction.',
            tab: 'aiAdvisor',
          },
          {
            tag: 'SEBI BRSR & GRESB Ready',
            title: 'One-Click Audit Packet & Green Bond Assurance',
            impact: 'Cuts ESG reporting effort by 70%',
            howTo:
              'Ensure all 4 statutory checkboxes are verified in Step 2, then click "BRSR / Green Bond Certificate" on Step 3 Dashboard to print/export.',
            tab: 'dashboard',
          },
          {
            tag: '1.5x Platinum Credits Multiplier',
            title: 'Unlock Platinum Tier (820+ Score) for Maximum Credits',
            impact: '+50% bonus SLIX Credits minted monthly',
            howTo:
              'Combine Group Captive Green PPA (>75%) + Cooling Tower ZLD reuse (>90%) + CO2 <600 ppm to cross 820 points.',
            tab: 'simulator',
          },
        ],
        faqs: [
          {
            q: 'How are Corporate & Employee SLIX Credits calculated?',
            a: 'Credits combine 60% Asset ESG Score + 40% Workplace EX Index, multiplied by your Tier Multiplier (1.0x Bronze up to 1.5x Platinum) and GLA area scale. Corporate credits offset BRSR/WELL audits, while Employee credits redeem for EV charging and wellness perks.',
          },
          {
            q: 'Can we share a locked screen with employees during a lobby pulse drive?',
            a: 'Yes! Switch the header role dropdown to "Employee" and click the Lock icon (PIN: 2026) so occupants only access the Employee Pulse and read-only campus scorecard.',
          },
          {
            q: 'How does SLIX help with SEBI BRSR and REIT disclosures?',
            a: 'SLIX structures energy intensity (EPI), Scope 2 renewables, ZLD water recycling, certified e-waste diversion, and PoSH/Fire compliance into an auditable asset spine ready for BRSR Principles 3 & 6.',
          },
        ],
      };
    }

    return {
      title: 'SLIX Communities — Housing Society & RWA Usage Guide',
      subtitle:
        'How Managing Committees, Hon. Secretaries, Facility Managers, and Residents turn everyday society operations into utility savings, Municipal tax rebates, and higher property values.',
      roleGuides: [
        {
          role: 'Hon. Secretary & Managing Committee (MC)',
          goal: 'Cut common electricity & water tanker bills while automating AGM/EGM governance.',
          steps: [
            'Onboard your society in Step 2 using your latest MSEDCL bill, solar kWp, STP reuse %, and OWC status.',
            'Present the AGM ROI Planner (Step 6) to get General Body approval on solar or ultrasonic water sub-meters.',
            'Paste raw AGM/MC meeting notes in Ops & Bot (Step 4) to auto-generate formal CHS Minutes, POs, and SLA tickets.',
          ],
          ctaLabel: 'Open Society Onboarding →',
          ctaTab: 'onboarding',
        },
        {
          role: 'Facility / Estate Manager',
          goal: 'Track preventive maintenance, STP/OWC uptime, and vendor SLAs without paperwork.',
          steps: [
            'Monitor daily pillar health on the Dashboard (Step 3) and inspect AI parameter gaps in Step 5.',
            'Track 4-hour SLA tickets for water pumps, lifts, and STP dosing generated from AGM resolutions.',
            'Keep Fire NOC, PWD Lift License, Structural Audit, and DG Stack tests updated to avoid compliance penalties.',
          ],
          ctaLabel: 'Open Ops & SLIX Bot →',
          ctaTab: 'opsBot',
        },
        {
          role: 'Flat Owner / Resident Member',
          goal: 'Lower next month’s maintenance bill and benchmark your flat against society peers.',
          steps: [
            'Complete the 2-minute Household Green Pulse in Step 7 (segregation, aerators, BLDC/AC habits).',
            'Earn +150 instant SLIX Credits plus monthly credits tied to your society’s overall ESG & Livability tier.',
            'Redeem personal SLIX Credits directly for ₹250 Maintenance Bill Rebates or organic/EV partner freebies.',
          ],
          ctaLabel: 'Open Resident Pulse →',
          ctaTab: 'peoplePulse',
        },
        {
          role: 'Siri Ventures Pilot Coordinator (Super Admin)',
          goal: 'Run smooth 30-day society pilots and manage per-flat SaaS & partner MIS.',
          steps: [
            'Use the WhatsApp-first invite template in Rollout Hub (Step 8) to onboard residents with zero app fatigue.',
            'Use the Kiosk PIN Lock (PIN: 2026) when handing a tablet to Residents or Facility staff during demos.',
            'Track per-flat SaaS billing, 18% GST invoices, and Solar/IoT partner commissions in Partners & MIS (Step 9).',
          ],
          ctaLabel: 'Open Rollout Hub →',
          ctaTab: 'commandCenter',
        },
      ],
      powerPlays: [
        {
          tag: '5%–10% Municipal Property Tax Rebate',
          title: 'Activate OWC Composting + STP Reuse + Rainwater Harvesting',
          impact: 'Saves ₹3–8 Lakhs/yr in Property Tax & Tankers',
          howTo:
            'Mark OWC Operational and STP Reuse >75% in Step 2, then generate your Board ESG Certificate in Step 3 as supporting proof for Municipal rebates.',
          tab: 'dashboard',
        },
        {
          tag: '22%–28% Water Bill Reduction',
          title: 'Deploy Apartment LoRaWAN Ultrasonic Water Sub-Meters',
          impact: '+50 ESG pts • 19-Month CapEx Payback',
          howTo:
            'Open Step 5 (AI Optimizer) or Step 6 (ROI Planner) and toggle "Apartment IoT Ultrasonic Sub-Metering" to see flat-wise CapEx vs. tanker savings.',
          tab: 'simulator',
        },
        {
          tag: '70%+ Resident Participation in 48 Hours',
          title: 'WhatsApp Group Challenge + Maintenance Bill Rebates',
          impact: 'Boosts Livability Social Score & Mints Bonus Credits',
          howTo:
            'Copy the pre-formatted WhatsApp invite from Step 8 (Rollout Hub) and post it in your society’s official announcement group.',
          tab: 'commandCenter',
        },
      ],
      faqs: [
        {
          q: 'How do Residents earn maintenance bill discounts from SLIX.ai?',
          a: 'When residents complete their 2-minute Household Green Pulse (Step 7), they earn personal SLIX Credits calculated from 50% Household Score + 30% Society ESG + 20% Livability. Residents can redeem 250 credits directly for a ₹250 Maintenance Bill Rebate.',
        },
        {
          q: 'How does the AGM Minutes AI Fulfillment work?',
          a: 'In Step 4 (Ops & Bot), paste your rough AGM or Managing Committee notes and click "Generate Minutes & Auto-Fulfill Resolutions". SLIX formats official CHS Minutes and automatically creates Vendor Purchase Orders, 4h SLA Helpdesk Tickets, and Statutory Register logs.',
        },
        {
          q: 'Can we run both Gated Communities and IT Parks under slixai.in?',
          a: 'Yes! Use Step 1 (Select Edition) or the top header toggle to switch seamlessly between SLIX Communities and SLIX Workplace—both roll up into Siri Ventures’ unified MIS console.',
        },
      ],
    };
  }, [vertical]);

  // ============================================================================
  // RENDER
  // ============================================================================
  const isCorp = vertical === 'corporate';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-[#113D2E] font-sans">
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#113D2E] text-white border border-[#C58B2A] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-[#C58B2A] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER & UNIFIED EDITION / ROLE SWITCHERS */}
      <header className="sticky top-0 z-40 bg-[#113D2E] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SlixBrandLogo
              subtitle={isCorp ? 'Corporate & REIT ESG OS' : 'Gated Communities & RWA OS'}
            />

            {/* Quick Edition Pill */}
            <div className="hidden sm:flex items-center bg-white/10 rounded-xl p-0.5 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => handleSelectVertical('residential', false)}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer ${
                  !isCorp ? 'bg-emerald-400 text-[#113D2E]' : 'text-white/80'
                }`}
              >
                <Home className="w-3 h-3" />
                <span>Communities</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectVertical('corporate', false)}
                className={`px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer ${
                  isCorp ? 'bg-[#C58B2A] text-[#113D2E]' : 'text-white/80'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>Corporate / IT Parks</span>
              </button>
            </div>

            {verticalEntities.length > 0 && (
              <select
                value={activeEntity?.id || ''}
                onChange={(e) => setSelectedEntityId(e.target.value)}
                className="bg-white/10 border border-white/20 text-white text-xs font-bold rounded-xl px-3 py-2 max-w-[180px] sm:max-w-[230px]"
              >
                {verticalEntities.map((ent) => (
                  <option key={ent.id} value={ent.id} className="text-[#113D2E]">
                    {ent.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Language Switcher */}
            <div className="flex items-center bg-white/10 rounded-xl p-0.5 text-[11px] font-bold">
              {[
                { code: 'en', label: 'EN' },
                { code: 'mr', label: 'मराठी' },
                { code: 'hi', label: 'हिंदी' },
              ].map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`px-2 py-1 rounded-lg cursor-pointer ${
                    lang === l.code ? 'bg-[#C58B2A] text-[#113D2E]' : 'text-white/80'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            {/* Active Wallet Pill */}
            <div className="hidden md:flex items-center gap-1.5 bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl text-xs">
              <Coins className="w-3.5 h-3.5 text-[#C58B2A]" />
              <span className="text-white/75">
                {activeRoleKey === 'resident' || activeRoleKey === 'employee'
                  ? 'Personal Credits:'
                  : isCorp
                  ? 'Corporate Credits:'
                  : 'Society Credits:'}
              </span>
              <span className="font-mono font-extrabold text-[#C58B2A]">
                {(activeRoleKey === 'resident' || activeRoleKey === 'employee'
                  ? personalAvailableCredits
                  : orgAvailableCredits
                ).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Role-Based Access Switcher + Kiosk Lock */}
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-xl px-2 py-1">
              <select
                value={activeRoleKey}
                onChange={(e) => handleRoleSwitch(e.target.value)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
              >
                {Object.values(roleMap).map((r) => (
                  <option key={r.key} value={r.key} className="text-[#113D2E]">
                    {r.shortLabel}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleToggleKioskLock}
                title={roleLocked ? 'Unlock Kiosk (PIN: 2026)' : 'Lock Role for Demo'}
                className={`p-1 rounded-lg cursor-pointer ${
                  roleLocked ? 'bg-rose-500 text-white' : 'bg-white/15 text-emerald-300'
                }`}
              >
                {roleLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Quick Help & Playbook Button */}
            <button
              type="button"
              onClick={() => setActiveTab('helpGuide')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all ${
                activeTab === 'helpGuide'
                  ? 'bg-[#C58B2A] text-[#113D2E]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#C58B2A]" />
              <span className="hidden sm:inline">{t.helpGuide}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((p) => !p)}
              className="lg:hidden p-2 rounded-xl bg-white/10 text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Guided Wizard Stepper */}
        <nav className="hidden lg:block bg-[#0C2D22] border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-1.5 py-2.5 overflow-x-auto">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const currentIdx = navItems.findIndex((n) => n.id === activeTab);
              const isCompleted = idx < currentIdx;
              return (
                <React.Fragment key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-[#C58B2A] text-[#113D2E] shadow-xs'
                        : isCompleted
                        ? 'bg-emerald-900/70 text-emerald-200 border border-emerald-500/30'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                  {idx < navItems.length - 1 && (
                    <span className="text-white/25 text-xs select-none">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </nav>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0C2D22] px-4 py-3 space-y-1.5 border-t border-white/10">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                    activeTab === item.id
                      ? 'bg-[#C58B2A] text-[#113D2E]'
                      : 'text-white/85 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* PINNED COMMAND CENTRE KPI STRIP */}
      {activeEntity && (
        <div className="bg-white border-b border-[#113D2E]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#C58B2A] shrink-0" />
              <div>
                <div className="text-[10px] text-[#113D2E]/60 font-bold uppercase">
                  {isCorp ? 'Campus ESG Index' : 'SLIX ESG Score'}
                </div>
                <div className="font-mono font-extrabold text-sm">
                  {metrics.totalScore}/1000 <span className="text-[#C58B2A]">({metrics.tier})</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] text-[#113D2E]/60 font-bold uppercase">
                  {isCorp ? 'Workplace EX Index' : 'Livability Index'}
                </div>
                <div className="font-mono font-extrabold text-sm">{metrics.livabilityScore}/100</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <div className="text-[10px] text-[#113D2E]/60 font-bold uppercase">
                  {isCorp ? 'Corporate Credits' : 'Society Credits'}
                </div>
                <div className="font-mono font-extrabold text-sm text-emerald-800">
                  {orgAvailableCredits.toLocaleString('en-IN')} CR
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <div className="text-[10px] text-[#113D2E]/60 font-bold uppercase">
                  {metrics.secondaryMetricLabel}
                </div>
                <div className="font-mono font-extrabold text-sm">
                  {metrics.secondaryMetricValue}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <div className="text-[10px] text-[#113D2E]/60 font-bold uppercase">
                  Compliance Spine
                </div>
                <div className="font-bold text-xs text-emerald-800">
                  {isCorp ? 'SEBI BRSR / GRI Ready' : 'CHS NOCs Verified'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* PERSISTENT CONVERSATIONAL SLIX BOT GUIDE BANNER */}
        <section className="bg-gradient-to-r from-[#113D2E] via-[#154A38] to-[#113D2E] text-white rounded-3xl p-4 sm:p-5 border border-[#C58B2A]/50 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#C58B2A] text-[#113D2E] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Bot className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[#C58B2A] text-[10px] font-extrabold uppercase tracking-wider">
                    {wizardCoach.badge}
                  </span>
                  <span className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> SLIX Bot Guiding You
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                  “{wizardCoach.headline}”
                </h2>
                <p className="text-xs text-white/80 leading-relaxed">{wizardCoach.tip}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {wizardCoach.actions.map((act, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={act.onClick}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                    idx === wizardCoach.actions.length - 1
                      ? 'bg-[#C58B2A] text-[#113D2E] hover:brightness-105 shadow-xs'
                      : 'bg-white/12 text-white border border-white/20 hover:bg-white/20'
                  }`}
                >
                  {act.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setBotDrawerOpen((p) => !p)}
                className="px-3 py-2 rounded-xl bg-emerald-950/90 border border-emerald-400/40 text-emerald-200 text-xs font-bold cursor-pointer"
              >
                {botDrawerOpen ? 'Hide Chat' : 'Ask Bot'}
              </button>
            </div>
          </div>

          {botDrawerOpen && (
            <div className="mt-4 pt-3.5 border-t border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
              <div className="lg:col-span-7 flex flex-col gap-1.5 max-h-24 overflow-y-auto pr-1">
                {guideChatHistory.slice(-2).map((msg) => (
                  <div
                    key={msg.id}
                    className={`text-xs px-3 py-1.5 rounded-xl ${
                      msg.sender === 'user'
                        ? 'bg-[#C58B2A]/20 text-[#F7F6F2] self-end border border-[#C58B2A]/40'
                        : 'bg-white/10 text-white/95 self-start'
                    }`}
                  >
                    <strong className="text-[#C58B2A] mr-1.5">
                      {msg.sender === 'user' ? 'You:' : 'SLIX Bot:'}
                    </strong>
                    <span>{msg.text}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleGuideChatSubmit} className="lg:col-span-5 flex gap-2">
                <input
                  type="text"
                  placeholder="Type 'Housing Society', 'IT Park', or ask SLIX Bot..."
                  value={guideChatInput}
                  onChange={(e) => setGuideChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/55"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[#C58B2A] text-[#113D2E] text-xs font-extrabold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask</span>
                </button>
              </form>
            </div>
          )}
        </section>

        {/* STEP 1: INTERACTIVE EDITION SELECTOR ("WHAT TYPE OF COMMUNITY ARE YOU ONBOARDING?") */}
        {activeTab === 'chooseType' && (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C58B2A]">
                Step 1 • Choose Your Community / Premises Profile
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#113D2E]">
                What type of community or premises are we setting up today?
              </h1>
              <p className="text-xs sm:text-sm text-[#113D2E]/75">
                SLIX Bot configures the exact scoring parameters, stakeholder roles, compliance spine, and SLIX Credits wallet for your selection.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('helpGuide')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#113D2E]/15 text-xs font-bold text-[#113D2E] hover:border-[#C58B2A] cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#C58B2A]" />
                  <span>New to SLIX.ai? Read Edition Usage Guide &amp; ROI Playbook →</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {/* Edition 1A: Gated Communities & Housing Societies */}
              <div
                onClick={() => handleSelectVertical('residential', true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectVertical('residential', true);
                }}
                className={`group bg-white rounded-3xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between gap-6 shadow-xs hover:shadow-xl ${
                  !isCorp
                    ? 'border-emerald-600 ring-4 ring-emerald-500/10'
                    : 'border-[#113D2E]/12 hover:border-emerald-600'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                      <Home className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-extrabold">
                      RWAs • Co-op Housing Societies
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#113D2E]">
                    Gated Community / Housing Society
                  </h2>
                  <p className="text-xs sm:text-sm text-[#113D2E]/75 leading-relaxed">
                    Tailored for Managing Committees, Hon. Secretaries, Facility Managers &amp; Residents. Covers Solar, STP Water Reuse, OWC Composting, AGM Minutes AI Fulfillment, Maintenance Rebates &amp; Resident SLIX Credits.
                  </p>
                  <ul className="space-y-1.5 text-xs text-[#113D2E]/85">
                    <li>• 1,000-Point IGBC-Aligned Society ESG + 6-Dimension Livability Index</li>
                    <li>• AGM / EGM Minutes AI Fulfillment + CHS Statutory Registers</li>
                    <li>• Resident Green Pulse, Maintenance Rebates &amp; Dual SLIX Wallets</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectVertical('residential', true);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#113D2E] group-hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Start Gated Community Wizard</span>
                  <ArrowRight className="w-4 h-4 text-[#C58B2A]" />
                </button>
              </div>

              {/* Edition 1B: Corporate Campuses, IT Parks & Commercial REITs */}
              <div
                onClick={() => handleSelectVertical('corporate', true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleSelectVertical('corporate', true);
                }}
                className={`group bg-[#113D2E] text-white rounded-3xl p-6 sm:p-8 border-2 transition-all cursor-pointer flex flex-col justify-between gap-6 shadow-xs hover:shadow-xl ${
                  isCorp
                    ? 'border-[#C58B2A] ring-4 ring-[#C58B2A]/20'
                    : 'border-transparent hover:border-[#C58B2A]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#C58B2A] text-[#113D2E] flex items-center justify-center">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/15 text-[#C58B2A] text-[11px] font-extrabold">
                      IT Parks • Offices • REITs
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Corporate Campus / IT Park / Commercial
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    Tailored for Asset Owners, REITs, CRE Heads, Tenant Corporate HRs &amp; Employees. Links BMS Chiller optimization, IAQ/CO2, Employee Experience (EX) &amp; SEBI BRSR / GRI Assurance.
                  </p>
                  <ul className="space-y-1.5 text-xs text-white/90">
                    <li>• Asset-Level ESG + 6-Dimension Workplace Livability &amp; EX Index</li>
                    <li>• AI BMS Chiller &amp; VAV Optimization + Green Bond ROI Planner</li>
                    <li>• SEBI BRSR / GRI Audit Spine + Corporate &amp; Employee SLIX Wallets</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectVertical('corporate', true);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#C58B2A] group-hover:brightness-105 text-[#113D2E] font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Start Corporate / IT Park Wizard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: OPS & SLIX BOT (MINUTES AI FULFILLMENT) */}
        {activeTab === 'opsBot' && activeEntity && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#113D2E]/12 space-y-4">
              <h3 className="text-lg font-bold">
                {isCorp
                  ? 'Owner–Tenant ESG Review Minutes & BMS Fulfillment'
                  : 'General Body (AGM / EGM) Minutes & AI Fulfillment'}
              </h3>
              <div>
                <label className="block font-bold mb-1">Meeting Title</label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#113D2E]/20 bg-[#F7F6F2]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Resolutions &amp; Action Notes</label>
                <textarea
                  rows={5}
                  value={meetingNotes}
                  onChange={(e) => setMeetingNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#113D2E]/20 bg-[#F7F6F2]"
                />
              </div>
              <button
                type="button"
                onClick={handleFulfillMinutes}
                className="w-full py-3 rounded-xl bg-[#C58B2A] text-[#113D2E] font-extrabold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Minutes &amp; Auto-Fulfill Resolutions</span>
              </button>
            </div>

            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#113D2E]/12 space-y-4">
              <h3 className="text-lg font-bold">Verified Minutes &amp; Auto-Dispatched Workflows</h3>
              {generatedMinutes ? (
                <>
                  <pre className="p-3.5 rounded-2xl bg-[#F7F6F2] whitespace-pre-wrap font-mono text-[11px]">
                    {generatedMinutes}
                  </pre>
                  <div className="space-y-2">
                    {fulfilledItems.map((it, i) => (
                      <div key={i} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                        <div className="font-bold text-[#113D2E]">{it.type}</div>
                        <div className="text-[#113D2E]/75">{it.detail}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="p-8 rounded-2xl bg-[#F7F6F2] text-center text-[#113D2E]/65">
                  Click “Generate Minutes &amp; Auto-Fulfill Resolutions” to convert notes into formal minutes and live tasks.
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: AI OPTIMIZER */}
        {activeTab === 'aiAdvisor' && activeEntity && (
          <div className="space-y-6 text-xs">
            <div className="bg-[#113D2E] text-white rounded-3xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">
                  AI Optimization Roadmap for {activeEntity.name}
                </h2>
                <button
                  type="button"
                  onClick={() => handleRunAiCopilot('90-Day Platinum & ROI Plan')}
                  className="px-4 py-2 rounded-xl bg-[#C58B2A] text-[#113D2E] font-extrabold cursor-pointer"
                >
                  Generate Executive AI Roadmap
                </button>
              </div>
              {aiLoading && <div className="text-emerald-300 font-bold">Generating AI plan...</div>}
              {aiResponse && (
                <pre className="p-4 rounded-2xl bg-white/10 whitespace-pre-wrap font-sans leading-relaxed">
                  {aiResponse}
                </pre>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.diagnostics.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-3xl p-5 border border-[#113D2E]/12 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F7F6F2] font-bold">
                        {d.pillar}
                      </span>
                      <span className="font-mono font-extrabold text-emerald-700">
                        +{d.gainPts} ESG pts
                      </span>
                    </div>
                    <h3 className="text-base font-bold">{d.parameter}</h3>
                    <p className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
                      <strong>AI Suggestion:</strong> {d.aiAction}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#113D2E]/10">
                    <span className="font-mono">
                      CapEx: <strong>₹{d.capexLakhs}L</strong> • Save:{' '}
                      <strong>₹{d.annualSaveLakhs}L/yr</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSimToggles((p) => ({ ...p, [d.simKey]: true }));
                        setActiveTab('simulator');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#113D2E] text-white font-bold cursor-pointer"
                    >
                      Simulate ROI →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: ROI PLANNER */}
        {activeTab === 'simulator' && activeEntity && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#113D2E]/12 space-y-3">
              <h2 className="text-xl font-bold">Interactive CapEx &amp; Payback ROI Simulator</h2>
              {metrics.diagnostics.map((d) => (
                <label
                  key={d.id}
                  className="p-3.5 rounded-2xl bg-[#F7F6F2] flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={!!simToggles[d.simKey]}
                      onChange={(e) =>
                        setSimToggles((p) => ({ ...p, [d.simKey]: e.target.checked }))
                      }
                    />
                    <div>
                      <div className="font-bold text-sm">{d.parameter}</div>
                      <div className="text-[#113D2E]/70">
                        CapEx: ₹{d.capexLakhs}L • Save: ₹{d.annualSaveLakhs}L/yr
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-800">+{d.gainPts} pts</span>
                </label>
              ))}
            </div>

            <div className="lg:col-span-5 bg-[#113D2E] text-white rounded-3xl p-6 space-y-4 h-fit">
              <div className="text-xs font-bold uppercase text-[#C58B2A]">Projected Impact</div>
              <div className="text-5xl font-mono font-extrabold text-[#C58B2A]">
                {simSummary.projectedScore}
                <span className="text-sm text-emerald-300 ml-2">/1000 ({simSummary.projectedTier})</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white/10">
                  <div className="text-white/70">Total CapEx</div>
                  <div className="font-mono font-extrabold text-lg">₹{simSummary.totalCapex}L</div>
                </div>
                <div className="p-3 rounded-2xl bg-white/10">
                  <div className="text-white/70">Annual Savings</div>
                  <div className="font-mono font-extrabold text-lg text-emerald-300">
                    ₹{simSummary.totalSave}L/yr
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/10">
                  <div className="text-white/70">Payback Period</div>
                  <div className="font-mono font-extrabold text-lg text-[#C58B2A]">
                    {simSummary.paybackMonths} Months
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/10">
                  <div className="text-white/70">Score Uplift</div>
                  <div className="font-mono font-extrabold text-lg">+{simSummary.addedPts} pts</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: PEOPLE PULSE (RESIDENT OR EMPLOYEE) + PERSONAL WALLET */}
        {activeTab === 'peoplePulse' && activeEntity && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
            <form
              onSubmit={handlePeoplePulseSubmit}
              className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#113D2E]/12 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {isCorp ? 'Employee Experience (EX) Pulse' : 'Resident Green Pulse'}
                </h2>
                <div className="flex gap-1">
                  {[1, 2].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setPeopleStep(st)}
                      className={`w-7 h-7 rounded-lg font-bold cursor-pointer ${
                        peopleStep === st ? 'bg-[#113D2E] text-white' : 'bg-[#F7F6F2]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {peopleStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-bold mb-1">
                      {isCorp ? 'Employee Name *' : 'Resident Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isCorp ? 'e.g., Siddharth Menon' : 'e.g., Ananya Joshi'}
                      value={peopleForm.personName}
                      onChange={(e) =>
                        setPeopleForm({ ...peopleForm, personName: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-[#113D2E]/20 bg-[#F7F6F2]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">
                      {isCorp ? 'Tenant Company & Floor *' : 'Flat No. *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isCorp ? 'e.g., FinEdge Global (Floor 8)' : 'e.g., A-1004'}
                      value={peopleForm.unitOrTenant}
                      onChange={(e) =>
                        setPeopleForm({ ...peopleForm, unitOrTenant: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-[#113D2E]/20 bg-[#F7F6F2]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPeopleStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-[#113D2E] text-white font-bold cursor-pointer"
                  >
                    Next: Rate Habits &amp; Comfort →
                  </button>
                </div>
              )}

              {peopleStep === 2 && (
                <div className="space-y-2.5">
                  {(isCorp
                    ? [
                        { key: 's1', label: 'Thermal Comfort & Fresh Indoor Air (IAQ)' },
                        { key: 's2', label: 'Workplace Belonging & Psychological Safety' },
                        { key: 's3', label: 'Daily Vigor, Daylight & Wellness Rooms' },
                        { key: 's4', label: 'EV / Metro / Carpool Commute Habits' },
                      ]
                    : [
                        { key: 's1', label: 'Wet / Dry / E-Waste Source Segregation' },
                        { key: 's2', label: 'Water Aerators & Conservation Habits' },
                        { key: 's3', label: 'BLDC Fans, 5-Star Appliances & AC 24°C' },
                        { key: 's4', label: 'EV / Carpool & Campus Walkability' },
                      ]
                  ).map((sl) => (
                    <div key={sl.key} className="p-3 rounded-2xl bg-[#F7F6F2]">
                      <div className="flex justify-between font-bold mb-1">
                        <span>{sl.label}</span>
                        <span className="font-mono text-emerald-800">{peopleForm[sl.key]}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={peopleForm[sl.key]}
                        onChange={(e) =>
                          setPeopleForm({ ...peopleForm, [sl.key]: Number(e.target.value) })
                        }
                        className="w-full accent-[#113D2E]"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#C58B2A] text-[#113D2E] font-extrabold cursor-pointer"
                  >
                    Submit Pulse &amp; Mint +150 SLIX Credits
                  </button>
                </div>
              )}
            </form>

            {/* Personal Wallet + Peer Comparison */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#113D2E] text-white rounded-3xl p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-base">
                    {isCorp ? 'Employee Personal SLIX Wallet' : 'Resident Personal SLIX Wallet'}
                  </h3>
                  <span className="text-xs font-mono text-[#C58B2A]">
                    Score: {personalCompositePct}/100
                  </span>
                </div>
                <div className="text-4xl font-mono font-extrabold text-[#C58B2A]">
                  {personalAvailableCredits.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-white/75 font-sans">Credits</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (personalAvailableCredits < 250) return triggerToast('Need 250 CR');
                    setPersonalRedeemedCredits((p) => p + 250);
                    triggerToast(
                      isCorp
                        ? 'Redeemed ₹300 EV Charging / Cafeteria Voucher!'
                        : 'Redeemed ₹250 Maintenance Bill Rebate!'
                    );
                  }}
                  className="w-full p-2.5 rounded-xl bg-white/10 hover:bg-white/15 flex justify-between cursor-pointer"
                >
                  <span>
                    {isCorp
                      ? 'Redeem ₹300 EV Charging / Organic Cafe Pass'
                      : 'Redeem ₹250 Next-Month Maintenance Bill Rebate'}
                  </span>
                  <span className="font-mono font-bold text-[#C58B2A]">250 CR</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#113D2E]/12 space-y-2">
                <h3 className="font-bold text-base">
                  Your Score vs. Overall {isCorp ? 'Campus' : 'Society'}
                </h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-2xl bg-[#F7F6F2]">
                    <div className="text-[10px] font-bold text-[#113D2E]/60">Your Score</div>
                    <div className="font-mono font-extrabold text-lg text-emerald-800">
                      {personalCompositePct}/100
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F7F6F2]">
                    <div className="text-[10px] font-bold text-[#113D2E]/60">Overall ESG</div>
                    <div className="font-mono font-extrabold text-lg">
                      {metrics.totalScore}/1000
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F7F6F2]">
                    <div className="text-[10px] font-bold text-[#113D2E]/60">
                      {isCorp ? 'Campus EX' : 'Livability'}
                    </div>
                    <div className="font-mono font-extrabold text-lg text-[#C58B2A]">
                      {metrics.livabilityScore}/100
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: ROLLOUT HUB */}
        {activeTab === 'commandCenter' && (
          <div className="bg-white rounded-3xl p-6 border border-[#113D2E]/12 space-y-4 text-xs">
            <h2 className="text-xl font-bold">
              {isCorp
                ? 'Enterprise Employee Pulse & Tenant BRSR Rollout'
                : 'WhatsApp-First Resident Pilot Invite'}
            </h2>
            <div className="p-4 rounded-2xl bg-[#F7F6F2] font-mono text-[11px] leading-relaxed">
              🌿 *Namaste from {activeEntity?.name || 'SLIX.ai'}!*
              <br />
              Complete your 2-min {isCorp ? 'Workplace Wellbeing & ESG Pulse' : 'Household Green Check'} on https://slixai.in to earn SLIX Credits &amp; rewards!
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(
                  `Complete your 2-min SLIX.ai Pulse for ${
                    activeEntity?.name || 'our community'
                  } on https://slixai.in to earn SLIX Credits!`
                );
                triggerToast('Invite message copied to clipboard!');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#113D2E] text-white font-bold flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#C58B2A]" />
              <span>Copy Shareable Invite Link</span>
            </button>
          </div>
        )}

        {/* STEP 9: SIRI VENTURES UNIFIED SUPER-ADMIN MIS */}
        {activeTab === 'siriSaas' && (
          <div className="space-y-6 text-xs">
            <div className="bg-white rounded-3xl p-6 border border-[#113D2E]/12 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold">
                  Siri Ventures Unified Portfolio Billing MIS (Communities + Corporate)
                </h2>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold">
                  Total Onboarded Properties: {entities.length}
                </span>
              </div>
              {entities.length === 0 ? (
                <p className="text-[#113D2E]/70">
                  Onboard a Gated Community or Corporate Campus in Step 2 to generate live SaaS billing &amp; GST invoices.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {entities.map((ent) => {
                    const corp = ent.vertical === 'corporate';
                    const count = corp
                      ? Number(ent.totalEmployees) || 1000
                      : Number(ent.totalUnits) || 200;
                    const rate = saasRates[ent.id] || (corp ? 45 : 35);
                    const totalWithGst = Math.round(count * rate * 1.18);
                    return (
                      <div
                        key={ent.id}
                        className="p-4 rounded-2xl bg-[#F7F6F2] flex flex-wrap items-center justify-between gap-3"
                      >
                        <div>
                          <div className="font-bold text-sm flex items-center gap-2">
                            <span>{ent.name}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                corp
                                  ? 'bg-[#113D2E] text-[#C58B2A]'
                                  : 'bg-emerald-100 text-emerald-900'
                              }`}
                            >
                              {corp ? 'Corporate / IT Park' : 'Housing Society'}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#113D2E]/65">
                            {count} {corp ? 'Employees' : 'Flats'} × ₹{rate}/mo + 18% GST
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={rate}
                            onChange={(e) =>
                              setSaasRates((p) => ({ ...p, [ent.id]: Number(e.target.value) }))
                            }
                            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#113D2E]/20 font-bold"
                          >
                            <option value={25}>Core (₹25)</option>
                            <option value={35}>Growth ESG (₹35)</option>
                            <option value={45}>Enterprise BRSR (₹45)</option>
                          </select>
                          <div className="font-mono font-extrabold text-sm">
                            ₹{totalWithGst.toLocaleString('en-IN')}/mo
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#113D2E]/12 space-y-3">
              <h2 className="text-xl font-bold">Empanelled ESG &amp; BMS Solution Partners MIS</h2>
              {partners.map((ptr) => (
                <div
                  key={ptr.id}
                  className="p-4 rounded-2xl bg-[#F7F6F2] flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-sm">
                      {ptr.name} <span className="text-[#C58B2A]">({ptr.segment})</span>
                    </div>
                    <div className="text-[11px] text-[#113D2E]/65">
                      SLA: {ptr.sla}% • Active Deployments: {ptr.deployments}
                    </div>
                  </div>
                  <div className="text-right font-mono">
                  <div className="font-extrabold">GMV: ₹{ptr.gmvLakhs} Lakhs</div>
                  <div className="text-emerald-800 font-bold">
                    Siri Fee ({ptr.feePct}%): ₹{((ptr.gmvLakhs * ptr.feePct) / 100).toFixed(2)}L
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HELP & PLAYBOOK MODULE (EDITION-SPECIFIC USAGE GUIDE & ROI PLAYBOOK) */}
      {activeTab === 'helpGuide' && (
        <div className="space-y-6 text-xs">
          {/* Header Banner with Edition Switcher */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#113D2E]/12 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 font-extrabold text-[11px]">
                <BookOpen className="w-3.5 h-3.5 text-[#C58B2A]" />
                <span>
                  {isCorp ? 'SLIX Workplace Edition Guide' : 'SLIX Communities Edition Guide'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#113D2E]">
                {editionHelpContent.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#113D2E]/75 leading-relaxed">
                {editionHelpContent.subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#113D2E]/60">
                View Guide For Edition:
              </div>
              <div className="flex items-center bg-[#F7F6F2] p-1 rounded-2xl border border-[#113D2E]/15">
                <button
                  type="button"
                  onClick={() => handleSelectVertical('residential', false)}
                  className={`px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 cursor-pointer ${
                    !isCorp ? 'bg-[#113D2E] text-white' : 'text-[#113D2E]/75'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Gated Communities</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectVertical('corporate', false)}
                  className={`px-3.5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 cursor-pointer ${
                    isCorp ? 'bg-[#113D2E] text-[#C58B2A]' : 'text-[#113D2E]/75'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Corporate / IT Parks</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sub-Navigation Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'quickstart', label: '1. Role-by-Role Quick-Start Guide', icon: CheckCircle2 },
              { id: 'playbooks', label: '2. How to Make the Most Out of SLIX (ROI Playbook)', icon: Lightbulb },
              { id: 'scoring', label: '3. Scoring & SLIX Credits Formula', icon: Calculator },
              { id: 'faq', label: '4. Pilot FAQs & Support', icon: PhoneCall },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setHelpTopicTab(st.id)}
                  className={`px-4 py-2.5 rounded-xl font-extrabold flex items-center gap-2 cursor-pointer ${
                    helpTopicTab === st.id
                      ? 'bg-[#113D2E] text-white shadow-xs'
                      : 'bg-white border border-[#113D2E]/15 text-[#113D2E]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#C58B2A]" />
                  <span>{st.label}</span>
                </button>
              );
            })}
          </div>

          {/* SUB-TAB 1: ROLE-BY-ROLE QUICK-START GUIDE */}
          {helpTopicTab === 'quickstart' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {editionHelpContent.roleGuides.map((rg, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-[#113D2E]/12 flex flex-col justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-[#F7F6F2] font-extrabold text-[#113D2E]">
                        Persona #{idx + 1}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700">
                        3-Step Workflow
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-[#113D2E]">{rg.role}</h3>
                    <p className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 font-semibold text-[#113D2E]">
                      Primary Goal: {rg.goal}
                    </p>
                    <ol className="space-y-2 pl-4 list-decimal text-[#113D2E]/85 leading-relaxed">
                      {rg.steps.map((stepTxt, sIdx) => (
                        <li key={sIdx}>{stepTxt}</li>
                      ))}
                    </ol>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab(rg.ctaTab)}
                    className="w-full py-2.5 rounded-xl bg-[#113D2E] text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{rg.ctaLabel}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SUB-TAB 2: HIGH-ROI PLAYBOOKS ("HOW TO MAKE THE MOST OUT OF SLIX") */}
          {helpTopicTab === 'playbooks' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {editionHelpContent.powerPlays.map((pp, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-[#113D2E]/12 flex flex-col justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#C58B2A]/20 text-[#113D2E] font-extrabold text-[11px]">
                      {pp.tag}
                    </span>
                    <h3 className="text-lg font-extrabold text-[#113D2E]">{pp.title}</h3>
                    <div className="p-3 rounded-2xl bg-[#113D2E] text-white font-mono font-bold text-[11px]">
                      Impact: <span className="text-[#C58B2A]">{pp.impact}</span>
                    </div>
                    <p className="text-[#113D2E]/80 leading-relaxed">
                      <strong>How to Execute in SLIX:</strong> {pp.howTo}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab(pp.tab)}
                    className="w-full py-2.5 rounded-xl bg-[#C58B2A] text-[#113D2E] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Launch This Workflow</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* SUB-TAB 3: SCORING & SLIX CREDITS FORMULA TRANSPARENCY */}
          {helpTopicTab === 'scoring' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#113D2E]/12 space-y-4">
                <h3 className="text-lg font-extrabold">
                  1,000-Point ESG &amp; 100-Point {isCorp ? 'Workplace EX' : 'Livability'} Weights
                </h3>
                <div className="space-y-2.5">
                  {metrics.pillars.map((p) => (
                    <div key={p.id} className="p-3 rounded-2xl bg-[#F7F6F2] flex justify-between items-center">
                      <span className="font-bold">{p.name}</span>
                      <span className="font-mono font-extrabold text-[#113D2E]">
                        Max {p.max} pts ({Math.round((p.max / 1000) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center">
                  {[
                    { tier: 'Bronze', range: '0–519', mult: '1.0x CR' },
                    { tier: 'Silver', range: '520–679', mult: '1.15x CR' },
                    { tier: 'Gold', range: '680–819', mult: '1.3x CR' },
                    { tier: 'Platinum', range: '820–1000', mult: '1.5x CR' },
                  ].map((tRow) => (
                    <div key={tRow.tier} className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                      <div className="font-extrabold text-[#113D2E]">{tRow.tier}</div>
                      <div className="font-mono text-[10px] text-[#113D2E]/70">{tRow.range} pts</div>
                      <div className="font-mono font-bold text-emerald-800 mt-0.5">{tRow.mult}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6 bg-[#113D2E] text-white rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-extrabold text-[#C58B2A]">
                  Dual SLIX Credits Minting &amp; Redemption Rules
                </h3>
                <div className="p-4 rounded-2xl bg-white/10 space-y-1.5">
                  <div className="font-bold text-sm">
                    1. {isCorp ? 'Corporate / Campus Treasury Wallet' : 'Society Treasury Wallet'}
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    Minted monthly using <strong>[(ESG/10 × 60%) + ({isCorp ? 'Workplace EX' : 'Livability'} × 40%)] × Tier Multiplier × Scale</strong>. Redeemable for SLIX SaaS renewals, MPCB/STP lab audits, or SEBI BRSR assurance offsets.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white/10 space-y-1.5">
                  <div className="font-bold text-sm">
                    2. {isCorp ? 'Employee Personal Wallet' : 'Resident Personal Wallet'}
                  </div>
                  <p className="text-white/80 leading-relaxed">
                    Minted whenever an occupant submits a 2-minute Pulse audit (50% Individual Score + 30% {isCorp ? 'Campus' : 'Society'} ESG + 20% {isCorp ? 'EX' : 'Livability'}). Redeemable for{' '}
                    {isCorp
                      ? 'EV charging, metro passes, or organic cafeteria vouchers.'
                      : '₹250 monthly maintenance bill rebates or organic/EV freebies.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 4: FREQUENTLY ASKED QUESTIONS & LIVE PILOT SUPPORT */}
          {helpTopicTab === 'faq' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-3">
                {editionHelpContent.faqs.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#113D2E]/12 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(openFaqIdx === idx ? -1 : idx)}
                      className="w-full p-4 text-left font-extrabold text-sm flex items-center justify-between cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <span className="text-[#C58B2A] font-mono">
                        {openFaqIdx === idx ? '−' : '+'}
                      </span>
                    </button>
                    {openFaqIdx === idx && (
                      <div className="px-4 pb-4 text-[#113D2E]/80 leading-relaxed border-t border-[#113D2E]/10 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="lg:col-span-4 bg-[#113D2E] text-white rounded-3xl p-6 space-y-4 h-fit">
                <h3 className="text-lg font-extrabold text-[#C58B2A]">
                  Dedicated Pilot Concierge
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Need assistance running your Managing Committee AGM demo, IT Park BMS baseline, or resident WhatsApp rollout?
                </p>
                <div className="p-3.5 rounded-2xl bg-white/10 font-mono space-y-1">
                  <div>WhatsApp / Call: +91 85918 36100</div>
                  <div>Portal: https://slixai.in</div>
                  <div>Kiosk Unlock PIN: 2026</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBotDrawerOpen(true);
                    triggerToast('SLIX Bot Chat opened at top of screen!');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#C58B2A] text-[#113D2E] font-extrabold cursor-pointer"
                >
                  Ask SLIX Bot Live ↑
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </main>

      {/* ASSURANCE CERTIFICATE MODAL */}
      {showCertModal && activeEntity && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 border-4 border-[#113D2E] space-y-5 text-center shadow-2xl">
            <div className="flex justify-center">
              <SlixBrandLogo
                subtitle={isCorp ? 'SEBI BRSR & Asset ESG Assurance' : 'RWA Sustainability Benchmark'}
              />
            </div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-[#C58B2A]">
              {isCorp
                ? 'SEBI BRSR, GRI & Green Bond Asset Assurance Certificate'
                : 'Official RWA Sustainability & Livability Certificate'}
            </div>
            <h2 className="text-2xl font-bold text-[#113D2E]">{activeEntity.name}</h2>
            <div className="grid grid-cols-3 gap-3 py-3 border-y border-[#113D2E]/15">
              <div>
                <div className="text-[10px] uppercase font-bold text-[#113D2E]/60">ESG Score</div>
                <div className="text-2xl font-mono font-extrabold">
                  {metrics.totalScore}/1000
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#113D2E]/60">Tier</div>
                <div className="text-2xl font-extrabold text-[#C58B2A]">{metrics.tier}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#113D2E]/60">
                  {isCorp ? 'Workplace EX' : 'Livability'}
                </div>
                <div className="text-2xl font-mono font-extrabold text-emerald-800">
                  {metrics.livabilityScore}/100
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#113D2E] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Export PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 rounded-xl border border-[#113D2E]/20 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#113D2E]/10 py-4 px-4 sm:px-6 text-xs text-[#113D2E]/70">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <SlixBrandLogo compact />
            <span>SLIX.ai (slixai.in) — Unified ESG &amp; Livability Operating System</span>
          </div>
          <div>Pilot Support: +91 85918 36100 • Siri Ventures</div>
        </div>
      </footer>
    </div>
  );
}