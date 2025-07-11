import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { inject } from '@angular/core';
import { ConfirmService } from '../_services/confirm.service';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> =
  (component, currentRoute, currentState, nextState) => {
    const confirmService = inject(ConfirmService);

    if (component.editForm?.dirty) {
      return confirmService.confirm(
        'Confirmation',
        'Are you sure you want to continue? Any unsaved changes will be lost.',
        'Yes',
        'No'
      ) ?? false;
    }
    return true;
  };
