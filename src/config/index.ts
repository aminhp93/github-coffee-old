import development from './development';
import production from './production';

if (process.env.NODE_ENV === 'production') {
  console.log(process?.env);
}

let config: any = {};

if (process.env.ENV === 'production') {
  config = production;
} else {
  config = development;
}

export default config;
