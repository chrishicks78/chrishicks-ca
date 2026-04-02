#!/usr/bin/env node
// generate-presentation.js — Builds Hicks v. Vigneau forensic analysis PowerPoint
'use strict';

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const D = require('./presentation-data');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches
pptx.author = 'Chris Hicks';
pptx.title = 'Hicks v. Vigneau: Strategic Forensic Analysis';
pptx.subject = 'Family Docket ' + D.DOCKETS.family;

// ── Slide master ──
pptx.defineSlideMaster({
  title: 'LEGAL',
  background: { color: D.COLORS.white },
  objects: [
    { rect: { x: 0, y: 0, w: '100%', h: 0.55, fill: { color: D.COLORS.navy } } },
    { rect: { x: 0, y: 7.05, w: '100%', h: 0.45, fill: { color: D.COLORS.navy } } },
    { text: { text: D.DOCKETS.family + '  |  ' + D.DOCKETS.criminal1 + '  |  ' + D.DOCKETS.criminal2,
      options: { x: 0.4, y: 7.1, w: 8, h: 0.3, fontSize: D.FONTS.footer, color: D.COLORS.medGray, fontFace: 'Arial' } } },
    { text: { text: 'chrishicks.ca',
      options: { x: 10.5, y: 7.1, w: 2.5, h: 0.3, fontSize: D.FONTS.footer, color: D.COLORS.gold, fontFace: 'Arial', align: 'right' } } },
  ],
});

// ── Helper functions ──

function headerText(slide, text) {
  slide.addText(text, { x: 0.4, y: 0.07, w: 12, h: 0.45, fontSize: D.FONTS.heading, color: D.COLORS.white, fontFace: 'Arial', bold: true });
}

function sectionDivider(num, title) {
  const s = pptx.addSlide();
  s.background = { color: D.COLORS.navy };
  s.addText(String(num).padStart(2, '0'), { x: 0, y: 1.2, w: '100%', h: 2.5, fontSize: 96, color: D.COLORS.gold, fontFace: 'Arial', bold: true, align: 'center' });
  s.addShape(pptx.ShapeType.rect, { x: 4.5, y: 3.7, w: 4.33, h: 0.04, fill: { color: D.COLORS.gold } });
  s.addText(title, { x: 1, y: 4, w: 11.33, h: 1, fontSize: D.FONTS.sectionTitle, color: D.COLORS.white, fontFace: 'Arial', align: 'center' });
}

function bulletSlide(title, bullets, citations) {
  const s = pptx.addSlide({ masterName: 'LEGAL' });
  headerText(s, title);
  const bodyText = bullets.map(b => ({ text: b, options: { bullet: true, fontSize: D.FONTS.body, color: D.COLORS.charcoal, breakLine: true, paraSpaceAfter: 6 } }));
  s.addText(bodyText, { x: 0.6, y: 0.8, w: 11.5, h: 5.5, fontFace: 'Arial', valign: 'top' });
  if (citations) {
    s.addText(citations.join('  |  '), { x: 0.6, y: 6.4, w: 11.5, h: 0.5, fontSize: D.FONTS.citation, color: '888888', fontFace: 'Arial', italic: true });
  }
  return s;
}

function tableSlide(title, rows, opts) {
  const s = pptx.addSlide({ masterName: 'LEGAL' });
  headerText(s, title);
  const tblRows = rows.map((row, ri) => {
    return row.map((cell, ci) => {
      const isHeader = ri === 0;
      const sevCol = opts && opts.severityCol === ci;
      let fillColor = isHeader ? D.COLORS.navy : (ri % 2 === 0 ? D.COLORS.lightGray : D.COLORS.white);
      let fontColor = isHeader ? D.COLORS.white : D.COLORS.charcoal;
      if (sevCol && !isHeader) {
        const val = (typeof cell === 'string' ? cell : '').toUpperCase();
        if (val === 'HIGH') { fillColor = D.COLORS.lightRed; fontColor = D.COLORS.red; }
        else if (val === 'MEDIUM') { fillColor = D.COLORS.lightAmber; fontColor = '996600'; }
        else if (val === 'LOW') { fillColor = D.COLORS.lightGreen; fontColor = D.COLORS.green; }
      }
      return { text: typeof cell === 'string' ? cell : String(cell), options: {
        fill: { color: fillColor }, color: fontColor, fontSize: opts && opts.fontSize || D.FONTS.small,
        bold: isHeader, fontFace: 'Arial', align: isHeader ? 'center' : 'left', valign: 'middle',
        border: [{ pt: 0.5, color: D.COLORS.medGray }], margin: [3, 4, 3, 4],
      }};
    });
  });
  s.addTable(tblRows, { x: 0.4, y: 0.75, w: 12.5, colW: opts && opts.colW, autoPage: false });
  return s;
}

