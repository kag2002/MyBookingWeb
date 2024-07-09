import { Component, ChangeDetectionStrategy } from "@angular/core";
import { AppAuthService } from "@shared/auth/app-auth.service";
import { AppSessionService } from "@shared/session/app-session.service";

@Component({
  selector: "header-user-menu",
  templateUrl: "./header-user-menu.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderUserMenuComponent {
  constructor(
    private _authService: AppAuthService,
    private _user: AppSessionService
  ) {}

  userIdLogin = this._user.userId;
  logout(): void {
    this._authService.logout();
  }
}
