import { range } from 'lodash';

export default (numberOfResults: number) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <methodResponse>
  <params>
  <param><value><array><data>
  <value><array><data>
  <value><array><data>
  <value>${range(0, numberOfResults).reduce((prev, num) => {
    return prev + `<array><data>
    <value><string>this is the name of the file ${num}</string></value>
    <value><string>12345</string></value>
    <value><string></string></value>
    <value><i8>1</i8></value>
    <value><i8>2</i8></value>
    <value><i8>1603179559</i8></value>
    <value><string>/filepath/with/slashes</string></value>
    <value><string>/filepath/with/slashes</string></value>
    <value><string>folderName</string></value>
    <value><string>/filepath/with/slashes</string></value>
    <value><i8>99602671</i8></value>
    <value><i8>99602671</i8></value>
    <value><i8>0</i8></value>
    <value><i8>0</i8></value>
    <value><i8>0</i8></value>
    <value><i8>0</i8></value>
    <value><i8>1556556544</i8></value>
    <value><i8>1</i8></value>
    <value><i8>0</i8></value>
    </data></array>`;
  }, '')}</value></data></array></value></data></array></value></data>
  </array></value></param></params></methodResponse>`;
};
