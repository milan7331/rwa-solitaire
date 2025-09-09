import { AsyncValidator } from "@angular/forms";
import { UserService } from "../../../services/api/user/user.service";
import { Injectable } from "@angular/core";
import { createAsyncAvailabilityValidator } from "./async-factory";
import { ASYNC_USERNAME_RULE } from "./async-rules";

@Injectable({providedIn: 'root'})
export class UsernameAsyncValidator implements AsyncValidator {
    constructor(private readonly userService: UserService) {}

    validate = createAsyncAvailabilityValidator(
        (value) => this.userService.checkUsernameAvailable(value),
        ASYNC_USERNAME_RULE.errorKey
    );
}