// ── SLIDE 1: Title ──
(function titleSlide() {
  const s = pptx.addSlide();
  s.background = { color: D.COLORS.navy };
  s.addText('HICKS v. VIGNEAU', { x: 0.5, y: 1.5, w: 12.33, h: 1.5, fontSize: 44, color: D.COLORS.white, fontFace: 'Arial', bold: true, align: 'center' });
  s.addShape(pptx.ShapeType.rect, { x: 4, y: 3.1, w: 5.33, h: 0.05, fill: { color: D.COLORS.gold } });
  s.addText('Strategic Forensic Analysis\n& Litigation Action Plan', { x: 1, y: 3.4, w: 11.33, h: 1.2, fontSize: 22, color: D.COLORS.gold, fontFace: 'Arial', align: 'center' });
  s.addText([
    { text: 'Family: ' + D.DOCKETS.family, options: { fontSize: 12, color: D.COLORS.medGray, breakLine: true } },
    { text: 'Criminal: ' + D.DOCKETS.criminal1 + '  /  ' + D.DOCKETS.criminal2, options: { fontSize: 12, color: D.COLORS.medGray, breakLine: true } },
    { text: D.DOCKETS.court, options: { fontSize: 12, color: D.COLORS.medGray, breakLine: true } },
    { text: '\nPrepared: ' + new Date().toISOString().slice(0, 10), options: { fontSize: 11, color: D.COLORS.gold } },
  ], { x: 2, y: 4.8, w: 9.33, h: 2, fontFace: 'Arial', align: 'center' });
})();

// ── SLIDE 2: Table of Contents ──
(function tocSlide() {
  const s = pptx.addSlide({ masterName: 'LEGAL' });
  headerText(s, 'Table of Contents');
  const sections = [
    '01  Credential Discrepancy — Laterrière',
    '02  Allegation Escalation Timeline',
    '03  DARVO Pattern Analysis',
    '04  Contradiction Matrix (21 Points)',
    '05  Racial Profiling Evidence Base',
    '06  Emergency Procedural Pathways',
    '07  Disclosure & Institutional Complaints',
    '08  Associated Parties',
    '09  Priority Action Items',
  ];
  const items = sections.map(sec => ({
    text: sec,
    options: { fontSize: D.FONTS.subheading, color: D.COLORS.charcoal, bullet: false, breakLine: true, paraSpaceAfter: 10 }
  }));
  s.addText(items, { x: 1.5, y: 1, w: 10, h: 6, fontFace: 'Arial', valign: 'top' });
})();

// ── SLIDES 3-5: Executive Summary ──
bulletSlide('Executive Summary — Key Findings', [
  'Frédéric Laterrière\'s claimed SQH hypnosis membership since 2014 does NOT appear on the 2025 SQH registry (~220 members reviewed)',
  'Zero published positions on ADHD/TDAH found despite evaluating an ADHD-related parenting context',
  'Allegation pattern shows clear escalation: BIXI → filming → kidnapping → assault → criminal charges → SAAQ report',
  'Pattern is consistent with documented "silver bullet" litigation strategy (Justice Canada 2001-FCY-4E)',
], ['SQH: societequebecoisehypnose.ca/membres-sqh/', 'Justice Canada: justice.gc.ca/eng/rp-pr/fl-lf/divorce/2001_4/p1.html']);

