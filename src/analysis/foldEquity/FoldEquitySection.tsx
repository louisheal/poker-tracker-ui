import type { PostflopBetResponseBucketDto, PostflopBetResponseStreet } from "../dto";
import { AnalysisPanelGrid } from "../AnalysisPanelGrid";
import { AnalysisSectionState } from "../AnalysisSectionState";
import type { AnalysisSectionStatus } from "../AnalysisSectionState";
import { FoldEquityChart } from "./FoldEquityChart";
import type { FoldEquityBucketsState } from "./useFoldEquityBuckets";

const foldEquityLines = ["BF", "XBF", "BRF", "XBRF"] as const satisfies PostflopBetResponseBucketDto["line"][];

interface Props {
  street: PostflopBetResponseStreet;
  state: FoldEquityBucketsState;
}

export const FoldEquitySection = (props: Props) => {
  const loadedState = props.state.status === "loaded" ? props.state : null;
  const sectionStatus: AnalysisSectionStatus =
    props.state.status === "loaded"
      ? {
          status: "loaded",
          hasData: props.state.buckets.some((bucket) => bucket.opportunityCount > 0),
        }
      : props.state;

  return (
    <AnalysisSectionState
      title="Fold Equity"
      street={props.street}
      status={sectionStatus}
      emptyMessage={`No ${props.street.toLowerCase()} fold-equity observations are available.`}
    >
      {loadedState !== null && (
        <AnalysisPanelGrid>
          {foldEquityLines.map((line) => (
            <FoldEquityChart key={line} buckets={loadedState.buckets} line={line} street={props.street} />
          ))}
        </AnalysisPanelGrid>
      )}
    </AnalysisSectionState>
  );
};
