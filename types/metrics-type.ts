export type MetricAppwrite = {
    name: string;
    user_id: string;
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
