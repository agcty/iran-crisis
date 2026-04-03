import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  PARTICIPANTS,
  GROUPS,
  STATUS_META,
  TEAL,
  type Participant,
} from "../data/participant-data";
import { useFeatureFlags } from "../feature-flags";

/* ------------------------------------------------------------------ */
/*  Match data                                                         */
/* ------------------------------------------------------------------ */

interface Match {
  company: string;
  role: string;
  status: "Eingestellt" | "Im Gespräch" | "Vorgeschlagen";
  whyYou: string;
  workplace: string;
  location: string;
  distance: string;
  type: "Vollzeit" | "Teilzeit" | "Minijob";
  nextAction: string;
  matchedOn: string;
}

const MATCH_STATUS_ME = {
  "Eingestellt":   { label: "Du arbeitest hier", color: "#3A8F6E", bg: "#E8F3EE" },
  "Im Gespräch":   { label: "Ihr lernt euch kennen", color: "#C49240", bg: "#F6F0E4" },
  "Vorgeschlagen": { label: "Neu für dich", color: "#9A7DB8", bg: "#F0ECF4" },
} as const;

function getMatchesForMe(p: Participant): Match[] {
  const matches: Record<number, Match[]> = {
    1: [
      { company: "REWE", role: "Verkaufshilfe", status: "Im Gespräch", whyYou: "Du hast Erfahrung im Umgang mit Kunden aus der Gastronomie, und deine Zuverlässigkeit ist genau das, was dort gesucht wird. Die Stelle ist Teilzeit, wie du es dir wünschst.", workplace: "Supermarkt-Filiale, festes Team mit ca. 12 Leuten", location: "Berlin-Neukölln", distance: "15 Min.", type: "Teilzeit", nextAction: "Vorstellungsgespräch am 14. Mär", matchedOn: "3. Mär 2025" },
      { company: "dm-drogerie", role: "Verkäuferin", status: "Vorgeschlagen", whyYou: "dm sucht jemanden, der gut mit Kunden umgehen kann und zeitlich flexibel ist — beides trifft auf dich zu. Es ist eine ruhigere Arbeitsumgebung als Gastronomie.", workplace: "Drogerie-Filiale, kleines Team, geregelter Tagesablauf", location: "Berlin-Kreuzberg", distance: "22 Min.", type: "Teilzeit", nextAction: "Bewerbung noch offen", matchedOn: "5. Mär 2025" },
      { company: "Lidl", role: "Kassiererin", status: "Vorgeschlagen", whyYou: "Einzelhandel passt zu deinen Stärken. Die Stelle ist allerdings Vollzeit mit Schichtarbeit — das ist vielleicht nicht ideal. Aber sie suchen zuverlässige Leute, und da bist du stark.", workplace: "Discounter-Filiale, schnelleres Tempo, Schichtsystem", location: "Berlin-Tempelhof", distance: "28 Min.", type: "Vollzeit", nextAction: "Noch offen", matchedOn: "7. Mär 2025" },
    ],
    2: [
      { company: "REWE", role: "Verkäuferin", status: "Eingestellt", whyYou: "Du bist hier angekommen. Kundenkontakt, kurzer Weg, Teilzeit — es hat einfach gepasst.", workplace: "Supermarkt-Filiale", location: "Berlin-Mitte", distance: "12 Min.", type: "Teilzeit", nextAction: "", matchedOn: "10. Feb 2025" },
    ],
    4: [
      { company: "Lidl", role: "Verkäuferin", status: "Eingestellt", whyYou: "Deine Motivation und die Praxiserfahrung aus dem Kurs haben den Ausschlag gegeben. Du hast es geschafft.", workplace: "Discounter-Filiale", location: "Berlin-Wedding", distance: "18 Min.", type: "Vollzeit", nextAction: "", matchedOn: "15. Feb 2025" },
    ],
    6: [
      { company: "DHL", role: "Lagerarbeiter", status: "Im Gespräch", whyYou: "Du hast einen Gabelstaplerschein und Erfahrung bei Amazon — das ist genau, was DHL sucht. Und die Filiale ist nur 18 Minuten entfernt, also gut innerhalb deiner 30-Minuten-Grenze.", workplace: "Großes Logistikzentrum, strukturierte Abläufe, feste Schichten", location: "Berlin-Spandau", distance: "18 Min.", type: "Vollzeit", nextAction: "Probearbeitstag am 12. Mär", matchedOn: "28. Feb 2025" },
      { company: "Hermes", role: "Kommissionierer", status: "Vorgeschlagen", whyYou: "Deine Lagererfahrung passt gut, und das Schichtmodell dort ist flexibler als bei vielen anderen. 25 Minuten Pendelzeit — knapp, aber noch drin.", workplace: "Paketzentrum, mittelgroßes Team", location: "Potsdam", distance: "25 Min.", type: "Vollzeit", nextAction: "Noch offen", matchedOn: "4. Mär 2025" },
    ],
    8: [
      { company: "DHL", role: "Paketbotin", status: "Eingestellt", whyYou: "Körperliche Arbeit und Unabhängigkeit — genau das, was du dir gewünscht hast. Du bist deinen eigenen Weg gegangen.", workplace: "Zustellbasis", location: "Berlin-Lichtenberg", distance: "20 Min.", type: "Vollzeit", nextAction: "", matchedOn: "5. Feb 2025" },
    ],
    9: [
      { company: "Elektro Schulz", role: "Elektriker-Helfer", status: "Im Gespräch", whyYou: "Ein kleiner Familienbetrieb mit 8 Mitarbeitern — genau das, was du dir gewünscht hast, kein Großkonzern. Deine Qualifikation aus Serbien passt, die Anerkennung ist auf dem Weg.", workplace: "Kleiner Handwerksbetrieb, 8 Mitarbeiter, familiäre Atmosphäre", location: "Berlin-Charlottenburg", distance: "20 Min.", type: "Vollzeit", nextAction: "Anerkennungsbescheid nachreichen", matchedOn: "1. Mär 2025" },
      { company: "Berliner Haustechnik", role: "Servicetechniker", status: "Vorgeschlagen", whyYou: "Fachlich passt die Stelle gut zu deiner Ausbildung. Es ist allerdings ein größeres Unternehmen — nicht der kleine Betrieb, den du dir wünschst. Trotzdem eine fachlich starke Option.", workplace: "Mittelständisches Unternehmen, ca. 60 Mitarbeiter, Serviceeinsätze beim Kunden", location: "Berlin-Marzahn", distance: "35 Min.", type: "Vollzeit", nextAction: "Noch nicht besprochen", matchedOn: "6. Mär 2025" },
    ],
    10: [
      { company: "Vivantes Klinikum", role: "Pflegehelferin", status: "Im Gespräch", whyYou: "Deine Pflegeerfahrung und deine empathische Art sind genau das, was auf dieser Station gebraucht wird. Das B2-Zertifikat fehlt noch — aber du bist zur Prüfung angemeldet, und Vivantes weiß das.", workplace: "Klinik, Station mit festem Pflegeteam", location: "Berlin-Friedrichshain", distance: "15 Min.", type: "Vollzeit", nextAction: "B2-Zertifikat abwarten", matchedOn: "25. Feb 2025" },
      { company: "Caritas Altenpflege", role: "Betreuungsassistenz", status: "Vorgeschlagen", whyYou: "Diese Stelle braucht kein B2-Zertifikat — das macht sie besonders interessant für dich, weil du sofort anfangen könntest. Betreuungsassistenz bedeutet vor allem Gespräche und Alltagsbegleitung, weniger medizinische Pflege.", workplace: "Senioreneinrichtung, ruhige Atmosphäre, kleines Betreuungsteam", location: "Berlin-Schöneberg", distance: "22 Min.", type: "Teilzeit", nextAction: "Noch offen", matchedOn: "4. Mär 2025" },
    ],
    14: [
      { company: "Edeka", role: "Verkaufshilfe", status: "Eingestellt", whyYou: "Du hast im Vorstellungsgespräch überzeugt — deine Motivation hat den Unterschied gemacht, auch wenn es privat gerade nicht einfach war.", workplace: "Supermarkt-Filiale", location: "Berlin-Prenzlauer Berg", distance: "10 Min.", type: "Vollzeit", nextAction: "", matchedOn: "18. Feb 2025" },
    ],
    15: [
      { company: "Kreativagentur Funke", role: "Social Media Assistenz", status: "Vorgeschlagen", whyYou: "Du kennst dich mit Canva und Social Media aus — die Agentur sucht genau das. Es ist eine kleine Agentur, wo du viel lernen und ausprobieren kannst.", workplace: "Kreativagentur, 6 Leute, lockere Atmosphäre, viel Eigenverantwortung", location: "Berlin-Mitte", distance: "25 Min.", type: "Teilzeit", nextAction: "Noch offen", matchedOn: "5. Mär 2025" },
      { company: "Print & Co", role: "Grafik-Praktikum", status: "Vorgeschlagen", whyYou: "Ein Praktikum, das dir den Einstieg in die Grafikwelt ermöglicht. Du hättest die Chance, mit professionellen Tools zu arbeiten und ein echtes Portfolio aufzubauen.", workplace: "Druckerei mit Designabteilung, strukturierter Arbeitsalltag", location: "Berlin-Kreuzberg", distance: "18 Min.", type: "Vollzeit", nextAction: "Noch offen", matchedOn: "7. Mär 2025" },
    ],
    18: [
      { company: "Siemens", role: "Sachbearbeiterin Einkauf", status: "Im Gespräch", whyYou: "6 Jahre als Industriekauffrau — du bringst genau die Erfahrung mit, die hier gebraucht wird. Und ja, Teilzeit ist dort möglich. Das Zweitgespräch läuft.", workplace: "Großes Unternehmen, Einkaufsabteilung, professionelles Umfeld", location: "Berlin-Siemensstadt", distance: "22 Min.", type: "Teilzeit", nextAction: "Zweitgespräch am 11. Mär", matchedOn: "24. Feb 2025" },
      { company: "BMW Berlin", role: "Auftragsabwicklung", status: "Vorgeschlagen", whyYou: "Deine kaufmännische Erfahrung und deine strukturierte Arbeitsweise passen gut hierhin. Auch hier ist Teilzeit möglich.", workplace: "Niederlassung, Verwaltungsteam", location: "Berlin-Spandau", distance: "30 Min.", type: "Teilzeit", nextAction: "Noch offen", matchedOn: "3. Mär 2025" },
      { company: "Bosch", role: "Projektassistenz", status: "Vorgeschlagen", whyYou: "Du bist organisiert und kommunikativ — das brauchen sie dort. Aber: es wäre Vollzeit. Wenn das für dich nicht passt, sag Bescheid, dann suchen wir weiter nach Teilzeit.", workplace: "Technologieunternehmen, Projektteam, internationales Umfeld", location: "Berlin-Adlershof", distance: "40 Min.", type: "Vollzeit", nextAction: "Noch offen", matchedOn: "6. Mär 2025" },
    ],
    24: [
      { company: "Zalando", role: "Kundenberater", status: "Im Gespräch", whyYou: "Du bist geduldig und kommst gut mit Menschen klar — perfekt für Kundenservice. Und der Wechsel aus dem Lager in den direkten Kundenkontakt, den du dir wünschst, würde hier klappen.", workplace: "Kundenservice-Center, offenes Büro, junges Team", location: "Berlin-Friedrichshain", distance: "20 Min.", type: "Vollzeit", nextAction: "Hospitation am 13. Mär", matchedOn: "27. Feb 2025" },
      { company: "Deutsche Bahn", role: "Service-Mitarbeiter", status: "Vorgeschlagen", whyYou: "Kundenservice am Bahnhof — du wärst die erste Anlaufstelle für Reisende. Es bedeutet Schichtarbeit, aber du wärst nah dran an Menschen, wie du es dir wünschst.", workplace: "Hauptbahnhof, Service-Point, wechselnde Schichten", location: "Berlin Hauptbahnhof", distance: "15 Min.", type: "Vollzeit", nextAction: "Noch offen", matchedOn: "5. Mär 2025" },
    ],
  };
  return matches[p.id] ?? [];
}

