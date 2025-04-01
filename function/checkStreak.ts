import { metricsService } from "@/services/metrics";

async function scheduledStreakCheck() {
    await metricsService.checkAndUpdateStreaks();
}
