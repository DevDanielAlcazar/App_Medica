import fs from "fs";
import path from "path";
import readline from "readline";

export interface MedicalChunk {
  chunk_id: string;
  tome_id: string;
  clinical_domain: string;
  population: string[];
  severity_level: string;
  red_flag_relevant: boolean;
  clinical_action_type: string;
  must_ask: string[];
  must_not_say: string[];
  safe_user_message: string;
  internal_reasoning_summary: string;
  evidence_summary: string;
  retrieval_keywords: string[];
}

// Caché global en memoria para evitar recargar el archivo de 13MB en cada mensaje
let cachedChunks: MedicalChunk[] | null = null;

// Lista básica de Stopwords en español para limpiar la consulta
const SPANISH_STOPWORDS = new Set([
  "de", "la", "que", "el", "en", "y", "a", "los", "del", "se", "las", "un", "para", "con", "no", 
  "una", "su", "al", "lo", "como", "mas", "pero", "sus", "le", "ya", "o", "este", "sí", "si", "porque",
  "esta", "entre", "cuando", "muy", "sin", "sobre", "también", "me", "mi", "mis", "te", "yo"
]);

/**
 * Carga el archivo consolidado JSONL de RAG de forma perezosa en memoria.
 */
async function loadRagCorpus(): Promise<MedicalChunk[]> {
  if (cachedChunks) return cachedChunks;

  console.log("[RAG Engine] Cargando corpus médico consolidado en memoria...");
  const corpusPath = path.join(
    process.cwd(),
    "..", // Subir de /web a la raíz del proyecto
    "data",
    "medical-rag",
    "master_release",
    "v0_1",
    "all_available_chunks.consolidated.jsonl"
  );

  const chunks: MedicalChunk[] = [];
  
  if (!fs.existsSync(corpusPath)) {
    console.error(`[RAG Engine] Archivo de corpus no encontrado en: ${corpusPath}`);
    return [];
  }

  const fileStream = fs.createReadStream(corpusPath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const chunk: MedicalChunk = JSON.parse(line);
      chunks.push(chunk);
    } catch (err) {
      // Ignorar líneas corruptas de JSON
    }
  }

  cachedChunks = chunks;
  console.log(`[RAG Engine] Corpus médico cargado con éxito. Total de chunks indexados: ${chunks.length}`);
  return chunks;
}

/**
 * Normaliza y extrae palabras clave significativas de un texto de consulta
 */
function extractQueryKeywords(query: string): string[] {
  // Quitar acentos, puntuación y pasar a minúsculas
  const normalized = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'¿]/g, " ");

  const words = normalized.split(/\s+/);
  
  // Filtrar stopwords y duplicados
  return Array.from(
    new Set(
      words.filter((w) => w.length > 2 && !SPANISH_STOPWORDS.has(w))
    )
  );
}

/**
 * Realiza una búsqueda por coincidencia de palabras clave sobre el corpus cargado en memoria.
 */
export async function searchMedicalKnowledge(
  userQuery: string,
  limit = 3
): Promise<string> {
  try {
    const corpus = await loadRagCorpus();
    if (corpus.length === 0) return "";

    const keywords = extractQueryKeywords(userQuery);
    if (keywords.length === 0) return "";

    console.log(`[RAG Engine] Buscando coincidencia para palabras clave: [${keywords.join(", ")}]`);

    // Calificar cada chunk según la coincidencia de palabras clave
    const scoredChunks = corpus.map((chunk) => {
      let score = 0;
      
      // 1. Coincidencia con retrieval_keywords
      const normalizedKeywords = (chunk.retrieval_keywords || []).map((k) =>
        k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      );

      for (const kw of keywords) {
        // Coincidencia exacta o parcial en keywords del RAG
        const matchesKeyword = normalizedKeywords.some(
          (nk) => nk === kw || nk.includes(kw) || kw.includes(nk)
        );
        if (matchesKeyword) score += 3; // Peso alto por palabra clave de recuperación directa
        
        // 2. Coincidencia en el dominio clínico o descripción
        const domainLower = chunk.clinical_domain?.toLowerCase() || "";
        if (domainLower.includes(kw)) score += 2;

        // 3. Coincidencia general en el contenido seguro de la guía
        const messageLower = chunk.safe_user_message?.toLowerCase() || "";
        const evidenceLower = chunk.evidence_summary?.toLowerCase() || "";
        if (messageLower.includes(kw)) score += 1;
        if (evidenceLower.includes(kw)) score += 1;
      }

      // Boost extra para casos de banderas rojas clínicas relevantes
      if (score > 0 && chunk.red_flag_relevant) {
        score += 1.5;
      }

      return { chunk, score };
    });

    // Filtrar los que tengan puntuación mayor a 0 y ordenar descendentemente
    const hits = scoredChunks
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    if (hits.length === 0) {
      console.log("[RAG Engine] No se encontraron Chunks de Conocimiento relevantes.");
      return "";
    }

    console.log(`[RAG Engine] Encontrados ${hits.length} Chunks relevantes.`);

    // Construir el bloque de contexto estructurado para inyectar en el prompt
    let contextBlock = "\n=== CONTEXTO MÉDICO DE SOPORTE (RAG - GUÍAS DE PRÁCTICA CLÍNICA VIGENTES) ===\n";
    hits.forEach((hit, index) => {
      const c = hit.chunk;
      contextBlock += `\n[Fuente clínica #${index + 1}: ${c.clinical_domain} (Nivel Severidad: ${c.severity_level})]\n`;
      contextBlock += `- Lineamientos seguros para la IA: ${c.safe_user_message}\n`;
      contextBlock += `- Restricciones (Lo que la IA NO debe decir/asumir): ${c.must_not_say.join(" | ")}\n`;
      contextBlock += `- Preguntas requeridas para descartar riesgo: ${c.must_ask.join(" | ")}\n`;
      contextBlock += `- Resumen de evidencia: ${c.evidence_summary}\n`;
    });
    contextBlock += "\n===========================================================================\n";

    return contextBlock;
  } catch (error) {
    console.error("[RAG Engine Error]:", error);
    return "";
  }
}
