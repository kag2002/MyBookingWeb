import { Component, Injector, OnInit } from "@angular/core";
import { AppComponentBase } from "@shared/app-component-base";
import {
  Router,
  RouterEvent,
  NavigationEnd,
  PRIMARY_OUTLET,
} from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
import { MenuItem } from "@shared/layout/menu-item";

@Component({
  selector: "sidebar-menu",
  templateUrl: "./sidebar-menu.component.html",
})
export class SidebarMenuComponent extends AppComponentBase implements OnInit {
  menuItems: MenuItem[];
  menuItemsMap: { [key: number]: MenuItem } = {};
  activatedMenuItems: MenuItem[] = [];
  routerEvents: BehaviorSubject<RouterEvent> = new BehaviorSubject(undefined);
  homeRoute = "/app/trangchu";

  constructor(injector: Injector, private router: Router) {
    super(injector);
    this.router.events.subscribe(this.routerEvents);
  }

  ngOnInit(): void {
    this.menuItems = this.getMenuItems();
    this.patchMenuItems(this.menuItems);
    this.routerEvents
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const currentUrl = event.url !== "/" ? event.url : this.homeRoute;
        const primaryUrlSegmentGroup =
          this.router.parseUrl(currentUrl).root.children[PRIMARY_OUTLET];
        if (primaryUrlSegmentGroup) {
          this.activateMenuItems("/" + primaryUrlSegmentGroup.toString());
        }
      });
  }

  getMenuItems(): MenuItem[] {
    return [
      new MenuItem(this.l("Trang chủ"), "/app/trangchu", "fas fa-info-circle"),
      new MenuItem(
        this.l("Thống kê"),
        "/app/home",
        "fas fa-home",
        "Pages.Users"
      ),
      new MenuItem(
        this.l("Vai trò"),
        "/app/roles",
        "fas fa-theater-masks",
        "Pages.Users"
        // "Pages.Roles"
      ),
      new MenuItem(
        this.l("Người thuê"),
        "/app/tenants",
        "fas fa-building",
        "Pages.Tenants"
      ),
      new MenuItem(
        this.l("Người dùng"),
        "/app/users",
        "fas fa-users",
        "Pages.Users"
      ),
      new MenuItem(
        this.l("Thêm cơ sở"),
        "/app/TaoKhachsan",
        "fas fa-plus ",
        "Pages.Users"
      ),
      new MenuItem(
        this.l("Danh sách đặt phòng"),
        "/app/Phieudatlist",
        "fas fa-table-list ",
        "Pages.Users"
      ),
      new MenuItem(
        this.l("Hồ sơ đặt phòng"),
        "/app/Hosodat",
        "fas fa-table-list ",
        "Pages.Users"
      ),
      new MenuItem(
        this.l("Phản hồi"),
        "/app/Phanhoi",
        "fas fa-commenting ",
        "Pages.Users"
      ),
      // new MenuItem(this.l("MultiLevelMenu"), "", "fas fa-circle", "", [
      //   new MenuItem("ASP.NET Boilerplate", "", "fas fa-dot-circle", "", [
      //     new MenuItem(
      //       "Home",
      //       "https://aspnetboilerplate.com?ref=abptmpl",
      //       "far fa-circle"
      //     ),
      //     new MenuItem(
      //       "Templates",
      //       "https://aspnetboilerplate.com/Templates?ref=abptmpl",
      //       "far fa-circle"
      //     ),
      //     new MenuItem(
      //       "Samples",
      //       "https://aspnetboilerplate.com/Samples?ref=abptmpl",
      //       "far fa-circle"
      //     ),
      //     new MenuItem(
      //       "Documents",
      //       "https://aspnetboilerplate.com/Pages/Documents?ref=abptmpl",
      //       "far fa-circle"
      //     ),
      //   ]),
      //   new MenuItem("ASP.NET Zero", "", "fas fa-dot-circle", "", [
      //     new MenuItem(
      //       "Home",
      //       "https://aspnetzero.com?ref=abptmpl",
      //       "far fa-circle"
      //     ),
      //     new MenuItem(
      //       "Features",
      //       "https://aspnetzero.com/Features?ref=abptmpl",
      //       "far fa-circle"
      //     ),
      //     new MenuItem(
      //       "Pricing",
      //       "https://aspnetzero.com/Pricing?ref=abptmpl#pricing",
      //       "far fa-circle"
      //     ),
      //     new MenuItem(
      //       "Faq",
      //       "https://aspnetzero.com/Faq?ref=abptmpl",
      //       "far fa-circle"
      //     ),
      //     new MenuItem(
      //       "Documents",
      //       "https://aspnetzero.com/Documents?ref=abptmpl",
      //       "far fa-circle"
      //     ),
      //   ]),
      // ]),
    ];
  }

  patchMenuItems(items: MenuItem[], parentId?: number): void {
    items.forEach((item: MenuItem, index: number) => {
      item.id = parentId ? Number(parentId + "" + (index + 1)) : index + 1;
      if (parentId) {
        item.parentId = parentId;
      }
      if (parentId || item.children) {
        this.menuItemsMap[item.id] = item;
      }
      if (item.children) {
        this.patchMenuItems(item.children, item.id);
      }
    });
  }

  activateMenuItems(url: string): void {
    this.deactivateMenuItems(this.menuItems);
    this.activatedMenuItems = [];
    const foundedItems = this.findMenuItemsByUrl(url, this.menuItems);
    foundedItems.forEach((item) => {
      this.activateMenuItem(item);
    });
  }

  deactivateMenuItems(items: MenuItem[]): void {
    items.forEach((item: MenuItem) => {
      item.isActive = false;
      item.isCollapsed = true;
      if (item.children) {
        this.deactivateMenuItems(item.children);
      }
    });
  }

  findMenuItemsByUrl(
    url: string,
    items: MenuItem[],
    foundedItems: MenuItem[] = []
  ): MenuItem[] {
    items.forEach((item: MenuItem) => {
      if (item.route === url) {
        foundedItems.push(item);
      } else if (item.children) {
        this.findMenuItemsByUrl(url, item.children, foundedItems);
      }
    });
    return foundedItems;
  }

  activateMenuItem(item: MenuItem): void {
    item.isActive = true;
    if (item.children) {
      item.isCollapsed = false;
    }
    this.activatedMenuItems.push(item);
    if (item.parentId) {
      this.activateMenuItem(this.menuItemsMap[item.parentId]);
    }
  }

  isMenuItemVisible(item: MenuItem): boolean {
    if (!item.permissionName) {
      return true;
    }
    return this.permission.isGranted(item.permissionName);
  }
}
