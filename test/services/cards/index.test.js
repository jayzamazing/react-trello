'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {app, runServer, closeServer} from '../../../src/app';
import {DATABASE_URL} from '../../../src/config';
import {Card} from '../../../src/models/cards';
import {createUsers,createCards,createText,createBoards,createCardslist} from '../utils/seeddata';
import {deleteDb} from '../utils/cleandb.js';
var should = chai.should();

chai.use(chaiHttp);
let users, cards, boards, cardslists;

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
      users = res;
      return createBoards(users);
    })
    .then((res2) => {
      boards = res2;
      return createCardslist(users, boards);
    }).then((res3) => {
      cardslists = res3;
      return createCards(users, cardslists);
    }).then((res4) => {
      cards = res4;
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
          res.body.card[0].text.should.equal(cards[0].text);
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
