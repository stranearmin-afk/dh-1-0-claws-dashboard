'use client';

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const COLORS = {
  bg: "#0F1117",
  card: "#1A1D27",
  cardHover: "#22262F",
  accent: "#3B82F6",
  accentGlow: "#3B82F620",
  green: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
  pink: "#EC4899",
  text: "#E2E8F0",
  textMuted: "#94A3B8",
  textDim: "#64748B",
  border: "#2D3348",
};

const CHART_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899", "#F97316"];

const branchenData = [
  { name: "Logistiker (KEP)", value: 256, pct: 51.7 },
  { name: "Dienstleister (Sonst.)", value: 96, pct: 19.4 },
  { name: "Handwerker (Sonst.)", value: 69, pct: 13.9 },
  { name: "Bauunternehmer", value: 23, pct: 4.6 },
  { name: "Elektriker", value: 17, pct: 3.4 },
  { name: "Solar-Montage", value: 17, pct: 3.4 },
  { name: "Umzug", value: 5, pct: 1.0 },
  { name: "Sonstige", value: 12, pct: 2.4 },
];

const fahrzeugData = [
  { name: "L4H3 (3,5t)", value: 300, color: "#3B82F6" },
  { name: "L2H1 (2,8t)", value: 187, color: "#10B981" },
  { name: "L3H2 (2,8t)", value: 133, color: "#F59E0B" },
  { name: "L2H2 (2,8t)", value: 107, color: "#8B5CF6" },
  { name: "L1H1 (2,8t)", value: 71, color: "#06B6D4" },
  { name: "E-Fahrzeug", value: 112, color: "#EC4899" },
];

const laufzeitData = [
  { name: "<24 Mon.", value: 48 },
  { name: "24 Mon.", value: 145 },
  { name: "36 Mon.", value: 120 },
  { name: "48 Mon.", value: 89 },
];

const laufleistungData = [
  { name: "1.000 km", value: 23 },
  { name: "2.000 km", value: 46 },
  { name: "3.000 km", value: 140 },
  { name: "4.000 km", value: 154 },
  { name: "5.000 km", value: 44 },
  { name: ">5.000 km", value: 127 },
];

const fuhrparkData = [
  { name: "1-5", value: 217 },
  { name: "6-10", value: 71 },
  { name: "11-15", value: 28 },
  { name: "16-25", value: 30 },
  { name: "26-50", value: 21 },
  { name: "51-100", value: 6 },
  { name: ">100", value: 8 },
];

const leadQuellenData = [
  { name: "Webseite", value: 295 },
  { name: "Facebook", value: 69 },
  { name: "Telefon", value: 54 },
  { name: "Instagram", value: 43 },
  { name: "E-Mail", value: 34 },
  { name: "Meta Ads", value: 34 },
  { name: "Superchat", value: 27 },
];

const kontaktData = [
  { name: "1", value: 235 },
  { name: "2", value: 101 },
  { name: "3", value: 102 },
  { name: "4", value: 86 },
  { name: "5", value: 50 },
  { name: "6", value: 37 },
  { name: "7", value: 24 },
  { name: "8+", value: 81 },
];

const monthlyData = [
  { month: "Jan 23", leads: 5 }, { month: "Feb", leads: 4 }, { month: "Mär", leads: 6 },
  { month: "Apr", leads: 9 }, { month: "Mai", leads: 10 }, { month: "Jun", leads: 8 },
  { month: "Jul 23", leads: 52 }, { month: "Aug", leads: 22 }, { month: "Sep", leads: 34 },
  { month: "Okt", leads: 16 }, { month: "Nov", leads: 32 }, { month: "Dez", leads: 26 },
  { month: "Jan 24", leads: 24 }, { month: "Feb", leads: 28 }, { month: "Mär", leads: 36 },
  { month: "Apr", leads: 27 }, { month: "Mai", leads: 16 }, { month: "Jun", leads: 14 },
  { month: "Jul 24", leads: 13 }, { month: "Aug", leads: 15 }, { month: "Sep", leads: 17 },
  { month: "Okt", leads: 25 }, { month: "Nov", leads: 25 }, { month: "Dez", leads: 7 },
  { month: "Jan 25", leads: 14 }, { month: "Feb", leads: 12 }, { month: "Mär", leads: 15 },
  { month: "Apr", leads: 19 }, { month: "Mai", leads: 13 }, { month: "Jun", leads: 12 },
  { month: "Jul 25", leads: 10 }, { month: "Aug", leads: 12 }, { month: "Sep", leads: 7 },
  { month: "Okt", leads: 17 }, { month: "Nov", leads: 10 }, { month: "Dez", leads: 9 },
];

