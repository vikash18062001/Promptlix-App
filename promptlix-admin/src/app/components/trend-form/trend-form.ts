import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PromptlixService, TrendDto } from '../../services/promptlix';

@Component({
  selector: 'app-trend-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="overlay">
      <form [formGroup]="form" (ngSubmit)="save()" class="modal">
        <h2>{{ trend.id ? 'Edit Trend' : 'Create Trend' }}</h2>

        <input
          type="text"
          placeholder="Prompt"
          formControlName="prompt"
        />

        <!-- ✅ Multiline Textarea for "How To" -->
        <textarea
          placeholder="How To"
          formControlName="howTo"
          rows="6"
        ></textarea>

        <input
          type="number"
          placeholder="Trend Order"
          formControlName="trendOrder"
        />

        <input type="file" (change)="handleFile($event)" />

        <div class="buttons">
          <button type="submit" [disabled]="form.invalid">Save</button>
          <button type="button" (click)="cancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      z-index: 1000;
    }

    .modal {
      border: 1px solid #fff;
      padding: 2rem;
      width: 400px;
      background: #000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      border-radius: 10px;
    }

    .modal input,
    .modal textarea {
      background: transparent;
      border: 1px solid #fff;
      color: #fff;
      padding: 0.5rem;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.9rem;
      resize: vertical;
      white-space: pre-wrap; /* ✅ important for preserving spacing */
    }

    textarea::placeholder {
      color: #aaa;
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
    }

    .buttons button {
      border: 1px solid #fff;
      background: transparent;
      color: #fff;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      transition: 0.2s;
    }

    .buttons button:hover {
      background: #fff;
      color: #000;
    }
  `]
})
export class TrendFormComponent implements OnInit {
  @Input() trend!: TrendDto;
  @Output() close = new EventEmitter<boolean>();

  file?: File;
  form: any;

  constructor(private fb: FormBuilder, private service: PromptlixService) {
    this.form = this.fb.group({
      prompt: ['', Validators.required],
      howTo: ['', Validators.required],
      trendOrder: [0, Validators.required],
    });
  }

  ngOnInit() {
    if (this.trend) {
      this.form.patchValue(this.trend);
    }
  }

  handleFile(event: any) {
    this.file = event.target.files[0];
  }

  save() {
    const data = this.form.value as TrendDto;

    // ✅ Preserve formatting exactly as typed (line breaks, spaces)
    data.howTo = data.howTo.replace(/\r\n/g, '\n');

    if (this.trend?.id) {
      this.service.update(this.trend.id, data, this.file).subscribe({
        next: () => this.close.emit(true),
        error: (err) => {
          console.error('Update failed:', err);
          this.close.emit(false);
        }
      });
    } else {
      this.service.create(data, this.file).subscribe({
        next: () => this.close.emit(true),
        error: (err) => {
          console.error('Create failed:', err);
          this.close.emit(false);
        }
      });
    }
  }

  cancel() {
    this.close.emit(false);
  }
}
