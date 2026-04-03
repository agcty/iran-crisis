export const STATUS_META = {
  "Neu":              { color: "#8A8580", bg: "#F0EDEA" },
  "Profil in Arbeit": { color: "#5A8BB8", bg: "#E8EFF6" },
  "Im Matching":      { color: "#9A7DB8", bg: "#F0ECF4" },
  "Vermittelt":       { color: "#3A8F6E", bg: "#E8F3EE" },
} as const;

export type ParticipantStatus = keyof typeof STATUS_META;

export type ReportStatus = "nicht begonnen" | "entwurf" | "veröffentlicht";

export interface Participant {
  id: number;
  name: string;
  status: ParticipantStatus;
  massnahme: string;
  coach: string;
  notesCount: number;
  reportStatus: ReportStatus;
  avatar: string;
  chatBubble: string;
  aiSummary: string;
}

/** Matching strength as 0–1 based on notes + report */
export function matchingStrength(p: Participant): number {
  if (p.status === "Neu") return 0;
  if (p.status === "Vermittelt") return 1;
  // Profile base: 0.15
  let strength = 0.15;
  // Notes: up to 0.5 (diminishing returns, ~8 notes for full credit)
  strength += Math.min(p.notesCount / 8, 1) * 0.5;
  // Report: +0.35
  if (p.reportStatus === "veröffentlicht") strength += 0.35;
  else if (p.reportStatus === "entwurf") strength += 0.15;
  return Math.min(strength, 1);
}

/** Human-readable matching signal label — frames the system's learning state, not a grade */
export function matchingLabel(strength: number): { label: string; color: string } {
  if (strength === 0) return { label: "Noch nicht aktiv", color: "#8A8580" };
  if (strength < 0.3) return { label: "Lernt noch", color: "#C49240" };
  if (strength < 0.6) return { label: "Erste Signale", color: "#C49240" };
  if (strength < 0.85) return { label: "Gute Signale", color: "#5A8BB8" };
  return { label: "Starke Signale", color: "#3A8F6E" };
}

/** Attention score 0–1: higher = needs more coach attention */
export function attentionScore(p: Participant): number {
  if (p.status === "Vermittelt") return 0.12;
  if (p.status === "Neu") return p.notesCount === 0 ? 0.85 : 0.7;
  if (p.status === "Profil in Arbeit") {
    if (p.notesCount === 0) return 0.8;
    if (p.notesCount < 3) return 0.6;
    return 0.45;
  }
  // Im Matching — inversely proportional to matching strength
  const strength = matchingStrength(p);
  if (strength < 0.35) return 0.9;
  if (strength < 0.5) return 0.7;
  if (strength < 0.7) return 0.5;
  return 0.3;
}

/** Whether this participant has a pending action the coach should address */
export function needsAction(p: Participant): boolean {
  if (p.status === "Neu" && p.notesCount === 0) return true;
  if (p.status === "Profil in Arbeit" && p.notesCount === 0) return true;
  if (p.status === "Im Matching" && matchingStrength(p) < 0.5) return true;
  return false;
}

/** Actionable reason text for urgent participants */
export function urgentReason(p: Participant): string {
  if (p.status === "Neu" && p.notesCount === 0) return "Noch kein Erstgespräch — kennenlernen";
  if (p.status === "Neu") return "Neu im Kurs — Profil anlegen";
  if (p.status === "Profil in Arbeit" && p.notesCount === 0) return "Keine Notizen — erste Eindrücke festhalten";
  if (p.status === "Profil in Arbeit" && p.notesCount < 3) return "Wenige Notizen — Profil stärken";
  if (p.status === "Im Matching") {
    const s = matchingStrength(p);
    if (s < 0.35) return "Matching lernt noch — deine Notizen helfen";
    if (s < 0.5) return "Erste Signale da — mehr Kontext verbessert Ergebnisse";
  }
  return p.chatBubble;
}

export const TEAL = {
  500: "#2E7D6F",
  600: "#256B5E",
  700: "#1F5C50",
  glow: "rgba(46,125,111,",
} as const;

