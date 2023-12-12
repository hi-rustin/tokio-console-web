import { Duration, Timestamp } from "./duration";
import type { Stats as ProtoTaskStats } from "~/gen/tasks_pb";

export interface TokioTaskStats {
    polls: bigint;
    createdAt: Timestamp;
    droppedAt?: Timestamp;
    busy: Duration;
    scheduled: Duration;
    lastPollStarted?: Timestamp;
    lastPollEnded?: Timestamp;
    idle?: Duration;
    total?: Duration;

    // === waker stats ===
    // Total number of times the task has been woken over its lifetime.
    wakes: bigint;
    // Total number of times the task's waker has been cloned
    wakerClones: bigint;
    // Total number of times the task's waker has been dropped.
    wakerDrops: bigint;
    // The timestamp of when the task was last woken.
    lastWake?: Timestamp;
    // Total number of times the task has woken itself.
    selfWakes: bigint;
}

export function fromProtoTaskStats(stats: ProtoTaskStats): TokioTaskStats {
    const createdAt = new Timestamp(
        stats.createdAt!.seconds,
        stats.createdAt!.nanos,
    );
    const droppedAt = stats.droppedAt
        ? new Timestamp(stats.droppedAt.seconds, stats.droppedAt.nanos)
        : undefined;
    const total = droppedAt ? droppedAt.subtract(createdAt) : undefined;

    const pollStats = stats.pollStats!;
    const busy = pollStats.busyTime
        ? new Duration(pollStats.busyTime.seconds, pollStats.busyTime.nanos)
        : new Duration(BigInt(0), 0);

    const scheduled = stats.scheduledTime
        ? new Duration(stats.scheduledTime.seconds, stats.scheduledTime.nanos)
        : new Duration(BigInt(0), 0);

    const idle = total ? total.subtract(busy).subtract(scheduled) : undefined;

    return {
        polls: pollStats.polls,
        createdAt,
        droppedAt,
        busy,
        scheduled,
        lastPollStarted: pollStats.lastPollStarted
            ? new Timestamp(
                  pollStats.lastPollStarted.seconds,
                  pollStats.lastPollStarted.nanos,
              )
            : undefined,
        lastPollEnded: pollStats.lastPollEnded
            ? new Timestamp(
                  pollStats.lastPollEnded.seconds,
                  pollStats.lastPollEnded.nanos,
              )
            : undefined,
        idle,
        total,
        wakes: stats.wakes,
        wakerClones: stats.wakerClones,
        wakerDrops: stats.wakerDrops,
        lastWake: stats.lastWake
            ? new Timestamp(stats.lastWake.seconds, stats.lastWake.nanos)
            : undefined,
        selfWakes: stats.selfWakes,
    };
}
