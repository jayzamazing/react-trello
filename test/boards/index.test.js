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
let boards, cards, cardslists, users;
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
return createBoards(users);
    })
    .then(res2 => {
      boards = res2;

return createCardslist(users, boards);
    })
.then(res3 => {
      cardslists = res3;

return createCards(users, cardslists);
    })
.then(res4 => {
      cards = res4;
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
      // .set('Accept', 'application/json')
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
          res.body.should.have.property('cardslists');
          should.equal(res.body.cardslists, null);
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
          res.body.board.should.have.lengthOf(1);
          /* eslint-enable */
          res.body.board[0].should.have.property('_id');
          res.body.board[0]._id.should.equal(`${boards[0]._id}`);
          res.body.board[0].should.have.property('title');
          res.body.board[0].title.should.equal(boards[0].title);
          res.body.board[0].should.have.property('cardslists');
          res.body.board[0].cardslists.should.be.a('array');
          res.body.board[0].cardslists[0].should.have.property('title');
          res.body.board[0].cardslists[0].title.should.equal(cardslists[0].title);
          res.body.board[0].cardslists[0].cards[0].should.have.property('text');
          res.body.board[0].cardslists[0].cards[0].text.should.equal(cards[0].text);
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
          res.should.have.status(204);

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
