import Post from '../../../../data/model/Post';

const see = '/images/see.jpg';
const see2 = '/images/see2.jpg';
const schiff = '/images/schiff.jpg';
const meer = '/images/meer.jpg';
const kraftwerkberlin = '/images/kraftwerkberlin.jpg';
const finka = '/images/finka.jpg';
const bauer = '/images/bauer.jpg';
const bauer2 = '/images/bauer2.jpg';
const aussentrauung = '/images/aussentrauung.jpg';

export const posts = [
  new Post({id: "1", creatorId: '1', title: 'Das Haus am See', image: see, description: 'description'}),
  new Post({id: "2", creatorId: '2', title: 'Das zweite Haus am See', image: see2, description: 'description'}),
  new Post({id: "3", creatorId: '1', title: 'Ein Schiff zum Entspannen und Feiern', image: schiff, description: 'description'}),
  new Post({id: "4", creatorId: '1', title: 'Ein schöner Platz am Meer', image: meer, description: 'description'}),
  new Post({id: "5", creatorId: '3', title: 'Der coole Industriepalast', image: kraftwerkberlin, description: 'description'}),
  new Post({id: "6", creatorId: '2', title: 'Mediteran anmutende Finka', image: finka, description: 'description'}),
  new Post({id: "7", creatorId: '3', title: 'Altmodischer Bauernhof', image: bauer, description: 'description'}),
  new Post({id: "8", creatorId: '2', title: 'Neumodischer Bauernhof', image: bauer2, description: 'description'}),
  new Post({id: "9", creatorId: '1', title: 'Möglichkeit zur schönen Aussentrauung', image: aussentrauung, description: 'description'})
];
