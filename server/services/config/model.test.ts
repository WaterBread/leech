import { generateDefaults } from './model';

describe('model', () => {
  describe('generateDefaults', () => {
    it('should result an object of defaults', () => {
      const defaults = generateDefaults();
      expect(defaults).toMatchInlineSnapshot(`
        Object {
          "ui": Object {
            "theme": Object {
              "color": Object {
                "primary": "#ffffff",
                "secondary": "#ffffff",
                "tertiary": "#ffffff",
              },
            },
          },
        }
      `);
    });
  });
});
