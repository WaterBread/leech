import parser from './parser';

const fileListResponse = [
  [['A01. Rock or Bust.mp3']],
  [['A02. Play Ball.mp3']],
  [['A03. Rock The Blues Away.mp3']],
  [['A04. Miss Adventure.mp3']],
  [['A05. Dogs of War.mp3']],
  [['A06. Got Some Rock & Roll Thunder.mp3']],
  [['Artwork', 'Booklet 1.jpg']],
  [['Artwork', 'Booklet 10.jpg']],
  [['Artwork', 'Booklet 11.jpg']],
  [['Artwork', 'Booklet 12.jpg']],
  [['Artwork', 'Booklet 2.jpg']],
  [['Artwork', 'Booklet 3.jpg']],
  [['Artwork', 'Booklet 4.jpg']],
  [['Artwork', 'Booklet 5.jpg']],
  [['Artwork', 'Booklet 6.jpg']],
  [['Artwork', 'Booklet 7.jpg']],
  [['Artwork', 'Booklet 8.jpg']],
  [['Artwork', 'Booklet 9.jpg']],
  [['Artwork', 'Gatefold Inside.jpg']],
  [['Artwork', 'Gatefold Outside.jpg']],
  [['Artwork', 'Inside Back.jpg']],
  [['Artwork', 'Inside Front.jpg']],
  [['B07. Hard Times.mp3']],
  [['B08. Baptism By Fire.mp3']],
  [['B09. Rock The House.mp3']],
  [['B10. Sweet Candy.mp3']],
  [['B11. Emission Control.mp3']],
  [['Cover.jpg']],
  [['Rock or Bust.cue']]
];

const mockItems = () => {
  const arr = [];
  for (let x = 0; x < 10; x++) {
    arr.push([`testName-${x}`, 'testdesc', x]);
  }
  return arr;
};

describe('Parser', () => {
  test('it should successfully parse a simple command', () => {
    const mockResp = 0;
    const params = [
      { param: { apiName: 'tryStop', xmlName: '' }, expectResponse: true }
    ];
    const parsed = parser(mockResp, params);
    expect(parsed).toMatchInlineSnapshot(`
      Object {
        "tryStop": 0,
      }
    `);
  });

  test('it should successfully parse a sample system multicall', () => {
    const mockResp = [[[...mockItems()]]];

    const params = [
      { param: { apiName: 'name', xmlName: '' }, expectResponse: true },
      { param: { apiName: 'desc', xmlName: '' }, expectResponse: true },
      { param: { apiName: 'number', xmlName: '' }, expectResponse: true }
    ];

    const response = parser(mockResp[0][0], params);

    expect(response).toMatchInlineSnapshot(`
      Array [
        Object {
          "desc": "testdesc",
          "name": "testName-0",
          "number": 0,
        },
        Object {
          "desc": "testdesc",
          "name": "testName-1",
          "number": 1,
        },
        Object {
          "desc": "testdesc",
          "name": "testName-2",
          "number": 2,
        },
        Object {
          "desc": "testdesc",
          "name": "testName-3",
          "number": 3,
        },
        Object {
          "desc": "testdesc",
          "name": "testName-4",
          "number": 4,
        },
        Object {
          "desc": "testdesc",
          "name": "testName-5",
          "number": 5,
        },
        Object {
          "desc": "testdesc",
          "name": "testName-6",
          "number": 6,
        },
        Object {
          "desc": "testdesc",
          "name": "testName-7",
          "number": 7,
        },
        Object {
          "desc": "testdesc",
          "name": "testName-8",
          "number": 8,
        },
        Object {
          "desc": "testdesc",
          "name": "testName-9",
          "number": 9,
        },
      ]
    `);
  });

  test('it should successfully parse a filelist command response', () => {
    const params = [
      {
        param: {
          apiName: 'pathComponents',
          xmlName: 'pathComponents',
          formatResponse: (item: any) => {
            console.log(item, Array.isArray(item));
            if (Array.isArray(item)) return item.join('/');
            else return item;
          }
        },
        expectResponse: true
      }
    ];

    const response = parser(fileListResponse, params);

    expect(response).toMatchInlineSnapshot(`
      Array [
        Object {
          "pathComponents": "A01. Rock or Bust.mp3",
        },
        Object {
          "pathComponents": "A02. Play Ball.mp3",
        },
        Object {
          "pathComponents": "A03. Rock The Blues Away.mp3",
        },
        Object {
          "pathComponents": "A04. Miss Adventure.mp3",
        },
        Object {
          "pathComponents": "A05. Dogs of War.mp3",
        },
        Object {
          "pathComponents": "A06. Got Some Rock & Roll Thunder.mp3",
        },
        Object {
          "pathComponents": "Artwork/Booklet 1.jpg",
        },
        Object {
          "pathComponents": "Artwork/Booklet 10.jpg",
        },
        Object {
          "pathComponents": "Artwork/Booklet 11.jpg",
        },
        Object {
          "pathComponents": "Artwork/Booklet 12.jpg",
        },
        Object {
          "pathComponents": "Artwork/Booklet 2.jpg",
        },
        Object {
          "pathComponents": "Artwork/Booklet 3.jpg",
        },
        Object {
          "pathComponents": "Artwork/Booklet 4.jpg",
        },
        Object {
          "pathComponents": "Artwork/Booklet 5.jpg",
        },
        Object {
          "pathComponents": "Artwork/Booklet 6.jpg",
        },
        Object {
          "pathComponents": "Artwork/Booklet 7.jpg",
        },
        Object {
          "pathComponents": "Artwork/Booklet 8.jpg",
        },
        Object {
          "pathComponents": "Artwork/Booklet 9.jpg",
        },
        Object {
          "pathComponents": "Artwork/Gatefold Inside.jpg",
        },
        Object {
          "pathComponents": "Artwork/Gatefold Outside.jpg",
        },
        Object {
          "pathComponents": "Artwork/Inside Back.jpg",
        },
        Object {
          "pathComponents": "Artwork/Inside Front.jpg",
        },
        Object {
          "pathComponents": "B07. Hard Times.mp3",
        },
        Object {
          "pathComponents": "B08. Baptism By Fire.mp3",
        },
        Object {
          "pathComponents": "B09. Rock The House.mp3",
        },
        Object {
          "pathComponents": "B10. Sweet Candy.mp3",
        },
        Object {
          "pathComponents": "B11. Emission Control.mp3",
        },
        Object {
          "pathComponents": "Cover.jpg",
        },
        Object {
          "pathComponents": "Rock or Bust.cue",
        },
      ]
    `);
  });
});
