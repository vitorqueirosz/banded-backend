import express, { Application, NextFunction, Response, Request } from 'express';
import dotenv from 'dotenv';
import { Server } from '@overnightjs/core';
import { createServer } from 'http';
import path from 'path';
import { Server as SocketServer } from 'socket.io';
import bodyParser from 'body-parser';
import './utils/module-alias';

import cors from 'cors';

import { UserController } from '@src/controllers/UserController';
import { BandController } from '@src/controllers/BandControler';
import { UserMusicsController } from '@src/controllers/UserMusicsController';
import { UserMusicianController } from '@src/controllers/UserMusicianController';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { tmpFolder } from './config/upload';

import * as database from './database';
import { GenreController } from './controllers/GenreController';
import AppError from './utils/errors/appError';
import { UserAlbumsController } from './controllers/UserAlbumsController';
import { UserChatsController } from './controllers/UserChatsController';

dotenv.config();

interface SocketResponse {
  io: SocketServer<DefaultEventsMap, DefaultEventsMap>;
}
export class SetupServer extends Server {
  constructor(private port = process.env.APP_PORT) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupControllers() {
    const userController = new UserController();
    const bandController = new BandController();
    const genreController = new GenreController();
    const userMusicsController = new UserMusicsController();
    const userMusicianController = new UserMusicianController();
    const userAlbumsController = new UserAlbumsController();
    const userChatsController = new UserChatsController();

    this.addControllers([
      userController,
      bandController,
      genreController,
      userMusicsController,
      userMusicianController,
      userAlbumsController,
      userChatsController,
    ]);
  }

  public setupExpress(): void {
    this.app.use(bodyParser.json());

    this.app.use(
      cors({
        origin: '*',
      }),
    );

    this.app.use('/uploads', express.static(path.join(tmpFolder)));

    this.app.use(
      (err: Error, request: Request, response: Response, _: NextFunction) => {
        if (err instanceof AppError) {
          return response
            .status(err.code)
            .json({ status: 'error', message: err.message });
        }

        return response
          .status(500)
          .json({ status: 'error', message: 'Internal Server Error' });
      },
    );
  }

  public getApp(): Application {
    return this.app;
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): SocketResponse {
    const server = createServer(this.app);
    const io = new SocketServer(server);

    server.listen(this.port, () => console.log('Server listening'));

    return { io };
  }
}
