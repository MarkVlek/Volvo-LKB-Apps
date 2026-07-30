import { Component, Input } from '@angular/core';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-battery-status',
  templateUrl: './battery-status.component.html',
  styleUrls: ['./battery-status.component.scss']
})
export class BatteryStatusComponent {
  arrayColor = [];
  percentage: number;
  charging: boolean;
  totalPin = 5;
  color = '#3DCC93';
  pinColor = '#efefed';

  constructor() { }

  ngOnInit() {
    this.getBatteryInfo();
  }

  async renderArrayColor() {
    const info = await Device.getBatteryInfo();

    this.percentage = info.batteryLevel * 100;
		const part = 100 / this.totalPin;
		let currentLevel = 0 + part;
		for (let i = 0; i < this.totalPin; i++) {
			if (this.percentage >= currentLevel) {
				this.arrayColor.push({ full: true, color: this.color, width: '7px' });
				currentLevel += part;
			} else {
				const newWidth = ((this.percentage - currentLevel + part) * 7) / 20;
				this.arrayColor.push({ full: false, color: this.pinColor, width: newWidth + 'px' });
				for (let j = i + 1; j < this.totalPin; j++) {
					this.arrayColor.push({ full: true, color: this.pinColor, width: '7px' });
				}
				break;
			}
		}
    console.log(this.percentage)
	}

  getBatteryInfo = async () => {
    const info = await Device.getBatteryInfo();
    this.percentage = info.batteryLevel * 100;
    this.charging = info.isCharging;

    setInterval(async () => {
      const info = await Device.getBatteryInfo();

      this.percentage = info.batteryLevel * 100;
      this.charging = info.isCharging;
      console.log('Percentage: ',this.percentage)
      console.log('Batterylevel: ', info.batteryLevel)
    }, 60000);
  }
}
