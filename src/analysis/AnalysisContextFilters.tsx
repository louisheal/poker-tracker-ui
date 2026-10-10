import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type {
  PostflopActionSequence,
  PostflopAnalysisTab,
  PostflopFlopHighCard,
  PostflopFlopRankTexture,
  PostflopFlopTexture,
  PostflopRunout,
  RiverBetSizeCategory,
} from "./dto";
import { FlopFilterSet } from "./FlopFilterSet";
import { RiverFilterSet } from "./RiverFilterSet";
import { TurnFilterSet } from "./TurnFilterSet";

const contextFiltersSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1.5,
  alignItems: "stretch",
  minWidth: 0,
  "& > *": {
    minWidth: 0,
    pb: 1.5,
  },
  "& > *:last-child": {
    pb: 0,
  },
} satisfies SxProps<Theme>;

interface Props {
  activeTab: PostflopAnalysisTab;
  flopHighCard: PostflopFlopHighCard | null;
  flopTextures: PostflopFlopTexture[];
  flopActionSequences: PostflopActionSequence[];
  flopRankTextures: PostflopFlopRankTexture[];
  turnActionSequences: PostflopActionSequence[];
  turnRunouts: PostflopRunout[];
  riverRunouts: PostflopRunout[];
  riverBetSizeCategory: RiverBetSizeCategory | null;
  onFlopHighCardChange: (value: PostflopFlopHighCard | null) => void;
  onFlopTexturesChange: (values: PostflopFlopTexture[]) => void;
  onFlopActionSequencesChange: (values: PostflopActionSequence[]) => void;
  onFlopRankTexturesChange: (values: PostflopFlopRankTexture[]) => void;
  onTurnActionSequencesChange: (values: PostflopActionSequence[]) => void;
  onTurnRunoutsChange: (values: PostflopRunout[]) => void;
  onRiverRunoutsChange: (values: PostflopRunout[]) => void;
  onRiverBetSizeCategoryChange: (value: RiverBetSizeCategory | null) => void;
}

export const AnalysisContextFilters = (props: Props) => (
  <Box sx={contextFiltersSx}>
    <FlopFilterSet
      highCard={props.flopHighCard}
      textures={props.flopTextures}
      rankTextures={props.flopRankTextures}
      actionSequences={props.flopActionSequences}
      showActionSequence={props.activeTab !== "Flop"}
      onHighCardChange={props.onFlopHighCardChange}
      onTexturesChange={props.onFlopTexturesChange}
      onRankTexturesChange={props.onFlopRankTexturesChange}
      onActionSequencesChange={props.onFlopActionSequencesChange}
    />
    {props.activeTab !== "Flop" && (
      <TurnFilterSet
        runouts={props.turnRunouts}
        actionSequences={props.turnActionSequences}
        showActionSequence={props.activeTab === "River"}
        onRunoutsChange={props.onTurnRunoutsChange}
        onActionSequencesChange={props.onTurnActionSequencesChange}
      />
    )}
    {props.activeTab === "River" && (
      <>
        <RiverFilterSet
          runouts={props.riverRunouts}
          betSizeCategory={props.riverBetSizeCategory}
          onRunoutsChange={props.onRiverRunoutsChange}
          onBetSizeCategoryChange={props.onRiverBetSizeCategoryChange}
        />
      </>
    )}
  </Box>
);
