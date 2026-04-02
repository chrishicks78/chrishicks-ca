# Codex Continuation Script — Hicks v. Vigneau

## What's Already Built

Branch: `claude/hicks-vigneau-legal-brief-CZbE7`

| File | Purpose |
|------|---------|
| `presentation-data.js` | All research content as structured data (credentials, timeline, DARVO, 21-point contradiction matrix, racial profiling stats, procedural pathways, disclosure framework, associated parties, priority actions) |
| `generate-presentation.js` | pptxgenjs script producing a 36-slide forensic analysis .pptx |
| `package.json` | Updated with `pptxgenjs` dependency + `generate:presentation` script |

**To generate:** `npm install && npm run generate:presentation`
**Output:** `presentations/hicks-vigneau-forensic-analysis-YYYY-MM-DD.pptx`

---

## Task 1: Google Drive Exhibit Integration

Pull exhibits from Chris's Google Drive and embed them into the presentation.

### Prompt for Codex

```
I need you to integrate Google Drive exhibits into the existing presentation at
/home/user/chrishicks-ca/generate-presentation.js.

Key exhibits to locate and embed:
- Exhibit P-36 (contradicts assault allegation)
- DPJ closure letter (investigation closed, no finding)
- SOS Tape recording reference
- Google Photos albums documenting active parenting
- Arrest video screenshots
- Any SMS/text message evidence

For each exhibit found:
1. Download or screenshot it
2. Add it as a slide image using: slide.addImage({ path: 'exhibits/filename.png', x, y, w, h })
3. Add a caption with the exhibit number and relevance

Create an exhibits/ directory and save downloaded files there.
Add 'exhibits/' to .gitignore.

The presentation uses these colors:
- Navy: #003366, Gold: #C8A951, White: #FFFFFF, Charcoal: #333333

Use the existing slide master 'LEGAL' for consistency.
```

---

## Task 2: Multimedia Evidence Embedding

### Prompt for Codex

```
In the repository /home/user/chrishicks-ca, I need you to:

1. Search the web for publicly available evidence related to Chris Hicks Montreal:
   - Arrest video (search YouTube, social media platforms)
   - GoFundMe campaign
   - Any news coverage
   - chrishicks.ca website content

2. Search for archived/cached pages:
   - Laterrière's clinic bio (cliniquedepsychologiecaprouge.ca/nos-psychologues/frederic-laterriere/)
     via Wayback Machine (web.archive.org)
   - Any cached versions showing ADHD therapy positions or hypnosis credential details
   - SQH membership pages from 2014-2024

3. For each piece of evidence found:
   - Take a screenshot or save the content
   - Add it as a new slide in generate-presentation.js
   - Include the URL, access date, and archive date as citations

4. Update presentation-data.js with any new findings.
```

---

## Task 3: Presentation Variants

### Court-Ready Condensed Version (10 slides)

```
Create a condensed 10-slide version of the presentation at
/home/user/chrishicks-ca/generate-presentation.js.

New file: generate-presentation-court.js
Output: presentations/hicks-vigneau-court-summary-YYYY-MM-DD.pptx

Slides:
1. Title + docket numbers
2. Executive summary (3 key findings)
3. Credential discrepancy (Laterrière SQH gap)
4. Allegation escalation timeline (visual)
5. Contradiction matrix highlights (top 5 HIGH severity)
6. Racial profiling evidence (statistics + Lamontagne 2024)
7. Emergency procedural pathway (habeas corpus)
8. Disclosure rights summary
9. Priority actions (immediate only)
10. Closing with contact

Use the same LEGAL slide master and color scheme from presentation-data.js.
```

### French-Language Version

```
Create a French-language version of the presentation.

New file: generate-presentation-fr.js
Output: presentations/hicks-vigneau-analyse-forensique-YYYY-MM-DD.pptx

Translate all content in presentation-data.js to French, creating
presentation-data-fr.js. Legal terms should use their proper Quebec
French equivalents (e.g., "habeas corpus" stays Latin, "abuse of process"
= "abus de procédure", "disclosure" = "communication de la preuve").

Maintain all case citations in their original language.
```

