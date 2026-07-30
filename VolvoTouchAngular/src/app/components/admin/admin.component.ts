import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
  inputValue: string = "";
  authorized: boolean = false;
  message: string;
  playerConfig: any[] = [];
  isUpdateVolvoReasons: boolean = false;
  isUpdateLKB: boolean = false;
  isUpdateFeatures: boolean = false;
  isUpdateAccessories: boolean = false;

  loading: boolean = false;

  closeTimeout: any;

  constructor(
    private router: Router,
    public adminService: AdminService,
    public dialogRef: MatDialogRef<AdminComponent>
  ) { }

  ngOnInit(): void {

    this.closeModalTimout();

    this.adminService.getPlayerConfig().subscribe({
      next: (res) => {
        for (let key in res) {
          this.playerConfig.push({ key: key, value: res[key] });

          if (this.playerConfig.find(x => x.key === 'VolvoEndlessAisle_LeveransklaraBilar' && x.value === 'true')) {
            this.isUpdateLKB = true;
          }
          if (this.playerConfig.find(x => x.key === 'VolvoEndlessAisle_ReasonToChoose' && x.value === 'true')) {
            this.isUpdateVolvoReasons = true;
          }
          if (this.playerConfig.find(x => x.key === 'VolvoEndlessAisle_Showroom' && x.value === 'true')) {
            this.isUpdateFeatures = true;
          }
          if (this.playerConfig.find(x => x.key === 'VolvoEndlessAisle_Kista' && x.value === 'true')) {
            this.isUpdateFeatures = true;
          }
          if (this.playerConfig.find(x => x.key === 'VolvoEndlessAisle_Delivery' && x.value === 'true')) {
            this.isUpdateFeatures = true;
          }
          if(this.playerConfig.find(x => x.key === 'VolvoEndlessAisle_ByggDinVolvo' && x.value === 'true')) {
            this.isUpdateFeatures = true;
          }
          if (this.playerConfig.find(x => x.key === 'VolvoEndlessAisle_ChooseAccesories' && x.value === 'true')) {
            this.isUpdateAccessories = true;
          }
        }
      }
    })
  }

  closeModalTimout() {
    this.closeTimeout = null;
    clearTimeout(this.closeTimeout);

    this.closeTimeout = setTimeout(() => {
      this.closeModal();
    }, 300000)
  }

  closeModal() {
    this.dialogRef.close(true);
  }

  onBackdropClick(e) {
    if (e.target.id == "backdrop") {
      this.message = "";
      this.inputValue = "";
      this.authorized = false;
      this.adminService.toggleAdminModal();
    }
  }

  onInputChange(e) {
    this.onPinClick(e.target.innerHTML);
  }

  onPinClick(key: number) {
    this.inputValue += key;
    if (this.inputValue == "1919") this.authorized = true;
    else if (this.inputValue.length >= 4) this.inputValue = "";
  }

  restartApplication() {
    this.message = "";
    this.inputValue = "";
    this.adminService.authorized = false;
    this.adminService.toggleAdminModal();
    this.router.navigate([""]);
  }

  updateChrome() {
    this.loading = true;
    this.message = '';
    this.adminService.updateChrome().subscribe({
      next: (res) => {
        this.handleRequest(res)
        this.loading = false;
      }
    })
  }

  updatePlugins() {
    this.loading = true;
    this.message = '';
    this.adminService.updatePlugins().subscribe({
      next: (res) => {
        this.handleRequest(res)
        this.loading = false;
      }
    })
  }

  updateVolvoReasons() {
    this.loading = true;
    this.message = '';
    this.adminService.updateVolvoReasons().subscribe({
      next: (res) => {
        this.handleRequest(res)
        this.loading = false;
      }
    })
  }

  updateAccessories() {
    this.loading = true;
    this.message = '';
    this.adminService.updateAccessories().subscribe({
      next: (res) => {
        this.handleRequest(res)
        this.loading = false;
      }
    })
  }


  updateLKB() {
    this.loading = true;
    this.message = '';
    this.adminService.updateLKB().subscribe({
      next: (res) => {
        this.handleRequest(res)
        this.loading = false;
      }
    })
  }

  updateFeatures() {
    this.loading = true;
    this.message = '';
    this.adminService.updateFeatures().subscribe({
      next: (res) => {
        this.handleRequest(res)
        this.loading = false;
      }
    })
  }

  handleRequest(res) {
    if (res.status) this.message = res.status;
    else if (res.message) this.message = res.message;
    else this.message = "Unkown error";
  }
}