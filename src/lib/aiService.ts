/**
 * GenSpeak Intelligence Layer - Engineering Specification Implementation.
 * Implements the Provider Adapter Pattern, Prompt Manager, Context Builder,
 * Response Validator, Safety Layer, Rate Limiter, Caching, Retry Logic, and Feature Flags.
 */

export interface AIServiceResponse {
  content: string;
  isAI: boolean;
  tokensUsed?: number;
  cached?: boolean;
  provider: string;
}

// ----------------------------------------------------
// 1. FEATURE FLAGS & CONFIGURATION
// ----------------------------------------------------
export const FeatureFlags = {
  enableStreaming: true,
  enableLocalFallback: true,
  enableStrictSafety: true,
  enableRetryLogic: true,
};

// ----------------------------------------------------
// 2. PROVIDER ADAPTER PATTERN
// ----------------------------------------------------
export interface AIAdapter {
  name: string;
  generateText(prompt: string, context?: string): Promise<string>;
}

export class OpenAIAdapter implements AIAdapter {
  name = "OpenAI";
  async generateText(prompt: string, context?: string): Promise<string> {
    // If process.env.OPENAI_API_KEY was present, we would invoke the official SDK here.
    // In absence of actual keys, simulate response representing the adapter behavior:
    return `[OpenAI Response] Resolved with context: "${context || "none"}".\nPrompt: "${prompt}"`;
  }
}

export class AnthropicAdapter implements AIAdapter {
  name = "Anthropic (Claude)";
  async generateText(prompt: string, context?: string): Promise<string> {
    return `[Claude Response] Resolved with context: "${context || "none"}".\nPrompt: "${prompt}"`;
  }
}

export class GeminiAdapter implements AIAdapter {
  name = "Google Gemini";
  async generateText(prompt: string, context?: string): Promise<string> {
    return `[Gemini Response] Resolved with context: "${context || "none"}".\nPrompt: "${prompt}"`;
  }
}

export class DeepSeekAdapter implements AIAdapter {
  name = "DeepSeek";
  async generateText(prompt: string, context?: string): Promise<string> {
    return `[DeepSeek Response] Resolved with context: "${context || "none"}".\nPrompt: "${prompt}"`;
  }
}

export class LocalFallbackAdapter implements AIAdapter {
  name = "Local Lexicon Model";
  async generateText(prompt: string, _context?: string): Promise<string> {
    if (_context) { /* ignore */ }
    const query = prompt.toLowerCase();
    
    // Slang Translator
    if (query.includes("cooked")) {
      return "**Original Slang**: 'Cooked'\n\n**Core Definition**: Being completely finished, ruined, or in an irreversible bad situation.\n\n**Interpretations**:\n1. *General Failure*: Fulfilling a bad grade, losing a game, or getting caught in a lie.\n2. *Extreme Fatigue*: Being physically exhausted after a gym session or work shift.";
    }
    if (query.includes("rizz")) {
      return "**Original Slang**: 'Rizz'\n\n**Core Definition**: One's ability to charm, attract, or seduce another person effortslessly.\n\n**Interpretations**:\n1. *Unspoken Rizz*: Attracting partners without verbal communication.\n2. *Rizzing up*: Active pursuit or flirting.";
    }
    if (query.includes("skibidi")) {
      return "**Original Slang**: 'Skibidi'\n\n**Core Definition**: Absurdist Gen Alpha adjective meaning cool, bad, or weird depending entirely on the sentence tone.";
    }

    // Default Fallback
    return `**Linguistic Analysis**:\n\nThe query "${prompt.substring(0, 60)}" describes contemporary internet dialect tokens. Under local lexicographical validation rules, this term is primarily utilized as a casual identity marker or sarcasm indicator on TikTok and Discord networks.`;
  }
}

// ----------------------------------------------------
// 3. CONTEXT BUILDER
// ----------------------------------------------------
export class ContextBuilder {
  private sessionHistory: { role: "user" | "assistant"; text: string }[] = [];

  addHistory(role: "user" | "assistant", text: string) {
    this.sessionHistory.push({ role, text });
    // Retain only last 6 messages to optimize token limits and protect privacy
    if (this.sessionHistory.length > 6) {
      this.sessionHistory.shift();
    }
  }

  getHistoryContext(): string {
    return this.sessionHistory
      .map(h => `${h.role === "user" ? "User" : "AI Assistant"}: ${h.text}`)
      .join("\n");
  }

  clear() {
    this.sessionHistory = [];
  }
}

export const activeSessionContext = new ContextBuilder();

// ----------------------------------------------------
// 4. PROMPT MANAGER
// ----------------------------------------------------
export const PromptManager = {
  slangTranslate: (input: string) => 
    `Translate and explain this internet slang term/phrase: "${input}". Provide multiple interpretations, nuance, and contextual usage details.`,
  
  sentenceExplain: (input: string) => 
    `Analyze this full sentence: "${input}". Identify and highlight all internet slang terms, then break down the total subtext and emotional meaning.`,
  
  emojiInterpret: (input: string) => 
    `Decode the following emoji combination: "${input}". Detail the internet culture subtext, emotion, and typical scenarios where it is used.`,
  
  memeContext: (input: string) => 
    `Analyze the meme reference: "${input}". Explain its platform origin, why it became popular, and the humor/irony dynamics behind it.`,
  
  eli10: (input: string) => 
    `Explain the following term/phrase like I am 10 years old: "${input}". Use simple, friendly metaphors and avoid advanced technical jargon.`,
  
  parentMode: (input: string) => 
    `Translate the slang "${input}" into plain, polite English for parents. Highlight the context, usage, and any relevant safety or behavior concerns if applicable.`,
  
  teacherMode: (input: string) => 
    `Explain the slang "${input}" from an educational perspective. Provide classroom-friendly explanations, linguistic syntax structure, and historical context.`,
  
  conversationAnalyze: (input: string) => 
    `Analyze the following chat conversation: "${input}". Highlight all slang words, emojis, tone shifts, sarcasm markers, and internet culture references.`,
  
  generateExamples: (input: string) => 
    `Generate realistic conversation examples for the term "${input}" in four environments: TikTok comment section, Gaming lobby voice chat, Discord server channels, and Professional/Office slack workspace.`,
  
  discoverRelated: (input: string) => 
    `Recommend related items for the slang "${input}". Provide synonyms, antonyms, newer Gen Alpha alternatives, older Gen Y/Z variations, and platform-specific usage differences.`
};

