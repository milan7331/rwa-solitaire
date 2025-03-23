import { Store } from "@ngrx/store";
import { filter, map, Observable, withLatestFrom } from "rxjs";
import { selectUserloginValid } from "../../store/selectors/user.selectors";

export const loginValid = (store: Store) => <T>(source: Observable<T>) =>
    source.pipe(
        withLatestFrom(store.select(selectUserloginValid)),
        filter(([_, loginValid]) => loginValid),
        map(([action]) => action),
    );
