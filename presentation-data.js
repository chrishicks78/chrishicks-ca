// presentation-data.js — All embedded content for Hicks v. Vigneau forensic presentation
'use strict';

const COLORS = {
  navy: '003366',
  white: 'FFFFFF',
  gold: 'C8A951',
  charcoal: '333333',
  lightGray: 'F2F2F2',
  medGray: 'D9D9D9',
  red: 'CC0000',
  amber: 'E6A800',
  green: '339933',
  lightRed: 'FDECEA',
  lightAmber: 'FFF8E1',
  lightGreen: 'E8F5E9',
};

const DOCKETS = {
  family: '500-04-079464-237',
  criminal1: '500-01-285448-251',
  criminal2: '500-01-285449-259',
  court: 'Quebec Superior Court / Court of Québec',
};

const FONTS = {
  title: 28,
  sectionTitle: 24,
  heading: 20,
  subheading: 16,
  body: 13,
  small: 11,
  citation: 9,
  footer: 7,
};

// ── Section 1: Laterrière Credential Discrepancy ──

const credentialRows = [
  ['Claimed Credential', 'Verification Status', 'Source'],
  ['Maîtrise en psychologie', 'Confirmed (third-party dirs)', 'PagesJaunes, RateMDs, Lumino Health'],
  ['Membre SQH depuis 2014', 'NOT FOUND on 2025 SQH registry', 'societequebecoisehypnose.ca/membres-sqh/'],
  ['OPQ Registration', 'Unverifiable online (captcha)', 'ordrepsy.qc.ca — verify directly'],
  ['Psychologue-expert (courts)', 'Self-claimed since 2007', 'Clinic bio page'],
  ['OTSTCFQ Registration', 'NOT LISTED', 'OTSTCFQ registry search'],
  ['ADHD/TDAH expertise', 'ZERO published positions found', 'Multiple search queries returned nothing'],
  ['Hypnosis practice', 'Listed as clinic service', 'cliniquedepsychologiecaprouge.ca'],
];

const credentialNotes = [
  'Clinic bio: cliniquedepsychologiecaprouge.ca/nos-psychologues/frederic-laterriere/',
  'Page returned HTTP 415 on direct fetch but remains indexed by Google',
  'No Wayback Machine captures accessible — potential content removal',
  'Published: Revue québécoise de psychologie Vol. 43, No. 2 (2022) — custody evaluations only',
  'Media: La Presse (Mar 14, 2023) — Lili Homier case, family paid $11,900 for psycholegal report',
  'Presented for Barreau du Québec on cross-examination in custody + personality disorders',
];

const titleClarification = [
  ['Role', 'Laterrière', 'Psychosocial Evaluator'],
  ['Title', 'Psychologue', 'Travailleur social / T.S.'],
  ['Regulator', 'OPQ (Ordre des psychologues)', 'OTSTCFQ'],
  ['Legal basis', 'Custom psycholegal eval', 'Art. 425 C.p.c.'],
  ['Registry', 'Not independently verified', 'N/A for Laterrière'],
  ['Significance', 'Different scope & standards', 'Court-appointed framework'],
];

// ── Section 2: Allegation Escalation Timeline ──

const timelineEvents = [
  { date: '2023', label: 'BIXI\nIncident', severity: 'green', detail: 'Initial minor allegation — public cycling dispute' },
  { date: '2023', label: 'Filming\nAllegation', severity: 'amber', detail: 'Allegation of unauthorized filming escalated' },
  { date: '2024', label: 'Kidnapping\nClaim', severity: 'amber', detail: 'Claim Nova was kidnapped — no corroboration' },
  { date: '2024', label: 'Assault\nAllegation', severity: 'red', detail: 'Physical assault allegation introduced' },
  { date: '2025', label: 'Criminal\nCharges', severity: 'red', detail: 'Criminal dockets 500-01-285448/285449 filed' },
  { date: '2025', label: 'SAAQ\nReport', severity: 'red', detail: 'Motor vehicle authority report — furthest escalation' },
];

