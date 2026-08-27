"""
Truth Gate — proof-of-concept validation logic.
NOT the Stage 4 implementation. Demonstrates the CONTRACT's rules are
soundly implementable and testable against synthetic fixtures, independent
of external authority. Real UKBT facts still require U-22 (registry owner)
and U-23 (named approver) resolved before they can reach 'approved' status
with a real identity - this script proves the MECHANISM, not a bypass of
that requirement.
"""
from datetime import date, timedelta

# Synthetic source registry (fixture data — not a real UKBT registry)
REGISTRY = {
    "SRC-001": {"tier": "T1", "url": "https://example-ukbt-official.test/about"},
    "SRC-002": {"tier": "T1", "url": "https://example-ukbt-official.test/history"},
    "SRC-003": {"tier": "T4", "url": "https://example-random-blog.test/ukbt-mentions"},
}

ORG_FACT_FIELDS = {"founded_year", "player_name", "fixture_result", "sponsor_name"}
EXEMPT_FIELDS = {"page_title_label", "ui_button_text"}

class GateResult:
    def __init__(self, passed, reasons):
        self.passed = passed
        self.reasons = reasons
    def __repr__(self):
        return f"{'PASS' if self.passed else 'FAIL'}: {self.reasons or 'ok'}"

def evaluate(record, today=None):
    """Evaluate one content record against the truth-gate rules (T1-T8)."""
    today = today or date.today()
    reasons = []
    field = record.get("field")
    value = record.get("value")
    status = record.get("status")
    sources = record.get("sources", None)
    approver = record.get("approver")
    valid_until = record.get("valid_until")

    is_org_fact = field in ORG_FACT_FIELDS
    is_exempt = field in EXEMPT_FIELDS

    # T5 / fail-closed: an org-fact field with no exemption needs everything below
    if is_org_fact and not is_exempt:

        # "attempted publication without required authority": status marked ready
        # to ship with no approval step ever run at all
        if status == "published" and approver is None and sources is None:
            reasons.append("FAIL: attempted publication bypassing the approval step entirely")

        # T2: sources must resolve against the registry, not be free text
        elif sources is None:
            reasons.append("FAIL: missing provenance — no sources[] present")
        else:
            resolved = []
            for sid in sources:
                if sid not in REGISTRY:
                    reasons.append(f"FAIL: unresolvable source id '{sid}' — not in registry (unverified source)")
                else:
                    resolved.append(REGISTRY[sid])

            if not reasons:
                # T3: tier enforcement
                bad_tier = [r for r in resolved if r["tier"] not in ("T1", "T2", "T3")]
                if bad_tier:
                    reasons.append(f"FAIL: source tier {bad_tier[0]['tier']} rejected (T4/T5 not admissible — missing authority)")

                # T6: named approver required for approved status
                if status == "approved" and not approver:
                    reasons.append("FAIL: status=approved but no named approver recorded")

                # T4: freshness
                if valid_until is not None and valid_until < today:
                    reasons.append(f"FAIL: evidence expired (valid_until {valid_until} < today {today}) — stale evidence")

                # T8: conflicting evidence — two sources disagreeing on the same field's value
                if record.get("conflicting_value") is not None:
                    reasons.append("FAIL: conflicting evidence — two sources disagree on this claim")

    passed = len(reasons) == 0
    return GateResult(passed, reasons)


FIXTURES = [
    {
        "name": "PASS: valid provenance + valid authority + valid approver",
        "record": {
            "field": "founded_year", "value": "2015", "status": "approved",
            "sources": ["SRC-001", "SRC-002"], "approver": "J. Rahman (Committee Chair)",
            "valid_until": date.today() + timedelta(days=365),
        },
        "expect_pass": True,
    },
    {
        "name": "FAIL: missing provenance",
        "record": {"field": "player_name", "value": "A. Khan", "status": "approved",
                    "sources": None, "approver": "someone"},
        "expect_pass": False,
    },
    {
        "name": "FAIL: missing authority (T4 source)",
        "record": {"field": "sponsor_name", "value": "Acme Ltd", "status": "approved",
                    "sources": ["SRC-003"], "approver": "someone"},
        "expect_pass": False,
    },
    {
        "name": "FAIL: missing named approver",
        "record": {"field": "founded_year", "value": "2015", "status": "approved",
                    "sources": ["SRC-001"], "approver": None},
        "expect_pass": False,
    },
    {
        "name": "FAIL: expired/stale evidence",
        "record": {"field": "fixture_result", "value": "3-1", "status": "approved",
                    "sources": ["SRC-001"], "approver": "someone",
                    "valid_until": date.today() - timedelta(days=1)},
        "expect_pass": False,
    },
    {
        "name": "FAIL: conflicting evidence",
        "record": {"field": "founded_year", "value": "2015", "status": "approved",
                    "sources": ["SRC-001", "SRC-002"], "approver": "someone",
                    "conflicting_value": "2016"},
        "expect_pass": False,
    },
    {
        "name": "FAIL: unverified source (unresolvable registry id)",
        "record": {"field": "player_name", "value": "B. Islam", "status": "approved",
                    "sources": ["SRC-999-DOES-NOT-EXIST"], "approver": "someone"},
        "expect_pass": False,
    },
    {
        "name": "FAIL: attempted publication without required authority (approval step skipped entirely)",
        "record": {"field": "sponsor_name", "value": "Global Corp", "status": "published",
                    "sources": None, "approver": None},
        "expect_pass": False,
    },
]

if __name__ == "__main__":
    all_ok = True
    for fx in FIXTURES:
        result = evaluate(fx["record"])
        ok = result.passed == fx["expect_pass"]
        all_ok = all_ok and ok
        print(f"[{'OK ' if ok else 'MISMATCH'}] {fx['name']}")
        print(f"         -> {result}")
    print()
    print("ALL_FIXTURES_MATCHED_EXPECTATION =", all_ok)