/* ------------------------------------------------------------------ */
/*  Matching notes (what the coach shared with the system)             */
/* ------------------------------------------------------------------ */

interface MatchingNote {
  text: string;
  date: string;
}

function getMatchingNotesForMe(p: Participant): MatchingNote[] {
  const notes: Record<number, MatchingNote[]> = {
    1: [
      { text: "Erfahrung in der Gastronomie, möchte in den Einzelhandel wechseln", date: "10. Feb 2025" },
      { text: "Schichtbereitschaft vorhanden", date: "10. Feb 2025" },
      { text: "Deutsch ist gut, formelle Formulierungen noch üben", date: "28. Feb 2025" },
      { text: "Sehr zuverlässig und pünktlich", date: "15. Feb 2025" },
    ],
    2: [
      { text: "Guter Kontakt mit Kunden und Filialleitung bei REWE", date: "1. Mär 2025" },
    ],
    4: [
      { text: "Hohe Motivation, Praxiserfahrung aus dem Kurs", date: "18. Feb 2025" },
    ],
    6: [
      { text: "Gabelstaplerschein vorhanden, Erfahrung bei Amazon im Lager", date: "18. Feb 2025" },
      { text: "Pendelt ungern länger als 30 Minuten", date: "18. Feb 2025" },
      { text: "Sucht bevorzugt in Logistik/Lager", date: "12. Feb 2025" },
    ],
    7: [
      { text: "Handwerkliches Geschick im Kurs aufgefallen", date: "22. Feb 2025" },
    ],
    5: [
      { text: "Handwerkliche Berufe als Wunsch genannt", date: "20. Feb 2025" },
    ],
    9: [
      { text: "Gelernter Elektriker, Anerkennung aus Serbien läuft", date: "14. Feb 2025" },
      { text: "Möchte in kleinem Betrieb arbeiten", date: "20. Feb 2025" },
    ],
    10: [
      { text: "Erfahrung als Pflegehelferin, möchte im Gesundheitsbereich bleiben", date: "20. Feb 2025" },
      { text: "B2-Zertifikat fehlt noch, ist zur Prüfung angemeldet", date: "25. Feb 2025" },
    ],
    14: [
      { text: "Gute Auffassungsgabe, lernt schnell, kommt gut mit Kunden klar", date: "12. Feb 2025" },
      { text: "Sehr motiviert und überzeugend im Gespräch", date: "18. Feb 2025" },
    ],
    15: [
      { text: "Interesse an Grafikdesign und Marketing", date: "22. Feb 2025" },
      { text: "Canva- und Social-Media-Grundkenntnisse", date: "22. Feb 2025" },
    ],
    18: [
      { text: "Industriekauffrau, 6 Jahre Erfahrung, bevorzugt Teilzeit", date: "15. Feb 2025" },
      { text: "Sehr strukturiert und kommunikativ", date: "20. Feb 2025" },
    ],
    24: [
      { text: "Erfahrung als Lagerist, möchte in den Kundenservice wechseln", date: "22. Feb 2025" },
      { text: "Freundlich, geduldig, kommt gut mit Menschen klar", date: "28. Feb 2025" },
    ],
  };
  return notes[p.id] ?? [];
}

