'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../../bin/www');
const {DATABASE_URL} = require('../../config/config');
const {Cardslist} = require('../../models/cardslist');
const {createUsers, createBoards, createCardslist, createCards, createTitle} = require('../utils/seeddata');
const {deleteDb} = require('../utils/cleandb.js');
const should = chai.should();
chai.use(chaiHttp);
let boards, cards, cardslists, users;
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
  it('should not create a Cardslist, not auth redirects to /', () => {
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
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/`);
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
      .then(() => {
        return agent
        .post('/Cardslist')
        //set headers
        .set('Accept', 'application/json')
        .send({title: 'grocery list'})
        .then(res => {
          res.body.should.have.property('title');
          res.body.should.have.property('_id');
          res.body.title.should.equal('grocery list');
          res.body.should.have.property('cards');
          should.equal(res.body.cards, null);
        });
      });
  });
  it('should not get any Cardslist, not auth redirects to /', () => {
    agent = chai.request.agent(app);

return agent
      .get('/Cardslist')
      //set headers
      .set('Accept', 'application/json')
      .then(res => {
        /* eslint-disable */
        res.should.redirect;
        /* eslint-enable */
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/`);
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
      .then(() => {
        return agent
        .get('/Cardslist')
        //set headers
        .set('Accept', 'application/json')
        .then(res => {
          /* eslint-disable */
          res.body.cardslist.should.have.lengthOf(1);
          /* eslint-enable */
          res.body.cardslist[0].should.have.property('title');
          res.body.cardslist[0].should.have.property('_id');
          res.body.cardslist[0].title.should.equal(cardslists[0].title);
          res.body.cardslist[0]._id.should.equal(`${cardslists[0]._id}`);
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
      .then(() => {
        return agent
        .put(`/Cardslist/${cardslists[2]._id}`)
        .send(newTitle)
        .then(res => {
          res.should.have.status(204);

return Cardslist.findById(cardslists[2]._id).exec();
        })
        .then(cardslist => {
          cardslist._id.should.deep.equal(cardslists[2]._id);
          cardslist.title.should.equal(newTitle.title);
          cardslist.createdAt.should.deep.equal(cardslists[2].createdAt);
          cardslist.updatedAt.should.be.greaterThan(cardslists[2].updatedAt);
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
      .then(() => {
        return agent
        .delete(`/Cardslist/${cardslists[3]._id}`)
        .then(res => {
          res.should.have.status(204);

return Cardslist.findById(cardslists[3]._id).exec();
        })
        .then(cardslist => {
          should.not.exist(cardslist);
        });
      });
  });
});
