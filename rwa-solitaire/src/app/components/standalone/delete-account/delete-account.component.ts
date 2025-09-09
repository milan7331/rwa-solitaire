import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { deleteAccountActions } from '../../../store/actions/user.actions';

@Component({
  selector: 'app-delete-account',
  imports: [
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {

  constructor(
    private readonly dialogRef: MatDialogRef<DeleteAccountComponent>,
    private readonly store: Store
  ) {}


  deleteAccount(): void {
    this.store.dispatch(deleteAccountActions.deleteAccount());
    this.dialogRef.close();
  }

  exit(): void {
    this.dialogRef.close();
  }

}
