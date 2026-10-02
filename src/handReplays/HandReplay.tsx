import { useEffect, useState } from "react";
import { getHandReplay } from "./api";
import type { HandReplayDto } from "./dto";
import { HandReplayControls } from "./HandReplayControls";
import { HandReplaySpot } from "./HandReplaySpot";

interface Props {
  handId: string;
}

export const HandReplay = (props: Props) => {
  const [handReplay, setHandReplay] = useState<HandReplayDto | null>(null);
  const [sequenceIndex, setSequenceIndex] = useState(0);

  useEffect(() => {
    const loadHandReplay = async () => {
      const data = await getHandReplay(props.handId);
      setHandReplay(data);
    };

    void loadHandReplay();
  }, [props.handId]);

  // TODO : loading spinner
  if (handReplay === null) {
    return;
  }

  const maxIndex = handReplay.actionSequence.length;

  const onBack = () => {
    setSequenceIndex((prev) => {
      if (prev === 0) {
        return 0;
      }
      return prev - 1;
    });
  };

  const onForward = () => {
    setSequenceIndex((prev) => {
      if (prev === maxIndex - 1) {
        return maxIndex - 1;
      }
      return prev + 1;
    });
  };

  const currentSpot = handReplay.actionSequence[sequenceIndex];

  return (
    <>
      <HandReplaySpot
        handReplaySpot={currentSpot}
        heroHoleCards={handReplay.heroCards}
        heroPosition={handReplay.heroPosition}
      />
      <HandReplayControls index={sequenceIndex} length={maxIndex} onBack={onBack} onForward={onForward} />
    </>
  );
};
