import type {
  PostflopBettingAnalysisDto,
  PostflopBettingStatDto,
  PostflopActionSequence,
  PostflopAnalysisTab,
  PostflopMatchupDirection,
  PostflopOpportunityType,
  PostflopFlopHighCard,
  PostflopFlopRankTexture,
  PostflopFlopTexture,
  PostflopPotType,
  PostflopRunout,
  PostflopSeatPosition,
  RiverBetSizeCategory,
  RiverBettingStatDto,
  RiverBetResponseStatDto,
} from "./dto";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

const isFiniteNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

const isPostflopOpportunityType = (value: unknown): value is PostflopOpportunityType =>
  value === "FlopContinuationBet" || value === "DonkBet" || value === "DelayedContinuationBet";

const isPostflopMatchupDirection = (value: unknown): value is PostflopMatchupDirection =>
  value === "HeroVsVillain" || value === "VillainVsHero" || value === "VillainVsVillain";

const isRiverBettingStatDto = (value: unknown): value is RiverBettingStatDto => {
  if (typeof value !== "object" || value === null) return false;

  return (
    "aggressionType" in value &&
    (value.aggressionType === "Bet" || value.aggressionType === "Raise") &&
    "opportunityCount" in value &&
    isFiniteNumber(value.opportunityCount) &&
    "heroOpportunityCount" in value &&
    isFiniteNumber(value.heroOpportunityCount) &&
    "showdownCount" in value &&
    isFiniteNumber(value.showdownCount) &&
    "villainWinCount" in value &&
    isFiniteNumber(value.villainWinCount) &&
    "opponentWinCount" in value &&
    isFiniteNumber(value.opponentWinCount) &&
    "chopCount" in value &&
    isFiniteNumber(value.chopCount) &&
    "heroCallCount" in value &&
    isFiniteNumber(value.heroCallCount) &&
    "heroCallVillainWinCount" in value &&
    isFiniteNumber(value.heroCallVillainWinCount) &&
    "heroCallHeroWinCount" in value &&
    isFiniteNumber(value.heroCallHeroWinCount) &&
    "heroCallChopCount" in value &&
    isFiniteNumber(value.heroCallChopCount)
  );
};

const isRiverBetResponseStatDto = (value: unknown): value is RiverBetResponseStatDto => {
  if (typeof value !== "object" || value === null) return false;

  return (
    "line" in value &&
    (value.line === "BF" || value.line === "XBF") &&
    "opportunityCount" in value &&
    isFiniteNumber(value.opportunityCount) &&
    "villainFoldCount" in value &&
    isFiniteNumber(value.villainFoldCount)
  );
};

const isPostflopBettingStatDto = (value: unknown): value is PostflopBettingStatDto => {
  if (typeof value !== "object" || value === null) return false;

  return (
    "opportunityType" in value &&
    isPostflopOpportunityType(value.opportunityType) &&
    "matchupDirection" in value &&
    isPostflopMatchupDirection(value.matchupDirection) &&
    "actorPosition" in value &&
    typeof value.actorPosition === "string" &&
    "responderPosition" in value &&
    (typeof value.responderPosition === "string" || value.responderPosition === null) &&
    "delayedContext" in value &&
    (typeof value.delayedContext === "string" || value.delayedContext === null) &&
    "opportunityCount" in value &&
    isFiniteNumber(value.opportunityCount) &&
    "betCount" in value &&
    isFiniteNumber(value.betCount) &&
    "betRate" in value &&
    isFiniteNumber(value.betRate) &&
    "responseBreakdown" in value &&
    Array.isArray(value.responseBreakdown) &&
    value.responseBreakdown.every(
      (response) =>
        typeof response === "object" &&
        response !== null &&
        "responseType" in response &&
        typeof response.responseType === "string" &&
        "count" in response &&
        isFiniteNumber(response.count) &&
        "rate" in response &&
        isFiniteNumber(response.rate),
    )
  );
};

