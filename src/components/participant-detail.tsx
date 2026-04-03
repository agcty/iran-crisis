import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { PARTICIPANTS, STATUS_META, TEAL, matchingStrength, matchingLabel, needsAction, urgentReason, type Participant } from "../data/participant-data";
import { useFeatureFlags } from "../feature-flags";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface Match {
  company: string;
  role: string;
  status: "Eingestellt" | "Im Gespräch" | "Vorgeschlagen";
  fit: "Stark" | "Gut" | "Möglich";
  reason: string;
  location: string;
  distance: string;
  type: "Vollzeit" | "Teilzeit" | "Minijob";
  nextAction: string;
  gap?: boolean; // true = open question (knowledge gap), false/undefined = factual status
  matchedOn: string;
}

const MATCH_STATUS = {
  "Eingestellt":   { color: "#3A8F6E", bg: "#E8F3EE" },
  "Im Gespräch":   { color: "#C49240", bg: "#F6F0E4" },
  "Vorgeschlagen": { color: "#9A7DB8", bg: "#F0ECF4" },
} as const;

const FIT_STYLE = {
  "Stark":   { color: "#3A8F6E", bg: "rgba(58,143,110,0.08)" },
  "Gut":     { color: "#5A8BB8", bg: "rgba(90,139,184,0.08)" },
  "Möglich": { color: "#C49240", bg: "rgba(196,146,64,0.08)" },
} as const;

