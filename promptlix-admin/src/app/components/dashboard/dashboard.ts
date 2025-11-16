import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PromptlixService, TrendDto } from '../../services/promptlix';
import { TrendFormComponent } from '../trend-form/trend-form';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TrendFormComponent],
  template: `
    <div class="dashboard">

      <!-- Navbar -->
      <header class="navbar">
        <h1>Promptlix Admin Dashboard</h1>
        <div class="navbar-buttons">
          <button class="add-btn" (click)="addNew()">+ Add Trend</button>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </header>

      <!-- Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th (click)="sort('prompt')">Prompt</th>
              <th (click)="sort('howTo')">How To</th>
              <th (click)="sort('TrendOrder')">Order</th>
              <th (click)="sort('createdAt')">Posted On</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let t of trends">
              <td>{{ t.prompt }}</td>
              <td><div class="how-to-text" [innerText]="t.howTo"></div></td>
              <td>{{ t.trendOrder }}</td>
              <td>{{ t.createdAt }}</td>
              <td>
                <img *ngIf="t.imageUrl" [src]="t.imageUrl" width="40" height="40" />
              </td>
              <td class="action-buttons">
                <button (click)="editTrend(t)">Edit</button>
                <button class="delete" (click)="deleteTrend(t.id!)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty message -->
      <p *ngIf="trends?.length === 0" class="no-data">No trends available.</p>

      <!-- Trend Form Modal -->
      <app-trend-form
        *ngIf="selectedTrend"
        [trend]="selectedTrend"
        (close)="onFormClose($event)">
      </app-trend-form>

    </div>
  `,
  styles: [`
    .dashboard {
      background: #000;
      color: #fff;
      min-height: 100vh;
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #111;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .navbar-buttons {
      display: flex;
      gap: 0.8rem;
    }

    .add-btn, .logout-btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }

    .add-btn { background: transparent; border: 1px solid #fff; color: #fff; }
    .logout-btn { background: #ff4d4d; color: #fff; }

    .table-container {
      background: #111;
      border-radius: 8px;
      overflow-x: auto;
    }

    .how-to-text { white-space: pre-wrap; }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 750px;
    }

    th, td {
      border-bottom: 1px solid #333;
      padding: 0.75rem 1rem;
      cursor: pointer;
    }

    .pagination-controls {
      margin-top: 1rem;
      display: flex;
      justify-content: center;
      gap: 1rem;
      align-items: center;
    }

    .pagination-controls button {
      padding: 0.4rem 1rem;
      background: #222;
      border: 1px solid #555;
      color: white;
      border-radius: 5px;
      cursor: pointer;
    }

    .pagination-controls button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .no-data {
      text-align: center;
      margin-top: 1rem;
      color: #bbb;
    }
  `]
})
export class DashboardComponent implements OnInit {

  trends: TrendDto[] = [];
  selectedTrend: TrendDto | null = null;

  /** Pagination */
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;

  /** Sorting */
  sortBy = 'TrendOrder';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private service: PromptlixService, private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('admin')) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadTrends();
  }

  /** Load paginated + sorted data */
  loadTrends() {
    this.service
      .getPaginated(this.currentPage, this.pageSize, this.sortBy, this.sortOrder)
      .subscribe({
        next: (res: any) => {
          this.trends = res;       // expects { items, totalCount }
          this.totalPages = Math.ceil(res.totalCount / this.pageSize);
        },
        error: (err) => console.error('Error loading trends', err),
      });
  }

  /** Sorting logic */
  sort(column: string) {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    this.loadTrends();
  }

  addNew() {
    this.selectedTrend = {} as TrendDto;
  }

  editTrend(trend: TrendDto) {
    this.selectedTrend = { ...trend };
  }

  deleteTrend(id: string) {
    if (confirm('Are you sure you want to delete this trend?')) {
      this.service.delete(id).subscribe(() => this.loadTrends());
    }
  }

  onFormClose(refresh: boolean) {
    this.selectedTrend = null;
    if (refresh) this.loadTrends();
  }

  logout() {
    localStorage.removeItem('admin');
    this.router.navigate(['/login']);
  }

  /** Pagination */
  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.loadTrends();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadTrends();
    }
  }
}
