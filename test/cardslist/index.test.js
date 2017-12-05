'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../../bin/www');
const {DATABASE_URL} = require('../../config/serverConfig');
const {Cardslist} = require('../../models/cardslist');
const {createUsers, createBoards, createCardslist, createCards, createTitle} = require('../utils/seeddata');
const {deleteDb} = require('../utils/cleandb.js');
const should = chai.should();
chai.use(chaiHttp);
let boards, cards, cardslist, users;
describe('Cardslist service', () => {
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
    .then(res2 => {
      boards = res2;
      return boards;
    })
    .then(res => createCardslist(users, res))
    .then(res3 => {
      cardslist = res3;
      return cardslist;
    })
    .then(res => createCards(users, res))
    .then(res4 => {
      cards = res4;
    });
  });
  afterEach(() => {
    return deleteDb();
  });
  it('should not create a Cardslist, not auth redirects to /login', () => {
    agent = chai.request.agent(app);

return agent
      .post('/cardslist')
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
  it('should create a Cardslist', () => {
    agent = chai.request.agent(app);

return agent
      //request to /Cardslist
      .post('/auth/login')
      //send the following data
      .auth(users[0].email, users[0].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(res => {
        const token = res.body.authToken;
        return agent
        .post('/Cardslist')
        //set headers
        .set('authorization', `Bearer ${token}`)
        .send({title: 'grocery list', boardId: boards[0]._id})
        .then(res => {
          res.body.should.have.property('title');
          res.body.should.have.property('_id');
          res.body.title.should.equal('grocery list');
          res.body.should.have.property('cards');
          should.equal(res.body.cards, null);
        });
      });
  });
  it('should not get any Cardslist, not auth redirects to /login', () => {
    agent = chai.request.agent(app);

return agent
      .get('/Cardslist')
      //set headers
      .set('Accept', 'application/json')
      .then(res => {
        /* eslint-disable */
        res.should.redirect;
        /* eslint-enable */
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/login`);
      });
  });
  it('should get a users Cardslist', () => {
    agent = chai.request.agent(app);

return agent
      //request to /Cardslist
      .post('/auth/login')
      //send the following data
      .auth(users[0].email, users[0].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(res => {
        const token = res.body.authToken;
        return agent
        .get('/Cardslist')
        //set headers
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          /* eslint-disable */
          res.body.cardslist.should.have.lengthOf(1);
          /* eslint-enable */
          res.body.cardslist[0].should.have.property('title');
          res.body.cardslist[0].should.have.property('_id');
          res.body.cardslist[0].title.should.equal(cardslist[0].title);
          res.body.cardslist[0]._id.should.equal(`${cardslist[0]._id}`);
          res.body.cardslist[0].should.have.property('cards');
          res.body.cardslist[0].cards.should.be.a('array');
          res.body.cardslist[0].cards[0].should.have.property('text');
          res.body.cardslist[0].cards[0].text.should.equal(cards[0].text);
        });
      });
  });
  it('should update a users Cardslist', () => {
    const newTitle = createTitle();
    agent = chai.request.agent(app);

return agent
      //request to /Cardslist
      .post('/auth/login')
      //send the following data
      .auth(users[2].email, users[2].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(res => {
        const token = res.body.authToken;
        return agent
        .put(`/Cardslist/${cardslist[2]._id}`)
        .send(newTitle)
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          res.should.have.status(201);
          res.body._id.should.equal(`${cardslist[2]._id}`);
          res.body.title.should.equal(newTitle.title);

return Cardslist.findById(cardslist[2]._id).exec();
        })
        .then(cdls => {
          cdls._id.should.deep.equal(cardslist[2]._id);
          cdls.title.should.equal(newTitle.title);
          cdls.createdAt.should.deep.equal(cardslist[2].createdAt);
          cdls.updatedAt.should.be.greaterThan(cardslist[2].updatedAt);
        });
      });
  });
  it('should delete a users Cardslist', () => {
    agent = chai.request.agent(app);

return agent
      //request to /Cardslist
      .post('/auth/login')
      //send the following data
      .auth(users[3].email, users[3].unhashed)
      .then(res => {
        const token = res.body.authToken;
        return agent
        .delete(`/Cardslist/${cardslist[3]._id}`)
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          res.should.have.status(204);

return Cardslist.findById(cardslist[3]._id).exec();
        })
        .then(cardslist => {
          should.not.exist(cardslist);
        });
      });
  });
});