function getMatchesForParticipant(p: Participant): Match[] {
  const matches: Record<number, Match[]> = {
    1: [ // Amina — Einzelhandel, Gastronomie-Erfahrung
      { company: "REWE", role: "Verkaufshilfe", status: "Im Gespräch", fit: "Stark", reason: "Gastronomie-Erfahrung, Kundenkontakt, Schichtbereitschaft", location: "Berlin-Neukölln", distance: "15 Min.", type: "Teilzeit", nextAction: "Vorstellungsgespräch am 14. Mär", matchedOn: "3. Mär 2025" },
      { company: "dm-drogerie", role: "Verkäuferin", status: "Vorgeschlagen", fit: "Gut", reason: "Kundenorientiert, zuverlässig, flexible Zeiten", location: "Berlin-Kreuzberg", distance: "22 Min.", type: "Teilzeit", nextAction: "Bewerbung ausstehend", gap: true, matchedOn: "5. Mär 2025" },
      { company: "Lidl", role: "Kassiererin", status: "Vorgeschlagen", fit: "Möglich", reason: "Einzelhandel passt, Schichtarbeit könnte schwierig sein", location: "Berlin-Tempelhof", distance: "28 Min.", type: "Vollzeit", nextAction: "Schichtbereitschaft unbekannt", gap: true, matchedOn: "7. Mär 2025" },
    ],
    2: [ // Sarah — bei REWE vermittelt
      { company: "REWE", role: "Verkäuferin", status: "Eingestellt", fit: "Stark", reason: "Passte perfekt: Kundenkontakt, Nähe, Teilzeit möglich", location: "Berlin-Mitte", distance: "12 Min.", type: "Teilzeit", nextAction: "Nachbetreuung in 4 Wochen", matchedOn: "10. Feb 2025" },
    ],
    4: [ // Fatima — bei Lidl vermittelt
      { company: "Lidl", role: "Verkäuferin", status: "Eingestellt", fit: "Stark", reason: "Praxiserfahrung durch Kurs, hohe Motivation", location: "Berlin-Wedding", distance: "18 Min.", type: "Vollzeit", nextAction: "Nachbetreuung in 2 Wochen", matchedOn: "15. Feb 2025" },
    ],
    6: [ // Leon — Logistik, Gabelstapler, max 30 Min pendeln
      { company: "DHL", role: "Lagerarbeiter", status: "Im Gespräch", fit: "Stark", reason: "Gabelstaplerschein, Amazon-Erfahrung, kurze Pendelzeit", location: "Berlin-Spandau", distance: "18 Min.", type: "Vollzeit", nextAction: "Probearbeitstag am 12. Mär", matchedOn: "28. Feb 2025" },
      { company: "Hermes", role: "Kommissionierer", status: "Vorgeschlagen", fit: "Gut", reason: "Lagererfahrung passt, Schichtmodell flexibel", location: "Potsdam", distance: "25 Min.", type: "Vollzeit", nextAction: "Bewerbung ausstehend", gap: true, matchedOn: "4. Mär 2025" },
    ],
    8: [ // Clara — bei DHL vermittelt
      { company: "DHL", role: "Paketbotin", status: "Eingestellt", fit: "Stark", reason: "Mag körperliche Arbeit und Unabhängigkeit", location: "Berlin-Lichtenberg", distance: "20 Min.", type: "Vollzeit", nextAction: "Nachbetreuung abgeschlossen", matchedOn: "5. Feb 2025" },
    ],
    9: [ // Marko — Elektriker, kleiner Betrieb
      { company: "Elektro Schulz", role: "Elektriker-Helfer", status: "Im Gespräch", fit: "Stark", reason: "Gelernter Elektriker, Anerkennung läuft, kleiner Familienbetrieb", location: "Berlin-Charlottenburg", distance: "20 Min.", type: "Vollzeit", nextAction: "Anerkennungsbescheid nachreichen", matchedOn: "1. Mär 2025" },
      { company: "Berliner Haustechnik", role: "Servicetechniker", status: "Vorgeschlagen", fit: "Möglich", reason: "Fachlich passend, aber Großunternehmen — bevorzugt kleinen Betrieb", location: "Berlin-Marzahn", distance: "35 Min.", type: "Vollzeit", nextAction: "Noch nicht besprochen", gap: true, matchedOn: "6. Mär 2025" },
    ],
    10: [ // Nadia — Gesundheit, Pflege
      { company: "Vivantes Klinikum", role: "Pflegehelferin", status: "Im Gespräch", fit: "Gut", reason: "Pflegeerfahrung, empathisch — B2 fehlt noch", location: "Berlin-Friedrichshain", distance: "15 Min.", type: "Vollzeit", nextAction: "B2-Zertifikat abwarten", matchedOn: "25. Feb 2025" },
      { company: "Caritas Altenpflege", role: "Betreuungsassistenz", status: "Vorgeschlagen", fit: "Stark", reason: "Kein B2 nötig, Erfahrung passt, einfühlsam", location: "Berlin-Schöneberg", distance: "22 Min.", type: "Teilzeit", nextAction: "Bewerbung ausstehend", gap: true, matchedOn: "4. Mär 2025" },
    ],
    14: [ // Marco — bei Edeka vermittelt
      { company: "Edeka", role: "Verkaufshilfe", status: "Eingestellt", fit: "Stark", reason: "Sehr motiviert im Gespräch, trotz schwieriger Phase überzeugt", location: "Berlin-Prenzlauer Berg", distance: "10 Min.", type: "Vollzeit", nextAction: "Nachbetreuung in 4 Wochen", matchedOn: "18. Feb 2025" },
    ],
    15: [ // Kira — kreativ, Design, Marketing
      { company: "Kreativagentur Funke", role: "Social Media Assistenz", status: "Vorgeschlagen", fit: "Gut", reason: "Canva-Kenntnisse, Social Media Erfahrung", location: "Berlin-Mitte", distance: "25 Min.", type: "Teilzeit", nextAction: "Kein Portfolio vorhanden", gap: true, matchedOn: "5. Mär 2025" },
      { company: "Print & Co", role: "Grafik-Praktikum", status: "Vorgeschlagen", fit: "Möglich", reason: "Einstieg in Grafik, aber formale Qualifikation fehlt", location: "Berlin-Kreuzberg", distance: "18 Min.", type: "Vollzeit", nextAction: "Noch nicht besprochen", gap: true, matchedOn: "7. Mär 2025" },
    ],
    18: [ // Lisa — Industriekauffrau, Wiedereinstieg, Teilzeit
      { company: "Siemens", role: "Sachbearbeiterin Einkauf", status: "Im Gespräch", fit: "Stark", reason: "6 Jahre Erfahrung als Industriekauffrau, Teilzeit möglich", location: "Berlin-Siemensstadt", distance: "22 Min.", type: "Teilzeit", nextAction: "Zweitgespräch am 11. Mär", matchedOn: "24. Feb 2025" },
      { company: "BMW Berlin", role: "Auftragsabwicklung", status: "Vorgeschlagen", fit: "Gut", reason: "Kaufmännische Erfahrung, strukturierte Arbeitsweise", location: "Berlin-Spandau", distance: "30 Min.", type: "Teilzeit", nextAction: "Bewerbung ausstehend", gap: true, matchedOn: "3. Mär 2025" },
      { company: "Bosch", role: "Projektassistenz", status: "Vorgeschlagen", fit: "Gut", reason: "Kommunikativ, organisiert — Vollzeit könnte Hürde sein", location: "Berlin-Adlershof", distance: "40 Min.", type: "Vollzeit", nextAction: "Teilzeit ungeklärt", gap: true, matchedOn: "6. Mär 2025" },
    ],
    24: [ // Stefan — ex-Lagerist, will Kundenservice
      { company: "Zalando", role: "Kundenberater", status: "Im Gespräch", fit: "Gut", reason: "Geduldig, menschenorientiert — Quereinstieg aus Lager", location: "Berlin-Friedrichshain", distance: "20 Min.", type: "Vollzeit", nextAction: "Hospitation am 13. Mär", matchedOn: "27. Feb 2025" },
      { company: "Deutsche Bahn", role: "Service-Mitarbeiter", status: "Vorgeschlagen", fit: "Möglich", reason: "Kundenservice passt, Schichtdienst muss geklärt werden", location: "Berlin Hauptbahnhof", distance: "15 Min.", type: "Vollzeit", nextAction: "Schichtmodell ungeklärt", gap: true, matchedOn: "5. Mär 2025" },
    ],
  };
  return matches[p.id] ?? [];
}

interface Dokument {
  name: string;
  type: string;
  date: string;
}

function getDocumentsForParticipant(p: Participant): Dokument[] {
  const docs: Dokument[] = [
    { name: "Lebenslauf", type: "PDF", date: "12. Feb 2025" },
  ];
  if (p.status !== "Neu") {
    docs.push({ name: "Zertifikat Deutsch B2", type: "PDF", date: "3. Jan 2025" });
  }
  if (p.reportStatus === "veröffentlicht") {
    docs.push({ name: "Coach-Bericht", type: "PDF", date: "1. Mär 2025" });
  }
  return docs;
}