const isPostflopBettingAnalysisDto = (value: unknown): value is PostflopBettingAnalysisDto => {
  if (
    typeof value !== "object" ||
    value === null ||
    !("stats" in value) ||
    !Array.isArray(value.stats) ||
    !("riverStats" in value) ||
    !Array.isArray(value.riverStats) ||
    !("riverBetResponseStats" in value) ||
    !Array.isArray(value.riverBetResponseStats)
  ) {
    return false;
  }
  return (
    value.stats.every(isPostflopBettingStatDto) &&
    value.riverStats.every(isRiverBettingStatDto) &&
    value.riverBetResponseStats.every(isRiverBetResponseStatDto)
  );
};

interface PostflopBettingAnalysisFilters {
  activeTab: PostflopAnalysisTab;
  pfrInPosition: boolean | null;
  ipPosition: PostflopSeatPosition | null;
  oopPosition: PostflopSeatPosition | null;
  potTypes: readonly PostflopPotType[];
  flopHighCard: PostflopFlopHighCard | null;
  flopTextures: readonly PostflopFlopTexture[];
  flopActionSequences: readonly PostflopActionSequence[];
  flopRankTextures: readonly PostflopFlopRankTexture[];
  turnActionSequences: readonly PostflopActionSequence[];
  turnRunouts: readonly PostflopRunout[];
  riverRunouts: readonly PostflopRunout[];
  riverBetSizeCategory: RiverBetSizeCategory | null;
  minRiverBetToPotPercent: string;
  maxRiverBetToPotPercent: string;
}

const appendValues = <T extends string>(query: URLSearchParams, key: string, values: readonly T[]) => {
  for (const value of values) {
    query.append(key, value);
  }
};

export const getPostflopBettingAnalysis = async (
  filters: PostflopBettingAnalysisFilters,
  signal?: AbortSignal,
): Promise<PostflopBettingAnalysisDto> => {
  const query = new URLSearchParams();
  if (filters.pfrInPosition !== null) {
    query.set("pfrInPosition", String(filters.pfrInPosition));
  }
  if (filters.ipPosition !== null) {
    query.set("ipPosition", filters.ipPosition);
  }
  if (filters.oopPosition !== null) {
    query.set("oopPosition", filters.oopPosition);
  }
  appendValues(query, "potTypes", filters.potTypes);

  if (filters.activeTab === "Flop") {
    if (filters.flopHighCard !== null) {
      query.set("flopHighCard", filters.flopHighCard);
    }
    appendValues(query, "flopTextures", filters.flopTextures);
  }

  if (filters.activeTab !== "Flop") {
    appendValues(query, "flopActionSequences", filters.flopActionSequences);
  }

  if (filters.activeTab !== "Turn") {
    appendValues(query, "flopRankTextures", filters.flopRankTextures);
  }

  if (filters.activeTab === "River") {
    appendValues(query, "turnActionSequences", filters.turnActionSequences);
  }

  if (filters.activeTab !== "Flop") {
    appendValues(query, "turnRunouts", filters.turnRunouts);
  }

  if (filters.activeTab === "River") {
    appendValues(query, "riverRunouts", filters.riverRunouts);
    if (filters.riverBetSizeCategory !== null) {
      query.set("riverBetSizeCategory", filters.riverBetSizeCategory);
    }
    const minBetToPotPercent = Number(filters.minRiverBetToPotPercent);
    if (filters.minRiverBetToPotPercent.trim() !== "" && Number.isFinite(minBetToPotPercent)) {
      query.set("minRiverBetToPotPercent", String(minBetToPotPercent));
    }
    const maxBetToPotPercent = Number(filters.maxRiverBetToPotPercent);
    if (filters.maxRiverBetToPotPercent.trim() !== "" && Number.isFinite(maxBetToPotPercent)) {
      query.set("maxRiverBetToPotPercent", String(maxBetToPotPercent));
    }
  }

  const queryString = query.toString();
  const url = `${apiBaseUrl}/api/massdata/postflop-betting${queryString.length > 0 ? `?${queryString}` : ""}`;
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!isPostflopBettingAnalysisDto(payload)) {
    throw new Error("Invalid postflop analysis response.");
  }

  return payload;
};
