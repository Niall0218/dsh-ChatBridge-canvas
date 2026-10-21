# APC fidelity audit — 6 sessions, 3 delivered previews

**Scope.** Read-only on `src/`; artifacts under `.lab-b/`. Target: `src/model.js` sha256:0ed39b883ffd (22:07) plus the 3 previews (20:14–20:22). The file changed twice during the audit (V1 → APC draft); numbers are pinned to that snapshot, copied to `.lab-b/out/apc-snapshot-0ed39b883ffd.mjs`.

**Instrument.** `.lab-b/lib/anchors.mjs`: 11 classes (constraint, range, transition, number, negation, decision, conflict, datetime, id, version, cn_numeral) with sentence/message/turn provenance and canonical units (`24h`=`24 小时`). Flags: `approx`, `derived`, `symbolic`, `mixed_unit`, `relative_time`, `vague_quantity`, `feature_name`, `hypothetical`, `sequence_truncated`, `polarity_pair`, `status_code`, `version_token`. Self-tests: 15/15 tricky forms typed correctly; 7/7 UI lines rejected (`用量 14.1K tok`, `tok/s`, `缓存命中 92%`, `1%`, `¥10`, `v0.4.2`, `3 轮 3 步`); injected `999 分钟` is caught as fabricated.

## Inventory and recall

Per source, unique anchors / tier-A: S1A 79/12, S1B 112/28, S2A 107/43, S2B 76/27, S3A 97/10, S3B 136/35 — 607 total, **155 tier-A** (constraints, ranges, transitions, conflicts, strong decisions, object-bearing negations, datetimes, IDs). Negations are over-inclusive (421), so gates use the A subset only.

| source | V1 861 avg | APC draft 611 | delivered preview 1,862 | extractive @1,600 |
|---|---|---|---|---|
| S1A | 8/12 (67%) | 4/12 (33%) | 8/12 (67%) | 12/12 |
| S1B | 12/28 (43%) | 11/28 (39%) | 14/28 (50%) | 28/28 |
| S2A | 20/43 (47%) | 16/43 (37%) | 22/43 (51%) | 43/43 |
| S2B | 11/27 (41%) | 8/27 (30%) | 16/27 (59%) | 27/27 |
| S3A | 3/10 (30%) | 3/10 (30%) | 8/10 (80%) | 10/10 |
| S3B | 9/35 (26%) | 7/35 (20%) | 24/35 (69%) | 35/35 |
| **total** | **63/155 (41%)** | **49/155 (32%)** | **92/155 (59%)** | **155/155** |

Conflict / strong-decision retention (tier A): V1 **3/8, 10/14**; APC **2/8, 5/14**; preview **7/8, 7/14**; extractive **8/8, 14/14**. Polarity damage (number survives, negation does not): V1 14, APC 17, preview 22.

**The delivered preview is not `buildDigest` output.** It is three assistant bullets of exactly **620 chars** each (raw prefixes), 1,862/source; the 5,388-char preview in REAL-RUN-REPORT matches this. The 21/24 run was therefore scored at 1,862 chars/source, not 750–985 — and **43% of tier-A assistant anchors lie beyond the 620-char cut**.

Category recall (all anchors): constraint/range/conflict/datetime — V1 70/15/44/33%, APC 50/8/33/37%, preview 60/69/89/63%, extractive 100/100/100/89%. Severity-ranked losses: S1A `< 1 次` (13), `表述不一致` (12); S1B `≤5%` (13), `同一页面新旧不一致` (13); S2A `影响范围：不知道…` (13), `收工条件` (11); S2B `≥ 30 天` (13), `验收标准…` (12); S3A `预览与实际评审内容不一致` (13), `验收：逐条比对一致` (13); S3B `互相排斥` (13), `判定标准` (13), `D10` (12).

## Harness and gates

`.lab-b/run-harness.mjs` sweeps budgets for extractive and sectioned candidates: **G1** A-recall 100%, **G2** conflict+decision retention ≥90%, **G3** claim-level provenance 100%, **G4** zero fabricated numbers, **G5** budget, **G6** no mid-sentence cut. At 1,300 chars extractive passes every gate on 4/6 sources (S2A 98% and S3B 94% A-recall); sectioned reaches only 74–90% and never 100% at ≤1,600 (per-section quotas under-fill). **Extractive at 1,600 passes all six gates on all six sources** (1,503–1,547 chars, 0 fabricated, 0 truncation). APC passes only G4/G5; V1 and preview fail G1/G2/G3/G6.

| | S1A | S1B | S2A | S2B | S3A | S3B |
|---|---|---|---|---|---|---|
| floor | 629 | 1,200 | 1,363 | 1,083 | 360 | 1,314 |
| min passing (G1/G2/G4/G5) | 800 | 1,300 | 1,600 | 1,200 | 800 | 1,500 |

