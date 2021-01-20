import { Application } from 'express';

import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import './utils/module-alias';

import cors from 'cors';

import { UserController } from '@src/controllers/UserController';
import { BandController } from '@src/controllers/BandControler';
import { UserMusicsController } from '@src/controllers/UserMusicsController';

import * as database from './database';
import { GenreController } from './controllers/GenreController';
import AppError from './utils/errors/appError';

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

    this.addControllers([
      userController,
      bandController,
      genreController,
      userMusicsController,
    ]);
  }

  public setupExpress(): void {
    this.app.use(bodyParser.json());

    // this.app.use(
    //   cors({
    //     origin: '*',
    //   }),
    // );
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

  public start(): void {
    this.app.listen(this.port, () => console.log('Server listening'));
  }
}
