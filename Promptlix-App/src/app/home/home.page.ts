import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, MenuController, ModalController } from '@ionic/angular';
import { TrendsService, DataItem } from '../services/trends.service';
import { FullViewComponent } from '../full-view/full-view.component';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule, FullViewComponent],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  data: DataItem[] = [];
  isTrending = true;
  page = 0;
  limit = 12;
  loading = false;
  finished = false;
  masonryInstance: any;
  @ViewChild('masonryGrid') masonryGrid!: ElementRef;

  constructor(
    private trends: TrendsService,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.loadMore();
  }

  toggleSorting() {
    this.isTrending = !this.isTrending;
    this.resetAndReload();
  }

  resetAndReload() {
    this.page = 0;
    this.data = [];
    this.finished = false;
    this.loadMore();
  }
  // items = [
  //   { image: 'https://picsum.photos/300/200' },
  //   { image: 'https://picsum.photos/300/400' },
  //   { image: 'https://picsum.photos/300/250' },
  //   { image: 'https://picsum.photos/300/350' },
  //   { image: 'https://picsum.photos/300/300' },
  // ];

  async loadMore(event?: any) {
    if (this.loading || this.finished) return;
    this.loading = true;

    this.trends.getData(this.page, this.limit).subscribe(
      (items) => {
        if (!items || items.length === 0) {
          this.finished = true;
        } else {
          const sorted = items.sort((a, b) =>
            this.isTrending
              ? (b.trendingScore || 0) - (a.trendingScore || 0)
              : new Date(b.createdOn || 0).getTime() -
              new Date(a.createdOn || 0).getTime()
          );
          this.data = [...this.data, ...sorted];
          this.page++;
        }

        this.loading = false;
        if (event) event.target.complete();
      },
      (err) => {
        console.error(err);
        this.loading = false;
        if (event) event.target.complete();
      }
    );
  }

  async openFullView(item: DataItem) {
    const modal = await this.modalCtrl.create({
      component: FullViewComponent,
      componentProps: { item },
      cssClass: 'full-view-modal',
    });
    await modal.present();
  }

  openMenu() {
    this.menuCtrl.open('main-menu');
  }

  openPrivacyPolicy() {
    window.open('https://yourdomain.com/privacy', '_blank');
  }

  async shareApp() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Promptlix',
          text: 'Check out this app!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Sharing not supported on this device.');
    }
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  }

  ngAfterViewInit() {
    const grid = this.masonryGrid.nativeElement;
    this.masonryInstance = new Masonry(grid, {
      itemSelector: '.masonry-item',
      columnWidth: '.masonry-item',
      percentPosition: true,
      gutter: 0,
    });

    imagesLoaded(grid, () => {
      this.masonryInstance.layout();
    });
  }

  home() { }

  rateApp() { }

  openHelpCenter() { }
}
