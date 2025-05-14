import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Leaderboard } from "../../models/leaderboard/leaderboard";
import { LeaderboardType } from "../../models/leaderboard/leaderboard.enum";

export const leaderboardsActions = createActionGroup({
    source: 'Leaderboards page',
    events: {
        // used for navigation from the paginator
        'ShowNextPage': emptyProps(),
        'ShowPreviousPage': emptyProps(),
        'SetPageIndex': props<{ index: number }>(),
        'ResetPageIndex': emptyProps(),

        // on initial component load treba provera da li je state prazan ako nije ovo se ne radi ovako valjda
        'Initialize Leaderboards': emptyProps(),
        'Initialize Leaderboards Success': props<{
            weekly: Leaderboard[];
            monthly: Leaderboard[];
            yearly: Leaderboard[];
            weeklyPageCount: number;
            monthlyPageCount: number;
            yearlyPageCount: number;
        }>(),
        'Initialize Leaderboards Failure': props<{ error: string }>(),

        // refresh page counter manually
        'refreshPageCount': emptyProps(),
        'refreshPageCountSuccess' : props<{
            weeklyPageCount: number,
            monthlyPageCount: number,
            yearlyPageCount: number,
        }>(),
        'refreshPageCountFailure': emptyProps(),

        // used when the navigation actions above request a page that is not yet loaded into store
        'LoadAdditionalPages': props<{
            leaderboardType: LeaderboardType,
            pageCount: number,
        }>(),
        'LoadAdditionalPagesSuccess': props<{
            leaderboardType: LeaderboardType,
            pageCount: number,
            pages: Leaderboard[],
        }>(),
        'LoadAdditionalPagesFailure': emptyProps(),
        'ToggleLoading': emptyProps(),
    }
});