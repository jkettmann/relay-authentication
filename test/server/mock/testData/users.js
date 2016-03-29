import User from '../../../../data/model/User';
import {ROLES} from '../../../../config';

const user1 = new User({
  id: '1',
  role: ROLES.reader,
  email: 'reader@test.com',
  password: '1234asdf',
  firstName: 'Hans',
  lastName: 'Franz'
});

const user2 = new User({
  id: '2',
  role: ROLES.publisher,
  email: 'publisher@test.com',
  password: '1234asdf',
  firstName: 'Peter',
  lastName: 'Fritz'
});

export const users = [user1, user2];