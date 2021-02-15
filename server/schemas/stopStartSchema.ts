import { body } from 'express-validator';

export default [
  body('hashes', 'Must have minimum of 1 hash').isArray({ min: 1 }),
  // body('hashes.[*]', 'Hash must have 40 characters').isString().isLength({ min: 40, max: 40 })
];
