import { Component } from "@angular/core";

@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.css"],
})
export class TimerComponent {
  //Đích đến timer
  targetDate: Date = new Date("2024-07-01");
  remainingTime: any;
  countdownInterval: any;

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    this.stopCountdown();
  }
  showCountdown: boolean = true;

  closeCountdown() {
    this.showCountdown = false;
  }
  startCountdown() {
    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeDifference = this.targetDate.getTime() - now;

      if (timeDifference <= 0) {
        this.stopCountdown();
        return;
      }
      this.remainingTime = {
        days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
      };
    }, 1000);
  }

  stopCountdown() {
    clearInterval(this.countdownInterval);
  }
}
