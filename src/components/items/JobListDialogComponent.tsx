import { fetchJobs } from "@/modules/items/transactionsService";
import {
  CheckIcon,
  Cross1Icon,
  ExclamationTriangleIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import {
  Badge,
  Button,
  Dialog,
  Flex,
  IconButton,
  ScrollArea,
  Spinner,
  Table,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface JobListDialogComponentProps {
  itemId: number;
}

function StatusIcon({ status, result }: { status: string; result?: any }) {
  switch (status) {
    case "PROCESSING":
      return (
        <IconButton variant="soft" color="yellow" onClick={() => {}}>
          <Spinner size="3" />
        </IconButton>
      );
    case "ERROR":
      return (
        <Tooltip content={result["error"] || "An error occurred"}>
          <IconButton variant="soft" color="red" onClick={() => {}}>
            <ExclamationTriangleIcon />
          </IconButton>
        </Tooltip>
      );
    default:
      return (
        <IconButton variant="soft" color="green" onClick={() => {}}>
          <CheckIcon />
        </IconButton>
      );
  }
}

function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case "TRAINER":
      return (
        <Badge variant="soft" color="blue" size="2">
          Trainer
        </Badge>
      );
    default:
      return (
        <Badge variant="soft" color="purple" size="2">
          Forecaster
        </Badge>
      );
  }
}

export default function JobListDialogComponent({
  itemId,
}: JobListDialogComponentProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setJobs([]);
      handleFetchJobs(itemId);
    }
  }, [open]);

  const handleFetchJobs = async (itemId: number) => {
    setLoading(true);
    try {
      console.log("Fetching jobs for itemId:", itemId);
      const { data } = await fetchJobs(itemId);
      setJobs(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast("Error fetching jobs.", { type: "error" });
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button variant="surface" onClick={() => fetchJobs(itemId)}>
          Jobs
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="600px">
        <Dialog.Title>
          <Flex direction="row" justify="between" align="center">
            <Text>Job List</Text>
            <Flex direction="row" gap="2">
              <IconButton
                variant="soft"
                color="green"
                onClick={() => handleFetchJobs(itemId)}
              >
                <ReloadIcon />
              </IconButton>
              <Dialog.Close>
                <Flex direction="row" justify="end">
                  <IconButton
                    variant="soft"
                    color="red"
                    onClick={() => setOpen(false)}
                  >
                    <Cross1Icon />
                  </IconButton>
                </Flex>
              </Dialog.Close>
            </Flex>
          </Flex>
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Here are all the jobs related to this item.
        </Dialog.Description>
        {loading ? (
          <Flex justify="center">
            <Spinner size="3" />
          </Flex>
        ) : (
          <ScrollArea style={{ height: "400px" }}>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Finalized At</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {jobs.length !== 0 &&
                  jobs.map((job) => (
                    <Table.Row key={job.id}>
                      <Table.Cell style={{ verticalAlign: "middle" }}>
                        {<StatusIcon status={job.status} result={job.result} />}
                      </Table.Cell>

                      <Table.Cell style={{ verticalAlign: "middle" }}>
                        {<TypeIcon type={job.queue} />}
                      </Table.Cell>

                      <Table.Cell style={{ verticalAlign: "middle" }}>
                        {new Date(job.createdAt).toLocaleString()}
                      </Table.Cell>
                      <Table.Cell style={{ verticalAlign: "middle" }}>
                        {job.status !== "PROCESSING" ? (
                          job.modifiedAt ? (
                            new Date(job.modifiedAt).toLocaleString()
                          ) : (
                            "N/A"
                          )
                        ) : (
                          <Spinner size="2" />
                        )}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                {jobs.length === 0 && (
                  <Table.Row>
                    <Table.Cell colSpan={4} style={{ textAlign: "center" }}>
                      No jobs found for this item.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Root>
          </ScrollArea>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
