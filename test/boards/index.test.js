'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../../bin/www');
const {DATABASE_URL} = require('../../config/serverConfig');
const {Board} = require('../../models/boards');
const {createUsers, createBoards, createCardslist, createCards, createTitle} = require('../utils/seeddata');
const {deleteDb} = require('../utils/cleandb');
const should = chai.should();
chai.use(chaiHttp);
let boards, cards, cardslist, users;
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
    /* eslint-disable */
    return createUsers(9)
    /* eslint-enable */
    .then(res => {
      users = res;
      return users;
    })
    .then(res => createBoards(res))
    .then(res => {
      boards = res;
      return boards;
    })
    .then(res => createCardslist(users, res))
    .then(res => {
      cardslist = res;
      return cardslist;
    })
    .then(res => createCards(users, res))
    .then(res => {
      cards = res;
    });
  });
  afterEach(() => {
    return deleteDb();
  });
  it('should not create a board, not auth redirects to /login', () => {
    agent = chai.request.agent(app);

return agent
      .post('/boards')
      //set headers
      .set('Accept', 'application/json')
      .send({title: 'grocery list'})
      .then(res => {
        /* eslint-disable */
        res.should.redirect;
        /* eslint-enable */
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/login`);
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
      .then(res => {
        const token = res.body.authToken;
        return agent
        .post('/boards')
        //set headers
        .set('authorization', `Bearer ${token}`)
        .send({title: 'grocery list'})
        .then(res => {
          res.body.should.have.property('_id');
          res.body.should.have.property('title');
          res.body.title.should.equal('grocery list');
          res.body.should.have.property('cardslist');
          should.equal(res.body.cardslist, null);
        });
      });
  });
  it('should not get any boards, not auth redirects to /login', () => {
    agent = chai.request.agent(app);

return agent
      .get('/boards')
      //set headers
      .set('Accept', 'application/json')
      .then(res => {
        /* eslint-disable */
        res.should.redirect;
        /* eslint-enable */
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/login`);
      });
  });
  it('should get a users boards', () => {
    agent = chai.request.agent(app);

return agent
      //request to /boards
      .post('/auth/login')
      //send the following data
      .auth(users[0].email, users[0].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(res => {
        const token = res.body.authToken;
        return agent
        .get('/boards')
        //set headers
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          /* eslint-disable */
          res.body.should.have.lengthOf(1);
          /* eslint-enable */
          res.body[0].should.have.property('_id');
          res.body[0]._id.should.equal(`${boards[0]._id}`);
          res.body[0].should.have.property('title');
          res.body[0].title.should.equal(boards[0].title);
          res.body[0].should.have.property('cardslist');
          res.body[0].cardslist.should.be.a('array');
          res.body[0].cardslist[0].should.have.property('title');
          res.body[0].cardslist[0].title.should.equal(cardslist[0].title);
          res.body[0].cardslist[0].cards[0].should.have.property('text');
          res.body[0].cardslist[0].cards[0].text.should.equal(cards[0].text);
        });
      });
  });
  it('should update a users boards', () => {
    const newTitle = createTitle();
    agent = chai.request.agent(app);

return agent
      //request to /boards
      .post('/auth/login')
      //send the following data
      .auth(users[2].email, users[2].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(res => {
        const token = res.body.authToken;
        return agent
        .put(`/boards/${boards[2]._id}`)
        .send(newTitle)
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          res.should.have.status(201);
return Board.findById(boards[2]._id).exec();
        })
        .then(board => {
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
      .then(res => {
        const token = res.body.authToken;
        return agent
        .delete(`/boards/${boards[3]._id}`)
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          res.should.have.status(204);

return Board.findById(boards[3]._id).exec();
        })
        .then(board => {
          should.not.exist(board);
        });
      });
  });
});
