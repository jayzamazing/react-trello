'use strict';
import chai from 'chai';
import chaiHttp from 'chai-http';
import {app, runServer, closeServer} from '../src/app';
chai.should();

chai.use(chaiHttp);
describe('index page test', () => {

  //setup
  before(() => {
    return runServer();
  });
  after(() => {
    return closeServer();
  });
  it('starts and shows the index page', () => {
    return chai.request(app)
      //request to /cards
      .get('/')
      //set headers
      .then((res) => {
        res.text.should.include('<html lang="en">');
      });
  });
});
