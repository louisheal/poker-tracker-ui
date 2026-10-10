import type {
  PostflopActionSequence,
  PostflopFlopHighCard,
  PostflopFlopRankTexture,
  PostflopFlopTexture,
  PostflopPotType,
  PostflopRunout,
  PostflopSeatPosition,
  PostflopBetResponseBucketDto,
  PostflopBetResponseStreet,
  RiverBetSizeCategory,
} from "./dto";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export interface PostflopBetResponseBucketFilters {
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
}

const isFiniteNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

const isPostflopBetResponseBucketDto = (value: unknown): value is PostflopBetResponseBucketDto => {
  if (typeof value !== "object" || value === null) return false;

  return (
    "line" in value &&
    (value.line === "BF" || value.line === "XBF") &&
    "betSizeThresholdPercent" in value &&
    isFiniteNumber(value.betSizeThresholdPercent) &&
    Number.isInteger(value.betSizeThresholdPercent) &&
    value.betSizeThresholdPercent >= 10 &&
    value.betSizeThresholdPercent <= 300 &&
    value.betSizeThresholdPercent % 10 === 0 &&
    "opportunityCount" in value &&
    isFiniteNumber(value.opportunityCount) &&
    Number.isInteger(value.opportunityCount) &&
    value.opportunityCount >= 0 &&
    "villainFoldCount" in value &&
    isFiniteNumber(value.villainFoldCount) &&
    Number.isInteger(value.villainFoldCount) &&
    value.villainFoldCount >= 0 &&
    value.villainFoldCount <= value.opportunityCount
  );
};

const appendValues = <T extends string>(query: URLSearchParams, key: string, values: readonly T[]) => {
  for (const value of values) {
    query.append(key, value);
  }
};

const buildPostflopBetResponseBucketQuery = (
  street: PostflopBetResponseStreet,
  filters: PostflopBetResponseBucketFilters,
) => {
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

  if (filters.flopHighCard !== null) {
    query.set("flopHighCard", filters.flopHighCard);
  }
  appendValues(query, "flopTextures", filters.flopTextures);
  appendValues(query, "flopRankTextures", filters.flopRankTextures);

  if (street !== "Flop") {
    appendValues(query, "flopActionSequences", filters.flopActionSequences);
    appendValues(query, "turnRunouts", filters.turnRunouts);
  }

  if (street === "River") {
    appendValues(query, "turnActionSequences", filters.turnActionSequences);
    appendValues(query, "riverRunouts", filters.riverRunouts);
    if (filters.riverBetSizeCategory !== null) {
      query.set("riverBetSizeCategory", filters.riverBetSizeCategory);
    }
  }

  return query;
};

const getPostflopBettingUrl = (path: string, query: URLSearchParams) => {
  const queryString = query.toString();
  return `${apiBaseUrl}/api/massdata/${path}${queryString.length > 0 ? `?${queryString}` : ""}`;
};

export const getPostflopBetResponseBuckets = async (
  street: PostflopBetResponseStreet,
  filters: PostflopBetResponseBucketFilters,
  signal?: AbortSignal,
): Promise<PostflopBetResponseBucketDto[]> => {
  const query = buildPostflopBetResponseBucketQuery(street, filters);
  const response = await fetch(
    getPostflopBettingUrl(`postflop-betting/${street.toLowerCase()}/response-buckets`, query),
    { signal },
  );
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("buckets" in payload) ||
    !Array.isArray(payload.buckets) ||
    !payload.buckets.every(isPostflopBetResponseBucketDto)
  ) {
    throw new Error(`Invalid ${street.toLowerCase()} response buckets response.`);
  }

  return payload.buckets;
};
