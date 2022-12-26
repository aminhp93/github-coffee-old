import production from './production';
import development from './development';
let config = production;

if (process.env.NODE_ENV === 'production') {
  config = production;
}

export default config;
