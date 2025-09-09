import { AsyncValidator } from "@angular/forms";
import { UserService } from "../../../services/api/user/user.service";
import { Injectable } from "@angular/core";
import { createAsyncAvailabilityValidator } from "./async-factory";
import { ASYNC_EMAIL_RULE } from "./async-rules";


@Injectable({providedIn: 'root'})
export class EmailAsyncValidator implements AsyncValidator {
    constructor(private readonly userService: UserService) {}

    validate = createAsyncAvailabilityValidator(
        (value) => this.userService.checkEmailAvailable(value),
        ASYNC_EMAIL_RULE.errorKey
    );
}