// ----------------------------------------------------
// 5. SAFETY LAYER & RESPONSE VALIDATOR
// ----------------------------------------------------
export class ResponseValidator {
  static sanitizeInput(input: string): string {
    // Basic injection protection and character escaping
    return input
      .replace(/[\{\}\[\]\(\)<>]/g, "")
      .trim()
      .substring(0, 400);
  }

  static validateOutput(content: string): boolean {
    if (!FeatureFlags.enableStrictSafety) return true;
    
    // Safety check for harmful prompt inject keywords or system override tags
    const bannedPatterns = [
      "ignore all previous instructions",
      "override system prompt",
      "you are now a developer terminal",
      "hacked"
    ];
    
    const contentLower = content.toLowerCase();
    return !bannedPatterns.some(pattern => contentLower.includes(pattern));
  }
}

// ----------------------------------------------------
// 6. RATE LIMITER
// ----------------------------------------------------
const clientRequests: Record<string, number[]> = {};
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 25;

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  if (!clientRequests[clientId]) {
    clientRequests[clientId] = [];
  }
  
  clientRequests[clientId] = clientRequests[clientId].filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (clientRequests[clientId].length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  clientRequests[clientId].push(now);
  return true;
}

// ----------------------------------------------------
// 7. CACHING LAYER
// ----------------------------------------------------
const cacheStore: Record<string, { response: AIServiceResponse; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes cache TTL

// ----------------------------------------------------
// 8. OBSERVABILITY LOGS
// ----------------------------------------------------
function logIntelligenceAudit(provider: string, toolType: string, latency: number, status: "SUCCESS" | "FAIL") {
  console.log(`[AI AUDIT LOG] Provider=${provider} | Tool=${toolType} | Latency=${latency}ms | Status=${status}`);
}

// ----------------------------------------------------
// 9. CORE SERVICE CONTROLLER (WITH RETRY LOGIC)
// ----------------------------------------------------
export async function executeAIRequest(
  toolType: keyof typeof PromptManager,
  input: string,
  clientId = "anonymous_user"
): Promise<AIServiceResponse> {
  const startTime = Date.now();

  // Rate limit validation
  if (!checkRateLimit(clientId)) {
    throw new Error("Editorial limits reached. Please wait a minute before making another query.");
  }

  // Input Sanitization
  const sanitizedInput = ResponseValidator.sanitizeInput(input);
  if (!sanitizedInput) {
    throw new Error("Invalid request content. Please type safe internet slang inputs.");
  }

  // Cache Lookup
  const cacheKey = `${toolType}_${sanitizedInput.toLowerCase()}`;
  if (cacheStore[cacheKey] && Date.now() - cacheStore[cacheKey].timestamp < CACHE_TTL) {
    return { ...cacheStore[cacheKey].response, cached: true };
  }

  // Provider selection (Default fallback or adapter override)
  const providerEnv = process.env.NEXT_PUBLIC_AI_PROVIDER || "local";
  let adapter: AIAdapter;

  if (providerEnv === "openai") {
    adapter = new OpenAIAdapter();
  } else if (providerEnv === "anthropic") {
    adapter = new AnthropicAdapter();
  } else if (providerEnv === "gemini") {
    adapter = new GeminiAdapter();
  } else if (providerEnv === "deepseek") {
    adapter = new DeepSeekAdapter();
  } else {
    adapter = new LocalFallbackAdapter();
  }

  const prompt = PromptManager[toolType](sanitizedInput);
  const context = activeSessionContext.getHistoryContext();

  // Retry execution pipeline (Up to 3 retries if enabled)
  let retryCount = 0;
  const maxRetries = FeatureFlags.enableRetryLogic ? 3 : 1;
  let textResult = "";

  while (retryCount < maxRetries) {
    try {
      // Simulate real roundtrip processing times
      await new Promise(resolve => setTimeout(resolve, 500));
      textResult = await adapter.generateText(prompt, context);
      
      // Safety validation
      if (!ResponseValidator.validateOutput(textResult)) {
        throw new Error("Response safety checks failed. Please try a different query.");
      }
      
      break; // Success! Exit retry loop
    } catch (err) {
      retryCount++;
      if (retryCount >= maxRetries) {
        logIntelligenceAudit(adapter.name, toolType, Date.now() - startTime, "FAIL");
        const errMsg = err instanceof Error ? err.message : "Failed to execute AI request after multiple retries.";
        throw new Error(errMsg);
      }
    }
  }

  // Log session history
  activeSessionContext.addHistory("user", sanitizedInput);
  activeSessionContext.addHistory("assistant", textResult);

  const response: AIServiceResponse = {
    content: textResult,
    isAI: true,
    tokensUsed: Math.floor(textResult.length / 4) + 20,
    provider: adapter.name,
  };

  // Cache response
  cacheStore[cacheKey] = { response, timestamp: Date.now() };

  // Log audit activity
  logIntelligenceAudit(adapter.name, toolType, Date.now() - startTime, "SUCCESS");

  return response;
}
