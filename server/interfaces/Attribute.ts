export interface Attribute {
  xmlName: string | Buffer
  apiName?: string
  formatResponse? : (responseItem: any) => any
}

export default Attribute;
