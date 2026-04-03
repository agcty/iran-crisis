# Matching & Incentive Design

## The Problem

The original pipeline was linear: **Neu -> Profil in Arbeit -> Bericht offen -> Im Matching -> Vermittelt**

This meant matching was *blocked* by the coach report. But the report would only be written after the coach spent weeks with the participant. During that time — the seminar window, when coaching and interview prep would be most impactful — the participant sat idle, waiting for matching to unlock.

The coach's incentive was misaligned: writing a report felt like paperwork that delayed the thing everyone wanted (a job placement), rather than something that actively helped.

## Core Insight

Matching should not be gated behind the coach report. The seminar is the most valuable window — participants are actively receiving coaching and could be preparing for real interviews. Blocking matching until after the report wastes this time.

## Solution: Continuous Matching with Progressive Signal Quality

Matching runs continuously. Quality scales with input. Three layers of signal, each adding weight:

### Layer 1: Profile + AI Conversation (Low Signal)
- Participant creates resume, talks to AI about preferences and goals
- Happens on day one
- Matching starts immediately but with weak signal — few matches, lower confidence

### Layer 2: Coach Notes (Medium Signal)
- Low-friction, informal observations accumulated over time
- Each note is a data point feeding the matching engine
- "Amina hat Erfahrung in der Gastronomie, möchte aber in den Einzelhandel" — ten seconds to write
- The coach sees matching quality improve as they add notes

### Layer 3: Published Report (Highest Signal)
- The capstone document — written when the coach truly knows the participant
- AI drafts it from accumulated notes + profile data
- Coach reviews, edits, publishes — a 5-minute task, not a writing project
- Carries the most matching weight because it's the most definitive assessment
- Also serves as the formal document for the Jobcenter

## Incentive Alignment

**Why this works:**
- Coach adds notes because they see the direct effect on matching quality (pull, not push)
- No stage is blocked — the natural workflow (get to know participant -> take notes -> summarize) maps directly to improving matching
- The report writes itself if the coach has been adding good notes
- Everyone's incentive points the same direction: better input -> better matches -> faster placement

**What we avoided:**
- Making the report a gate (creates bottleneck, misaligned incentive)
- Making the report affect matching early (creates friction — coach would either rush it for bad quality, or delay it and hurt matching)
- A hard visible gate for matching ("you need 5 notes to unlock") which would lead to gaming (5 garbage notes on day one)

## Matching Activation Threshold

Rather than a hard visible gate, matching "warms up" from the start. Internally, a minimum threshold exists before matches are surfaced:
- Participant has completed their profile (resume, preferences, AI conversation)
- Coach has added N substantive notes

The UI shows a continuous **matching strength indicator** — the coach always sees "add more, get better results" rather than "hit a checkbox to unlock the next stage."

## Notes vs. Report: Different Tools for Different Audiences

| | Notes | Report |
|---|---|---|
| **Audience** | System (matching engine) + all coaches on participant | Jobcenter (formal document) |
| **Tone** | Informal, personal observations | Structured, professional assessment |
| **Frequency** | Many, accumulated over time | Once, at the end |
| **Effort** | Low (10 seconds each) | Low (AI drafts from notes, coach reviews) |
| **Visibility** | Shared — any coach who can see the participant sees all notes (each note shows who created it) | Shared with Jobcenter |

## Notes Visibility & Attention Model

**Notes are shared, not private.** Any coach who can see a participant sees all notes on that participant. Each note displays its author. This is important because:
- Coaches sometimes share participants or hand off between programs
- A new coach picking up a participant needs the full context
- The notes are shared working context, not private diary entries

**Attention signals are based on participant state.** "Braucht Aufmerksamkeit" is computed from the participant's objective properties: status, note count, matching strength. Two coaches viewing the same participant see the same urgency. The dashboard scopes this to the logged-in coach's caseload — "6 Teilnehmer brauchen deine Aufmerksamkeit" means 6 of YOUR assigned participants.

## Notes as the Feedback Loop (Knowledge Gaps)

Everything revolves around notes. Notes are not just observations — they are the primary mechanism through which coaches teach the matching system about participants.

### The Loop

1. **System surfaces a match with a knowledge gap.** A match card shows "Kein Portfolio vorhanden" — this isn't a dead-end status. It's the system saying: "I don't know if this participant has a portfolio. If they do, this match gets much stronger."
2. **Coach investigates.** They talk to the participant, find out they have a Behance page with social media graphics.
3. **Coach adds a note.** "Hat Portfolio auf Behance, vor allem Social Media Grafiken." Ten seconds.
4. **System ingests the note.** Match quality for Kreativagentur Funke jumps from "Gut" to "Stark." The knowledge gap closes.
5. **System learns.** Next time a similar creative-field match appears for any participant, the system knows to ask about portfolios earlier.

### Why This Works

- **The coach isn't serving the system — the system is asking the coach for help.** The power dynamic is right. The coach is the expert; the system is the learner.
- **Knowledge gaps are surfaced in context.** The coach sees "Kein Portfolio vorhanden" on the exact match card where it matters, not in an abstract to-do list.
- **Every note makes matching better.** Not just for this participant — the system learns what information matters for which types of matches. It's a reinforcement loop.
- **The AI can proactively guide.** "Für 2 deiner Matches fehlen Informationen" — the system can prompt the coach to close specific gaps, creating a natural workflow where the AI asks and the coach answers.

### Match Status: Facts vs. Open Questions

Match cards distinguish between two types of status:

- **Facts/events**: "Vorstellungsgespräch am 14. Mär", "B2-Zertifikat abwarten" — things that are known and scheduled.
- **Open questions**: "Kein Portfolio vorhanden", "Teilzeit ungeklärt" — knowledge gaps where the coach can provide information.

Open questions are styled differently to signal "you can help here." When a coach closes a gap (by adding a note), the status updates and matching recalculates.

## Resulting Pipeline

The visible pipeline simplifies from 5 stages to 4:

**Neu -> Profil in Arbeit -> Im Matching -> Vermittelt**

- "Bericht offen" is no longer a pipeline stage — the report is an action within "Im Matching"
- A matching strength indicator replaces the report gate
- The report CTA appears when the coach has enough notes to generate one
