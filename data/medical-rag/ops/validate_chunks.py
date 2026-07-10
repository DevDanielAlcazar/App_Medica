#!/usr/bin/env python3
import json, sys
from pathlib import Path
from collections import Counter

REQUIRED = [
    "chunk_id","tome_id","version","language","source_ids","license_status",
    "clinical_status","legal_status","clinical_domain","population","severity_level",
    "red_flag_relevant","clinical_action_type","must_ask","must_not_say",
    "safe_user_message","internal_reasoning_summary","evidence_summary",
    "retrieval_keywords","created_at","reviewed_at","reviewers","is_example_only",
    "production_allowed","medical_review_status","legal_review_status","approval_evidence"
]
SEVERITY = {"S1","S2","S3","S4","S5","S6"}

def main(path):
    p = Path(path)
    ids = set()
    errors = []
    severity = Counter()
    for line_no, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            r = json.loads(line)
        except Exception as e:
            errors.append(f"line {line_no}: invalid json {e}")
            continue
        for k in REQUIRED:
            if k not in r:
                errors.append(f"line {line_no}: missing {k}")
        cid = r.get("chunk_id")
        if cid in ids:
            errors.append(f"line {line_no}: duplicate chunk_id {cid}")
        ids.add(cid)
        if r.get("severity_level") not in SEVERITY:
            errors.append(f"line {line_no}: invalid severity {r.get('severity_level')}")
        if r.get("severity_level") in {"S5","S6"} and not r.get("red_flag_relevant"):
            errors.append(f"line {line_no}: S5/S6 must be red_flag_relevant")
        if not r.get("source_ids"):
            errors.append(f"line {line_no}: empty source_ids")
        if not r.get("must_ask"):
            errors.append(f"line {line_no}: empty must_ask")
        if not r.get("must_not_say"):
            errors.append(f"line {line_no}: empty must_not_say")
        if r.get("production_allowed") is True:
            errors.append(f"line {line_no}: production_allowed=true requires signed approval")
        severity[r.get("severity_level")] += 1

    print("chunks:", len(ids))
    print("severity:", dict(sorted(severity.items())))
    if errors:
        print("ERRORS:")
        for e in errors[:200]:
            print("-", e)
        raise SystemExit(1)
    print("validation: OK")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: validate_chunks.py chunks.jsonl")
        raise SystemExit(2)
    main(sys.argv[1])
