export type FaultResponse = [
  {
    name: 'faultCode'
    value: number
  },
  {
    name: 'faultString'
    value: string
  }
];

export interface ResponseType {
  response: FaultResponse | any
  isFault: boolean
}