const timelineEvidenceTable = [
  ['Allegation', 'First Raised', 'Corroborating Evidence', 'Status'],
  ['BIXI incident', '2023', 'None found in public record', 'Unsubstantiated'],
  ['Filming', '2023', 'No video/photo evidence produced', 'Unsubstantiated'],
  ['Kidnapping', '2024', 'DPJ investigation closed', 'Closed — no finding'],
  ['Assault', '2024', 'Contradicted by Exhibit P-36', 'Contradicted'],
  ['Criminal charges', '2025', 'Arrest video exists publicly', 'Pending — charges contested'],
  ['SAAQ report', '2025', 'No independent verification', 'Unsubstantiated'],
];

// ── Section 3: DARVO Analysis ──

const darvoRows = [
  ['Phase', 'Observed Behaviour', 'Evidence Reference'],
  ['DENY', 'Denies pattern of escalating allegations', 'Contradiction matrix (21 points)'],
  ['DENY', 'Denies prior relationship dysfunction', 'SOS Tape recording'],
  ['DENY', 'Denies Nova expressed preference for father', 'DPJ closure letter'],
  ['ATTACK', 'Files criminal complaints against father', 'Dockets 500-01-285448/285449'],
  ['ATTACK', 'Engages psycholegal expert ($11,900+ fee model)', 'Laterrière engagement pattern'],
  ['ATTACK', 'Involves family network (Louis Vigneau) in proceedings', 'Associated parties evidence'],
  ['ATTACK', 'Weaponizes police calls against Black father', 'Arrest video; Lamontagne 2024 QCCS'],
  ['REVERSE V&O', 'Positions self as victim of father\'s advocacy', 'Court filings pattern'],
  ['REVERSE V&O', 'Uses child protection system as weapon', 'DPJ referral → closure pattern'],
  ['REVERSE V&O', 'Frames father\'s documentation as harassment', 'Silver bullet strategy literature'],
];

// ── Section 4: Contradiction Matrix ──

const contradictionMatrix = [
  ['#', 'Category', 'Claim Made', 'Contradicting Evidence', 'Severity'],
  ['1', 'Credentials', 'SQH member since 2014', 'Not on 2025 SQH member list', 'HIGH'],
  ['2', 'Credentials', 'Psychosocial evaluator', 'Licensed as psychologue, not T.S.', 'HIGH'],
  ['3', 'Credentials', 'ADHD expertise implied', 'Zero published ADHD positions', 'MEDIUM'],
  ['4', 'Safety', 'Father is danger to child', 'DPJ closed investigation — no finding', 'HIGH'],
  ['5', 'Safety', 'Kidnapping occurred', 'No police report corroboration found', 'HIGH'],
  ['6', 'Safety', 'Assault by father', 'Contradicted by Exhibit P-36', 'HIGH'],
  ['7', 'Conduct', 'Father harasses mother', 'Father documents for legal proceedings', 'MEDIUM'],
  ['8', 'Conduct', 'Father is unstable', 'Employed at SAP; stable professional history', 'MEDIUM'],
  ['9', 'Process', 'Criminal charges warranted', 'Pattern matches "silver bullet" strategy', 'HIGH'],
  ['10', 'Process', 'Police intervention justified', 'SPVM racial profiling ruled systemic (2024)', 'HIGH'],
  ['11', 'Parenting', 'Father unfit parent', 'Google Photos albums document active parenting', 'MEDIUM'],
  ['12', 'Parenting', 'Mother primary caregiver', 'Father sought equal custody from day one', 'MEDIUM'],
  ['13', 'Welfare', 'Child safe with mother', 'Current welfare verification pending', 'HIGH'],
  ['14', 'Legal', 'Fair process followed', 'Self-rep vs. funded legal team disparity', 'MEDIUM'],
  ['15', 'Legal', 'No abuse of process', 'Concurrent criminal + family = Babos indicators', 'HIGH'],
  ['16', 'Network', 'Family uninvolved', 'Louis Vigneau involvement documented', 'LOW'],
  ['17', 'Network', 'Independent professionals', 'Atlas Lowry — child therapist, potential bias', 'MEDIUM'],
  ['18', 'Evidence', 'No pattern of false claims', 'Escalation: BIXI→film→kidnap→assault→criminal→SAAQ', 'HIGH'],
  ['19', 'Racial', 'Race not a factor', 'Armony report: Black 3.6x stop rate', 'HIGH'],
  ['20', 'Racial', 'Police acted neutrally', 'Lamontagne: systemic SPVM racial profiling', 'HIGH'],
  ['21', 'Disclosure', 'Full disclosure provided', 'Stinchcombe/McNeil obligations unmet', 'HIGH'],
];

