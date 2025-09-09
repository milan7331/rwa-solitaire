import { Store } from "@ngrx/store";
import { filter, map, Observable, withLatestFrom } from "rxjs";
import { selectLoginValid } from "../../store/selectors/user.selectors";

export const loginValid = (store: Store) => <T>(source: Observable<T>) =>
    source.pipe(
        withLatestFrom(store.select(selectLoginValid)),
        filter(([_, loginValid]) => loginValid),
        map(([action]) => action),
    );