bulletSlide('Executive Summary — Systemic Issues', [
  'Lamontagne c. Montréal (2024 QCCS): Quebec Superior Court declared SPVM racial profiling SYSTEMIC — first judicial declaration',
  'Black people 3.6× more likely to be stopped by SPVM (Armony-Mulone-Hassaoui, 270K+ stops, 2014-2021)',
  'Black children investigated at 2.27× the rate of white children; placed out-of-home at 2× the rate (McGill 2026)',
  'Williams et al. (2024): Racialized fathers stigmatized as "authoritarian or dangerous" in custody evaluations',
  'CDPDJ 2011 report made 93 recommendations; 2020 follow-up found majority UNIMPLEMENTED',
], ['Lamontagne c. Ville de Montréal, 2024 QCCS', 'DOI: 10.1007/s44202-024-00282-8']);

bulletSlide('Executive Summary — Strategic Priorities', [
  'PRIORITY 1: Verify Nova\'s current welfare status immediately',
  'PRIORITY 2: File abuse of process motion under Babos (2014 SCC 16) + Articles 51-56 C.p.c.',
  'PRIORITY 3: Invoke Stinchcombe + McNeil disclosure rights in criminal matters',
  'PRIORITY 4: File CDPDJ complaint for racial discrimination in custody proceedings',
  'PRIORITY 5: Challenge Laterrière\'s credentials and evaluation objectivity',
  'PRIORITY 6: Request independent child counsel under Article 34 CCQ',
], ['R. v. Babos, 2014 SCC 16', 'R. v. Stinchcombe, [1991] 3 SCR 326', 'R. v. McNeil, 2009 SCC 3']);

// ── SECTION 1: Credential Discrepancy ──
sectionDivider(1, 'Credential Discrepancy\nFrédéric Laterrière');

tableSlide('Laterrière — Claimed vs. Verified Credentials', D.credentialRows, {
  colW: [3.5, 4, 5], severityCol: -1,
});

bulletSlide('Laterrière — Additional Context', D.credentialNotes, [
  'Clinic: cliniquedepsychologiecaprouge.ca', 'La Presse, Mar 14 2023', 'Revue québécoise de psychologie, Vol. 43 No. 2 (2022)',
]);

tableSlide('Title Clarification: Psychologue vs. Psychosocial Evaluator', D.titleClarification, {
  colW: [2, 3.5, 3.5], fontSize: D.FONTS.body,
});

// ── SECTION 2: Allegation Escalation ──
sectionDivider(2, 'Allegation Escalation\nTimeline');

// Timeline visual slide
(function timelineSlide() {
  const s = pptx.addSlide({ masterName: 'LEGAL' });
  headerText(s, 'Allegation Escalation Pattern');
  // Draw timeline line
  s.addShape(pptx.ShapeType.rect, { x: 1, y: 2.8, w: 11, h: 0.06, fill: { color: D.COLORS.navy } });
  // Draw events
  const evts = D.timelineEvents;
  const spacing = 10 / (evts.length - 1);
  evts.forEach((evt, i) => {
    const cx = 1.5 + i * spacing;
    const sevColor = evt.severity === 'red' ? D.COLORS.red : evt.severity === 'amber' ? D.COLORS.amber : D.COLORS.green;
    // Circle
    s.addShape(pptx.ShapeType.ellipse, { x: cx - 0.25, y: 2.55, w: 0.55, h: 0.55, fill: { color: sevColor }, shadow: { type: 'outer', blur: 3, offset: 1, color: '666666' } });
    // Label above
    s.addText(evt.label, { x: cx - 0.8, y: 1.3, w: 1.65, h: 1, fontSize: 10, color: D.COLORS.charcoal, fontFace: 'Arial', align: 'center', bold: true });
    // Date below
    s.addText(evt.date, { x: cx - 0.5, y: 3.3, w: 1.05, h: 0.4, fontSize: 9, color: D.COLORS.navy, fontFace: 'Arial', align: 'center' });
    // Detail below date
    s.addText(evt.detail, { x: cx - 0.9, y: 3.7, w: 1.85, h: 1.2, fontSize: 8, color: '666666', fontFace: 'Arial', align: 'center', valign: 'top' });
  });
  // Legend
  s.addText('● Green = Minor   ● Amber = Moderate   ● Red = Severe', { x: 2, y: 5.2, w: 9, h: 0.4, fontSize: 9, color: D.COLORS.charcoal, fontFace: 'Arial', align: 'center' });
  s.addText('Pattern consistent with "silver bullet" litigation strategy — Justice Canada Discussion Paper 2001-FCY-4E', { x: 1, y: 5.7, w: 11, h: 0.4, fontSize: D.FONTS.citation, color: '888888', fontFace: 'Arial', align: 'center', italic: true });
})();

