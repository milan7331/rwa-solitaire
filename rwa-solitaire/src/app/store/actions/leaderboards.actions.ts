import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Leaderboard, MonthlyLeaderboard, WeeklyLeaderboard, YearlyLeaderboard } from "../../models/leaderboard/leaderboard";
import { GetLeaderboardDto } from "../../models/leaderboard/get-leaderboard.dto";

export const leaderboardsActions = createActionGroup({
    source: 'Leaderboards page',
    events: {
        'Get weekly leaderboard': props<GetLeaderboardDto>(),
        'Get weekly leaderboard success': props<{leaderboards: WeeklyLeaderboard[]}>(),
        'Get weekly leaderboard failure': emptyProps(),

        'Get monthly leaderboard': props<GetLeaderboardDto>(),
        'Get monthly leaderboard success': props<{leaderboards: MonthlyLeaderboard[]}>(),
        'Get monthly leaderboard failure': emptyProps(),

        'Get yearly leaderboard': props<GetLeaderboardDto>(),
        'Get yearly leaderboard success': props<{leaderboards: YearlyLeaderboard[]}>(),
        'Get yearly leaderboard failure': emptyProps(),

        
    }
});
