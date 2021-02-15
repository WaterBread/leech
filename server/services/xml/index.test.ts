import Parser from './';
import fault from './test_data/fault';
import resultGenerator from './test_data/generator';

describe('xmlrpc parser', () => {
  it('should successfully parse a single result', () => {
    const response = new Parser().parse(resultGenerator(1));
    expect(response).toBeTruthy();

    expect(response.isFault).toBeFalsy();
    expect(response.response).toMatchInlineSnapshot(`
      Array [
        Array [
          Array [
            Array [
              Array [
                "this is the name of the file 0",
                "12345",
                "",
                1,
                2,
                1603179559,
                "/filepath/with/slashes",
                "/filepath/with/slashes",
                "folderName",
                "/filepath/with/slashes",
                99602671,
                99602671,
                0,
                0,
                0,
                0,
                1556556544,
                1,
                0,
              ],
            ],
          ],
        ],
      ]
    `);
  });

  it('should successfully parse a large amount of results', () => {
    const response = new Parser().parse(resultGenerator(100));
    expect(response).toBeTruthy();

    expect(response.isFault).toBeFalsy();
    expect(response.response).toMatchSnapshot();
  });

  it('should successfully parse a fault response', () => {
    const response = new Parser().parse(fault);
    expect(response).toBeTruthy();

    expect(response.isFault).toBeTruthy();
    expect(response.response).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "name": "faultCode",
            "value": -503,
          },
          Object {
            "name": "faultString",
            "value": "Target of wrong type to command.",
          },
        ],
      ]
    `);
  });
});
