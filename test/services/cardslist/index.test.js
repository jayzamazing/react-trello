'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {app, runServer, closeServer} from '../../../src/app';
import {DATABASE_URL} from '../../../src/config';
import {createUsers,createBoards,createCardslist,createCards,createTitle} from '../utils/seeddata';
import {deleteDb} from '../utils/cleandb.js';
var should = chai.should();

chai.use(chaiHttp);
let users, titles, cardslists;

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
    return createUsers()
    .then((res) => {
      users = res;
      return createCardslist(users, boards);
    }).then((res2) => {
      cardslists = res2;
      return createCards(users, cardslists);
    }).then((res3) => {
      cards = res3
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
      .then((res) => {
        res.should.redirect;
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
        return agent.
        post('/Cardslist')
        //set headers
        .set('Accept', 'application/json')
        .send({title: 'grocery list'})
        .then((res) => {
          res.body.should.have.property('title');
          res.body.title.should.equal('grocery list');
          res.body.should.have.property('cards');
          res.body.cards.should.be.a('array');
          res.body.cards.should.eql([]);
        });
      });
  });
  it('should not get any Cardslist, not auth redirects to /', () => {
    agent = chai.request.agent(app);
    return agent
      .get('/Cardslist')
      //set headers
      .set('Accept', 'application/json')
      .then((res) => {
        res.should.redirect;
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
        return agent.
        get('/Cardslist')
        //set headers
        .set('Accept', 'application/json')
        .then((res) => {
          res.body.cardslist.should.have.lengthOf(1);
          res.body.cardslist[0].should.have.property('title');
          res.body.cardslist[0].title.should.equal(titles[0].title);
          res.body.cardslist[0].should.have.property('cards');
          res.body.cardslist[0].cards.should.be.a('array');
          res.body.cardslist[0].cards.should.eql([]);
        });
      });
  });
  it('should update a users Cardslist', () => {
    let newTitle = createTitle();
    agent = chai.request.agent(app);
    return agent
      //request to /Cardslist
      .post('/auth/login')
      //send the following data
      .auth(users[2].email, users[2].unhashed)
      //set headers
      .set('Accept', 'application/json')
      .then(() => {
        return agent.
        put(`/Cardslist/${cardslists[2]._id}`)
        .send(newTitle)
        .then((res) => {
          res.should.have.status(204);
          return Cardslist.findById(cardslists[2]._id).exec();
        })
        .then((cardslist) => {
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
        return agent.
        delete(`/Cardslist/${cardslists[3]._id}`)
        .then((res) => {
          res.should.have.status(204);
          return Cardslist.findById(cardslists[3]._id).exec();
        })
        .then((cardslist) => {
          should.not.exist(cardslist);
        });
      });
  });
});