**Floor > 760 for 4/6 sources: 100% A-recall at 760 is arithmetically impossible.**

## Failure modes (all observed)

1. **Mid-sentence truncation.** Preview bullets end at exactly 620: `同一批 k…`, `判断是否…`. APC cuts `链长 ≥ 2（leaf + 至少一级中…` — and loses `任一级缺失即失败`.
2. **Anchor list without context.** APC: `硬锚点：0.1%；14:16；30 天；5 分钟；禁止；必须；≥；至少` — `≥`/`至少` detached, so `≥ 30 天` and `链长 ≥ 2` become interchangeable. `补齐锚点：P99；8 分钟；70%` strips the comparator from `回源 QPS ≤ 预算的 70%`.
3. **Ranges collapse.** `10–11 分钟` + `5–7 分钟` become `11 分钟；7 分钟` (V1 2/13 ranges, APC 1/13).
4. **Date class confusion.** `24 小时` (duration), `14:16` (clock), `10/20` (date), `D1–2`/`第 5 天` (schedule), `两周` (relative) need separate types; APC misses `D1–2`, `D6–7`, `第 5 天`, `两周`; V1 is blind to clock times (33%).
5. **Version strings as numbers.** `v0.4.2` is chrome, `V2`/`schema v1` are product versions. APC turns table cell `D4	Host API` into `4 H` — a fabricated anchor.
6. **Negation detached.** APC keeps `3% 不等于 0` but drops `没有归零`; 17 polarity flips. Keeping `满足 P95 ≤ 10 分钟` without `不` inverts the decision.
7. **Mixed units.** `1.9h（约 114 分钟）`, `1440 / 10.5`, `24h→2h`: keeping one side is lossless only if the equivalence sentence survives.
8. **Source attribution loss.** Previews have source headings but 0% turn-level tags; S2's transcript-vs-log `3%` discrepancy cannot be attributed from the digest.
9. **Over-compression → unreadable.** APC 520–750 chars: S3B `冲突/未知` holds headings (`1. 阻塞问题(按严重度)`), S1B `结论/决定` holds `feature flag 保留一个版本周期再清理`. S3A's real constraint (`预览不能删`, `只有两周`) never appears.
10. **Chinese tokenization.** `两周`, `一半`, `三条`, `三天` are not digit+unit; APC loses `两周` in S3A, V1 scores `降一半` as negation+number.

## Guardrails

* **G1** `tierA_recall == 1.0`, matched canonically **with sentence context** (≥60% of the anchor sentence's 2-grams in the line). A bare token list never counts.
* **G2** `(conflicts + strong_decisions kept) / total ≥ 0.9`.
* **G3** every line starts with `[来源N·轮K·角色]`; `untagged == 0`; no line mixes sources.
* **G4** every `number+unit` must exist in its declared source; derived values (`137 倍`, `144 倍`, `≈92%`) carry `≈/推算` plus inputs on the same line.
* **G5** `floor(source) ≤ chars ≤ budget`; **G6** no line ends with `…`, brackets balanced; if a sentence does not fit, drop it whole.
* **G7** constraint line = comparator + number + unit + object; range = both endpoints + unit; negation within 12 chars of its object.
* **G8** same canonical anchor ≤2× per source; no context-free anchor list longer than 3 items.
* **G9** `两周/一半/三条` matched literally; digit-only matchers fail.
* **G10 fail closed**: on failure try 1,300 → 1,600 → 2,000, then fall back to verbatim `full` with a warning. Never pad with `补齐锚点`.

**Budgets.** `DEFAULT = 1600`, `MIN = max(700, floor)`, `MAX = 2400`. Floors 629–1,363; passing 800–1,600. **Do not compress below `floor(source)`; refuse the emit.** Proxy: ≥20 A-anchors ⇒ ≥1,500, ≥30 ⇒ ≥1,600. Two sources × 1,600 plus framing ≈ 4,900 chars — below the 5,388 currently delivered.

## Verdict

750–980 chars and 100% critical recall are mutually unsatisfiable here: a perfect selector needs 1,083–1,363 chars on S2A/S3B, and V1 at 861 keeps 41%. The APC draft regresses: 32% A-recall at 611 chars, 848-char overflow on dense input, detached comparators, 0% claim-level provenance. Keep the anchor extractor, delete the anchor-value list, select whole sentences at 1,600 chars/source, gate creation on G1–G10. The delivered preview proves the point: 1,862 chars/source yet 59% — selection, not budget, is the bottleneck. No `src/` file was modified; reproduce with `node run-audit.mjs && node run-harness.mjs`.
