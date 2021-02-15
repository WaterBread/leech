import { FaultResponse } from '../interfaces';

export class FaultError extends Error {
  constructor (error: FaultResponse) {
    console.error(error);
    super(error.faultString);
  }
}
