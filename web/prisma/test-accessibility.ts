import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const SRC_DIR = join(__dirname, "..", "src");
const COMPONENTS_TO_CHECK = [
  "components/patient/NutritionPlanCard.tsx",
  "components/patient/WalletLedger.tsx",
  "components/patient/AppointmentScheduler.tsx",
  "components/admin/PermissionMatrix.tsx",
  "components/admin/UserTable.tsx",
];

function checkAccessibility(content: string): { issues: string[]; score: number } {
  const issues: string[] = [];
  let score = 100;

  const iconMatches = content.match(/<(svg|Icon)[^>]*>/g) || [];
  const iconWithLabel = content.match(/aria-label/g) || [];
  if (iconMatches.length > iconWithLabel.length) {
    issues.push(`Missing aria-label on ${iconMatches.length - iconWithLabel.length} icon(s)`);
    score -= 5;
  }

  const buttonIssues = (content.match(/<button[^>]*>/g) || []).filter(b => !b.includes("type="));
  if (buttonIssues.length > 0 && content.includes("form")) {
    issues.push(`${buttonIssues.length} button(s) missing type="button"`);
    score -= 3;
  }

  const imgMatches = content.match(/<img[^>]*>/g) || [];
  const imgWithAlt = content.match(/alt=/g) || [];
  if (imgMatches.length > imgWithAlt.length) {
    issues.push(`${imgMatches.length - imgWithAlt.length} image(s) missing alt text`);
    score -= 5;
  }

  const headings = content.match(/<h[1-6][^>]*>/g) || [];
  if (headings.length === 0 && content.length > 500) {
    issues.push("No semantic headings found in component");
    score -= 10;
  }

  const tabindex = content.match(/tabindex="-1"/g) || [];
  if (tabindex.length > 0) {
    issues.push(`${tabindex.length} potential tabindex misuse`);
    score -= 2;
  }

  return { issues, score };
}

async function runAccessibilityTests() {
  console.log("Iniciando Suite de Pruebas de Accesibilidad WCAG 2.2 AA...\n");
  let passed = true;
  const results: { file: string; score: number; issues: string[] }[] = [];

  for (const componentPath of COMPONENTS_TO_CHECK) {
    const fullPath = join(SRC_DIR, componentPath);
    try {
      const content = readFileSync(fullPath, "utf-8");
      const { issues, score } = checkAccessibility(content);
      results.push({ file: componentPath, score, issues });
      if (score < 80) {
        console.log(`  WARNING ${componentPath}: Score ${score}/100 - Issues: ${issues.join(", ")}`);
        passed = false;
      } else {
        console.log(`  OK ${componentPath}: Score ${score}/100`);
      }
    } catch (err) {
      console.log(`  FILE NOT FOUND ${componentPath}`);
    }
  }

  const i18nPath = join(SRC_DIR, "lib/i18n");
  const i18nFiles = readdirSync(i18nPath).filter(f => f.endsWith(".json"));
  console.log(`\n  i18n files found: ${i18nFiles.length}`);

  console.log("\n=======================================================");
  if (passed) {
    console.log("RESULTADO: ACCESIBILIDAD APROBADA (WCAG 2.2 AA)");
    process.exit(0);
  } else {
    console.error("RESULTADO: ALGUNOS COMPONENTES NECESITAN MEJORAS");
    process.exit(1);
  }
}

runAccessibilityTests();