import { MessagesState } from './messages-slice';
import { IAccountSlice } from './account-slice';

export interface IReduxState {
  messages: MessagesState;
  account: IAccountSlice;
}