// ── Section 5: Racial Profiling Evidence ──

const racialStats = [
  { stat: '3.6×', label: 'Black people more likely to be stopped by SPVM', source: 'Armony-Mulone-Hassaoui (2023), 270K+ stops analyzed' },
  { stat: '4-5×', label: 'Indigenous people stop rate vs. white', source: 'Same study, 2014-2021 data' },
  { stat: '2.27×', label: 'Black children investigation rate vs. white', source: 'Boatswain-Kyte et al. (2026), McGill University' },
  { stat: '2×', label: 'Black children out-of-home placement rate', source: 'Same McGill study — "cannot be explained by poverty"' },
  { stat: '40%', label: 'Young Black men stopped in Saint-Michel/MTL-Nord', source: 'Internal SPVM data, 2006-2007' },
];

const racialCaseLaw = [
  ['Case / Source', 'Year', 'Key Finding', 'Application'],
  ['Lamontagne c. Montréal', '2024', 'Systemic SPVM racial profiling declared', 'Challenge police report credibility'],
  ['Williams et al., Discover Psychology', '2024', 'Racial bias in custody evaluations documented', 'Challenge Laterrière evaluation objectivity'],
  ['Boatswain-Kyte et al., McGill', '2026', 'Black children 2.27× investigation rate', 'Challenge DPJ referral motivations'],
  ['Laurent Commission', '2021', 'Over-representation of Black/Indigenous children in DPJ', 'Systemic context for case'],
  ['CDPDJ Report + Follow-up', '2011/2020', '93 recommendations; majority unimplemented', 'Institutional failure evidence'],
  ['Black Justice Strategy (Canada)', '2024', '$23.6M allocated; 114 recommendations', 'Federal recognition of systemic racism'],
  ['Pradel Content case (Laval)', '2021', 'Officer violated ethics: false report + racial profiling', 'Precedent for weaponized police calls'],
];

// ── Section 6: Emergency Procedural Pathways ──

const habeasCorpus = [
  'Governed by Articles 82 and 398-404, Code of Civil Procedure (C-25.01)',
  'Article 82: Judge may hear urgent matters outside court hours / non-juridical days',
  'Initiated by "application" (demande), not traditional writ',
  'Must set out facts justifying emergency + basis for unlawful detention/withholding',
  'Filed at Superior Court greffe; served with possible shortened notice',
  'Heard by preference — expedited scheduling',
  'Filing fee: approximately $170-$200',
  'Parallel mechanism: Act Respecting Civil Aspects of Child Abduction (CQLR c. A-23.01)',
];

const babosTest = [
  ['Element', 'Requirement', 'Application to This Case'],
  ['1. Prejudice', 'To fair trial right or justice system integrity', 'Concurrent criminal charges designed to prejudice family outcome'],
  ['2. No alternative', 'No other remedy can redress prejudice', 'Criminal process cannot address custody manipulation'],
  ['3. Balancing', 'Interest in denouncing vs. decision on merits', 'Pattern of escalation outweighs merit of individual claims'],
];

const charterDamages = [
  'Section 49(1): Cessation of interference + compensation',
  'Section 49(2): Punitive damages for "unlawful and intentional" interference',
  'Per St-Ferdinand [1996] 3 SCR 211: "intentional" requires actual intent',
  'Relevant rights: s.4 (dignity), s.5 (private life), s.23 (fair hearing)',
  'Typical awards: $2,000-$25,000; higher for egregious cases',
  'Combinable with Articles 51-56 C.p.c. abuse of process',
];

// ── Section 7: Disclosure & Complaints ──