/* ------------------------------------------------------------------ */
/*  AI match commentary — conversational framing per participant       */
/* ------------------------------------------------------------------ */

function getMatchCommentary(p: Participant, matches: Match[]): string | null {
  if (matches.length === 0) return null;

  const commentary: Record<number, string> = {
    1: "Wir haben 3 Stellen gefunden. Bei REWE läuft schon ein Vorstellungsgespräch! Die Lidl-Stelle wäre Vollzeit mit Schichtarbeit — sag Bescheid, ob das für dich in Frage kommt.",
    6: "2 Stellen passen gut zu deiner Logistik-Erfahrung. Bei DHL steht ein Probearbeitstag an — die sind nur 18 Minuten entfernt. Hermes in Potsdam wäre etwas weiter, aber noch unter deinen 30 Minuten.",
    9: "Elektro Schulz ist ein kleiner Familienbetrieb — genau das, was du dir gewünscht hast. Die Berliner Haustechnik ist größer, aber fachlich eine gute Option. Was denkst du?",
    10: "Bei Vivantes läuft ein Gespräch, aber da wird B2 gebraucht. Die Caritas-Stelle braucht kein B2 — das könnte schneller gehen. Beide passen zu deiner Erfahrung.",
    15: "Beide Stellen sind im kreativen Bereich, den du dir wünschst. Die Agentur sucht Social-Media-Unterstützung, das Praktikum bei Print & Co wäre ein Einstieg in Grafikdesign.",
    18: "Bei Siemens läuft ein Zweitgespräch — Teilzeit ist dort möglich. BMW und Bosch sind weitere Optionen, aber die Bosch-Stelle wäre Vollzeit. Sag uns, ob das ein Ausschlusskriterium ist.",
    24: "Zalando sucht genau jemanden wie dich — geduldig und menschenorientiert. Bei der Bahn wäre es Schichtarbeit. Beide sind Kundenservice, wie du es dir wünschst.",
  };

  return commentary[p.id] ?? null;
}

/* ------------------------------------------------------------------ */
/*  Documents                                                          */
/* ------------------------------------------------------------------ */

interface Dokument {
  name: string;
  type: string;
  date: string;
}

function hasLebenslauf(p: Participant): boolean {
  return p.status !== "Neu" || p.notesCount > 0;
}

function getLebenslaufPreview(p: Participant): string[] {
  const summaryParts = p.aiSummary.split(/[.!]/).map(s => s.trim()).filter(Boolean);
  return summaryParts.length > 0 ? [summaryParts[0]] : [];
}

function getOtherDocuments(p: Participant): Dokument[] {
  const docs: Dokument[] = [];
  if (p.status !== "Neu") {
    docs.push({ name: "Zertifikat Deutsch B2", type: "PDF", date: "3. Jan 2025" });
  }
  if (p.reportStatus === "veröffentlicht") {
    docs.push({ name: "Coach-Bericht", type: "PDF", date: "1. Mär 2025" });
  }
  return docs;
}

