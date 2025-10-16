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
              <th>Prompt</th>
              <th>How To</th>
              <th>Order</th>
              <th>Posted On</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of trends">
              <td>{{ t.prompt }}</td>
              <td><div class="how-to-text" [innerText]="t.howTo"></div></td>
              <td>{{ t.trendOrder }}</td>
              <td>{{t.createdAt}}</td>
              <td>
                <img *ngIf="t.imageUrl" [src]="t.imageUrl" alt="trend" width="40" height="40" />
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
      <p *ngIf="trends.length === 0" class="no-data">No trends available.</p>

      <!-- Trend Form Modal -->
      <app-trend-form
        *ngIf="selectedTrend"
        [trend]="selectedTrend"
        (close)="onFormClose($event)">
      </app-trend-form>
    </div>
  `,
  styles: [`
    /* Layout */
    .dashboard {
      background: #000;
      color: #fff;
      min-height: 100vh;
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }

    /* Navbar */
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #111;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .navbar h1 {
      font-size: 1.3rem;
      margin: 0;
      color: #fff;
    }

    .navbar-buttons {
      display: flex;
      gap: 0.8rem;
    }

    .add-btn,
    .logout-btn {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: 0.2s;
    }

    .add-btn {
      background: transparent;
      border: 1px solid #fff;
      color: #fff;
    }

    .add-btn:hover {
      background: #fff;
      color: #000;
    }

    .logout-btn {
      background: #ff4d4d;
      color: #fff;
      border: none;
    }

    .logout-btn:hover {
      background: #ff1a1a;
    }

    /* Table */
    .table-container {
      background: #111;
      border-radius: 8px;
      overflow-x: auto;
    }

    .how-to-text {
      white-space: pre-wrap;
      word-wrap: break-word;
    }


    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 750px;
    }

    th, td {
      border-bottom: 1px solid #333;
      text-align: left;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
    }

    th {
      background: #111;
      color: #bbb;
      text-transform: uppercase;
      font-weight: 600;
    }

    tr:hover {
      background: #1a1a1a;
    }

    .trend-img {
      width: 50px;
      height: 50px;
      border-radius: 8px;
      object-fit: cover;
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .edit-btn, .delete-btn {
      padding: 0.3rem 0.8rem;
      font-size: 0.85rem;
      border-radius: 4px;
      cursor: pointer;
      transition: 0.2s;
      border: 1px solid transparent;
    }

    .edit-btn {
      background: transparent;
      color: #fff;
      border: 1px solid #fff;
    }

    .edit-btn:hover {
      background: #fff;
      color: #000;
    }

    .delete-btn {
      border: 1px solid #ff5050;
      color: #ff5050;
      background: transparent;
    }

    .delete-btn:hover {
      background: #ff5050;
      color: #fff;
    }

    .no-data {
      text-align: center;
      margin-top: 2rem;
      color: #aaa;
    }

    @media (max-width: 768px) {
      .navbar h1 {
        font-size: 1rem;
      }

      .navbar-buttons {
        flex-direction: column;
        align-items: flex-end;
      }

      .add-btn,
      .logout-btn {
        padding: 0.4rem 0.8rem;
        font-size: 0.8rem;
      }

      table {
        font-size: 0.85rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  trends: TrendDto[] = [];
  selectedTrend: TrendDto | null = null;

  constructor(private service: PromptlixService, private router: Router) { }

  ngOnInit() {
    if (!localStorage.getItem('admin')) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadTrends();
  }

  loadTrends() {
    this.service.getAll().subscribe({
      next: (data) => {
        // Sort newest first
        this.trends = data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
      },
      error: (err) => console.error('Error fetching trends', err),
    });
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
}
