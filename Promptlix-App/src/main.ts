import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { HomePage } from './app/home/home.page';
import { addIcons } from 'ionicons';
import { paperPlaneOutline, shareOutline, heartOutline, copyOutline, ellipsisHorizontalOutline, chevronDownOutline, menuOutline } from 'ionicons/icons';

if ((<any>window).location && window.location.hostname !== 'localhost') {
// Keep default behavior; remove this line if you want prod detection different
}

addIcons({
  'paper-plane-outline': paperPlaneOutline,
  'share-outline': shareOutline,
  'heart-outline': heartOutline,
  'copy-outline': copyOutline,
  'ellipsis-horizontal-outline': ellipsisHorizontalOutline,
  'chevron-down-outline': chevronDownOutline,
  'menu-outline' : menuOutline
});

bootstrapApplication(HomePage, {
providers: [
provideIonicAngular(),
provideHttpClient(),
provideRouter([]),
],
}).catch(err => console.error(err));