tableSlide('Allegation Evidence Cross-Reference', D.timelineEvidenceTable, {
  colW: [2.5, 1.5, 5, 3.5], severityCol: -1,
});

// ── SECTION 3: DARVO ──
sectionDivider(3, 'DARVO Pattern Analysis\nDeny — Attack — Reverse Victim & Offender');

tableSlide('DARVO Behavioural Mapping', D.darvoRows, {
  colW: [2, 6, 4.5], severityCol: -1,
});

// ── SECTION 4: Contradiction Matrix ──
sectionDivider(4, 'Contradiction Matrix\n21 Documented Points');

// Split into two slides (11 + 11 rows including header)
const cmHeader = D.contradictionMatrix[0];
const cmData = D.contradictionMatrix.slice(1);
const half = Math.ceil(cmData.length / 2);

tableSlide('Contradiction Matrix (1 of 2)', [cmHeader, ...cmData.slice(0, half)], {
  colW: [0.5, 1.8, 3, 4.5, 1.2], severityCol: 4, fontSize: 10,
});

tableSlide('Contradiction Matrix (2 of 2)', [cmHeader, ...cmData.slice(half)], {
  colW: [0.5, 1.8, 3, 4.5, 1.2], severityCol: 4, fontSize: 10,
});

// ── SECTION 5: Racial Profiling ──
sectionDivider(5, 'Racial Profiling\nEvidence Base');

// Stats dashboard
(function statsDashboard() {
  const s = pptx.addSlide({ masterName: 'LEGAL' });
  headerText(s, 'Key Statistics — Racial Disparities');
  const stats = D.racialStats;
  const cols = 3;
  stats.forEach((st, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = 0.5 + col * 4.2;
    const y = 1 + row * 2.8;
    // Stat box
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 3.8, h: 2.4, fill: { color: D.COLORS.lightGray }, rectRadius: 0.15,
      shadow: { type: 'outer', blur: 4, offset: 2, color: 'CCCCCC' } });
    s.addText(st.stat, { x, y: y + 0.15, w: 3.8, h: 1, fontSize: 36, color: D.COLORS.red, fontFace: 'Arial', bold: true, align: 'center' });
    s.addText(st.label, { x: x + 0.2, y: y + 1.1, w: 3.4, h: 0.7, fontSize: 10, color: D.COLORS.charcoal, fontFace: 'Arial', align: 'center', valign: 'top' });
    s.addText(st.source, { x: x + 0.2, y: y + 1.8, w: 3.4, h: 0.5, fontSize: 8, color: '888888', fontFace: 'Arial', align: 'center', italic: true, valign: 'top' });
  });
})();

tableSlide('Case Law & Academic Evidence — Racial Bias', D.racialCaseLaw, {
  colW: [3, 0.8, 4.5, 4.2], severityCol: -1,
});

// ── SECTION 6: Emergency Procedures ──
sectionDivider(6, 'Emergency Procedural\nPathways');

bulletSlide('Habeas Corpus for Child Custody', D.habeasCorpus, [
  'Code of Civil Procedure, C-25.01, Arts. 82, 398-404',
  'Act Respecting Civil Aspects of Child Abduction, CQLR c. A-23.01',
]);

tableSlide('Babos Test — Abuse of Process Stay (2014 SCC 16)', D.babosTest, {
  colW: [2, 4, 6.5], severityCol: -1, fontSize: D.FONTS.body,
});

bulletSlide('Quebec Charter Section 49 — Punitive Damages', D.charterDamages, [
  'Quebec (Public Curator) v. St-Ferdinand, [1996] 3 SCR 211',
  'Charte des droits et libertés de la personne, ss. 4, 5, 23, 49',
]);

