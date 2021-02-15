export interface Attribute {
  xmlName: string | Buffer
  apiName?: string
  formatResponse? : <T>(responseItem: any) => T
}

export default Attribute;
