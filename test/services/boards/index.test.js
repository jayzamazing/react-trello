'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import mongoose from 'mongoose';
import {app, runServer, closeServer} from '../../../src/app';
import {DATABASE_URL} from '../../../src/config';
import {Board} from '../../../src/models/boards';
import {User} from '../../../src/models/users';
import {Card} from '../../../src/models/cards';
import {Cardslist} from '../../../src/models/cardslist';
var should = chai.should();

chai.use(chaiHttp);
let users, titles, titles2, text, cards, ids, boards, cardslists;
//used to delete the database
const deleteDb = () => {
  return mongoose.connection.db.dropDatabase();
}
//Create a user, hash password, and keep track of original password
const createUser = () => {
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
const createUsers = () => {
  let seedData = [];
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
const createTitle = () => {
  return {
    title: faker.random.words()
  };
}
const createBoards = () => {
  let seedData = [];
  //create and store random titles
  for (let i = 0; i <= 9; i++) {
    seedData.push(createTitle());
    seedData[i].owner = ids[i]._id;
  }
  return Promise.all(seedData)
  .then((seed) => {
    titles = seed;
    return Board.insertMany(seed);
  })
  .then((res2) => {
    boards = res2;
  });
}
const createCardslist = () => {
  const seedData = [];
  //create and store random titles
  for (let i = 0; i <= 9; i++) {
    seedData.push(createTitle());
    seedData[i].owner = ids[i]._id;
    seedData[i].boardId = boards[i]._id
  }
  return Promise.all(seedData)
  .then((seed) => {
    titles2 = seed;
    return Cardslist.insertMany(seed);
  })
  .then((res2) => {
    cardslists = res2;
  });
}
function createText() {
  return {
    text: faker.random.words()
  };
}
function createCards() {
  const seedData = [];
  //create and store random text
  for (let i = 0; i <= 9; i++) {
    seedData.push(createText());
    seedData[i].owner = ids[i]._id;
    seedData[i].cardslistId = cardslists[i]._id
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
describe('boards service', () => {
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
      return createBoards();
    })
    .then(() => {
      return createCardslist();
    }).then(() => {
      return createCards();
    });
  });
  afterEach(() => {
    // return deleteDb();
  });
  it('should not create a board, not auth redirects to /', () => {
    agent = chai.request.agent(app);
    return agent
      .post('/boards')
      //set headers
      .set('Accept', 'application/json')
      .send({title: 'grocery list'})
      .then((res) => {
        res.should.redirect;
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/`);
      });
  });
  it('should create a board', () => {
    agent = chai.request.agent(app);
    return agent
      //request to /boards
      .post('/auth/login')
      //send the following data
      .auth(users[0].email, users[0].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(() => {
        return agent.
        post('/boards')
        //set headers
        .set('Accept', 'application/json')
        .send({title: 'grocery list'})
        .then((res) => {
          res.body.should.have.property('title');
          res.body.title.should.equal('grocery list');
        });
      });
  });
  it('should not get any boards, not auth redirects to /', () => {
    agent = chai.request.agent(app);
    return agent
      .get('/boards')
      //set headers
      .set('Accept', 'application/json')
      .then((res) => {
        res.should.redirect;
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/`);
      });
  });
  it.only('should get a users boards', () => {
    agent = chai.request.agent(app);
    return agent
      //request to /boards
      .post('/auth/login')
      //send the following data
      .auth(users[0].email, users[0].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(() => {
        return agent.
        get('/boards')
        //set headers
        .set('Accept', 'application/json')
        .then((res) => {
          console.log(res.body.board[0]);
          res.body.board.should.have.lengthOf(1);
          res.body.board[0].should.have.property('title');
          res.body.board[0].title.should.equal(titles[0].title);
          res.body.board[0].should.have.property('cardslists');
          res.body.board[0].cardslists.should.be.a('array');
          res.body.board[0].cardslists[0].should.have.property('title');
          res.body.board[0].cardslists[0].title.should.equal(cardslists[0].title);
          // console.log(res.body.board[0].cardslist[0]);
          // console.log(res.body.board[0]);
        });
      });
  });
  it('should update a users boards', () => {
    let newTitle = createTitle();
    agent = chai.request.agent(app);
    return agent
      //request to /boards
      .post('/auth/login')
      //send the following data
      .auth(users[2].email, users[2].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(() => {
        return agent.
        put(`/boards/${boards[2]._id}`)
        .send(newTitle)
        .then((res) => {
          res.should.have.status(204);
          return Board.findById(boards[2]._id).exec();
        })
        .then((board) => {
          board._id.should.deep.equal(boards[2]._id);
          board.title.should.equal(newTitle.title);
          board.createdAt.should.deep.equal(boards[2].createdAt);
          board.updatedAt.should.be.greaterThan(boards[2].updatedAt);
        });
      });
  });
  it('should delete a users boards', () => {
    agent = chai.request.agent(app);
    return agent
      //request to /boards
      .post('/auth/login')
      //send the following data
      .auth(users[3].email, users[3].unhashed)
      .then(() => {
        return agent.
        delete(`/boards/${boards[3]._id}`)
        .then((res) => {
          res.should.have.status(204);
          return Board.findById(boards[3]._id).exec();
        })
        .then((board) => {
          should.not.exist(board);
        });
      });
  });
});
