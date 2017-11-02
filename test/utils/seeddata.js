'use strict';
const faker = require('faker');
const {Board} = require('../../models/boards');
const {User} = require('../../models/users');
const {Card} = require('../../models/cards');
const {Cardslist} = require('../../models/cardslist');
//create a user, hash password, and keep track of original password
const createUser = () => {
const password = faker.internet.password();
  return User.hashPassword(password)
  .then(hash => {
    return {
      email: faker.internet.email(),
      password: hash,
      unhashed: password,
      fullName: faker.name.findName()
    };
  });
};
//create multiple users
const createUsers = count => {
const seedData = [];
let users = {};
for (let index = 0; index <= count; index++) {
  seedData.push(createUser());
}
//wait for all actions to complete before continuing
return Promise.all(seedData)
.then(seed => {
  users = seed;

return User.insertMany(seed);
})
.then(res => {
  //merge unhashed password with other user info
  return res.map((user, index) => {
    return {
      _id: user._id,
      email: user.email,
      password: user.password,
      unhashed: users[index].unhashed,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt
    };
  });
});
};
//create a random title
const createTitle = () => {
return {title: faker.random.words()};
};
//create multiple boards
const createBoards = users => {
const seedData = [];
//create and store random titles
for (let index = 0; index < users.length; index++) {
  seedData.push(createTitle());
  seedData[index].owner = users[index]._id;
}
//wait for all actions to complete before continuing
return Promise.all(seedData)
.then(seed => {
  return Board.insertMany(seed);
});
};
//create multiple cardslist
const createCardslist = (users, boards) => {
const seedData = [];
//create and store random titles
for (let index = 0; index < users.length; index++) {
  seedData.push(createTitle());
  seedData[index].owner = users[index]._id;
  seedData[index].boardId = boards[index]._id;
}
//wait for all actions to complete before continuing
return Promise.all(seedData)
.then(seed => {
  return Cardslist.insertMany(seed);
});
};
//create random text
const createText = () => {
return {text: faker.random.words()};
};
//create multiple cards
const createCards = (users, cardslist) => {
const seedData = [];
//create and store random text
for (let index = 0; index < users.length; index++) {
  seedData.push(createText());
  seedData[index].title = createTitle().title;
  seedData[index].owner = users[index]._id;
  seedData[index].cardslistId = cardslist[index]._id;
}
//wait for all actions to complete before continuing
return Promise.all(seedData)
.then(seed => {
  return Card.insertMany(seed);
});
};
module.exports = {createUser, createUsers, createTitle, createBoards, createCardslist, createText, createCards};
