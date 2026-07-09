import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const DEFAULT_PATH = 'data/medical-rag/tomes/01_red_flags_triage/release';

function validate() {
  const errors = [];
  const warnings = [];

  // Required files
  const requiredFiles = [
    'tome_manifest.json',
    'source_map.json',
    'chunks.jsonl',
    'contracts/chunk_contract.schema.json',
    'retrieval_policy.json',
    'anti_under_triage_policy.md',
    'RELEASE_CHECKLIST.md',
    'CHANGELOG.md'
  ];

  console.log('Validating Tome 01 Release Pack...\n');

  for (const file of requiredFiles) {
    const path = join(DEFAULT_PATH, file);
    if (!existsSync(path)) {
      errors.push(`Missing required file: ${file}`);
    } else {
      console.log(`✓ Found: ${file}`);
    }
  }

  // Validate tome_manifest.json
  try {
    const manifest = JSON.parse(readFileSync(join(DEFAULT_PATH, 'tome_manifest.json')));
    if (manifest.status !== 'release_candidate_draft') {
      warnings.push(`Manifest status is "${manifest.status}", expected "release_candidate_draft"`);
    }
    if (!manifest.production_gate) {
      errors.push('Missing production_gate in manifest');
    }
    console.log(`✓ Manifest valid: status=${manifest.status}`);
  } catch (e) {
    errors.push(`Invalid tome_manifest.json: ${e.message}`);
  }

  // Validate source_map.json
  try {
    const sourceMap = JSON.parse(readFileSync(join(DEFAULT_PATH, 'source_map.json')));
    const sources = sourceMap.sources || [];
    for (const s of sources) {
      if (s.allowed_for_production !== false) {
        errors.push(`Source ${s.source_id} has allowed_for_production=true in draft state`);
      }
    }
    console.log(`✓ Source map valid: ${sources.length} sources, none production-approved`);
  } catch (e) {
    errors.push(`Invalid source_map.json: ${e.message}`);
  }

  // Validate chunks.jsonl
  try {
    const chunksContent = readFileSync(join(DEFAULT_PATH, 'chunks.jsonl'), 'utf8');
    const lines = chunksContent.trim().split('\n').filter(l => l.trim());
    for (const line of lines) {
      const chunk = JSON.parse(line);
      if (chunk.production_allowed === true && chunk.is_example_only !== true) {
        errors.push(`Chunk ${chunk.chunk_id} has production_allowed=true without is_example_only`);
      }
    }
    console.log(`✓ Chunks JSONL valid: ${lines.length} lines`);
  } catch (e) {
    errors.push(`Invalid chunks.jsonl: ${e.message}`);
  }

  // Summary
  console.log('\n--- Validation Summary ---\n');
  if (errors.length > 0) {
    console.log('ERRORS:');
    for (const err of errors) console.log(`  ✗ ${err}`);
  }
  if (warnings.length > 0) {
    console.log('WARNINGS:');
    for (const warn of warnings) console.log(`  ⚠ ${warn}`);
  }
  if (errors.length === 0) {
    console.log('✓ All validations passed for release_candidate_draft');
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

validate();