const disclosureFramework = [
  ['Mechanism', 'Legal Basis', 'What It Compels', 'How to Invoke'],
  ['Stinchcombe', '[1991] 3 SCR 326', 'All relevant non-privileged Crown info', 'Written request to Crown; motion if refused'],
  ['McNeil', '2009 SCC 3', 'Police misconduct records of involved officers', 'Request to Crown; motion citing McNeil'],
  ['O\'Connor', '[1995] 4 SCR 411', 'Third-party records (DPJ/Batshaw files)', 'Application showing "likely relevance"'],
  ['Taillefer/Duguay', '[2003] 3 SCR 307', 'Restated Stinchcombe in Quebec context', 'Quebec-specific citation for disclosure'],
  ['Art. 278 CPC', 'C-25.01', 'Designated lawyer for cross-exam (free)', 'Court order; automatic in violence context'],
];

const complaintBodies = [
  ['Body', 'Jurisdiction', 'Deadline', 'Contact'],
  ['Commissaire déontologie policière', 'Police ethics complaints', '1 year', '514-864-1784 / 1-877-237-7897'],
  ['BEI', 'Death/serious injury/sexual by police', 'No fixed limit', 'bei.gouv.qc.ca'],
  ['CDPDJ', 'Discrimination (14 grounds incl. race)', '2 years', '1-800-361-6477 / plainte@cdpdj.qc.ca'],
  ['Barreau du Québec (Syndic)', 'Lawyer misconduct', 'No fixed limit', '445 St-Laurent Blvd, 5th Fl, Montreal'],
  ['SPVM Bureau clientèle', 'Direct police complaints', '10-day response', 'spvm.qc.ca'],
];

// ── Section 8: Associated Parties ──

const associatedParties = [
  ['Name', 'Role / Position', 'Key Information'],
  ['Me Éric Marquette', 'Partner, Pringle & Associés', 'Family law since 2018; teaches at École du Barreau since 2017; ex-Legal Aid'],
  ['Me Luis Moreno', 'Legal Aid lawyer (alleged)', 'Very limited public info; verify via Info-Barreau 514-954-3411'],
  ['Anouck Vigneau', 'Mother / Opposing party', 'UQAM literature/archives; McGill library sciences (2013); artist at 2014 Figura'],
  ['Louis Vigneau', 'Maternal family', 'Gestionnaire, Ministère des Transports du Québec'],
  ['Atlas Lowry', 'Child therapist', 'MA Drama Therapy Concordia (2023); CCC #11248315; trauma/colonial trauma specialist'],
  ['Frédéric Laterrière', 'Psycholegal evaluator', 'Clinique Cap-Rouge; SQH membership discrepancy; no ADHD publications'],
];

// ── Section 9: Priority Action Items ──

const priorityActions = [
  {
    priority: 'IMMEDIATE',
    color: 'red',
    actions: [
      'Verify Nova\'s current welfare status — request DPJ/Batshaw update',
      'File emergency habeas corpus application if access denied (Arts 82, 398-404 CPC)',
      'Request independent child counsel appointment under Article 34 CCQ',
      'Submit Stinchcombe disclosure request for criminal matters',
    ],
  },
  {
    priority: 'SHORT-TERM (30 days)',
    color: 'amber',
    actions: [
      'File Babos abuse of process motion (2014 SCC 16) — stay of criminal proceedings',
      'Submit McNeil request for SPVM officer misconduct records',
      'Contact SQH directly to verify Laterrière membership (contact@societequebecoisehypnose.ca)',
      'File CDPDJ complaint citing racial discrimination in custody process',
      'File Commissaire déontologie policière complaint re: arrest circumstances',
    ],
  },
  {
    priority: 'MEDIUM-TERM (90 days)',
    color: 'green',
    actions: [
      'Prepare O\'Connor application for DPJ/Batshaw file disclosure',
      'File Barreau du Québec complaint if lawyer misconduct identified',
      'Compile Quebec Charter s.49 damages claim (dignity, private life, fair hearing)',
      'Request OPQ verification of Laterrière registration',
      'Engage IRCA (Impact of Race and Culture Assessment) report if available',
      'Document full silver bullet pattern for abuse of process motion',
    ],
  },
];

module.exports = {
  COLORS, DOCKETS, FONTS,
  credentialRows, credentialNotes, titleClarification,
  timelineEvents, timelineEvidenceTable,
  darvoRows, contradictionMatrix,
  racialStats, racialCaseLaw,
  habeasCorpus, babosTest, charterDamages,
  disclosureFramework, complaintBodies,
  associatedParties, priorityActions,
};
