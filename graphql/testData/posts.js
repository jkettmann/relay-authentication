import Post from '../../data/model/Post'

const image1 = '/images/image1.jpg'
const image2 = '/images/image2.jpg'
const image3 = '/images/image3.jpg'
const image4 = '/images/image4.jpg'
const image5 = '/images/image5.jpg'
const image6 = '/images/image6.jpg'
const image7 = '/images/image7.jpg'
const image8 = '/images/image8.jpg'
const image9 = '/images/image9.jpg'

// eslint-disable-next-line import/prefer-default-export
export const posts = [
  new Post({
    id: '1',
    creatorId: '3',
    title: 'An interesting story',
    image: image1,
    description: 'description',
  }),
  new Post({
    id: '2',
    creatorId: '2',
    title: 'More interesting',
    image: image2,
    description: 'description',
  }),
  new Post({
    id: '3',
    creatorId: '2',
    title: 'Very nice post',
    image: image3,
    description: 'description',
  }),
  new Post({
    id: '4',
    creatorId: '3',
    title: 'Even nicer post',
    image: image4,
    description: 'description',
  }),
  new Post({
    id: '5',
    creatorId: '3',
    title: 'Look at that image',
    image: image5,
    description: 'description',
  }),
  new Post({
    id: '6',
    creatorId: '2',
    title: 'Have a nice day',
    image: image6,
    description: 'description',
  }),
  new Post({
    id: '7',
    creatorId: '3',
    title: 'Must do',
    image: image7,
    description: 'description',
  }),
  new Post({
    id: '8',
    creatorId: '2',
    title: 'Modern society',
    image: image8,
    description: 'description',
  }),
  new Post({
    id: '9',
    creatorId: '2',
    title: 'Modern society 2',
    image: image9,
    description: 'description',
  }),
]