---

## Task 4: Website Enhancement

### Prompt for Codex

```
Update /home/user/chrishicks-ca/index.html to add a comprehensive
case documentation section. The site is hosted on GitHub Pages at chrishicks.ca.

Add these sections after the existing content:

1. "Case Timeline" — An interactive timeline using HTML/CSS/JS showing
   the allegation escalation pattern (data from presentation-data.js)

2. "Evidence Summary" — A card-based layout showing:
   - Credential discrepancy findings
   - Racial profiling statistics
   - Key case citations with links

3. "Legal Resources" — Links to:
   - Commissaire déontologie policière
   - CDPDJ complaint form
   - Quebec Charter text
   - Stinchcombe/McNeil/Babos decisions on CanLII

4. "Support" — GoFundMe link (when available), contact info

Maintain the existing design: navy (#003366), white, gold (#C8A951).
Keep it mobile-responsive. No external CSS frameworks — pure CSS.
```

---

## Task 5: Deep Web Research — Laterrière ADHD & Hypnosis

### Prompt for Codex

```
I need deep research into Frédéric Laterrière's professional positions,
specifically regarding ADHD and hypnosis therapy.

1. Check Wayback Machine (web.archive.org) for archived versions of:
   - cliniquedepsychologiecaprouge.ca/nos-psychologues/frederic-laterriere/
   - Any pages from societequebecoisehypnose.ca mentioning Laterrière
   - His clinic's hypnosis service page

2. Search for:
   - Any conference presentations by Laterrière on ADHD/TDAH
   - Any interviews or media appearances discussing ADHD therapy
   - OPQ disciplinary records or complaints
   - Published opinions on medication vs. therapy for ADHD
   - Any criticism of ADHD diagnosis or treatment

3. Check academic databases:
   - Google Scholar for all publications by F. Laterrière
   - Revue québécoise de psychologie archives
   - Any conference proceedings (CPA, OPQ, SQH)

4. Document findings in a new file: laterriere-research-findings.md
5. Update presentation-data.js credentialRows with any new data

Chris has stated he read content about Laterrière's non-belief in
ADHD therapies online in the past but it's harder to find now.
Focus on archived/cached versions of pages.
```

---

## Task 6: Nova Welfare Verification Support

### Prompt for Codex

```
Help prepare the legal documents needed for Nova's welfare verification:

1. Draft an emergency habeas corpus application template following
   Quebec CPC Articles 82 and 398-404. Include:
   - Standard Superior Court header with docket 500-04-079464-237
   - Factual allegations section (template with blanks for specifics)
   - Legal basis section citing relevant articles
   - Prayer for relief

2. Draft an Article 34 CCQ motion for independent child counsel

3. Draft a Batshaw/DPJ file access request letter

4. Create all documents in a new legal-templates/ directory

5. Format as .docx using the 'docx' npm package (add to package.json)

Note: These are TEMPLATES — Chris must review and customize with
specific facts before filing. Include a disclaimer header on each.
```

---

## Environment Notes

- Repo: /home/user/chrishicks-ca
- Branch: claude/hicks-vigneau-legal-brief-CZbE7
- Node.js 20+
- GitHub Pages site: chrishicks.ca
- Key dependency: pptxgenjs (already in package.json)
- CI: npm run ci (validates NOVA schemas — don't break this)
- .gitignore: presentations/, exhibits/ should be excluded

## Priority Order

1. **Task 5** (Laterrière research) — Most time-sensitive for credibility challenge
2. **Task 6** (Nova welfare templates) — Most urgent for child safety
3. **Task 1** (Drive exhibits) — Strengthens presentation evidence
4. **Task 2** (Multimedia) — Additional evidence gathering
5. **Task 3** (Variants) — Court-ready and French versions
6. **Task 4** (Website) — Public documentation