// Article 34 + 278
bulletSlide('Child Counsel & Cross-Examination Protections', [
  'Article 34 CCQ: Court SHALL give child opportunity to be heard (mandatory)',
  'Child counsel funded by Legal Aid regardless of party\'s means',
  'Key case: F.(M.) c. L.(J.), 2002 CanLII 36783 (QC CA); Young c. Young, [1993] 4 SCR 3',
  'Article 278 CPC: Court may prevent self-rep from cross-examining in violence context',
  'When Art. 278 invoked → Commission des services juridiques designates free lawyer for cross-exam',
  'Strengthened by Bill 73 (2024) and Bill 56 (2024) family law reforms',
], ['Civil Code of Québec, Art. 34', 'Code of Civil Procedure, Art. 278']);

// ── SECTION 7: Disclosure & Complaints ──
sectionDivider(7, 'Disclosure Rights &\nInstitutional Complaints');

tableSlide('Disclosure Framework — Criminal Matters', D.disclosureFramework, {
  colW: [2, 2, 4.5, 4], severityCol: -1, fontSize: D.FONTS.small,
});

tableSlide('Institutional Complaint Bodies', D.complaintBodies, {
  colW: [3.5, 3, 1.5, 4.5], severityCol: -1,
});

// ── SECTION 8: Associated Parties ──
sectionDivider(8, 'Associated Parties');

tableSlide('Key Individuals — Public Record Summary', D.associatedParties, {
  colW: [2.5, 3, 7], severityCol: -1,
});

// ── SECTION 9: Priority Actions ──
sectionDivider(9, 'Priority Action Items');

// Action items slides
D.priorityActions.forEach(group => {
  const s = pptx.addSlide({ masterName: 'LEGAL' });
  headerText(s, 'Priority: ' + group.priority);
  const acColor = group.color === 'red' ? D.COLORS.red : group.color === 'amber' ? D.COLORS.amber : D.COLORS.green;
  // Priority indicator bar
  s.addShape(pptx.ShapeType.rect, { x: 0.4, y: 0.7, w: 0.15, h: 5.5, fill: { color: acColor } });
  const items = group.actions.map(a => ({
    text: a, options: { bullet: { code: '25CF' }, fontSize: D.FONTS.body, color: D.COLORS.charcoal, breakLine: true, paraSpaceAfter: 14 }
  }));
  s.addText(items, { x: 0.9, y: 0.8, w: 11.5, h: 5.5, fontFace: 'Arial', valign: 'top' });
});

// ── CLOSING SLIDE ──
(function closingSlide() {
  const s = pptx.addSlide();
  s.background = { color: D.COLORS.navy };
  s.addText('A Father\'s Fight for Justice', { x: 1, y: 1.5, w: 11.33, h: 1, fontSize: 32, color: D.COLORS.white, fontFace: 'Arial', bold: true, align: 'center' });
  s.addShape(pptx.ShapeType.rect, { x: 4.5, y: 2.7, w: 4.33, h: 0.04, fill: { color: D.COLORS.gold } });
  s.addText([
    { text: 'Chris Hicks', options: { fontSize: 20, color: D.COLORS.gold, breakLine: true, bold: true } },
    { text: '\nchrishicks78@gmail.com', options: { fontSize: 14, color: D.COLORS.medGray, breakLine: true } },
    { text: 'chrishicks.ca', options: { fontSize: 14, color: D.COLORS.medGray, breakLine: true } },
    { text: '\n' + D.DOCKETS.family, options: { fontSize: 12, color: D.COLORS.medGray, breakLine: true } },
    { text: D.DOCKETS.criminal1 + '  |  ' + D.DOCKETS.criminal2, options: { fontSize: 12, color: D.COLORS.medGray, breakLine: true } },
    { text: '\nPrepared for judicial review', options: { fontSize: 11, color: D.COLORS.gold, italic: true } },
  ], { x: 2, y: 3, w: 9.33, h: 3.5, fontFace: 'Arial', align: 'center' });
})();

// ── Write file ──
async function main() {
  const dir = path.join(__dirname, 'presentations');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = 'hicks-vigneau-forensic-analysis-' + new Date().toISOString().slice(0, 10) + '.pptx';
  const filepath = path.join(dir, filename);
  await pptx.writeFile({ fileName: filepath });
  console.log('✓ Presentation generated: ' + filepath);
  console.log('  Slides: ~36 | Format: 16:9 widescreen');
}

main().catch(err => { console.error('Error generating presentation:', err); process.exit(1); });