interface AiInsight {
  text: string;
  source: "Chat" | "Coach-Notiz" | "Profil";
  date: string;
}

function getInsightsForParticipant(p: Participant): AiInsight[] {
  const insights: Record<number, AiInsight[]> = {
    1: [
      { text: "Möchte im Einzelhandel arbeiten, hat vorher in der Gastronomie gearbeitet.", source: "Chat", date: "24. Feb 2025" },
      { text: "Deutsch ist gut, aber formelle Formulierungen fallen schwer.", source: "Coach-Notiz", date: "28. Feb 2025" },
      { text: "Sehr zuverlässig und pünktlich.", source: "Coach-Notiz", date: "15. Feb 2025" },
    ],
    2: [
      { text: "Hat bei REWE im Verkauf angefangen, Kontakt mit Filialleitung gut.", source: "Coach-Notiz", date: "1. Mär 2025" },
      { text: "Selbstbewusstsein deutlich gestiegen seit Kursstart.", source: "Chat", date: "22. Feb 2025" },
    ],
    3: [
      { text: "Alleinerziehend, braucht flexible Arbeitszeiten.", source: "Chat", date: "10. Feb 2025" },
      { text: "Interesse an Büro- und Verwaltungstätigkeiten.", source: "Chat", date: "10. Feb 2025" },
      { text: "Kaufmännische Ausbildung, 4 Jahre Berufspause.", source: "Profil", date: "8. Feb 2025" },
    ],
    6: [
      { text: "Sucht Arbeit in Logistik oder Lager.", source: "Chat", date: "18. Feb 2025" },
      { text: "Hat Gabelstaplerschein und Erfahrung bei Amazon.", source: "Profil", date: "12. Feb 2025" },
      { text: "Pendelt ungern länger als 30 Min.", source: "Chat", date: "18. Feb 2025" },
    ],
    7: [
      { text: "Schwankt zwischen Gastronomie und Handwerk.", source: "Chat", date: "20. Feb 2025" },
      { text: "Braucht Zeit und Orientierung, nicht drängen.", source: "Coach-Notiz", date: "25. Feb 2025" },
    ],
    9: [
      { text: "Gelernter Elektriker, Anerkennung aus Serbien läuft.", source: "Profil", date: "5. Feb 2025" },
      { text: "Möchte in kleinem Betrieb arbeiten, nicht Großkonzern.", source: "Chat", date: "14. Feb 2025" },
    ],
    10: [
      { text: "Erfahrung als Pflegehelferin, möchte im Gesundheitsbereich bleiben.", source: "Chat", date: "20. Feb 2025" },
      { text: "B2-Zertifikat fehlt noch für Anerkennung.", source: "Profil", date: "15. Feb 2025" },
    ],
    14: [
      { text: "Hatte privat schwierige Phase während des Kurses.", source: "Coach-Notiz", date: "4. Mär 2025" },
      { text: "War beim Vorstellungsgespräch bei Edeka sehr motiviert.", source: "Coach-Notiz", date: "18. Feb 2025" },
    ],
    15: [
      { text: "Sucht Arbeit im kreativen Bereich — Grafikdesign oder Marketing.", source: "Chat", date: "22. Feb 2025" },
      { text: "Grundkenntnisse in Canva und Social Media.", source: "Profil", date: "18. Feb 2025" },
    ],
    16: [
      { text: "Möchte in der IT arbeiten, programmiert autodidaktisch.", source: "Chat", date: "26. Feb 2025" },
      { text: "Braucht Hilfe beim Lebenslauf und Bewerbungsprozess.", source: "Coach-Notiz", date: "1. Mär 2025" },
    ],
    18: [
      { text: "Industriekauffrau mit 6 Jahren Erfahrung.", source: "Profil", date: "10. Feb 2025" },
      { text: "Sucht nach Elternzeit den Wiedereinstieg, bevorzugt Teilzeit.", source: "Chat", date: "15. Feb 2025" },
      { text: "Sehr strukturiert und kommunikativ.", source: "Coach-Notiz", date: "20. Feb 2025" },
    ],
    24: [
      { text: "Langjährige Erfahrung als Lagerist, will sich Richtung Kundenservice umorientieren.", source: "Chat", date: "22. Feb 2025" },
      { text: "Freundlich und geduldig, kommt gut mit Menschen klar.", source: "Coach-Notiz", date: "28. Feb 2025" },
    ],
  };
  return insights[p.id] ?? [];
}

const SOURCE_STYLE = {
  "Chat":  { color: "#9A7DB8", bg: "rgba(154,125,184,0.08)" },
  "Coach-Notiz":  { color: "#5A8BB8", bg: "rgba(90,139,184,0.08)" },
  "Profil":       { color: "#8A8580", bg: "rgba(138,133,128,0.08)" },
} as const;

interface CoachNote {
  text: string;
  date: string;
  type: "matching" | "privat";
}

