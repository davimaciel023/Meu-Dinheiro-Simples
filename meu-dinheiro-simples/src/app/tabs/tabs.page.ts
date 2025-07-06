import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  pieChartOutline,
  swapHorizontalOutline,
  addCircleOutline,
  walletOutline,
  settingsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [IonicModule, RouterModule],
  templateUrl: './tabs.page.html'
})
export class TabsPage {
  constructor() {
    addIcons({
      pieChartOutline,
      swapHorizontalOutline,
      addCircleOutline,
      walletOutline,
      settingsOutline
    });
  }
}
