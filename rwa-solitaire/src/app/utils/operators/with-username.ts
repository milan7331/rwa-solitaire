import { Store } from "@ngrx/store";
import { filter, map, Observable, withLatestFrom, concat } from "rxjs";
import { selectUsername } from "../../store/selectors/user.selectors";

export const withUsername = (store: Store) => <T>(source: Observable<T>) =>
    source.pipe(
        withLatestFrom(store.select(selectUsername)),
        filter(([_, username]) => username.length > 0),
        map(([_, username]) => username)
    );
