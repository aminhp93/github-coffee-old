import axios from 'axios';
import config from '@/config';

const baseUrl = config.apiUrl;

const TestUrls = {
  test: `${baseUrl}/api/test/test/`,
  startJob: `${baseUrl}/api/test/start-job/`,
};

const TestService = {
  test() {
    return axios({
      method: 'GET',
      url: TestUrls.test,
    });
  },
  startJob: () => {
    return axios({
      method: 'GET',
      url: TestUrls.startJob,
    });
  },
};

export default TestService;