export interface Group {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export const GROUPS: Group[] = [
  { id: "MAT-2024-031", name: "Berufseinstieg Frühjahr 2025",  startDate: "6. Jan 2025",  endDate: "28. Mär 2025" },
  { id: "MAT-2024-018", name: "Fachkräfte Integration",        startDate: "11. Nov 2024", endDate: "14. Feb 2025" },
  { id: "MAT-2024-042", name: "Neue Wege 2025",                startDate: "3. Feb 2025",  endDate: "25. Apr 2025" },
];

export const PARTICIPANTS: Participant[] = [
  { id: 1,  name: "Amina Hadzic",     status: "Im Matching",      massnahme: "MAT-2024-031", coach: "Fr. Kirchner",  notesCount: 6, reportStatus: "entwurf",         avatar: "/avatars/avatar-1.png",  chatBubble: "3 passende Stellen gefunden", aiSummary: "Möchte im Einzelhandel arbeiten, hat Erfahrung in der Gastronomie. Deutsch gut, aber formelle Formulierungen fallen schwer. Sehr zuverlässig und pünktlich — Arbeitgeber werden das schätzen." },
  { id: 2,  name: "Sarah König",      status: "Vermittelt",       massnahme: "MAT-2024-031", coach: "Fr. Kirchner",  notesCount: 9, reportStatus: "veröffentlicht",  avatar: "/avatars/avatar-2.png",  chatBubble: "Bei REWE angefangen!", aiSummary: "Arbeitet seit 2 Wochen bei REWE im Verkauf. Hat sich schnell eingelebt und guten Kontakt mit der Filialleitung aufgebaut. Selbstbewusstsein deutlich gestiegen seit Kursstart." },
  { id: 3,  name: "Diana Voss",       status: "Profil in Arbeit", massnahme: "MAT-2024-018", coach: "Hr. Bremer",    notesCount: 2, reportStatus: "nicht begonnen",  avatar: "/avatars/avatar-3.png",  chatBubble: "Lebenslauf wird erstellt", aiSummary: "Alleinerziehend, braucht flexible Arbeitszeiten. Interesse an Büro- und Verwaltungstätigkeiten. Hat kaufmännische Ausbildung, war 4 Jahre aus dem Beruf." },
  { id: 4,  name: "Fatima Basha",     status: "Vermittelt",       massnahme: "MAT-2024-031", coach: "Fr. Kirchner",  notesCount: 7, reportStatus: "veröffentlicht",  avatar: "/avatars/avatar-4.png",  chatBubble: "Vertrag unterschrieben!", aiSummary: "Festvertrag als Verkäuferin bei Lidl. Kam mit wenig Selbstvertrauen in den Kurs, hat sich enorm entwickelt. Sprachkenntnisse haben sich durch die Praxis stark verbessert." },
  { id: 5,  name: "Jonas Meier",      status: "Neu",              massnahme: "MAT-2024-042", coach: "Hr. Bremer",    notesCount: 1, reportStatus: "nicht begonnen",  avatar: "/avatars/avatar-5.png",  chatBubble: "Erstgespräch geplant", aiSummary: "Gerade erst gestartet. Wirkt zurückhaltend, aber interessiert. Im Erstgespräch handwerkliche Berufe als Wunsch genannt. Braucht wahrscheinlich etwas Anlaufzeit." },
  { id: 6,  name: "Leon Weber",       status: "Im Matching",      massnahme: "MAT-2024-018", coach: "Fr. Albrecht",  notesCount: 5, reportStatus: "nicht begonnen",  avatar: "/avatars/avatar-6.png",  chatBubble: "Matching läuft, Bericht stärkt Ergebnisse", aiSummary: "Sucht Arbeit in der Logistik oder im Lager. Hat Gabelstaplerschein und Erfahrung bei Amazon. Möchte gerne in der Nähe von Zuhause arbeiten, pendelt ungern länger als 30 Min." },
  { id: 7,  name: "Yusuf Aslan",      status: "Profil in Arbeit", massnahme: "MAT-2024-042", coach: "Hr. Bremer",    notesCount: 1, reportStatus: "nicht begonnen",  avatar: "/avatars/avatar-7.png",  chatBubble: "Stärkenanalyse mit KI läuft", aiSummary: "Unsicher bei der Berufswahl — schwankt zwischen Gastronomie und Handwerk. Braucht Zeit und Orientierung, nicht drängen. Spricht gut Deutsch, ist motiviert." },
  { id: 8,  name: "Clara Stein",      status: "Vermittelt",       massnahme: "MAT-2024-018", coach: "Fr. Albrecht",  notesCount: 8, reportStatus: "veröffentlicht",  avatar: "/avatars/avatar-8.png",  chatBubble: "Seit 3 Wochen bei DHL", aiSummary: "Arbeitet als Paketbotin bei DHL, ist sehr zufrieden. Schätzt die körperliche Arbeit und die Unabhängigkeit. War vorher lange arbeitslos und hat im Kurs neues Selbstvertrauen aufgebaut." },
  { id: 9,  name: "Marko Petrovic",   status: "Im Matching",      massnahme: "MAT-2024-031", coach: "Fr. Kirchner",  notesCount: 4, reportStatus: "nicht begonnen",  avatar: "/avatars/avatar-9.png",  chatBubble: "2 Matches gefunden, wird mit Notizen besser", aiSummary: "Gelernter Elektriker aus Serbien, Anerkennung läuft. Sucht Arbeit im Handwerk, am liebsten in einem kleinen Betrieb. Ruhig, aber fachlich sehr kompetent." },
  { id: 10, name: "Nadia Rahimi",     status: "Im Matching",      massnahme: "MAT-2024-018", coach: "Fr. Albrecht",  notesCount: 7, reportStatus: "entwurf",         avatar: "/avatars/avatar-10.png", chatBubble: "2 Matches vorgeschlagen", aiSummary: "Möchte im Gesundheitsbereich arbeiten, hat Erfahrung als Pflegehelferin. Sehr empathisch und belastbar. Benötigt noch B2-Zertifikat für die Anerkennung." },
  { id: 11, name: "Tina Fischer",     status: "Profil in Arbeit", massnahme: "MAT-2024-042", coach: "Hr. Bremer",    notesCount: 0, reportStatus: "nicht begonnen",  avatar: "/avatars/avatar-11.png", chatBubble: "Berufswünsche besprochen", aiSummary: "Möchte Teilzeit arbeiten, da sie sich um ihre Eltern kümmert. Hat Interesse an Arbeit im Sozialbereich. Erste Berufserfahrung im Einzelhandel." },
  { id: 13, name: "Petra Novak",      status: "Neu",              massnahme: "MAT-2024-042", coach: "Hr. Bremer",    notesCount: 0, reportStatus: "nicht begonnen",  avatar: "/avatars/avatar-13.png", chatBubble: "Willkommen!", aiSummary: "Gerade erst gestartet, noch kein Profil erstellt. Kein KI-Gespräch bisher." },
  { id: 14, name: "Marco Garcia",     status: "Vermittelt",       massnahme: "MAT-2024-018", coach: "Fr. Albrecht",  notesCount: 8, reportStatus: "veröffentlicht",  avatar: "/avatars/avatar-14.png", chatBubble: "Festvertrag bei Edeka!", aiSummary: "Hat Festvertrag bei Edeka als Verkaufshilfe. Hatte privat eine schwierige Phase während des Kurses, war aber beim Vorstellungsgespräch sehr motiviert und überzeugend." },
  { id: 15, name: "Kira Lindgren",    status: "Im Matching",      massnahme: "MAT-2024-031", coach: "Fr. Kirchner",  notesCount: 3, reportStatus: "nicht begonnen",  avatar: "/avatars/avatar-15.png", chatBubble: "Erste Matches, mehr Notizen helfen", aiSummary: "Sucht Arbeit im kreativen Bereich — Grafikdesign oder Marketing. Hat Grundkenntnisse in Canva und Social Media. Schwierigkeit: wenig formale Qualifikationen." },
  { id: 16, name: "Zahir Tahiri",     status: "Profil in Arbeit", massnahme: "MAT-2024-042", coach: "Hr. Bremer",    notesCount: 1, reportStatus: "nicht begonnen",  avatar: "/avatars/avatar-16.png", chatBubble: "Ziele definiert", aiSummary: "Möchte in der IT arbeiten, hat autodidaktisch Programmieren gelernt. Braucht Unterstützung beim Lebenslauf und formellen Bewerbungsprozess. Sehr ehrgeizig." },
  { id: 18, name: "Lisa Beck",        status: "Im Matching",      massnahme: "MAT-2024-031", coach: "Fr. Kirchner",  notesCount: 8, reportStatus: "veröffentlicht",  avatar: "/avatars/avatar-18.png", chatBubble: "Match bei Siemens vorgeschlagen", aiSummary: "Top-Kandidatin: Industriekauffrau mit 6 Jahren Erfahrung. Sucht nach Elternzeit den Wiedereinstieg, bevorzugt Teilzeit. Sehr strukturiert und kommunikativ." },
  { id: 23, name: "Tarek Said",       status: "Neu",              massnahme: "MAT-2024-042", coach: "Hr. Bremer",    notesCount: 0, reportStatus: "nicht begonnen",  avatar: "/avatars/avatar-23.png", chatBubble: "Willkommen!", aiSummary: "Gerade erst gestartet, noch kein Profil erstellt. Kein KI-Gespräch bisher." },
  { id: 24, name: "Stefan Huber",     status: "Im Matching",      massnahme: "MAT-2024-031", coach: "Fr. Kirchner",  notesCount: 5, reportStatus: "entwurf",         avatar: "/avatars/avatar-24.png", chatBubble: "Bericht stärkt Matching-Ergebnisse", aiSummary: "Hat lange als Lagerist gearbeitet, möchte sich umorientieren Richtung Kundenservice. Freundlich und geduldig, kommt gut mit Menschen klar. Braucht noch Überzeugungsarbeit im Lebenslauf." },
];