const idealKundeRadar = [
  { subject: "KEP-Branche", A: 95 },
  { subject: "Fuhrpark 1-10", A: 85 },
  { subject: "L4H3 Transporter", A: 80 },
  { subject: "LZ 24-36 Mon.", A: 75 },
  { subject: "3-4k km/Mon.", A: 78 },
  { subject: "Kaufoption Ja", A: 90 },
  { subject: "Webseite-Lead", A: 70 },
  { subject: "Hot Lead", A: 88 },
];

const Card = ({ children, className = "", span = 1 }: { children: React.ReactNode; className?: string; span?: number }) => (
  <div
    className={className}
    style={{
      background: COLORS.card,
      borderRadius: 16,
      border: `1px solid ${COLORS.border}`,
      padding: "24px",
      gridColumn: span > 1 ? `span ${span}` : undefined,
    }}
  >
    {children}
  </div>
);

const StatBox = ({ label, value, sub, color = COLORS.accent }: { label: string; value: string; sub?: string; color?: string }) => (
  <div style={{ textAlign: "center", padding: "16px 8px" }}>
    <div style={{ fontSize: 36, fontWeight: 800, color, lineHeight: 1.1, fontFamily: "'DM Sans', sans-serif" }}>{value}</div>
    <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 6, fontWeight: 500 }}>{label}</div>
    {sub && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children, icon }: { children: React.ReactNode; icon?: string }) => (
  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
    {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
    {children}
  </div>
);

const tabs = [
  { id: "overview", label: "Übersicht", icon: "📊" },
  { id: "ideal", label: "Ideal-Kunde", icon: "🎯" },
  { id: "marketing", label: "Marketing", icon: "📣" },
  { id: "insights", label: "Insights & Tipps", icon: "💡" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1E2130", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: COLORS.text }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color || COLORS.accent }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function FleetlinkAnalyse() {
  const [activeTab, setActiveTab] = useState("overview");

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/auth/login';
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'DM Sans', -apple-system, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ padding: "32px 32px 0", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚛</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>FleetLink Lead-Analyse</h1>
            <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }}>716 Leads mit unterschriebenen Langzeitverträgen · 592 Kunden · seit 2021</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              border: `1px solid ${COLORS.border}`,
              background: "transparent",
              color: COLORS.textMuted,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.red; e.currentTarget.style.color = COLORS.red; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textMuted; }}
          >
            Abmelden
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "20px 32px 0", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 4, background: COLORS.card, borderRadius: 12, padding: 4, width: "fit-content" }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "10px 20px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
                background: activeTab === t.id ? COLORS.accent : "transparent",
                color: activeTab === t.id ? "#fff" : COLORS.textMuted,
                transition: "all 0.2s",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "24px 32px 48px", maxWidth: 1200, margin: "0 auto" }}>

        {activeTab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, marginBottom: 24 }}>
              <Card><StatBox label="Gesamt-Leads" value="716" sub="unterschrieben" /></Card>
              <Card><StatBox label="Unique Kunden" value="592" sub="Unternehmen" color={COLORS.green} /></Card>
              <Card><StatBox label="Hot Leads" value="53%" sub="379 von 716" color={COLORS.amber} /></Card>
              <Card><StatBox label="Ø Kontakte" value="3,2" sub="bis Abschluss" color={COLORS.purple} /></Card>
              <Card><StatBox label="Top-Branche" value="52%" sub="KEP-Logistik" color={COLORS.cyan} /></Card>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionTitle icon="🏢">Branchen-Verteilung</SectionTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={branchenData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={140} tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill={COLORS.accent} radius={[0, 6, 6, 0]} name="Leads" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <SectionTitle icon="🚐">Fahrzeugtypen</SectionTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={fahrzeugData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} innerRadius={50} paddingAngle={3} label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} style={{ fontSize: 10 }}>
                      {fahrzeugData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionTitle icon="📅">Laufzeiten</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={laufzeitData}>
                    <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
                    <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill={COLORS.green} radius={[6, 6, 0, 0]} name="Leads" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <SectionTitle icon="🛣️">Laufleistung / Monat</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={laufleistungData}>
                    <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
                    <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill={COLORS.amber} radius={[6, 6, 0, 0]} name="Leads" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <SectionTitle icon="🏗️">Fuhrparkgröße</SectionTitle>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={fuhrparkData}>
                    <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
                    <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill={COLORS.purple} radius={[6, 6, 0, 0]} name="Leads" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <SectionTitle icon="📈">Abschlüsse über Zeit (monatlich)</SectionTitle>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="month" tick={{ fill: COLORS.textDim, fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="leads" stroke={COLORS.accent} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.accent }} name="Abschlüsse" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}

        {activeTab === "ideal" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionTitle icon="🎯">Idealkunden-Profil (Radar)</SectionTitle>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={idealKundeRadar} cx="50%" cy="50%" outerRadius={110}>
                    <PolarGrid stroke={COLORS.border} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
                    <PolarRadiusAxis tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="A" stroke={COLORS.accent} fill={COLORS.accent} fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <SectionTitle icon="👤">Der typische FleetLink-Kunde</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Branche", val: "KEP / Kurier-Express-Paket Logistik", pct: "52%", color: COLORS.accent },
                    { label: "Fuhrpark", val: "1-10 Fahrzeuge aktuell", pct: "76%", color: COLORS.green },
                    { label: "Fahrzeug", val: "Großer Transporter L4H3 (3,5t)", pct: "42%", color: COLORS.amber },
                    { label: "Laufzeit", val: "24-36 Monate", pct: "66%", color: COLORS.purple },
                    { label: "Km/Monat", val: "3.000-4.000 km", pct: "55%", color: COLORS.cyan },
                    { label: "Kaufoption", val: "Ja, gewünscht", pct: "76%", color: COLORS.pink },
                    { label: "Quelle", val: "Webseite + Social", pct: "62%", color: COLORS.amber },
                    { label: "Status", val: "Hot Lead bei Erstgespräch", pct: "53%", color: COLORS.red },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 80, fontSize: 11, color: COLORS.textDim, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>{item.label}</div>
                      <div style={{ flex: 1, position: "relative", height: 32, background: COLORS.bg, borderRadius: 8, overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: item.pct, background: item.color + "30", borderRadius: 8 }} />
                        <div style={{ position: "relative", padding: "6px 12px", fontSize: 13, fontWeight: 500, color: COLORS.text }}>{item.val}</div>
                      </div>
                      <div style={{ width: 40, fontSize: 13, fontWeight: 700, color: item.color, textAlign: "right" }}>{item.pct}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <SectionTitle icon="🔍">Erkennungsmerkmale für eingehende Leads</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.green, marginBottom: 10 }}>✅ Starke Abschluss-Signale</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      "KEP/Logistik-Branche + L4H3 Anfrage",
                      "Kaufoption wird explizit gewünscht",
                      "Fuhrpark bereits vorhanden (1-10 Fzg.)",
                      "3.000-4.000 km/Monat Bedarf",
                      "Laufzeit 24-36 Monate nachgefragt",
                      "Kommt über Webseite (organisch)",
                      "Gewerbe bestätigt + zeitnaher Bedarf",
                      "Budget 800-1.200€ bestätigt",
                    ].map((s, i) => (
                      <div key={i} style={{ padding: "8px 12px", background: COLORS.green + "10", borderRadius: 8, fontSize: 13, borderLeft: `3px solid ${COLORS.green}` }}>{s}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.amber, marginBottom: 10 }}>⚡ Lead-Scoring Empfehlung</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { pts: "+30", text: "KEP/Paketdienst/Kurier Branche" },
                      { pts: "+20", text: "Kaufoption = Ja" },
                      { pts: "+15", text: "L4H3 Transporter gewünscht" },
                      { pts: "+15", text: "Fuhrpark 1-10 Fahrzeuge" },
                      { pts: "+10", text: "3.000-4.000 km/Monat" },
                      { pts: "+10", text: "LZ 24-36 Monate" },
                      { pts: "+10", text: "Webseite als Quelle" },
                      { pts: "+5", text: "Erreichbarkeit morgens bestätigt" },
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: COLORS.amber + "10", borderRadius: 8, fontSize: 13 }}>
                        <span style={{ fontWeight: 800, color: COLORS.amber, fontFamily: "monospace", width: 36 }}>{item.pts}</span>
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === "marketing" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionTitle icon="📡">Lead-Quellen</SectionTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={leadQuellenData} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <XAxis type="number" tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={100} tick={{ fill: COLORS.textMuted, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill={COLORS.cyan} radius={[0, 6, 6, 0]} name="Abschlüsse" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <SectionTitle icon="📞">Kontakte bis Abschluss</SectionTitle>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={kontaktData}>
                    <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 11 }} label={{ value: "Kontaktanzahl", position: "insideBottom", offset: -5, fill: COLORS.textDim, fontSize: 11 }} />
                    <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill={COLORS.pink} radius={[6, 6, 0, 0]} name="Leads" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card>
              <SectionTitle icon="📣">Briefing für die Marketingabteilung</SectionTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent, marginBottom: 12 }}>🎯 Zielgruppe #1: KEP-Logistiker</h3>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMuted }}>
                    <p style={{ margin: "0 0 8px" }}>52% aller Abschlüsse kommen von Kurier-, Express- und Paketdiensten. Diese Kunden brauchen große Transporter (L4H3), fahren viele Kilometer (3.000-5.000+/Monat) und binden sich gerne 24-36 Monate.</p>
                    <p style={{ margin: "0 0 8px" }}><strong style={{ color: COLORS.text }}>Targeting:</strong> Facebook + Instagram Ads auf KEP-Branche, Subunternehmer von Amazon, DHL, Hermes, DPD, GLS. Keywords: „Transporter Langzeitmiete", „Sprinter mieten Gewerbe", „Kurier Fahrzeug mieten".</p>
                    <p style={{ margin: "0 0 8px" }}><strong style={{ color: COLORS.text }}>USP betonen:</strong> Kaufoption (76% wünschen das), All-inclusive Paket, flexible KM-Kontingente, kein Kapital-Einsatz nötig.</p>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.green, marginBottom: 12, marginTop: 20 }}>🎯 Zielgruppe #2: Handwerker & Dienstleister</h3>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMuted }}>
                    <p style={{ margin: "0 0 8px" }}>33% kommen aus Handwerk und Dienstleistung. Kleinerer Fuhrpark (1-5 Fzg.), bevorzugen L2H1 oder L3H2, weniger km/Monat.</p>
                    <p style={{ margin: "0 0 8px" }}><strong style={{ color: COLORS.text }}>Targeting:</strong> Lokales Google Ads, Handwerker-Portale, IHK-Netzwerke. Besonders Solar-Montage und Elektriker wachsen.</p>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.amber, marginBottom: 12 }}>📊 Kanal-Strategie</h3>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMuted }}>
                    <p style={{ margin: "0 0 8px" }}><strong style={{ color: COLORS.text }}>Webseite (41% der Abschlüsse):</strong> Top-Performer. SEO weiter ausbauen, Conversion Rate optimieren. Lead-Formular vereinfachen.</p>
                    <p style={{ margin: "0 0 8px" }}><strong style={{ color: COLORS.text }}>Facebook/Instagram (16%):</strong> Zweitstärkster Kanal. Visuell starke Ads mit echten Fahrzeugen. Retargeting über Meta Pixel.</p>
                    <p style={{ margin: "0 0 8px" }}><strong style={{ color: COLORS.text }}>Google Ads (PPC):</strong> Nur 15 Abschlüsse trackbar via UTM — hier entweder UTM-Tracking fixen oder Budget umschichten.</p>
                    <p style={{ margin: "0 0 8px" }}><strong style={{ color: COLORS.text }}>Telefon (8%):</strong> Überraschend stark. „Rückruf in 60 Sek" als Feature bewerben.</p>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: COLORS.purple, marginBottom: 12, marginTop: 20 }}>⚡ Quick Wins</h3>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: COLORS.textMuted }}>
                    <p style={{ margin: "0 0 8px" }}>• E-Fahrzeug-Nachfrage explodiert (112 Leads) → eigene Landing Page</p>
                    <p style={{ margin: "0 0 8px" }}>• Juli-Peaks (Sonderangebot 07/23 = 52 Leads) → Aktionen wiederholen</p>
                    <p style={{ margin: "0 0 8px" }}>• Bestandskunden-Erhöhung (124 Tags) → Upselling-Kampagne</p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}

        {activeTab === "insights" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <Card>
                <SectionTitle icon="⚠️">Auffälligkeiten</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { icon: "🔴", title: "UTM-Tracking ist mangelhaft", desc: "Nur 33 von 716 Leads haben UTM-Daten. Ihr wisst nicht, welche Kampagnen performen. Sofort fixen!" },
                    { icon: "🟡", title: "Juli 2023 war ein Ausreißer (52 Leads)", desc: "Das Sonderangebot 07/23 war extrem erfolgreich. Warum wurde das nicht wiederholt?" },
                    { icon: "🟡", title: "Smart Produkt dominiert (259 Tags)", desc: "36% der Leads wählen das Smart Produkt (Miete + Fzg. Kauf). Dieses Produkt verkauft sich fast von selbst." },
                    { icon: "🟢", title: "E-Mobilität stark wachsend", desc: "Von 2 Anfragen (2022) auf 67 (2024). E-Transporter sind ein wachsender Markt." },
                    { icon: "🟡", title: "Viele Felder leer / Branche fehlt oft", desc: "~200 Leads ohne Branchen-Tag. Datenqualität im CRM verbessern!" },
                    { icon: "🔴", title: "2024 H2 + 2025 = abfallender Trend", desc: "Ab Sommer 2024 sinken die monatlichen Abschlüsse. Gegenmaßnahmen nötig." },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "12px 16px", background: COLORS.bg, borderRadius: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 4 }}>{item.icon} {item.title}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <SectionTitle icon="🚀">Verkaufstipps</SectionTitle>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { title: "Priorisiere KEP-Leads", desc: "Jeder zweite Abschluss ist ein Kurier/Paketdienst. Wenn ein Lead aus dieser Branche kommt → sofort anrufen, nicht warten." },
                    { title: "Kaufoption als Closer einsetzen", desc: "76% der Abschlüsse wollten eine Kaufoption. Im Erstgespräch immer erwähnen — das ist der entscheidende USP." },
                    { title: "Kontakt-Intensität = 3-4 Touches", desc: "Die meisten Abschlüsse brauchen 1-4 Kontakte. Wer nach 5+ Kontakten nicht abschließt, wird selten noch Kunde." },
                    { title: "Follow-up in 48h Standard", desc: "33% schließen beim Erstkontakt ab. Schnelle Reaktionszeit ist entscheidend." },
                    { title: "Erklärung des Produkts ist Pflicht", desc: "322 von 716 Leads brauchten eine FL-Produkterklärung. Das zeigt: Kunden verstehen das Modell nicht sofort — bereite eine knappe, klare Pitch-Struktur vor." },
                    { title: "Bestandskunden für Upselling nutzen", desc: "124 Einträge sind Bestandserhöhungen. Bestehende Kunden sind die einfachsten Abschlüsse — quartalsweise Upselling-Calls einführen." },
                    { title: "Sonder-Aktionen funktionieren", desc: "Das Sonderangebot vom Juli 2023 brachte 4x mehr Leads. Plant quartalsweise Promotions." },
                    { title: "E-Fahrzeuge proaktiv anbieten", desc: "Die Nachfrage nach E-Transportern wächst stark. Wer hier kompetent beraten kann, gewinnt neue Segmente." },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "12px 16px", background: COLORS.bg, borderRadius: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.accent, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card>
              <SectionTitle icon="📋">Allgemeine Analyse: Zusammenfassung</SectionTitle>
              <div style={{ fontSize: 13, lineHeight: 1.8, color: COLORS.textMuted, columns: 2, columnGap: 32 }}>
                <p style={{ margin: "0 0 12px" }}><strong style={{ color: COLORS.text }}>Kerngeschäft:</strong> FleetLink bedient primär kleine und mittlere KEP-Unternehmen (Kurier, Express, Paket) mit Transporter-Langzeitmiete. Das Geschäftsmodell „Miete + Kaufoption" (Smart Produkt) ist das Flaggschiff und trifft den Nerv der Zielgruppe — Unternehmer, die Kapital schonen, aber langfristig Eigentum aufbauen wollen.</p>
                <p style={{ margin: "0 0 12px" }}><strong style={{ color: COLORS.text }}>Kundenstruktur:</strong> 592 einzigartige Kunden mit 716 Vertragsabschlüssen zeigen eine gesunde Wiederkaufrate. Der typische Kunde hat 1-10 Fahrzeuge im Fuhrpark, braucht große Transporter (L4H3) und fährt 3.000-4.000 km/Monat. Die meisten binden sich für 24-36 Monate.</p>
                <p style={{ margin: "0 0 12px" }}><strong style={{ color: COLORS.text }}>Vertriebsprozess:</strong> Im Schnitt braucht es 3,2 Kontakte bis zum Abschluss. Die Webseite ist der stärkste Kanal (41%), gefolgt von Social Media (16%) und Telefon (8%). Der Vertriebsprozess ist gut dokumentiert mit klaren KOM-Tags für Produkterklärungen.</p>
                <p style={{ margin: "0 0 12px" }}><strong style={{ color: COLORS.text }}>Wachstumschancen:</strong> E-Mobilität wächst rasant, Handwerker und Dienstleister sind unterrepräsentiert aber stabil wachsend. Sonder-Aktionen haben nachweislich starke Lead-Spikes erzeugt. Bestandskunden-Upselling ist ein einfacher Hebel.</p>
                <p style={{ margin: "0 0 12px" }}><strong style={{ color: COLORS.text }}>Risiken:</strong> Seit Mitte 2024 sinken die monatlichen Abschlüsse. UTM-Tracking fehlt fast komplett, was datengestützte Marketing-Entscheidungen unmöglich macht. Die Datenqualität im CRM ist verbesserungswürdig — viele Felder sind leer oder inkonsistent.</p>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
