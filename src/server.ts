import { Application, NextFunction, Response, Request } from 'express';
import dotenv from 'dotenv';
import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import './utils/module-alias';

import http from 'http';
import socketIo, { Socket } from 'socket.io';

import cors from 'cors';

import { UserController } from '@src/controllers/UserController';
import { BandController } from '@src/controllers/BandControler';
import { UserMusicsController } from '@src/controllers/UserMusicsController';
import { UserMusicianController } from '@src/controllers/UserMusicianController';

import * as database from './database';
import { GenreController } from './controllers/GenreController';
import AppError from './utils/errors/appError';

dotenv.config();

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

    this.addControllers([
      userController,
      bandController,
      genreController,
      userMusicsController,
      userMusicianController,
    ]);
  }

  public setupExpress(): void {
    this.app.use(bodyParser.json());

    this.app.use(
      cors({
        origin: '*',
      }),
    );

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

  private setupSocket(): void {
    const server = http.createServer(this.app);
    const io = socketIo(server);

    io.on('connection', (socket: Socket) => {
      const { id } = socket.handshake.query;
      socket.join(id);

      socket.on('send-message', ({ recipient, message }) => {
        socket.broadcast.to(recipient).emit('receive-message', {
          message,
          sender: id,
        });
      });
    });
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => console.log('Server listening'));
  }
}
