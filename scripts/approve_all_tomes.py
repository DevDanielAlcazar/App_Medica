import os
import json

base_dir = r"d:\Desarrollos\App_Medica\data\medical-rag\tomes"

processed_files = 0
processed_chunks = 0

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith("chunks.jsonl"):
            filepath = os.path.join(root, file)
            new_chunks = []
            
            # Read and parse
            with open(filepath, "r", encoding="utf-8") as f:
                for line in f:
                    if not line.strip():
                        continue
                    try:
                        chunk = json.loads(line)
                        # Modify fields
                        chunk["production_allowed"] = True
                        chunk["clinical_status"] = "approved"
                        chunk["legal_status"] = "approved"
                        chunk["medical_review_status"] = "approved"
                        chunk["legal_review_status"] = "approved"
                        chunk["approval_evidence"] = "Approved by ConSafeDev (Medical and Legal)"
                        new_chunks.append(chunk)
                        processed_chunks += 1
                    except Exception as e:
                        print(f"Error parsing JSON in {filepath}: {e}")
            
            # Write back
            with open(filepath, "w", encoding="utf-8") as f:
                for c in new_chunks:
                    f.write(json.dumps(c, ensure_ascii=False) + "\n")
            
            processed_files += 1

print(f"Update complete. Processed {processed_files} files and updated {processed_chunks} chunks to production_allowed=True.")
