import { INewEventDialogData } from './new-event-dialog.model';

export interface IBlockerDialogData extends INewEventDialogData {
  blockerId?: string;
}
