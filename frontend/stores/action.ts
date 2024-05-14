export const RESET_STATE = 'RESET_STATE';

export interface ResetStateAction {
  type: typeof RESET_STATE;
}

export const resetState = (): ResetStateAction => ({
  type: RESET_STATE,
});
