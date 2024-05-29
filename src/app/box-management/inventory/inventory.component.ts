import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DepotService } from '../../depot.service';
import { Depot } from '../../depot';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
  depotInventoryForm = this.formBuilder.group({
    depot: ['', Validators.required],
    newNumberOfBoxes: ['', [Validators.required, Validators.min(1)]],
  });
  selectedDepot: Depot | undefined = undefined;
  currentNumberOfBoxesInSelectedDepot: number = 0;
  depotSelected: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private depotService: DepotService) {}

  ngOnInit() {
    this.depotInventoryForm.controls.depot.valueChanges.subscribe((value : string | null) => {
      if (value != null) {
        this.selectedDepot = this.depotService.depotById(parseInt(value));

        this.depotSelected = this.selectedDepot !== undefined;

        if (this.selectedDepot !== undefined) {
          this.currentNumberOfBoxesInSelectedDepot = this.selectedDepot.numberOfBoxes;
        } else {
          this.currentNumberOfBoxesInSelectedDepot = 0;
        }
      }
    });
  }

  public getDepots() {
    return this.depotService.depots;
  }

  public setInventory() {
    this.depotService.setBoxes(this.selectedDepot!.id, parseInt(this.depotInventoryForm.controls.newNumberOfBoxes.value!));
  }
}
