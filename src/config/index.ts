// import development from './development';
import production from './production';

let config = production;

if (process.env.NODE_ENV === 'production') {
  config = production;
}

export default config;
