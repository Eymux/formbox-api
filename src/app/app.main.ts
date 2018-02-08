import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Logger } from 'ts-log-debug';
import { Router } from 'express-serve-static-core';
import { Inject, Injectable } from 'injection-js';
import * as path from 'path';
import * as filesystem from 'fs';
import * as https from 'https';
import * as http from 'http';
import * as morgan from 'morgan';
import * as cors from 'cors';

@Injectable()
export class AppMain {
  private log: Logger;
  private app: express.Application;
  private db: Router;
  private document: Router;
  private status: Router;
  private configuration: Router;

  constructor( @Inject('Logger') log: Logger,
    @Inject('Application') app: express.Application,
    @Inject('DatabaseApi') db: Router,
    @Inject('ConfigurationApi') configuration: Router,
    @Inject('StatusApi') status: Router) {

    this.db = db;
    this.app = app;
    this.log = log;
    this.status = status;
    this.configuration = configuration;
    this.log.debug('AppMain init.');

    this.configServer();
    this.setApiRoutes();

    if (process.env.DISABLE_SSL) {
      this.startHTTPServer();
    } else {
      this.startServer(this.readCertificates());
    }
  }

  configServer(): void {
    this.app.set('port', process.env.PORT || 4201);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(morgan('combined'));
    this.app.use(cors({ optionsSuccessStatus: 200 }));
  }

  setApiRoutes(): void {
    this.app.use('/db', this.db);
    this.app.use('/config', this.configuration);
    this.app.use('/status', this.status);
  }

  readCertificates(): https.ServerOptions {
    const serverOptions: https.ServerOptions = {
      key: filesystem.readFileSync(process.env.CERT_KEY_PATH, 'utf8'),
      cert: filesystem.readFileSync(process.env.CERT_CRT_PATH, 'utf8')
    };

    return serverOptions;
  }

  startServer(serverOptions: https.ServerOptions): void {
    this.log.debug('Starte HTTPS Server.');

    const httpsServer = https.createServer(serverOptions, this.app);
    httpsServer.listen(this.app.get('port'), process.env.HOST, () => {
      this.log.info(('App is running at https://%s:%d.'), process.env.HOST, this.app.get('port'));
    });
  }

  startHTTPServer(): void {
    this.log.debug('Starte HTTP Server.');

    const httpServer = http.createServer(this.app);
    httpServer.listen(this.app.get('port'), process.env.HOST, () => {
      this.log.info(('App is running at http://%s:%d.'), process.env.HOST, this.app.get('port'));
    });
  }
}
