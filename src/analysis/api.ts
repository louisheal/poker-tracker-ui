import type {
  PostflopBettingAnalysisDto,
  PostflopBettingStatDto,
  PostflopMatchupDirection,
  PostflopOpportunityType,
  PostflopFlopHighCard,
  PostflopFlopTexture,
  PostflopPotType,
  PostflopSeatPosition,
} from "./dto";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

const isFiniteNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

const isPostflopOpportunityType = (value: unknown): value is PostflopOpportunityType =>
  value === "FlopContinuationBet" || value === "DonkBet" || value === "DelayedContinuationBet";

const isPostflopMatchupDirection = (value: unknown): value is PostflopMatchupDirection =>
  value === "HeroVsVillain" || value === "VillainVsHero" || value === "VillainVsVillain";

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
  if (typeof value !== "object" || value === null || !("stats" in value) || !Array.isArray(value.stats)) return false;
  return value.stats.every(isPostflopBettingStatDto);
};

export const getPostflopBettingAnalysis = async (
  pfrInPosition: boolean | null,
  ipPosition: PostflopSeatPosition | null,
  oopPosition: PostflopSeatPosition | null,
  potTypes: readonly PostflopPotType[],
  flopHighCard: PostflopFlopHighCard | null,
  flopTextures: readonly PostflopFlopTexture[],
  signal?: AbortSignal,
): Promise<PostflopBettingAnalysisDto> => {
  const query = new URLSearchParams();
  if (pfrInPosition !== null) {
    query.set("pfrInPosition", String(pfrInPosition));
  }
  if (ipPosition !== null) {
    query.set("ipPosition", ipPosition);
  }
  if (oopPosition !== null) {
    query.set("oopPosition", oopPosition);
  }
  for (const potType of potTypes) {
    query.append("potTypes", potType);
  }
  if (flopHighCard !== null) {
    query.set("flopHighCard", flopHighCard);
  }
  for (const flopTexture of flopTextures) {
    query.append("flopTextures", flopTexture);
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
