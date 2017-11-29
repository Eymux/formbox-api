import { Logger } from 'ts-log-debug';
import { Injectable, Inject } from 'injection-js';
import * as express from 'express';
import * as https from 'https';
import * as socket from 'socket.io';
import * as fs from 'fs';


export class SocketServer {
  log: Logger;
  app: express.Express;

  constructor(@Inject('Logger') log: Logger, @Inject( 'Application' ) app: express.Express ) {
    this.app = app;
    this.log = log;
  }

  start() {
    const privateKey = fs.readFileSync('cert/server.key', 'utf8');
    const certificate = fs.readFileSync('cert/server.crt', 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    
    const server = https.createServer(credentials, this.app);
    const io = socket(server);
    
    io.on('connection', (client) => {
        this.log.info('Client connected.');        
    });

    server.listen(this.app.get('port'), () => {
      this.log.info(('App is running at https://localhost:%d.'), this.app.get('port'));
    });
  }
}