import { expect, it } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { createTask } from "./createTask";
import TaskTable from "~/components/TaskTable.vue";
import { TokioTask } from "~/types/task/tokioTask";
import { Timestamp } from "~/types/common/duration";

mockNuxtImport("useTasks", () => {
    return () => {
        const pending = ref<boolean>(false);
        const tasksData = ref<Map<bigint, TokioTask>>(new Map());
        tasksData.value.set(1n, createTask());
        const lastUpdatedAt = ref<Timestamp>(new Timestamp(1000n, 0));

        return { pending, tasksData, lastUpdatedAt };
    };
});

it("TaskTable View", async () => {
    const component = await mountSuspended(TaskTable);
    expect(component.element.querySelector("tbody")).toMatchSnapshot();
});
