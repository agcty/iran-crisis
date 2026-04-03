# Matching Embedding & Vector DB Research

Research notes on using embeddings for the retrieval layer of the matching system.

## Architecture

At scale (millions of participants × millions of jobs), matching needs a funnel:

1. **Embedding retrieval** (top ~100-500 candidates) — fast vector similarity search
2. **Structured ranking/reasoning** (LLM reranks the shortlist) — weighs coach notes, qualifications, soft signals
3. **Human-in-the-loop** (coach reviews top matches)

## Embedding Model: Gemini Embedding 2

- **Model ID:** `gemini-embedding-2-preview`
- **Pricing:** $0.20 per 1M input tokens (text), batch pricing 50% off
- **Max input:** 8,192 tokens
- **Output dimensions:** 3,072 default, supports MRL scaling to 1,536 / 768
- **Multimodal:** text, images, video, audio, PDFs in a single embedding space

### One Combined Vector per Participant

Recommended approach: concatenate all participant content into a single embedding rather than separate vectors per document type.

**What goes in (~4,000 tokens):**
- Profile / Lebenslauf (~800 tokens)
- Resume (~500 tokens)
- Coach notes, accumulated (~1,500 tokens)
- Published report (~1,200 tokens)

**Why one vector, not separate:**
- Cross-document context matters: coach notes recontextualize the resume (e.g., resume says "Lagerarbeiter" but coach writes "will eigentlich ins Büro")
- Avoids the scoring combination problem (how to weight/merge multiple vectors per participant)
- Re-embedding cost is negligible ($0.0008 per call), so "only re-embed what changed" saves nothing meaningful
- Maps directly to the progressive signal model — the composite picture IS the participant

**Re-embed on every meaningful update** (new note, report published). The vector naturally improves over time as more signals accumulate.

### Cost at Scale

| Scenario | Calculation | Cost |
|---|---|---|
| Initial embed (1M participants) | 1M × $0.0008 | $800 |
| Re-embeds (1M × 20 updates each) | 20M × $0.0008 | $16,000 |
| Job postings (2M × ~500 tokens) | 2M × $0.0001 | $200 |
| **Annual ongoing** (500K new participants, 20 re-embeds each) | 10M × $0.0008 | **~$8,000/year** |
| With batch pricing | | **~$4,000/year** |

## Vector Database Options

### Cloudflare Vectorize

- **Max dimensions: 1,536** (would need MRL downscaling from 3,072)
- Max vectors per index: 10,000,000
- Pricing: ~$20/month for 3M vectors at 1,536 dims
- Tight Cloudflare Workers integration
- No egress fees
- **Limitation:** 1,536 dim cap with no announced plans to increase

### Turbopuffer

- **No documented dimension limit** (3,072 works fine)
- Built on object storage (S3/R2), cheap at rest
- Supports f32 and f16 vectors
- **Minimum spend: $64/month** (Launch plan)
- At our scale, actual usage would be well under $64, so you hit the floor
- Slightly higher query latency than edge-optimized solutions

### Comparison

| | Cloudflare Vectorize | Turbopuffer |
|---|---|---|
| Max dimensions | 1,536 | No limit |
| Price floor | ~$0 (free tier) | $64/month |
| 3M vectors cost | ~$20/month | ~$64/month (minimum) |
| 3,072 dim support | No | Yes |
| Latency | Edge-optimized | Slightly slower |

### Other options not deeply evaluated
- **Qdrant Cloud** — free tier up to 1GB, supports up to 65,535 dims
- **pgvector** — no dimension limit, self-hostable on cheap VPS
- **Supabase** — pgvector under the hood, free tier with 500MB

## Recommendation

Start with **Cloudflare Vectorize at 1,536 dims**. It's near-free to prototype, and 1,536 dims with Gemini's MRL is solid for German-language job matching. If retrieval quality is later found to be the bottleneck, upgrade to Turbopuffer or Qdrant at full 3,072 dims — re-embedding cost to switch is ~$15.
