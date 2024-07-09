import { Component, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { finalize } from "rxjs/operators";
import { AppComponentBase } from "@shared/app-component-base";
import {
  AccountServiceProxy,
  RegisterInput,
  RegisterOutput,
} from "@shared/service-proxies/service-proxies";
import { accountModuleAnimation } from "@shared/animations/routerTransition";
import { AppAuthService } from "@shared/auth/app-auth.service";

@Component({
  templateUrl: "./register.component.html",
  animations: [accountModuleAnimation()],
})
export class RegisterComponent extends AppComponentBase {
  model: RegisterInput = new RegisterInput();
  saving = false;

  constructor(
    injector: Injector,
    private _accountService: AccountServiceProxy,
    private _router: Router,
    private authService: AppAuthService
  ) {
    super(injector);
  }

  save(): void {
    // debugger;
    this.saving = true;
    this._accountService
      .register(this.model)
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe(
        (result) => {
          // Autheticate
          this.saving = true;
          this.authService.authenticateModel.userNameOrEmailAddress =
            this.model.userName;
          this.authService.authenticateModel.password = this.model.password;
        },
        (error) => {
          // this.notify.error(this.l("Failed to register"));
          console.log(error);
        },
        () => {
          this._router.navigate(["./account/login"]);
          this.notify.success(this.l("SuccessfullyRegistered"));
        }
      );
  }
}
