'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../../bin/www');
const {DATABASE_URL} = require('../../config/serverConfig');
const {Card} = require('../../models/cards');
const {createUsers, createCards, createText, createBoards, createCardslist} = require('../utils/seeddata');
const {deleteDb} = require('../utils/cleandb.js');
const should = chai.should();
chai.use(chaiHttp);
let boards, cards, cardslist, users;
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
  it('should not create a Card, not auth redirects to /login', () => {
    agent = chai.request.agent(app);

return agent
      .post('/cards')
      //set headers
      .set('Accept', 'application/json')
      .send({text: 'grocery list'})
      .then(res => {
        /* eslint-disable */
        res.should.redirect;
        /* eslint-enable */
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/login`);
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
      .then(res => {
        const token = res.body.authToken;
        return agent
        .post('/cards')
        //set headers
        .set('authorization', `Bearer ${token}`)
        .send({title: 'grocery list', cardslistId: cardslist[0]._id})
        .then(res => {
          res.body.should.have.property('_id');
          res.body.should.have.property('title');
          res.body.title.should.equal('grocery list');
        });
      });
  });
  it('should not get any Card, not auth redirects to /login', () => {
    agent = chai.request.agent(app);

return agent
      .get('/cards')
      //set headers
      .set('Accept', 'application/json')
      .then(res => {
        /* eslint-disable */
        res.should.redirect;
        /* eslint-enable */
        res.should.redirectTo(`${res.request.protocol}//${res.request.host}/login`);
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
      .then(res => {
        const token = res.body.authToken;
        return agent
        .get('/cards')
        //set headers
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          /* eslint-disable */
          res.body.card.should.have.lengthOf(1);
          /* eslint-enable */
          res.body.card[0].should.have.property('_id');
          res.body.card[0].should.have.property('text');
          res.body.card[0].text.should.equal(cards[0].text);
          res.body.card[0]._id.should.equal(`${cards[0]._id}`);
        });
      });
  });
  it('should update a users Card', () => {
    const newTitle = createText();
    agent = chai.request.agent(app);

return agent
      //request to /Card
      .post('/auth/login')
      //send the following data
      .auth(users[2].email, users[2].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(res => {
        const token = res.body.authToken;
        return agent
        .put(`/cards/${cards[2]._id}`)
        .send(newTitle)
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          res.should.have.status(201);
          res.body._id.should.equal(`${cards[2]._id}`);
          res.body.text.should.equal(newTitle.text);
return Card.findById(cards[2]._id).exec();
        })
        .then(card => {
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
      .then(res => {
        const token = res.body.authToken;
        return agent
        .delete(`/cards/${cards[3]._id}`)
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          res.should.have.status(204);

return Card.findById(cards[3]._id).exec();
        })
        .then(cards => {
          should.not.exist(cards);
        });
      });
  });
});
