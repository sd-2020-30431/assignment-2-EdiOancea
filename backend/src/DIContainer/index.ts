import { Sequelize } from 'sequelize';
import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';
import * as cors from 'cors';
const Bottle = require('bottlejs');

import App from '../app';
import connection from '../connection';
import UserModelFactory from '../models/User';
import GroceryListItemModelFactory from '../models/GroceryListItem';

import AuthController from '../controllers/Auth';
import UserController from '../controllers/User';
import GroceryListItemController from '../controllers/GroceryListItem';
import TokenService from '../services/Token';
import AuthService from '../services/Auth';
import UserService from '../services/User';
import GroceryListItemService from '../services/GroceryListItem';
import EncryptionService from '../services/Encryption';
import wrapError from '../services/WrapError';
import HttpError from '../services/HttpError';

import ErrorMiddleware from '../middlewares/Error';

const bottle = new Bottle();
const env = (process.env.NODE_ENV || 'development').toUpperCase();

bottle.factory('bcrypt', () => bcrypt);
bottle.factory('express', () => express);
bottle.factory('wrapError', () => wrapError);
bottle.factory('Sequelize', () => Sequelize);
bottle.factory('ExpressRouter', ({ express }) => express.Router());
bottle.factory('jwt', () => jwt);
bottle.factory('sequelize', () => new Sequelize(
  process.env[`DB_NAME_${env}`],
  process.env[`DB_USER_${env}`],
  process.env[`DB_PASSWORD_${env}`],
  {
    host: process.env[`DB_HOST_${env}`],
    dialect: 'postgres',
  }
));
bottle.factory('GroceryListItemModel', ({ sequelize }) => GroceryListItemModelFactory(sequelize));
bottle.factory('UserModel', ({
  sequelize,
  EncryptionService,
}) => UserModelFactory(sequelize, EncryptionService));
bottle.factory('database', ({
  UserModel,
  GroceryListItemModel,
  Sequelizel,
  sequelize,
}) => connection(
  {
    User: UserModel,
    GroceryListItem: GroceryListItemModel,
  },
  Sequelize,
  sequelize,
));

bottle.factory('UserHttpError', () => new HttpError(403, 'Not yet pal'));
bottle.service('TokenService', TokenService, 'jwt')
bottle.service('EncryptionService', EncryptionService, 'bcrypt');
bottle.service('AuthService', AuthService, 'database', 'EncryptionService', 'TokenService');
bottle.service('UserService', UserService, 'database', 'UserHttpError');
bottle.service('GroceryListItemService', GroceryListItemService, 'database');
bottle.service('AuthController', AuthController, 'AuthService', 'ExpressRouter', 'wrapError');
bottle.service(
  'GroceryListItemController',
  GroceryListItemController,
  'GroceryListItemService',
  'ExpressRouter',
  'wrapError'
)
bottle.service(
  'UserController',
  UserController,
  'UserService',
  'ExpressRouter',
  'wrapError'
);

bottle.factory('App', ({
  express,
  AuthController,
  UserController,
  GroceryListItemController,
}) => new App(
  express(),
  5000,
  [bodyParser.json(), cors()],
  [
    AuthController,
    UserController,
    GroceryListItemController,
  ],
  [ErrorMiddleware],
));

export default bottle;
