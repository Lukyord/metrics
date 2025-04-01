import { Client, Databases, Query } from 'node-appwrite';

const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Databases service
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const databases = new Databases(client);

  try {
    // Get all metrics with valid streak types (excluding "no-streak")
    const metrics = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_METRICS_COLLECTION_ID,
        [
            Query.notEqual('streak_type', 'no-streak'),
            Query.isNotEqual('streak_type', '') // handle empty string case
        ]
    );

    log(`Found ${metrics.documents.length} metrics to check`);

    const today = new Date();
    const updates = metrics.documents.map(async (metric) => {
        const lastCompletedDate = new Date(metric.last_completed_date);
        const streakType = metric.streak_type;

        // Calculate if streak should be maintained
        const shouldMaintainStreak = (() => {
            switch (streakType) {
                case 'daily': {
                    const diffInDays = Math.floor(
                        (today.getTime() - lastCompletedDate.getTime()) / 
                        (1000 * 60 * 60 * 24)
                    );
                    return diffInDays <= 1;
                }
                case 'weekly': {
                    const weekDiff = getWeekNumber(today) - getWeekNumber(lastCompletedDate);
                    return weekDiff <= 1;
                }
                case 'monthly': {
                    const thisMonth = today.getMonth() + today.getFullYear() * 12;
                    const lastMonth = lastCompletedDate.getMonth() + 
                        lastCompletedDate.getFullYear() * 12;
                    return thisMonth - lastMonth <= 1;
                }
                case 'annually': {
                    const yearDiff = today.getFullYear() - lastCompletedDate.getFullYear();
                    return yearDiff <= 1;
                }
                default:
                    return false;
            }
        })();

        // If streak should not be maintained, reset it to 0
        if (!shouldMaintainStreak) {
            try {
                await databases.updateDocument(
                    process.env.APPWRITE_DATABASE_ID,
                    process.env.APPWRITE_METRICS_COLLECTION_ID,
                    metric.$id,
                    {
                        current_streak: 0
                    }
                );
                log(`Reset streak for metric ${metric.$id}`);
            } catch (err) {
                error(`Failed to update metric ${metric.$id}: ${err.message}`);
            }
        }
    });

    await Promise.all(updates);
    return res.json({
        success: true,
        message: 'Streak check completed successfully'
    });

  } catch (err) {
    error(`Error checking streaks: ${err.message}`);
    return res.json({
        success: false,
        error: err.message
    }, 500);
  }

  // The req object contains the request data
  if (req.path === "/ping") {
    // Use res object to respond with text(), json(), or binary()
    // Don't forget to return a response!
    return res.text("Pong");
  }

  return res.json({
    motto: "Build like a team of hundreds_",
    learn: "https://appwrite.io/docs",
    connect: "https://appwrite.io/discord",
    getInspired: "https://builtwith.appwrite.io",
  });
};
