import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const INPUT_PATH = 'data/medical-rag/tomes/01_red_flags_triage/curated_input';

function validateCuratedInput() {
  const errors = [];
  
  console.log('Validating Curated Input for Tome 01...\n');
  
  // Check curated_chunks.input.jsonl
  const chunksPath = join(INPUT_PATH, 'curated_chunks.input.jsonl');
  if (!existsSync(chunksPath)) {
    console.log('⚠ Missing curated_chunks.input.jsonl (expected - awaiting input)');
  } else {
    const content = readFileSync(chunksPath, 'utf8');
    const lines = content.trim().split('\n').filter(l => l.trim());
    for (const line of lines) {
      try { JSON.parse(line); } catch (e) { errors.push(`Invalid JSON in chunks: ${e.message}`); }
    }
    console.log(`✓ Found ${lines.length} curated chunks`);
  }
  
  // Check approved_sources.input.json
  const sourcesPath = join(INPUT_PATH, 'approved_sources.input.json');
  if (!existsSync(sourcesPath)) {
    console.log('⚠ Missing approved_sources.input.json (expected - awaiting input)');
  } else {
    try {
      const sources = JSON.parse(readFileSync(sourcesPath, 'utf8'));
      for (const s of sources) {
        if (s.license_status === 'restricted' || s.license_status === 'rejected') {
          errors.push(`Source ${s.source_id} has restricted/rejected license_status`);
        }
      }
      console.log(`✓ Found ${sources.length} approved sources`);
    } catch (e) { errors.push(`Invalid source JSON: ${e.message}`); }
  }
  
  console.log('\n--- Validation Summary ---\n');
  if (errors.length > 0) {
    for (const err of errors) console.log(`✗ ${err}`);
    process.exit(1);
  }
  console.log('✓ Validation passed (or no input available yet)');
  process.exit(0);
}

validateCuratedInput();