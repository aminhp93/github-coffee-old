import production from './production';
import development from './development';
let config = development;

if (process.env.NODE_ENV === 'production') {
  config = production;
}

export default config;