/* ------------------------------------------------------------------ */
/*  Status labels for the participant (warmer, personal framing)       */
/* ------------------------------------------------------------------ */

const STATUS_LABEL_ME: Record<string, string> = {
  "Neu": "Du bist gerade gestartet",
  "Profil in Arbeit": "Dein Profil wird aufgebaut",
  "Im Matching": "Wir suchen passende Stellen für dich",
  "Vermittelt": "Du hast es geschafft",
};

/* ------------------------------------------------------------------ */
/*  Tab type                                                           */
/* ------------------------------------------------------------------ */

type Tab = "start" | "stellen";

/* ------------------------------------------------------------------ */
/*  Match filter                                                       */
/* ------------------------------------------------------------------ */

type MatchFilter = "alle" | "kennenlernen" | "neu";

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ParticipantMe() {
  const { id } = useParams<{ id: string }>();
  const { matchingEnabled } = useFeatureFlags();
  const [prompt, setPrompt] = useState("");
  const [tab, setTab] = useState<Tab>("start");
  const [matchFilter, setMatchFilter] = useState<MatchFilter>("alle");
  const [showNotes, setShowNotes] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const participant = PARTICIPANTS.find(p => p.id === Number(id));
  if (!participant) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, #FDFCFA 0%, #F9F7F4 40%, #F5F2ED 100%)" }}
      >
        <p className="text-lg" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
          Profil nicht gefunden.
        </p>
      </div>
    );
  }

  const meta = STATUS_META[participant.status];
  const group = GROUPS.find(g => g.id === participant.massnahme);
  const matches = matchingEnabled ? getMatchesForMe(participant) : [];
  const matchingNotes = getMatchingNotesForMe(participant);
  const otherDocs = getOtherDocuments(participant);
  const hasResume = hasLebenslauf(participant);
  const resumePreview = getLebenslaufPreview(participant);
  const commentary = matchingEnabled ? getMatchCommentary(participant, matches) : null;
  const firstName = participant.name.split(" ")[0];
  const isNew = participant.status === "Neu" && matchingNotes.length === 0;
  const isPlaced = matchingEnabled && participant.status === "Vermittelt";
  const hiredMatch = matches.find(m => m.status === "Eingestellt");
  const inConversation = matches.filter(m => m.status === "Im Gespräch").length;
  const proposals = matches.filter(m => m.status === "Vorgeschlagen").length;
  const topMatch = matches.find(m => m.status === "Im Gespräch") ?? matches.find(m => m.status === "Vorgeschlagen");
  const remainingCount = matches.filter(m => m.status !== "Eingestellt").length - (topMatch ? 1 : 0);

  const filteredMatches = matchFilter === "alle"
    ? matches
    : matchFilter === "kennenlernen"
      ? matches.filter(m => m.status === "Im Gespräch")
      : matches.filter(m => m.status === "Vorgeschlagen");

  /* ── Shared: match card ── */

  const matchCard = (m: Match, i: number, delay = 0) => {
    const ms = MATCH_STATUS_ME[m.status];
    const isHired = m.status === "Eingestellt";
    const isActive = m.status === "Im Gespräch";
    return (
      <motion.div
        key={`${m.company}-${m.role}-${i}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: delay + i * 0.06 }}
        className="rounded-[18px] overflow-hidden"
        style={{
          background: isHired ? "rgba(58,143,110,0.04)" : "rgba(255,255,252,0.92)",
          border: `1px solid ${isHired ? "rgba(58,143,110,0.1)" : isActive ? "rgba(196,146,64,0.12)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: isActive
            ? "0 4px 20px -6px rgba(196,146,64,0.12), 0 1px 4px rgba(0,0,0,0.03)"
            : "0 2px 12px -4px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)",
        }}
      >
        {isActive && (
          <div className="h-[3px]" style={{ background: "linear-gradient(90deg, #C49240, #D4A855)" }} />
        )}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-[17px] font-[580] tracking-[-0.015em] leading-[1.2]" style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}>
                {m.company}
              </div>
              <div className="text-[13.5px] font-[430] mt-1" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
                {m.role} · {m.type}
              </div>
            </div>
            <span className="text-[11px] font-[520] py-[3px] px-[9px] rounded-full shrink-0 mt-0.5" style={{ background: ms.bg, color: ms.color, fontFamily: "'Satoshi', sans-serif" }}>
              {ms.label}
            </span>
          </div>
          <div className="mb-4">
            <span className="text-[11px] font-[500] uppercase tracking-[0.04em] block mb-1.5" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>Warum diese Stelle</span>
            <p className="text-[13.5px] font-[420] leading-[1.6] m-0" style={{ color: "#5A5550", fontFamily: "'Source Serif 4', Georgia, serif" }}>{m.whyYou}</p>
          </div>
          {m.workplace && (
            <div className="flex items-start gap-2 mb-4">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C8C0B4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-[1px]">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span className="text-[12.5px] font-[420] leading-[1.4]" style={{ color: "#A09A92", fontFamily: "'Satoshi', sans-serif" }}>{m.workplace}</span>
            </div>
          )}
          <div className="flex items-center gap-4 py-2.5 px-3 rounded-[10px] mb-1" style={{ background: "rgba(0,0,0,0.02)" }}>
            <span className="flex items-center gap-1.5 text-[12px] font-[450]" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {m.location}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] font-[450]" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {m.distance} von dir
            </span>
          </div>
          {m.nextAction && !isHired && (
            <div className="flex items-center gap-2.5 mt-3 py-2.5 px-3 rounded-[10px]" style={{ background: isActive ? "rgba(196,146,64,0.04)" : `${TEAL.glow}0.03)`, border: `1px solid ${isActive ? "rgba(196,146,64,0.08)" : `${TEAL.glow}0.06)`}` }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isActive ? "#C49240" : TEAL[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              <span className="text-[12.5px] font-[480]" style={{ color: isActive ? "#96793A" : TEAL[600], fontFamily: "'Satoshi', sans-serif" }}>{m.nextAction}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  /* ── View: Start (home + profile combined) ── */
  const renderStart = () => (
    <div className="max-w-[600px] mx-auto px-6 pt-8 pb-32">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05, ease: [0.4, 0, 0.2, 1] }} className="mb-8">
        <div className="flex items-center gap-5 mb-3">
          <div className="size-[72px] rounded-full overflow-hidden shrink-0" style={{ border: `3px solid ${meta.color}30` }}>
            <img src={participant.avatar} alt={participant.name} className="size-full object-cover" draggable={false} />
          </div>
          <div>
            <h1 className="text-[28px] font-normal tracking-[-0.025em] leading-[1.2] mb-1" style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              Hallo {firstName}
            </h1>
            <p className="text-[14px] font-[430] leading-[1.4]" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
              {STATUS_LABEL_ME[participant.status] ?? participant.status}
            </p>
          </div>
        </div>
        {group && (
          <div className="flex items-center gap-2 ml-[92px]">
            <span className="text-[12.5px] font-[430]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>{group.name}</span>
            <span style={{ color: "#D4CEC6" }}>·</span>
            <span className="text-[12.5px] font-[430]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>Coach: {participant.coach}</span>
          </div>
        )}
      </motion.div>

      {/* Placed celebration */}
      {isPlaced && hiredMatch && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
          <div className="rounded-[16px] p-5" style={{ background: "rgba(58,143,110,0.06)", border: "1px solid rgba(58,143,110,0.12)" }}>
            <div className="flex items-center gap-2 mb-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3A8F6E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              <span className="text-[14px] font-[520]" style={{ color: "#3A8F6E", fontFamily: "'Satoshi', sans-serif" }}>Du arbeitest bei {hiredMatch.company}</span>
            </div>
            <p className="text-[13.5px] font-[420] leading-[1.5] m-0" style={{ color: "#4A8A6E", fontFamily: "'Source Serif 4', Georgia, serif" }}>{hiredMatch.whyYou}</p>
          </div>
        </motion.div>
      )}

      {/* New participant welcome */}
      {isNew && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-8">
          <div className="rounded-[16px] p-6 text-center" style={{ background: "rgba(255,255,252,0.8)", border: "1px solid rgba(0,0,0,0.05)" }}>
            <div className="size-[48px] rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${TEAL.glow}0.06)` }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={TEAL[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </div>
            <h2 className="text-[18px] font-normal tracking-[-0.02em] mb-2" style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}>Willkommen bei Vermittelbar</h2>
            <p className="text-[13.5px] font-[420] leading-[1.6] m-0 max-w-[380px] mx-auto" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
              Dein Coach wird dich bald kennenlernen. Danach suchen wir passende Stellen, die wirklich zu dir passen — nicht nur zu deinem Lebenslauf.
            </p>
          </div>
        </motion.div>
      )}

      {/* Hero match — condensed clickable preview */}
      {!isNew && !isPlaced && topMatch && (() => {
        const tms = MATCH_STATUS_ME[topMatch.status];
        const isActive = topMatch.status === "Im Gespräch";
        return (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }} className="mb-8">
            <h2 className="text-[18px] font-normal tracking-[-0.02em] mb-3.5" style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}>
              {isActive ? "Dein aktuelles Kennenlernen" : "Neuer Vorschlag für dich"}
            </h2>
            <div
              className="rounded-[18px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-[2px] group"
              style={{
                background: "rgba(255,255,252,0.92)",
                border: `1px solid ${isActive ? "rgba(196,146,64,0.12)" : "rgba(0,0,0,0.06)"}`,
                boxShadow: isActive
                  ? "0 4px 20px -6px rgba(196,146,64,0.12), 0 1px 4px rgba(0,0,0,0.03)"
                  : "0 2px 12px -4px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.02)",
              }}
              onClick={() => setTab("stellen")}
            >
              {isActive && (
                <div className="h-[3px]" style={{ background: "linear-gradient(90deg, #C49240, #D4A855)" }} />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[17px] font-[580] tracking-[-0.015em] leading-[1.2]" style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}>
                      {topMatch.company}
                    </div>
                    <div className="text-[13.5px] font-[430] mt-1" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
                      {topMatch.role} · {topMatch.type}
                    </div>
                  </div>
                  <span className="text-[11px] font-[520] py-[3px] px-[9px] rounded-full shrink-0 mt-0.5" style={{ background: tms.bg, color: tms.color, fontFamily: "'Satoshi', sans-serif" }}>
                    {tms.label}
                  </span>
                </div>
                <p className="text-[13.5px] font-[420] leading-[1.6] m-0 mb-4 line-clamp-3" style={{ color: "#5A5550", fontFamily: "'Source Serif 4', Georgia, serif" }}>{topMatch.whyYou}</p>
                {topMatch.nextAction && (
                  <div className="flex items-center gap-2.5 mb-4 py-2.5 px-3 rounded-[10px]" style={{ background: isActive ? "rgba(196,146,64,0.04)" : `${TEAL.glow}0.03)`, border: `1px solid ${isActive ? "rgba(196,146,64,0.08)" : `${TEAL.glow}0.06)`}` }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isActive ? "#C49240" : TEAL[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    <span className="text-[12.5px] font-[480]" style={{ color: isActive ? "#96793A" : TEAL[600], fontFamily: "'Satoshi', sans-serif" }}>{topMatch.nextAction}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[12px] font-[450]" style={{ color: "#A09A92", fontFamily: "'Satoshi', sans-serif" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {topMatch.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px] font-[450]" style={{ color: "#A09A92", fontFamily: "'Satoshi', sans-serif" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {topMatch.distance}
                    </span>
                  </div>
                  <span className="text-[12px] font-[480] flex items-center gap-1.5 transition-colors duration-200 group-hover:text-[#2C2A27]" style={{ color: "#A09A92", fontFamily: "'Satoshi', sans-serif" }}>
                    Details
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </div>
            {remainingCount > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setTab("stellen"); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 mt-2.5 rounded-[12px] border-none cursor-pointer transition-all duration-200 hover:-translate-y-px"
                style={{ background: "transparent", color: "#A09A92", fontFamily: "'Satoshi', sans-serif" }}
              >
                <span className="text-[12.5px] font-[460]">
                  + {remainingCount} weitere {remainingCount === 1 ? "Stelle" : "Stellen"}
                </span>
              </button>
            )}
          </motion.div>
        );
      })()}

      {/* No matches yet, but notes exist — searching state */}
      {!isNew && !isPlaced && matches.length === 0 && matchingNotes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.12 }} className="mb-8">
          <div className="rounded-[14px] py-5 px-4 text-center" style={{ background: "rgba(255,255,252,0.6)", border: "1px solid rgba(0,0,0,0.04)" }}>
            <div className="size-[36px] rounded-full mx-auto mb-2.5 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.03)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0A99F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <p className="text-[13px] font-[420] leading-[1.5] m-0" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>Wir suchen gerade nach passenden Stellen für dich.</p>
          </div>
        </motion.div>
      )}

      {/* Überblick card — AI summary + matching signals + notes (matching only) */}
      {matchingEnabled && !isNew && !isPlaced && (commentary || matchingNotes.length > 0) && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26 }} className="mb-8">
          <div className="rounded-[16px] p-5" style={{ background: "rgba(255,255,252,0.8)", border: "1px solid rgba(0,0,0,0.06)" }}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={TEAL[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <span className="text-[13px] font-[550] tracking-[-0.01em]" style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}>
                So sehen wir dich
              </span>
              <span className="text-[10.5px] font-[420] py-[2px] px-[7px] rounded-full ml-auto" style={{ background: `${TEAL.glow}0.08)`, color: TEAL[500], fontFamily: "'Satoshi', sans-serif" }}>
                Aus Gesprächen mit deinem Coach
              </span>
            </div>

            {/* AI commentary */}
            {commentary && (
              <p className="text-[14px] font-[420] leading-[1.65] m-0" style={{ color: "#6B6660", fontFamily: "'Source Serif 4', Georgia, serif" }}>
                {commentary}
              </p>
            )}

            {/* Matching signals */}
            {matchingNotes.length > 0 && (
              <div className="mt-4 pt-4 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-2.5 mb-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0A99F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  <span className="text-[12px] font-[520]" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
                    Was wir über dich wissen
                  </span>
                  <span className="text-[11px] font-[450] ml-auto" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                    {matchingNotes.length} {matchingNotes.length === 1 ? "Signal" : "Signale"}
                  </span>
                </div>

                {/* Show first 3 notes as signal pills */}
                <div className="flex flex-wrap gap-1.5">
                  {matchingNotes.slice(0, 3).map((note, i) => (
                    <span key={i} className="text-[11.5px] font-[430] py-[4px] px-[10px] rounded-full" style={{ background: "rgba(0,0,0,0.03)", color: "#6B6660", fontFamily: "'Satoshi', sans-serif" }}>
                      {note.text}
                    </span>
                  ))}
                </div>

                {/* Expandable remaining notes */}
                {matchingNotes.length > 3 && (
                  <>
                    <button
                      onClick={() => setShowNotes(v => !v)}
                      className="flex items-center gap-1.5 mt-1 border-none bg-transparent cursor-pointer transition-colors duration-200 p-0"
                      style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transform: showNotes ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
                      >
                        <path d="M9 18l6-6-6-6"/>
                      </svg>
                      <span className="text-[12px] font-[450]">
                        {showNotes ? "Weniger anzeigen" : `${matchingNotes.length - 3} weitere anzeigen`}
                      </span>
                    </button>
                    <AnimatePresence>
                      {showNotes && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {matchingNotes.slice(3).map((note, i) => (
                              <span key={i} className="text-[11.5px] font-[430] py-[4px] px-[10px] rounded-full" style={{ background: "rgba(0,0,0,0.03)", color: "#6B6660", fontFamily: "'Satoshi', sans-serif" }}>
                                {note.text}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Profile section ── */}

      {/* Lebenslauf */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.22 }} className="mb-6">
        <h2 className="text-[18px] font-normal tracking-[-0.02em] mb-3" style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}>Lebenslauf</h2>
        <div
          className="rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-[1px] group"
          style={{
            background: hasResume ? "#FFFFFF" : "rgba(255,255,252,0.6)",
            border: hasResume ? "1px solid rgba(0,0,0,0.08)" : "2px dashed rgba(0,0,0,0.1)",
            boxShadow: hasResume ? "0 2px 12px -3px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)" : "none",
          }}
        >
          {hasResume ? (
            <div className="flex">
              <div className="w-[120px] shrink-0 flex flex-col items-center justify-center py-6 px-3" style={{ background: "linear-gradient(180deg, #F8F7F5 0%, #F3F0EC 100%)", borderRight: "1px solid rgba(0,0,0,0.05)" }}>
                <div className="w-[72px] rounded-[3px] p-2 flex flex-col gap-[4px]" style={{ aspectRatio: "210 / 297", background: "#FFFFFF", boxShadow: "0 1px 6px -1px rgba(0,0,0,0.08), 0 0.5px 2px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div className="w-[60%] h-[3px] rounded-full" style={{ background: "#2C2A27", opacity: 0.2 }} />
                  <div className="w-[40%] h-[2px] rounded-full mt-[2px]" style={{ background: "#2C2A27", opacity: 0.1 }} />
                  <div className="mt-[4px] flex flex-col gap-[2px]">
                    <div className="w-full h-[2px] rounded-full" style={{ background: "#2C2A27", opacity: 0.06 }} />
                    <div className="w-[90%] h-[2px] rounded-full" style={{ background: "#2C2A27", opacity: 0.06 }} />
                    <div className="w-[75%] h-[2px] rounded-full" style={{ background: "#2C2A27", opacity: 0.06 }} />
                  </div>
                  <div className="mt-[4px] flex flex-col gap-[2px]">
                    <div className="w-[50%] h-[2px] rounded-full" style={{ background: "#2C2A27", opacity: 0.1 }} />
                    <div className="w-full h-[2px] rounded-full" style={{ background: "#2C2A27", opacity: 0.06 }} />
                    <div className="w-[70%] h-[2px] rounded-full" style={{ background: "#2C2A27", opacity: 0.06 }} />
                  </div>
                </div>
                <span className="text-[10px] font-[450] mt-2" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>PDF · 2 Seiten</span>
              </div>
              <div className="flex-1 py-5 px-5 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[16px] font-[560] tracking-[-0.015em]" style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}>Lebenslauf</span>
                  <span className="text-[10px] font-[500] py-[2px] px-[7px] rounded-full" style={{ background: "#E8F3EE", color: "#3A8F6E", fontFamily: "'Satoshi', sans-serif" }}>Aktuell</span>
                </div>
                {resumePreview.length > 0 && (
                  <p className="text-[12.5px] font-[420] leading-[1.5] m-0 mb-3 line-clamp-2" style={{ color: "#8A857E", fontFamily: "'Source Serif 4', Georgia, serif" }}>{resumePreview[0]}</p>
                )}
                <span className="text-[12px] font-[480] inline-flex items-center gap-1.5 transition-colors duration-200 group-hover:text-[#256B5E]" style={{ color: TEAL[500], fontFamily: "'Satoshi', sans-serif" }}>
                  Anzeigen <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          ) : (
            <div className="py-8 px-6 text-center">
              <div className="mx-auto mb-4 w-[56px] flex items-center justify-center" style={{ aspectRatio: "210 / 297" }}>
                <div className="w-full h-full rounded-[3px] flex items-center justify-center" style={{ border: "2px dashed rgba(0,0,0,0.1)", background: "rgba(0,0,0,0.015)" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C8C0B4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </div>
              </div>
              <span className="text-[15px] font-[540] block mb-1.5" style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}>Lebenslauf erstellen</span>
              <p className="text-[13px] font-[420] leading-[1.5] m-0 max-w-[320px] mx-auto" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>Dein Coach hilft dir dabei. Je besser dein Lebenslauf, desto besser die Vorschläge.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Other documents */}
      {otherDocs.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.26 }} className="mb-8">
          <h2 className="text-[18px] font-normal tracking-[-0.02em] mb-3" style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}>Unterlagen</h2>
          <div className="flex flex-col gap-1.5">
            {otherDocs.map((d, i) => (
              <div key={i} className="flex items-center gap-3 rounded-[10px] py-2.5 px-3.5 cursor-pointer transition-all duration-200 hover:bg-[rgba(0,0,0,0.02)]" style={{ background: "rgba(255,255,252,0.5)", border: "1px solid rgba(0,0,0,0.04)" }}>
                <div className="size-[30px] rounded-[7px] flex items-center justify-center shrink-0" style={{ background: "rgba(0,0,0,0.03)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B0A99F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-[500]" style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}>{d.name}</div>
                  <div className="text-[11px] font-[420]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>{d.type} · {d.date}</div>
                </div>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C8C0B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Feedback CTA */}
      {matches.length > 0 && !isPlaced && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.34 }}>
          <div
            className="rounded-[16px] p-5 cursor-pointer transition-all duration-200 hover:-translate-y-px"
            style={{ background: `${TEAL.glow}0.03)`, border: `1px solid ${TEAL.glow}0.1)` }}
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex items-start gap-3.5">
              <div className="size-[36px] rounded-full shrink-0 flex items-center justify-center mt-0.5" style={{ background: `${TEAL.glow}0.07)` }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={TEAL[500]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <div className="flex-1">
                <span className="text-[14px] font-[520] block mb-1" style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}>Passt etwas nicht?</span>
                <p className="text-[13px] font-[420] leading-[1.5] m-0" style={{ color: "#6B6660", fontFamily: "'Source Serif 4', Georgia, serif" }}>Sag uns, was du dir anders wünschst — andere Arbeitszeiten, ein anderer Bereich, kürzerer Weg.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="pt-8 text-center">
        <p className="text-[12px] font-[420] m-0" style={{ color: "#C8C0B4", fontFamily: "'Satoshi', sans-serif" }}>Fragen? Sprich mit deinem Coach {participant.coach}.</p>
      </motion.div>
    </div>
  );

  /* ── View: Stellen ── */
  const renderStellen = () => (
    <div className="max-w-[600px] mx-auto px-6 pt-6 pb-32">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
        <h1 className="text-[24px] font-normal tracking-[-0.02em] mb-1" style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}>
          {isPlaced ? "Dein Weg" : "Stellen für dich"}
        </h1>
        {!isPlaced && matches.length > 0 && (
          <p className="text-[13px] font-[420] mb-5" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
            {matches.length} {matches.length === 1 ? "Stelle passt" : "Stellen passen"} zu deinem Profil
          </p>
        )}
        {isPlaced && <p className="text-[13px] font-[420] mb-5" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>Das war dein Vermittlungsprozess.</p>}
      </motion.div>

      {/* Filter pills */}
      {!isPlaced && matches.length > 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }} className="flex items-center gap-2 mb-6">
          {([
            { key: "alle" as MatchFilter, label: "Alle", count: matches.length },
            ...(inConversation > 0 ? [{ key: "kennenlernen" as MatchFilter, label: "Im Kennenlernen", count: inConversation }] : []),
            ...(proposals > 0 ? [{ key: "neu" as MatchFilter, label: "Neu", count: proposals }] : []),
          ]).map(f => (
            <button
              key={f.key}
              onClick={() => setMatchFilter(f.key)}
              className="text-[12px] font-[500] py-[5px] px-[12px] rounded-full border-none cursor-pointer transition-all duration-200"
              style={{ background: matchFilter === f.key ? "#2C2A27" : "rgba(0,0,0,0.04)", color: matchFilter === f.key ? "#FFFFFF" : "#8A857E", fontFamily: "'Satoshi', sans-serif" }}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </motion.div>
      )}

      {/* AI commentary on stellen page */}
      {commentary && !isPlaced && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }} className="mb-5">
          <div className="flex gap-3">
            <div className="size-[28px] rounded-full shrink-0 flex items-center justify-center mt-0.5" style={{ background: `${TEAL.glow}0.08)` }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={TEAL[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div className="flex-1 rounded-[12px] rounded-tl-[4px] py-3 px-4" style={{ background: `${TEAL.glow}0.04)`, border: `1px solid ${TEAL.glow}0.08)` }}>
              <p className="text-[13px] font-[430] leading-[1.55] m-0" style={{ color: "#4A6B63", fontFamily: "'Source Serif 4', Georgia, serif" }}>{commentary}</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-4">
        {filteredMatches.map((m, i) => matchCard(m, i, 0.15))}
      </div>

      {filteredMatches.length === 0 && matches.length > 0 && (
        <div className="text-center py-10">
          <p className="text-[13px] font-[420]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>Keine Stellen in dieser Kategorie.</p>
        </div>
      )}

      {matches.length === 0 && (
        <div className="text-center py-16">
          <div className="size-[48px] rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.03)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B0A99F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
          <p className="text-[14px] font-[420] leading-[1.5] m-0 max-w-[300px] mx-auto" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>Wir suchen gerade nach passenden Stellen für dich.</p>
        </div>
      )}
    </div>
  );

  const matchBadge = tab !== "stellen" && (inConversation + proposals) > 0;

  return (
    <div
      className="relative h-screen flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #FDFCFA 0%, #F9F7F4 40%, #F5F2ED 100%)" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(80,60,40,0.07) 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, transparent 75%)",
        }}
      />

      {/* Top bar with navigation */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-6 h-[52px] shrink-0"
        style={{
          background: "rgba(255,255,252,0.85)",
          backdropFilter: "blur(12px) saturate(1.4)",
          borderBottom: "1px solid rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="size-[24px] rounded-[7px] flex items-center justify-center" style={{ background: TEAL[500] }}>
            <span className="text-white text-[12px] font-[600]" style={{ fontFamily: "'Satoshi', sans-serif" }}>V</span>
          </div>
          <span className="text-[15px] font-[520] tracking-[-0.02em]" style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}>
            Vermittelbar
          </span>
        </div>

        {/* Navigation tabs — only show when matching is enabled */}
        {matchingEnabled ? (
          <div className="flex items-center gap-1 rounded-full p-[3px]" style={{ background: "rgba(0,0,0,0.03)" }}>
            {([
              { key: "start" as Tab, label: "Start" },
              { key: "stellen" as Tab, label: "Stellen" },
            ]).map(t => (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); if (t.key !== "stellen") setMatchFilter("alle"); }}
                className="relative text-[12.5px] font-[520] py-[5px] px-[14px] rounded-full border-none cursor-pointer transition-all duration-200"
                style={{
                  background: tab === t.key ? "rgba(255,255,252,0.95)" : "transparent",
                  color: tab === t.key ? "#2C2A27" : "#A09A92",
                  boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                {t.label}
                {/* Badge */}
                {t.key === "stellen" && matchBadge && (
                  <div
                    className="absolute -top-0.5 -right-0.5 size-[7px] rounded-full"
                    style={{ background: "#C49240" }}
                  />
                )}
              </button>
            ))}
          </div>
        ) : <div />}

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="size-[30px] rounded-full overflow-hidden" style={{ border: `2px solid ${meta.color}40` }}>
            <img src={participant.avatar} alt={firstName} className="size-full object-cover" draggable={false} />
          </div>
          <span className="text-[13px] font-[480]" style={{ color: "#6B6660", fontFamily: "'Satoshi', sans-serif" }}>{firstName}</span>
        </div>
      </div>

      {/* Scrollable tab content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {tab === "start" && renderStart()}
            {tab === "stellen" && renderStellen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating chat bar */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 px-5 pb-5 pt-8 pointer-events-none"
        style={{ background: "linear-gradient(to top, #F5F2ED 50%, transparent)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-[540px] mx-auto pointer-events-auto"
        >
          {/* Suggestion chips */}
          {!isPlaced && matches.length > 0 && (
            <div className="flex items-center gap-2 mb-2 px-1 overflow-x-auto scrollbar-hide">
              {[
                "Ich möchte lieber Teilzeit",
                "Keine Schichtarbeit",
                "Was ist der nächste Schritt?",
              ].map((chip, i) => (
                <button
                  key={i}
                  onClick={() => { setPrompt(chip); inputRef.current?.focus(); }}
                  className="text-[11.5px] font-[450] py-[5px] px-[11px] rounded-full border-none cursor-pointer whitespace-nowrap transition-all duration-200 hover:-translate-y-px"
                  style={{ background: "rgba(255,255,252,0.85)", color: "#8A857E", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", fontFamily: "'Satoshi', sans-serif" }}
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          <div
            className="relative rounded-full flex items-center transition-[box-shadow,border-color] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ background: "rgba(255,255,252,0.95)", border: "1px solid rgba(0,0,0,0.07)", padding: "4px 4px 4px 18px", boxShadow: "0 4px 24px -6px rgba(40,30,20,0.1), 0 1px 3px rgba(0,0,0,0.03)" }}
            onFocus={e => { e.currentTarget.style.borderColor = `${TEAL.glow}0.25)`; e.currentTarget.style.boxShadow = `0 0 0 4px ${TEAL.glow}0.06), 0 8px 40px -8px rgba(0,0,0,0.08)`; }}
            onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) { e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)"; e.currentTarget.style.boxShadow = "0 4px 24px -6px rgba(40,30,20,0.1), 0 1px 3px rgba(0,0,0,0.03)"; } }}
          >
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={isNew ? "Erzähl uns, was du dir wünschst..." : isPlaced ? "Wie läuft es bei dir?" : "Sag uns, was du dir wünschst oder was nicht passt..."}
              className="flex-1 bg-transparent border-none text-[14px] font-[450] py-3 tracking-[-0.005em] focus:outline-none placeholder-warm"
              style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}
            />
            <button
              className="size-[36px] rounded-full border-none cursor-pointer flex items-center justify-center shrink-0 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.06] active:scale-[0.97]"
              style={{ background: TEAL[500], boxShadow: `0 2px 8px -2px ${TEAL.glow}0.22)`, opacity: prompt.trim() ? 1 : 0.5 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
