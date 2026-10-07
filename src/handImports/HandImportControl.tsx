import type { HandImportJobDto } from "./api";
import { UploadButton } from "./UploadButton";
import { useHandImportJobs } from "./useHandImportJobs";

interface Props {
  onJobCompleted?: (job: HandImportJobDto) => void;
}

export const HandImportControl = (props: Props) => {
  const importState = useHandImportJobs();

  return (
    <UploadButton
      jobs={importState.jobs}
      onJobAccepted={importState.acceptJob}
      onJobCompleted={props.onJobCompleted}
      statusError={importState.errorMessage}
      onDismissStatusError={importState.clearError}
    />
  );
};
