"""
Lyra Nova Protocol - Python Implementation
Sticky memory scaffolding for maintaining high-fidelity context across AI sessions.
"""

from dataclasses import dataclass, asdict, field
from typing import List, Dict, Literal, Optional
from enum import Enum


class ClaimLabel(Enum):
    """Evidence classification for truth discipline."""
    SOURCED = "SOURCED"           # From explicit evidence/citations/vault
    COMPUTED = "COMPUTED"          # Derived from math/logic
    INFERRED = "INFERRED"          # Reasonable conclusion from sourced facts
    HYPOTHESIS = "HYPOTHESIS"      # Speculative; needs verification


class CompletionStatus(Enum):
    """Harness stages for deliverables."""
    SPEC = "Spec"
    BUILD = "Build"
    VERIFY = "Verify"
    PACKAGE = "Package"
    DONE = "STATUS: DONE"
    NOT_DONE = "STATUS: NOT DONE"


@dataclass
class Lead:
    """Entity in the discovery/knowledge graph."""
    entity: str
    tags: List[str]
    why_matters: str
    category: Optional[str] = None


@dataclass
class ContextUpdate:
    """
    Session footer structure - paste into CONTEXT VAULT at end of each session.
    """
    new_facts: List[str] = field(default_factory=list)
    leads: List[Lead] = field(default_factory=list)
    decisions: List[str] = field(default_factory=list)
    unknowns: List[str] = field(default_factory=list)
    next_steps: List[str] = field(default_factory=list)
    sources: List[str] = field(default_factory=list)


@dataclass
class ForensicsLogEntry:
    """
    Forensics mode log table entry.
    All fields verbatim; typos preserved.
    """
    evidence_id: str
    datetime_iso: str
    source: str
    sender_receiver: str
    verbatim_quote: str
    category_tag: str
    context_impact: str = "UNKNOWN"


@dataclass
class OutputCadence:
    """Standard response structure."""
    big_picture: str              # Exactly 2 sentences
    numbered_points: List[str]    # ≤4 points
    check_in: str                 # 1 sentence
    action_list: List[str]        # Exactly 3 bullets
    confidence: int               # 0-100
    risks_unknowns: List[str]


def label_claim(claim: str, label: ClaimLabel) -> str:
    """
    Tag a claim with its evidence classification.

    Args:
        claim: The statement to classify
        label: Classification type

    Returns:
        Formatted claim with label prefix
    """
    return f"({label.value}) {claim}"


def evidence_clash(source_a: str, source_b: str, conflict_summary: str) -> str:
    """
    Format an evidence conflict for reporting.

    Args:
        source_a: First source claim
        source_b: Conflicting source claim
        conflict_summary: Description of the disagreement

    Returns:
        Formatted evidence clash report
    """
    return (
        "Evidence Clash:\n"
        f"- Source A: {source_a}\n"
        f"- Source B: {source_b}\n"
        f"- Conflict: {conflict_summary}\n"
        "- Fix path: prefer primary/official docs; check dates; "
        "reproduce measurements; log assumptions."
    )


def render_context_update(update: ContextUpdate) -> str:
    """
    Format context update for pasting into CONTEXT VAULT.

    Args:
        update: ContextUpdate object with session data

    Returns:
        Formatted markdown string
    """
    leads_formatted = [
        f"  - {lead.entity} → {', '.join(lead.tags)} → {lead.why_matters}"
        for lead in update.leads
    ]

    return (
        "CONTEXT UPDATE (paste into Vault)\n"
        f"- New stable facts:\n" +
        "".join(f"  - {fact}\n" for fact in update.new_facts) +
        f"- New/updated leads:\n" + "\n".join(leads_formatted) + "\n" +
        f"- Decisions made:\n" +
        "".join(f"  - {dec}\n" for dec in update.decisions) +
        f"- Open questions (UNKNOWNs):\n" +
        "".join(f"  - {unk}\n" for unk in update.unknowns) +
        f"- Next steps:\n" +
        "".join(f"  - {step}\n" for step in update.next_steps) +
        f"- Sources used:\n" +
        "".join(f"  - {src}\n" for src in update.sources)
    )


def to_jsonable(obj) -> Dict:
    """Convert dataclass to JSON-serializable dict."""
    return asdict(obj)


def create_forensics_log_table(entries: List[ForensicsLogEntry]) -> str:
    """
    Generate forensics mode evidence log table.

    Args:
        entries: List of forensics log entries

    Returns:
        Markdown formatted table
    """
    header = (
        "| EvidenceID | DateTimeISO | Source | Sender/Receiver | "
        "VerbatimQuote | CategoryTag | ContextImpact |\n"
        "|------------|-------------|--------|-----------------|"
        "---------------|-------------|---------------|\n"
    )

    rows = "\n".join([
        f"| {e.evidence_id} | {e.datetime_iso} | {e.source} | "
        f"{e.sender_receiver} | {e.verbatim_quote} | {e.category_tag} | "
        f"{e.context_impact} |"
        for e in entries
    ])

    return header + rows


# Example usage
if __name__ == "__main__":
    # Create a context update
    update = ContextUpdate(
        new_facts=["NOVA protocol repository has no prior markdown docs"],
        leads=[
            Lead(
                entity="nova.resolver.js",
                tags=["code", "bug-fixed"],
                why_matters="Fixed unused JSON parse operation"
            )
        ],
        decisions=["Created Lyra Nova protocol documentation"],
        unknowns=["Whether protocol should be linked from index.html"],
        next_steps=["Commit protocol files", "Push to branch", "Create PR"],
        sources=["ChatGPT conversation transcript"]
    )

    print(render_context_update(update))

    # Create a forensics log entry
    log_entry = ForensicsLogEntry(
        evidence_id="EVD001",
        datetime_iso="2026-01-15T00:19:00Z",
        source="git commit",
        sender_receiver="system",
        verbatim_quote="Fix bug: remove unused protocol file parsing",
        category_tag="code_change",
        context_impact="Improved performance by removing wasteful I/O"
    )

    print("\n" + create_forensics_log_table([log_entry]))
