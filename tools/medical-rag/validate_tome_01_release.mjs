import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const RELEASE_PATH = 'data/medical-rag/tomes/01_red_flags_triage/release';

function validateRelease() {
  const errors = [];
  const warnings = [];
  
  console.log('Validating Tome 01 Release Pack...\n');
  
  // Required files
  const requiredFiles = [
    'tome_manifest.json',
    'source_map.json',
    'chunks.jsonl',
    'contracts/chunk_contract.schema.json',
    'RELEASE_CHECKLIST.md'
  ];
  
  for (const file of requiredFiles) {
    const path = join(RELEASE_PATH, file);
    if (!existsSync(path)) { errors.push(`Missing: ${file}`); } else { console.log(`✓ Found: ${file}`); }
  }
  
  // Validate manifest
  try {
    const manifest = JSON.parse(readFileSync(join(RELEASE_PATH, 'tome_manifest.json')));
    if (manifest.production_approved !== false) { errors.push('production_approved should be false'); }
    if (!manifest.last_updated_at) { warnings.push('Missing last_updated_at in manifest'); }
    console.log(`✓ Manifest valid: status=${manifest.status}`);
  } catch (e) { errors.push(`Invalid manifest: ${e.message}`); }
  
  // Validate chunks
  try {
    const chunksContent = readFileSync(join(RELEASE_PATH, 'chunks.jsonl'), 'utf8');
    const lines = chunksContent.trim().split('\n').filter(l => l.trim());
    for (const line of lines) {
      const chunk = JSON.parse(line);
      if (chunk.is_example_only !== true && chunk.is_example_only !== false) {
        warnings.push(`Chunk ${chunk.chunk_id} missing is_example_only field`);
      }
    }
    console.log(`✓ Chunks JSONL valid: ${lines.length} lines`);
  } catch (e) { errors.push(`Invalid chunks.jsonl: ${e.message}`); }
  
  // Summary
  console.log('\n--- Validation Summary ---\n');
  if (warnings.length > 0) {
    console.log('WARNINGS:');
    for (const warn of warnings) console.log(`  ⚠ ${warn}`);
  }
  if (errors.length > 0) {
    console.log('ERRORS:');
    for (const err of errors) console.log(`  ✗ ${err}`);
    process.exit(1);
  }
  console.log('✓ All validations passed');
  process.exit(0);
}

validateRelease();