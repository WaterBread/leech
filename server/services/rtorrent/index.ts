import Deserializer from 'xmlrpc/lib/deserializer';
import net from 'net';

const NULL_CHAR = String.fromCharCode(0);

const getConnectionOptions: any = () => {
  if (process.env.SOCK_PATH) {
    return { path: process.env.SOCK_PATH };
  }
  if (process.env.SOCK_HOST) {
    return {
      host: process.env.SOCK_HOST,
      port: process.env.SOCK_PORT
    };
  }
  return {};
};

export const methodCall = async (xml: string): Promise<any> => {
  return await new Promise((resolve, reject) => {
    const connectionOptions = getConnectionOptions();

    const stream = net.connect(connectionOptions);
    const xmlLength = Buffer.byteLength(xml, 'utf8');

    stream.setEncoding('UTF8');

    const headerItems = [
      `CONTENT_LENGTH${NULL_CHAR}${xmlLength}${NULL_CHAR}`,
      `SCGI${NULL_CHAR}1${NULL_CHAR}`
    ];

    const headerLength = headerItems.reduce(
      (accumulator, headerItem) => accumulator + headerItem.length,
      0
    );

    stream.end(`${headerLength}:${headerItems.join('')},${xml}`);

    const d = new Deserializer();
    d.deserializeMethodResponse(stream, (err, data) => {
      if (err) reject(err);
      else {
        resolve(data);
      }
    });
  });
};
