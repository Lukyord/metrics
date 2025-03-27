export type StreakType =
    | "daily"
    | "weekly"
    | "monthly"
    | "annually"
    | "no-streak";

export type MetricAppwrite = {
    name: string;
    user_id: string;
    streak_type?: StreakType | null;
    current_streak: number;
    longest_streak: number;
    last_completed_date: Date;
    completion_history: string;
};

export type Metric = MetricAppwrite & {
    id: string;
    subgoals: Subgoal[];
};

export type SubgoalAppwrite = {
    name: string;
    metrics: string;
    progress: number;
    unit: string;
};

export type Subgoal = {
    name: string;
    progress: number;
    unit: string;
    metric_id: string;
};
