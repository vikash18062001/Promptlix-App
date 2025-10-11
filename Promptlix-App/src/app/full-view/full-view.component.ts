import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { DataItem } from '../services/trends.service';

@Component({
  selector: 'app-full-view',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './full-view.component.html',
  styleUrls: ['./full-view.component.scss'],
})
export class FullViewComponent {
  @Input() item!: DataItem;

  constructor(private modalCtrl: ModalController, private toastCtrl: ToastController) {}

  close() {
    this.modalCtrl.dismiss();
  }

  async copyText() {
    try {
      if (navigator && (navigator as any).clipboard?.writeText) {
        await (navigator as any).clipboard.writeText(this.item.howto);
      } else {
        const ta = document.createElement('textarea');
        ta.value = this.item.howto;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      const t = await this.toastCtrl.create({ message: 'Copied to clipboard', duration: 1200 });
      await t.present();
    } catch {
      const t = await this.toastCtrl.create({ message: 'Copy failed', duration: 1200 });
      await t.present();
    }
  }

  async share() {
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({
          title: 'Promptlix',
          text: this.item.howto,
          url: this.item.imageUrl,
        });
      } else {
        await (navigator as any).clipboard.writeText(this.item.imageUrl || this.item.howto);
        const t = await this.toastCtrl.create({ message: 'Link copied (no share available)', duration: 1400 });
        await t.present();
      }
    } catch {
      const t = await this.toastCtrl.create({ message: 'Share failed', duration: 1200 });
      await t.present();
    }
  }
}
