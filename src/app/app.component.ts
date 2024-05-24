import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router';
import { TransferComponent } from './box-management/transfer/transfer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    CommonModule,
    TransferComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'box-management-app';
}
