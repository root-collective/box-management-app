import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { TransferComponent } from './box-management/transfer/transfer.component';
import { InventoryComponent } from './box-management/inventory/inventory.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    CommonModule,
    MatTabsModule,
    TransferComponent,
    InventoryComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'box-management-app';
}
