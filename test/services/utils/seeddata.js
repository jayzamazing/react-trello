'use strict';
import faker from 'faker';
import {Board} from '../../../src/models/boards';
import {User} from '../../../src/models/users';
import {Card} from '../../../src/models/cards';
import {Cardslist} from '../../../src/models/cardslist';
//Create a user, hash password, and keep track of original password
export const createUser = () => {
  let password = faker.internet.password();
  return User.hashPassword(password)
  .then((hash) => {
    return {
      email: faker.internet.email(),
      password: hash,
      unhashed: password
    };
  });
};
//create multiple users
export const createUsers = () => {
  let seedData = [], users;
  for (let i = 0; i <= 9; i++) {
    seedData.push(createUser());
  }
  //wait for all actions to complete before continuing
  return Promise.all(seedData)
  .then((seed) => {
    users = seed;
    return User.insertMany(seed);
  }).then((res) => {
    //merge unhashed password with other user info
    return res.map((x, index) => {
      return {
        _id: x._id,
        email: x.email,
        password: x.password,
        unhashed: users[index].unhashed,
        updatedAt: x.updatedAt,
        createdAt: x.createdAt
      };
    });
  });
};
//create a random title
export const createTitle = () => {
  return {
    title: faker.random.words()
  };
};
//create multiple boards
export const createBoards = (users) => {
  let seedData = [];
  //create and store random titles
  for (let i = 0; i <= 9; i++) {
    seedData.push(createTitle());
    seedData[i].owner = users[i]._id;
  }
  //wait for all actions to complete before continuing
  return Promise.all(seedData)
  .then((seed) => {
    return Board.insertMany(seed);
  });
};
//create multiple cardslists
export const createCardslist = (users, boards) => {
  const seedData = [];
  //create and store random titles
  for (let i = 0; i <= 9; i++) {
    seedData.push(createTitle());
    seedData[i].owner = users[i]._id;
    seedData[i].boardId = boards[i]._id;
  }
  //wait for all actions to complete before continuing
  return Promise.all(seedData)
  .then((seed) => {
    return Cardslist.insertMany(seed);
  });
};
//create random text
export const createText = () => {
  return {
    text: faker.random.words()
  };
};
//create multiple cards
export const createCards = (users, cardslists) => {
  const seedData = [];
  //create and store random text
  for (let i = 0; i <= 9; i++) {
    seedData.push(createText());
    seedData[i].owner = users[i]._id;
    seedData[i].cardslistId = cardslists[i]._id;
  }
  //wait for all actions to complete before continuing
  return Promise.all(seedData)
  .then((seed) => {
    return Card.insertMany(seed);
  });
};