function getNotesForParticipant(p: Participant): CoachNote[] {
  const notes: Record<number, CoachNote[]> = {
    14: [
      { text: "Hatte privat eine sehr schwierige Phase. Einfühlsam bleiben, nicht zu viel Druck.", date: "4. Mär 2025", type: "privat" },
      { text: "Edeka-Stelle passt super, er war beim Gespräch sehr motiviert und überzeugend.", date: "18. Feb 2025", type: "matching" },
      { text: "Gute Auffassungsgabe, lernt schnell, kommt gut mit Kunden klar.", date: "12. Feb 2025", type: "matching" },
    ],
    2: [
      { text: "Sarah blüht richtig auf seit dem REWE-Start. Guter Kontakt mit der Filialleitung.", date: "1. Mär 2025", type: "matching" },
      { text: "War anfangs sehr unsicher, hat sich enorm entwickelt. Stolz auf sie.", date: "20. Feb 2025", type: "privat" },
    ],
    1: [
      { text: "Deutsch ist gut, aber formelle Formulierungen fallen ihr schwer. Bewerbungsschreiben gemeinsam üben.", date: "28. Feb 2025", type: "matching" },
      { text: "Sehr zuverlässig, immer pünktlich. Arbeitgeber werden das mögen.", date: "15. Feb 2025", type: "matching" },
      { text: "Hat Angst vor Telefonaten — lieber persönlich oder per Mail. Nicht unter Druck setzen.", date: "22. Feb 2025", type: "privat" },
      { text: "Erfahrung in der Gastronomie, möchte jetzt in den Einzelhandel wechseln. Schichtbereitschaft vorhanden.", date: "10. Feb 2025", type: "matching" },
    ],
    7: [
      { text: "Schwankt zwischen Gastronomie und Handwerk. Braucht Orientierung, nicht drängen.", date: "25. Feb 2025", type: "privat" },
      { text: "Spricht gut Deutsch, ist motiviert. Handwerkliches Geschick im Kurs aufgefallen.", date: "22. Feb 2025", type: "matching" },
    ],
    5: [
      { text: "Wirkt im Erstgespräch zurückhaltend, aber interessiert. Braucht wahrscheinlich Anlaufzeit.", date: "20. Feb 2025", type: "privat" },
      { text: "Handwerkliche Berufe als Wunsch genannt.", date: "20. Feb 2025", type: "matching" },
    ],
    6: [
      { text: "Gabelstaplerschein vorhanden. Erfahrung bei Amazon im Lager. Pendelt ungern > 30 Min.", date: "18. Feb 2025", type: "matching" },
      { text: "Sucht bevorzugt in Logistik/Lager.", date: "12. Feb 2025", type: "matching" },
      { text: "Wirkt manchmal unmotiviert, braucht klare Strukturen und Deadlines.", date: "15. Feb 2025", type: "privat" },
    ],
    9: [
      { text: "Gelernter Elektriker aus Serbien, Anerkennung läuft. Fachlich sehr kompetent.", date: "14. Feb 2025", type: "matching" },
      { text: "Möchte in kleinem Betrieb arbeiten, nicht Großkonzern.", date: "20. Feb 2025", type: "matching" },
      { text: "Ruhig, braucht manchmal Ermutigung. Sprachbarriere macht ihn unsicher, obwohl sein Deutsch okay ist.", date: "18. Feb 2025", type: "privat" },
    ],
    10: [
      { text: "Erfahrung als Pflegehelferin, möchte im Gesundheitsbereich bleiben. Sehr empathisch.", date: "20. Feb 2025", type: "matching" },
      { text: "B2-Zertifikat fehlt noch, ist angemeldet zur Prüfung.", date: "25. Feb 2025", type: "matching" },
    ],
    15: [
      { text: "Interesse an Grafikdesign und Marketing. Canva- und Social-Media-Grundkenntnisse.", date: "22. Feb 2025", type: "matching" },
      { text: "Wenig formale Qualifikationen — Portfolio aufbauen wäre wichtig.", date: "26. Feb 2025", type: "matching" },
    ],
    18: [
      { text: "Industriekauffrau, 6 Jahre Erfahrung. Wiedereinstieg nach Elternzeit, bevorzugt Teilzeit.", date: "15. Feb 2025", type: "matching" },
      { text: "Sehr strukturiert und kommunikativ. Top-Kandidatin.", date: "20. Feb 2025", type: "matching" },
      { text: "Macht sich Sorgen, ob sie nach der Elternzeit noch mithalten kann. Selbstvertrauen stärken.", date: "18. Feb 2025", type: "privat" },
    ],
    24: [
      { text: "Langjährige Erfahrung als Lagerist, will sich Richtung Kundenservice umorientieren.", date: "22. Feb 2025", type: "matching" },
      { text: "Freundlich und geduldig, kommt gut mit Menschen klar.", date: "28. Feb 2025", type: "matching" },
      { text: "Braucht noch Überzeugungsarbeit im Lebenslauf — unterschätzt sich selbst.", date: "1. Mär 2025", type: "privat" },
    ],
  };
  return notes[p.id] ?? [];
}

/* ------------------------------------------------------------------ */
/*  Überblick Card                                                     */
/* ------------------------------------------------------------------ */

