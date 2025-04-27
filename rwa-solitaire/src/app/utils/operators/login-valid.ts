import { Store } from "@ngrx/store";
import { filter, map, Observable, withLatestFrom } from "rxjs";
import { selectUserLoginValid } from "../../store/selectors/user.selectors";

export const loginValid = (store: Store) => <T>(source: Observable<T>) =>
    source.pipe(
        withLatestFrom(store.select(selectUserLoginValid)),
        filter(([_, loginValid]) => loginValid),
        map(([action]) => action),
    );
