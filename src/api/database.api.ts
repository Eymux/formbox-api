import * as express from 'express';
import { Router } from 'express-serve-static-core';
import { Logger } from 'ts-log-debug';

export function DatabaseRouter(log: Logger): Router {
  log.debug('Initialisiere Database API.');
  const api = express.Router();

  api.get('/', (req, res) => {
    res.json({ message: 'FormBox Databse API' });
  });

  return api;
}
