export interface Member {
    rank: number;
    lastName: string;
    firstName: string;
    name:string;
    distance: number;
    activities: number;
    elevGain: number;
    movingTime: number;
    profile: string;
}

export interface ReportGroup {
    name: string;
    totalDistance: number;
    totalMovingTime: number;
    totalActivities: number;
    members: Member[];
}

export interface Report {
    reportTime:string,
    reportGroups: ReportGroup[],
    title:string,
    description:string
}