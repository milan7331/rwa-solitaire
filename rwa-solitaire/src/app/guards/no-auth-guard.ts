import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { selectLoginValid } from "../store/selectors/user.selectors";
import { map, take } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
    constructor(
        private readonly store: Store,
        private readonly router: Router
    ) {}

    canActivate() {
        return this.store.select(selectLoginValid).pipe(
            take(1),
            map(isLoggedIn => {
                if (isLoggedIn) {
                    this.router.navigate(['/menu']);
                    return false;
                }
                return true;
            })
        );
    }
}