function OverblickCard({ participant }: { participant: Participant }) {
  const [showSources, setShowSources] = useState(false);
  const insights = getInsightsForParticipant(participant);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
      className="mb-10"
    >
      <div
        className="rounded-[16px] p-5"
        style={{
          background: "rgba(255,255,252,0.8)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9A7DB8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
          <span
            className="text-[13px] font-[550] tracking-[-0.01em]"
            style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}
          >
            Überblick
          </span>
          <span
            className="text-[10.5px] font-[420] py-[2px] px-[7px] rounded-full ml-auto"
            style={{ background: "rgba(154,125,184,0.08)", color: "#9A7DB8", fontFamily: "'Satoshi', sans-serif" }}
          >
            Aus Notizen & Gesprächen
          </span>
        </div>

        {/* Summary */}
        <p
          className="text-[14px] font-[420] leading-[1.65] m-0"
          style={{ color: "#6B6660", fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          {participant.aiSummary}
        </p>

        {/* Sources toggle */}
        {insights.length > 0 && (
          <>
            <button
              onClick={() => setShowSources(v => !v)}
              className="flex items-center gap-1.5 mt-3.5 border-none bg-transparent cursor-pointer transition-colors duration-200 p-0"
              style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transform: showSources ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                <path d="M9 18l6-6-6-6"/>
              </svg>
              <span className="text-[12px] font-[450]">
                {showSources ? "Quellen ausblenden" : `${insights.length} Quellen anzeigen`}
              </span>
            </button>

            {/* Expandable sources */}
            <AnimatePresence>
              {showSources && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-2 mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}>
                    {insights.map((ins, i) => {
                      const s = SOURCE_STYLE[ins.source];
                      return (
                        <div key={i} className="flex items-start gap-2.5">
                          <span
                            className="text-[10px] font-[480] py-[2px] px-[6px] rounded-full shrink-0 mt-[3px]"
                            style={{ background: s.bg, color: s.color, fontFamily: "'Satoshi', sans-serif", whiteSpace: "nowrap" }}
                          >
                            {ins.source}
                          </span>
                          <span
                            className="text-[12.5px] font-[420] leading-[1.5] flex-1"
                            style={{ color: "#6B6660", fontFamily: "'Source Serif 4', Georgia, serif" }}
                          >
                            {ins.text}
                          </span>
                          <span
                            className="text-[10.5px] font-[400] shrink-0 mt-[2px]"
                            style={{ color: "#C8C0B4", fontFamily: "'Satoshi', sans-serif", whiteSpace: "nowrap" }}
                          >
                            {ins.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Matching Strength Card                                             */
/* ------------------------------------------------------------------ */

function MatchingStrengthCard({ participant }: { participant: Participant }) {
  const { matchingEnabled } = useFeatureFlags();
  const strength = matchingStrength(participant);
  const { label, color } = matchingLabel(strength);

  if (!matchingEnabled) return null;
  if (participant.status === "Neu") return null;
  if (participant.status === "Vermittelt") return null;

  const hasReport = participant.reportStatus !== "nicht begonnen";
  const reportPublished = participant.reportStatus === "veröffentlicht";
  const matchingNotes = getNotesForParticipant(participant).filter(n => n.type === "matching");
  const matchingNoteCount = matchingNotes.length;

  // Build signal items
  const signals = [
    { label: "Profil erstellt", active: true },
    { label: `${matchingNoteCount} Matching-Notizen`, active: matchingNoteCount > 0, emphasis: matchingNoteCount < 2 },
    {
      label: reportPublished ? "Bericht veröffentlicht" : hasReport ? "Bericht (Entwurf)" : "Bericht nicht begonnen",
      active: hasReport,
      emphasis: !hasReport && matchingNoteCount >= 3,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
      className="mb-10"
    >
      <div
        className="rounded-[16px] p-5"
        style={{
          background: "rgba(255,255,252,0.8)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Strength header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span
              className="text-[13px] font-[550] tracking-[-0.01em]"
              style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}
            >
              Matching-Signale
            </span>
          </div>
          <span
            className="text-[12px] font-[520] py-[3px] px-[10px] rounded-full"
            style={{ background: `${color}15`, color, fontFamily: "'Satoshi', sans-serif" }}
          >
            {label}
          </span>
        </div>

        {/* Strength bar */}
        <div
          className="h-[5px] rounded-full mb-4"
          style={{ background: "rgba(0,0,0,0.05)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.max(strength * 100, 4)}%`,
              background: `linear-gradient(90deg, ${color}90, ${color})`,
            }}
          />
        </div>

        {/* Signal breakdown */}
        <div className="flex flex-col gap-2">
          {signals.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className="size-[16px] rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: s.active ? `${color}15` : "rgba(0,0,0,0.04)",
                }}
              >
                {s.active ? (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <div className="size-[5px] rounded-full" style={{ background: "#C8C0B4" }} />
                )}
              </div>
              <span
                className="text-[12.5px] font-[430]"
                style={{
                  color: s.active ? "#6B6660" : "#B0A99F",
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                {s.label}
              </span>
              {s.emphasis && (
                <span
                  className="text-[10.5px] font-[450] py-[1px] px-[7px] rounded-full"
                  style={{ background: "rgba(196,146,64,0.1)", color: "#C49240", fontFamily: "'Satoshi', sans-serif" }}
                >
                  {s.active ? "Mehr hinzufügen" : "Verbessert Matching"}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Report CTA — shows when coach has enough notes but no report */}
        {!hasReport && participant.notesCount >= 4 && (
          <button
            className="mt-4 w-full py-[9px] rounded-[10px] border-none text-[13px] font-[520] cursor-pointer transition-all duration-200 hover:-translate-y-px"
            style={{
              background: TEAL[500],
              color: "white",
              fontFamily: "'Satoshi', sans-serif",
              boxShadow: `0 2px 8px -2px ${TEAL.glow}0.25)`,
            }}
          >
            Bericht aus Notizen erstellen
          </button>
        )}

        {/* Draft report CTA */}
        {participant.reportStatus === "entwurf" && (
          <button
            className="mt-4 w-full py-[9px] rounded-[10px] border text-[13px] font-[520] cursor-pointer transition-all duration-200 hover:-translate-y-px"
            style={{
              background: "transparent",
              borderColor: `${TEAL[500]}30`,
              color: TEAL[500],
              fontFamily: "'Satoshi', sans-serif",
            }}
          >
            Bericht-Entwurf überprüfen & veröffentlichen
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ParticipantDetail() {
  const { id } = useParams<{ id: string }>();
  const { matchingEnabled } = useFeatureFlags();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [notesTab, setNotesTab] = useState<"matching" | "privat">("matching");
  const inputRef = useRef<HTMLInputElement>(null);

  const participant = PARTICIPANTS.find(p => p.id === Number(id));
  if (!participant) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(180deg, #FDFCFA 0%, #F9F7F4 40%, #F5F2ED 100%)" }}
      >
        <p className="text-lg" style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}>
          Teilnehmer nicht gefunden.
        </p>
      </div>
    );
  }

  const meta = STATUS_META[participant.status];
  const matches = matchingEnabled ? getMatchesForParticipant(participant) : [];
  const documents = getDocumentsForParticipant(participant);
  const notes = getNotesForParticipant(participant);

  return (
    <div
      className="relative h-full flex flex-col overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #FDFCFA 0%, #F9F7F4 40%, #F5F2ED 100%)",
      }}
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-[680px] mx-auto px-6 pt-8 pb-32">

          {/* Back link */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            onClick={() => navigate("/app/teilnehmer")}
            className="flex items-center gap-1.5 mb-8 border-none bg-transparent cursor-pointer transition-colors duration-200 hover:text-[#6B6660]"
            style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="text-[13px] font-[450]">Zurück</span>
          </motion.button>

          {/* Participant header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-center gap-5 mb-10"
          >
            <div
              className="size-[72px] rounded-full overflow-hidden shrink-0 transition-[border-color] duration-500"
              style={{
                border: `2.5px solid ${meta.color}30`,
              }}
            >
              <img src={participant.avatar} alt={participant.name} className="size-full object-cover" draggable={false} />
            </div>
            <div>
              <h1
                className="text-[28px] font-normal tracking-[-0.025em] leading-[1.2] mb-1.5"
                style={{ color: "#2C2A27", fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                {participant.name}
              </h1>
              <div className="flex items-center gap-2.5">
                <span
                  className="inline-flex items-center gap-[5px] py-[3px] pr-[9px] pl-[7px] rounded-full text-[11.5px] font-[520]"
                  style={{ background: `${meta.bg}`, color: meta.color, fontFamily: "'Satoshi', sans-serif" }}
                >
                  <span className="size-1.5 rounded-full" style={{ background: meta.color }} />
                  {participant.status}
                </span>
                <span className="text-[12.5px] font-[430]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                  {participant.coach} · {participant.massnahme}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Attention banner */}
          {needsAction(participant) && !dismissed && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
              className="mb-6"
            >
              <div
                className="flex items-center gap-3 rounded-[12px] py-3 px-4"
                style={{
                  background: "rgba(196,146,64,0.06)",
                  border: "1px solid rgba(196,146,64,0.12)",
                }}
              >
                <div
                  className="size-[8px] rounded-full shrink-0"
                  style={{ background: "#C49240" }}
                />
                <span
                  className="text-[13px] font-[480] flex-1"
                  style={{ color: "#96793A", fontFamily: "'Satoshi', sans-serif" }}
                >
                  {urgentReason(participant)}
                </span>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-[12px] font-[480] py-[4px] px-[10px] rounded-[8px] border-none cursor-pointer transition-all duration-200 hover:bg-[rgba(196,146,64,0.08)] shrink-0"
                  style={{
                    background: "rgba(196,146,64,0.04)",
                    color: "#96793A",
                    fontFamily: "'Satoshi', sans-serif",
                  }}
                >
                  Gesehen
                </button>
              </div>
            </motion.div>
          )}
          {dismissed && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <div
                className="flex items-center gap-3 rounded-[12px] py-2.5 px-4"
                style={{
                  background: "rgba(0,0,0,0.015)",
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#B0A99F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-[12.5px] font-[430] flex-1" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                  Gesehen — du kümmerst dich darum
                </span>
                <button
                  onClick={() => setDismissed(false)}
                  className="text-[11.5px] font-[430] border-none bg-transparent cursor-pointer p-0 transition-colors duration-200"
                  style={{ color: "#C8C0B4", fontFamily: "'Satoshi', sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#8A857E"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#C8C0B4"; }}
                >
                  Rückgängig
                </button>
              </div>
            </motion.div>
          )}

          {/* Überblick */}
          <OverblickCard participant={participant} />

          {/* Matching Strength */}
          <MatchingStrengthCard participant={participant} />

          {/* Matches — only for Im Matching / Vermittelt */}
          {matches.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="mb-10"
            >
              <h2
                className="text-[13px] font-[550] tracking-[0.04em] uppercase mb-3.5"
                style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
              >
                Matches
              </h2>
              <div className="flex flex-col gap-3">
                {matches.map((m, i) => {
                  const ms = MATCH_STATUS[m.status];
                  const fs = FIT_STYLE[m.fit];
                  return (
                    <div
                      key={i}
                      className="rounded-[14px] p-4 cursor-pointer transition-all duration-200 hover:-translate-y-px"
                      style={{
                        background: "rgba(255,255,252,0.8)",
                        border: "1px solid rgba(0,0,0,0.05)",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
                      }}
                    >
                      {/* Top: company + role + badges */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div
                            className="text-[15px] font-[580] tracking-[-0.01em]"
                            style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}
                          >
                            {m.company}
                          </div>
                          <div
                            className="text-[13px] font-[430] mt-0.5"
                            style={{ color: "#8A857E", fontFamily: "'Satoshi', sans-serif" }}
                          >
                            {m.role} · {m.type}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className="text-[10.5px] font-[520] py-[2px] px-[7px] rounded-full"
                            style={{ background: fs.bg, color: fs.color, fontFamily: "'Satoshi', sans-serif" }}
                          >
                            {m.fit}
                          </span>
                          <span
                            className="text-[10.5px] font-[520] py-[2px] px-[7px] rounded-full"
                            style={{ background: ms.bg, color: ms.color, fontFamily: "'Satoshi', sans-serif" }}
                          >
                            {m.status}
                          </span>
                        </div>
                      </div>

                      {/* Reason */}
                      <p
                        className="text-[12.5px] font-[420] leading-[1.5] m-0 mb-2.5"
                        style={{ color: "#6B6660", fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: "italic" }}
                      >
                        {m.reason}
                      </p>

                      {/* Details row: location + distance + date */}
                      <div className="flex items-center gap-3 mb-2.5">
                        <span className="flex items-center gap-1 text-[11.5px] font-[430]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {m.location}
                        </span>
                        <span className="flex items-center gap-1 text-[11.5px] font-[430]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {m.distance}
                        </span>
                        <span className="text-[11px] font-[400] ml-auto" style={{ color: "#C8C0B4", fontFamily: "'Satoshi', sans-serif" }}>
                          {m.matchedOn}
                        </span>
                      </div>

                      {/* Knowledge gap — only shown when the system has an open question */}
                      {m.gap && (
                        <div
                          className="flex items-center gap-2 rounded-[8px] py-[7px] px-[10px]"
                          style={{
                            background: "rgba(196,146,64,0.04)",
                            border: "1px solid rgba(196,146,64,0.08)",
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#C49240" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                            <path d="M12 17h.01"/>
                          </svg>
                          <span
                            className="text-[12px] font-[450]"
                            style={{ color: "#B08930", fontFamily: "'Satoshi', sans-serif" }}
                          >
                            {m.nextAction}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Dokumente */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <h2
              className="text-[13px] font-[550] tracking-[0.04em] uppercase mb-3.5"
              style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
            >
              Dokumente
            </h2>
            <div className="flex flex-col gap-1.5">
              {documents.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3.5 rounded-[12px] py-3 px-4 cursor-pointer transition-all duration-200 hover:bg-[rgba(0,0,0,0.02)]"
                  style={{
                    background: "rgba(255,255,252,0.6)",
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="size-[34px] rounded-[9px] flex items-center justify-center shrink-0"
                    style={{ background: "rgba(0,0,0,0.03)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0A99F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[13.5px] font-[520] tracking-[-0.01em]"
                      style={{ color: "#2C2A27", fontFamily: "'Satoshi', sans-serif" }}
                    >
                      {d.name}
                    </div>
                    <div
                      className="text-[11.5px] font-[420]"
                      style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}
                    >
                      {d.type} · {d.date}
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8C0B4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notes with two spaces */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="mt-10"
          >
            {/* Tab header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 p-[3px] rounded-[10px]" style={{ background: "rgba(0,0,0,0.03)" }}>
                <button
                  onClick={() => setNotesTab("matching")}
                  className="text-[12.5px] font-[500] py-[5px] px-[12px] rounded-[8px] border-none cursor-pointer transition-all duration-200"
                  style={{
                    background: notesTab === "matching" ? "rgba(255,255,252,0.95)" : "transparent",
                    color: notesTab === "matching" ? TEAL[600] : "#B0A99F",
                    boxShadow: notesTab === "matching" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                    fontFamily: "'Satoshi', sans-serif",
                  }}
                >
                  {matchingEnabled ? "Für das Matching" : "Notizen"}
                </button>
                <button
                  onClick={() => setNotesTab("privat")}
                  className="text-[12.5px] font-[500] py-[5px] px-[12px] rounded-[8px] border-none cursor-pointer transition-all duration-200"
                  style={{
                    background: notesTab === "privat" ? "rgba(255,255,252,0.95)" : "transparent",
                    color: notesTab === "privat" ? "#6B6660" : "#B0A99F",
                    boxShadow: notesTab === "privat" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                    fontFamily: "'Satoshi', sans-serif",
                  }}
                >
                  Für mich
                </button>
              </div>
              <button
                className="text-[12px] font-[480] py-[5px] px-[12px] rounded-[8px] border-none cursor-pointer transition-all duration-200 hover:-translate-y-px"
                style={{
                  background: notesTab === "matching" ? `${TEAL.glow}0.06)` : "rgba(0,0,0,0.03)",
                  color: notesTab === "matching" ? TEAL[700] : "#8A857E",
                  fontFamily: "'Satoshi', sans-serif",
                }}
              >
                + Notiz
              </button>
            </div>

            {/* Context label */}
            <div className="flex items-center gap-1.5 mb-3">
              {notesTab === "matching" ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={TEAL[500]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  <span className="text-[11.5px] font-[450]" style={{ color: TEAL[500], fontFamily: "'Satoshi', sans-serif" }}>
                    {matchingEnabled ? "Fließt ins Matching ein — Fähigkeiten, Wünsche, Verfügbarkeit" : "Fähigkeiten, Wünsche, Verfügbarkeit"}
                  </span>
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#B0A99F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span className="text-[11.5px] font-[450]" style={{ color: "#B0A99F", fontFamily: "'Satoshi', sans-serif" }}>
                    Nur für dich sichtbar — wird nicht verarbeitet
                  </span>
                </>
              )}
            </div>

            {/* Notes list */}
            {(() => {
              const filteredNotes = notes.filter(n => n.type === notesTab);
              if (filteredNotes.length === 0) {
                return (
                  <div
                    className="rounded-[12px] py-6 px-4 text-center"
                    style={{ background: "rgba(0,0,0,0.015)", border: "1px solid rgba(0,0,0,0.03)" }}
                  >
                    <span className="text-[13px] font-[420]" style={{ color: "#C8C0B4", fontFamily: "'Satoshi', sans-serif" }}>
                      {notesTab === "matching"
                        ? (matchingEnabled ? "Noch keine Matching-Notizen. Halte Fähigkeiten, Wünsche und Verfügbarkeit fest." : "Noch keine Notizen.")
                        : "Noch keine privaten Notizen."}
                    </span>
                  </div>
                );
              }
              return (
                <div className="flex flex-col gap-2.5">
                  {filteredNotes.map((n, i) => (
                    <div
                      key={`${notesTab}-${i}`}
                      className="rounded-[12px] py-3.5 px-4"
                      style={{
                        background: notesTab === "matching" ? "rgba(255,253,245,0.7)" : "rgba(255,255,252,0.5)",
                        border: `1px solid ${notesTab === "matching" ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.03)"}`,
                        borderLeft: `2.5px solid ${notesTab === "matching" ? `${TEAL.glow}0.25)` : "rgba(180,175,168,0.3)"}`,
                      }}
                    >
                      <p
                        className="text-[13.5px] font-[430] leading-[1.55] m-0"
                        style={{ color: "#6B6660", fontFamily: "'Source Serif 4', Georgia, serif", fontStyle: "italic" }}
                      >
                        {n.text}
                      </p>
                      {n.date && (
                        <span
                          className="text-[11px] font-[420] mt-2 inline-block"
                          style={{ color: "#C8C0B4", fontFamily: "'Satoshi', sans-serif" }}
                        >
                          {n.date}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </motion.div>
        </div>
      </div>

      {/* Bottom chat bar — fixed */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-5 pt-8 pointer-events-none" style={{ background: "linear-gradient(to top, #F5F2ED 40%, transparent)" }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-[680px] mx-auto pointer-events-auto"
        >
          <div
            className="relative rounded-full flex items-center transition-[box-shadow,border-color] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              background: "rgba(255,255,252,0.95)",
              border: "1px solid rgba(0,0,0,0.07)",
              padding: "5px 5px 5px 20px",
              boxShadow: "0 4px 24px -6px rgba(40,30,20,0.1), 0 1px 3px rgba(0,0,0,0.03)",
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = `${TEAL.glow}0.25)`;
              e.currentTarget.style.boxShadow = `0 0 0 4px ${TEAL.glow}0.06), 0 8px 40px -8px rgba(0,0,0,0.08)`;
            }}
            onBlur={e => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                e.currentTarget.style.borderColor = "rgba(0,0,0,0.07)";
                e.currentTarget.style.boxShadow = "0 4px 24px -6px rgba(40,30,20,0.1), 0 1px 3px rgba(0,0,0,0.03)";
              }
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={`Frag etwas über ${participant.name.split(" ")[0]}...`}
              className="flex-1 bg-transparent border-none text-[15px] font-[450] py-3.5 tracking-[-0.005em] focus:outline-none placeholder-warm"
              style={{
                color: "#2C2A27",
                fontFamily: "'Satoshi', sans-serif",
              }}
            />
            <button
              className="size-[38px] rounded-full border-none cursor-pointer flex items-center justify-center shrink-0 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.06] active:scale-[0.97]"
              style={{
                background: TEAL[500],
                boxShadow: `0 2px 8px -2px ${TEAL.glow}0.22)`,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
