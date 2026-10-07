import { useEffect, useState } from "react";
import { getActiveHandImportJobs, getHandImportJob } from "./api";
import type { HandImportJobDto } from "./api";

const isActiveStatus = (status: HandImportJobDto["status"]): boolean => status === "queued" || status === "processing";

const isActiveJob = (job: HandImportJobDto): boolean =>
  isActiveStatus(job.status) || job.files.some((file) => isActiveStatus(file.status));

const mergeJobs = (currentJobs: HandImportJobDto[], updates: HandImportJobDto[]): HandImportJobDto[] => {
  const jobsById = new Map(currentJobs.map((job) => [job.jobId, job]));
  updates.forEach((job) => jobsById.set(job.jobId, job));
  return Array.from(jobsById.values());
};

export const useHandImportJobs = () => {
  const [jobs, setJobs] = useState<HandImportJobDto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const activeJobIdsKey = jobs
    .filter(isActiveJob)
    .map((job) => job.jobId)
    .join("\n");

  useEffect(() => {
    const controller = new AbortController();
    let timeoutId: number | undefined;
    let retryDelay = 1000;

    const discoverActiveJobs = async () => {
      try {
        const activeJobs = await getActiveHandImportJobs(controller.signal);
        if (controller.signal.aborted) return;

        setJobs((currentJobs) => mergeJobs(currentJobs, activeJobs));
        setErrorMessage(null);
      } catch (error) {
        if (controller.signal.aborted) return;

        setErrorMessage(error instanceof Error ? error.message : "Active imports could not be restored.");
        timeoutId = window.setTimeout(() => void discoverActiveJobs(), retryDelay);
        retryDelay = Math.min(retryDelay * 2, 30000);
      }
    };

    void discoverActiveJobs();

    return () => {
      controller.abort();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (activeJobIdsKey.length === 0) return;

    const controller = new AbortController();
    const activeJobIds = activeJobIdsKey.split("\n");
    let timeoutId: number | undefined;
    let pollDelay = 500;

    const pollActiveJobs = async () => {
      const results = await Promise.allSettled(activeJobIds.map((jobId) => getHandImportJob(jobId, controller.signal)));
      if (controller.signal.aborted) return;

      const refreshedJobs: HandImportJobDto[] = [];
      let hasRequestFailure = false;
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          refreshedJobs.push(result.value);
        } else {
          hasRequestFailure = true;
        }
      });

      if (refreshedJobs.length > 0) {
        setJobs((currentJobs) => mergeJobs(currentJobs, refreshedJobs));
      }
      setErrorMessage(hasRequestFailure ? "Import status could not be updated. Retrying..." : null);
      pollDelay = hasRequestFailure ? Math.min(pollDelay * 2, 30000) : 1500;
      timeoutId = window.setTimeout(() => void pollActiveJobs(), pollDelay);
    };

    timeoutId = window.setTimeout(() => void pollActiveJobs(), 500);
    return () => {
      controller.abort();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [activeJobIdsKey]);

  const acceptJob = (job: HandImportJobDto) => {
    setJobs((currentJobs) => mergeJobs(currentJobs, [job]));
    setErrorMessage(null);
  };

  return {
    jobs,
    errorMessage,
    acceptJob,
    clearError: () => setErrorMessage(null),
  };
};
