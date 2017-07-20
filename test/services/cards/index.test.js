'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import mongoose from 'mongoose';
import {app, runServer, closeServer} from '../../../src/app';
import {DATABASE_URL} from '../../../src/config';
import {Card} from '../../../src/models/cards';
import {User} from '../../../src/models/users';
var should = chai.should();

chai.use(chaiHttp);
let users, text, ids, cards;
//used to delete the database
function deleteDb() {
  return mongoose.connection.db.dropDatabase();
}
//Create a user, hash password, and keep track of original password
function createUser() {
  let password = faker.internet.password();
  return User.hashPassword(password)
  .then((hash) => {
    return {
      email: faker.internet.email(),
      password: hash,
      unhashed: password
    };
  });
}
//create multiple users
function createUsers() {
  const seedData = [];
  for (let i = 0; i <= 9; i++) {
    seedData.push(createUser());
  }
  //wait for all the hashpassword promises to finish before performing insert many
  return Promise.all(seedData)
  .then((seed) => {
    users = seed;
    return User.insertMany(seed);
  });
}
function createText() {
  return {
    text: faker.random.words()
  };
}
function createCard() {
  const seedData = [];
  //create and store random text
  for (let i = 0; i <= 9; i++) {
    seedData.push(createText());
    seedData[i].owner = ids[i]._id;
  }
  return Promise.all(seedData)
  .then((seed) => {
    text = seed;
    return Card.insertMany(seed);
  })
  .then((res2) => {
    cards = res2;
  });
}
describe('Card service', () => {
  let agent;
  //setup
  before(() => {
    return runServer(DATABASE_URL);
  });
  after(() => {
    return closeServer();
  });
  beforeEach(() => {
    return createUsers()
    .then((res) => {
      ids = res;
      return createCard();
    });
  });
  afterEach(() => {
    return deleteDb();
  });
  it('should not create a Card, not auth redirects to /', () => {
    agent = chai.request.agent(app);
    return agent
      .post('/cards')
      //set headers
      .set('Accept', 'application/json')
      .send({text: 'grocery list'})
      .then((res) => {
        res.should.redirect;
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/`);
      });
  });
  it('should create a Card', () => {
    agent = chai.request.agent(app);
    return agent
      //request to /Card
      .post('/auth/login')
      //send the following data
      .auth(users[0].email, users[0].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(() => {
        return agent.
        post('/cards')
        //set headers
        .set('Accept', 'application/json')
        .send({text: 'grocery list'})
        .then((res) => {
          res.body.should.have.property('text');
          res.body.text.should.equal('grocery list');
        });
      });
  });
  it('should not get any Card, not auth redirects to /', () => {
    agent = chai.request.agent(app);
    return agent
      .get('/cards')
      //set headers
      .set('Accept', 'application/json')
      .then((res) => {
        res.should.redirect;
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/`);
      });
  });
  it('should get a users Card', () => {
    agent = chai.request.agent(app);
    return agent
      //request to /Card
      .post('/auth/login')
      //send the following data
      .auth(users[0].email, users[0].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(() => {
        return agent.
        get('/cards')
        //set headers
        .set('Accept', 'application/json')
        .then((res) => {
          res.body.card.should.have.lengthOf(1);
          res.body.card[0].should.have.property('text');
          res.body.card[0].text.should.equal(text[0].text);
        });
      });
  });
  it('should update a users Card', () => {
    let newTitle = createText();
    agent = chai.request.agent(app);
    return agent
      //request to /Card
      .post('/auth/login')
      //send the following data
      .auth(users[2].email, users[2].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(() => {
        return agent.
        put(`/cards/${cards[2]._id}`)
        .send(newTitle)
        .then((res) => {
          res.should.have.status(204);
          return Card.findById(cards[2]._id).exec();
        })
        .then((card) => {
          card._id.should.deep.equal(cards[2]._id);
          card.text.should.equal(newTitle.text);
          card.createdAt.should.deep.equal(cards[2].createdAt);
          card.updatedAt.should.be.greaterThan(cards[2].updatedAt);
        });
      });
  });
  it('should delete a users Card', () => {
    agent = chai.request.agent(app);
    return agent
      //request to /Card
      .post('/auth/login')
      //send the following data
      .auth(users[3].email, users[3].unhashed)
      .then(() => {
        return agent.
        delete(`/cards/${cards[3]._id}`)
        .then((res) => {
          res.should.have.status(204);
          return Card.findById(cards[3]._id).exec();
        })
        .then((cards) => {
          should.not.exist(cards);
        });
      });
  });
});
