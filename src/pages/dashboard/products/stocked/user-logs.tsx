import { getItemUserLogs } from "@/modules/items/transactionsService";
import { UserLog } from "@/types/user-log";
import { Badge, Skeleton, Spinner, Table } from "@radix-ui/themes";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface UserLogsProps {
  itemId: number;
  refresh: boolean;
}

export function UserLogs({ itemId, refresh }: UserLogsProps) {
  const logsInitialState = (): UserLog[] => {
    return Array.from({ length: 10 }, (_, i) => ({
      userId: 0,
      username: "Loading...",
      transactionType: "IN",
      quantity: 0,
      date: new Date(),
    }));
  };

  const [itemUserLogs, setItemUserLogs] = useState<UserLog[]>(
    logsInitialState()
  );
  const [itemUserLogsLoading, setItemUserLogsLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);

  const tableBodyRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef(true);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    initialLoad();
  }, [itemId, refresh]);

  const initialLoad = () => {
    setItemUserLogsLoading(true);
    setItemUserLogs(logsInitialState());
    setNextCursor(undefined);
    setHasMore(true);
    isInitialLoad.current = true;
    loadItemUserLogs(itemId);
  };

  const loadItemUserLogs = async (itemId: number, cursor?: string) => {
    try {
      const { data, success, message } = await getItemUserLogs(itemId, {
        cursor,
        limit: ITEMS_PER_PAGE,
      });

      if (!success) {
        toast(message, { type: "error" });
        setItemUserLogsLoading(false);
        return;
      }

      const response = data;

      if (isInitialLoad.current) {
        setItemUserLogs(response.data);
        isInitialLoad.current = false;
      } else {
        setItemUserLogs((prev) => [...prev, ...response.data]);
      }

      setHasMore(response.pagination.hasNext);
      setNextCursor(response.pagination.nextCursor);
      setItemUserLogsLoading(false);
      setLoadingMore(false);
    } catch (error) {
      toast("An error occurred loading user logs.", { type: "error" });
      setItemUserLogsLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || !nextCursor) return;

    setLoadingMore(true);
    loadItemUserLogs(itemId, nextCursor);
  }, [itemId, nextCursor, hasMore, loadingMore]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const scrollPosition = target.scrollTop + target.clientHeight;
      const scrollHeight = target.scrollHeight;

      // Load more when user scrolls to bottom 10%
      if (scrollPosition >= scrollHeight * 0.9) {
        loadMore();
      }
    },
    [loadMore]
  );

  return (
    <div style={styles.tableContainer}>
      <Table.Root style={styles.table}>
        <Table.Header style={styles.tableHeader}>
          <Table.Row>
            <Table.ColumnHeaderCell
              style={{ ...styles.headerCell, width: "30%" }}
            >
              Date
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              style={{ ...styles.headerCell, width: "35%" }}
            >
              User
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              style={{ ...styles.headerCell, width: "15%" }}
            >
              Method
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell
              style={{ ...styles.headerCell, width: "20%" }}
            >
              Quantity
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
      <div
        ref={tableBodyRef}
        style={styles.tableBodyWrapper}
        onScroll={handleScroll}
      >
        <Table.Root style={styles.table}>
          <Table.Body>
            {itemUserLogs.map((log, index) => (
              <Table.Row key={`${log.userId}-${log.date}-${index}`}>
                <Table.Cell style={{ ...styles.bodyCell, width: "30%" }}>
                  <Skeleton loading={itemUserLogsLoading && index < 10}>
                    {new Date(log.date).toISOString().split("T")[0]}
                  </Skeleton>
                </Table.Cell>
                <Table.Cell
                  style={{
                    ...styles.bodyCell,
                    width: "35%",
                  }}
                >
                  <Skeleton loading={itemUserLogsLoading && index < 10}>
                    {log.username}
                  </Skeleton>
                </Table.Cell>
                <Table.Cell
                  style={{
                    ...styles.bodyCell,
                    width: "15%",
                    textAlign: "center",
                  }}
                >
                  <Skeleton loading={itemUserLogsLoading && index < 10}>
                    <Badge
                      color={log.transactionType === "IN" ? "green" : "red"}
                    >
                      {log.transactionType}
                    </Badge>
                  </Skeleton>
                </Table.Cell>
                <Table.Cell
                  style={{
                    ...styles.bodyCell,
                    width: "20%",
                    textAlign: "center",
                  }}
                >
                  <Skeleton loading={itemUserLogsLoading && index < 10}>
                    {log.quantity} units
                  </Skeleton>
                </Table.Cell>
              </Table.Row>
            ))}
            {loadingMore && (
              <Table.Row>
                <Table.Cell
                  colSpan={4}
                  style={{
                    ...styles.bodyCell,
                    textAlign: "center",
                    padding: "16px",
                  }}
                >
                  <Spinner size="2" />
                </Table.Cell>
              </Table.Row>
            )}
            {!hasMore && itemUserLogs.length > 0 && !itemUserLogsLoading && (
              <Table.Row>
                <Table.Cell
                  colSpan={4}
                  style={{
                    ...styles.bodyCell,
                    textAlign: "center",
                    color: "var(--gray-11)",
                    fontStyle: "italic",
                    padding: "16px",
                  }}
                >
                  No more logs to display
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  );
}

const styles: { [key: string]: CSSProperties } = {
  tableContainer: {
    height: "250px",
    border: "1px solid var(--gray-6)",
    borderRadius: "6px",
    overflow: "hidden",
  },
  table: {
    width: "100%",
  },
  tableHeader: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    backgroundColor: "#1B201F",
  },
  headerCell: {
    fontWeight: "bold",
    padding: "8px 12px",
    verticalAlign: "middle",
  },
  tableBodyWrapper: {
    height: "calc(250px - 40px)",
    overflowY: "auto",
    overflowX: "hidden",
  },
  bodyCell: {
    padding: "8px 12px",
    verticalAlign: "middle",
    borderBottom: "1px solid var(--gray-3)",
  },
};
