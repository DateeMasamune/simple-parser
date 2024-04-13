export interface IInput {
  [EInputKeys.query]: string;
  [EInputKeys.emerge]: string;
  [EInputKeys.keyWords]: string;
  [EInputKeys.sourceRef]: string;
  [EInputKeys.selectorName]: string;
}

export enum EInputKeys {
  query = "query",
  emerge= 'emerge',
  keyWords = "keyWords",
  sourceRef = "sourceRef",
  selectorName = "selectorName",
}
