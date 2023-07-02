import useWebSocket from 'react-use-websocket';

const WS_URL =
  'wss://tradestation.fireant.vn/quote?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSIsImtpZCI6IkdYdExONzViZlZQakdvNERWdjV4QkRITHpnSSJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4iLCJhdWQiOiJodHRwczovL2FjY291bnRzLmZpcmVhbnQudm4vcmVzb3VyY2VzIiwiZXhwIjoxOTU2Mzc5MDYxLCJuYmYiOjE2NTYzNzkwNjEsImNsaWVudF9pZCI6ImZpcmVhbnQudHJhZGVzdGF0aW9uIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiZW1haWwiLCJhY2NvdW50cy1yZWFkIiwiYWNjb3VudHMtd3JpdGUiLCJvcmRlcnMtcmVhZCIsIm9yZGVycy13cml0ZSIsImNvbXBhbmllcy1yZWFkIiwiaW5kaXZpZHVhbHMtcmVhZCIsImZpbmFuY2UtcmVhZCIsInBvc3RzLXdyaXRlIiwicG9zdHMtcmVhZCIsInN5bWJvbHMtcmVhZCIsInVzZXItZGF0YS1yZWFkIiwidXNlci1kYXRhLXdyaXRlIiwidXNlcnMtcmVhZCIsInNlYXJjaCIsImFjYWRlbXktcmVhZCIsImFjYWRlbXktd3JpdGUiLCJibG9nLXJlYWQiLCJpbnZlc3RvcGVkaWEtcmVhZCJdLCJzdWIiOiIxZmI5NjI3Yy1lZDZjLTQwNGUtYjE2NS0xZjgzZTkwM2M1MmQiLCJhdXRoX3RpbWUiOjE2NTYzNzkwNjEsImlkcCI6IkZhY2Vib29rIiwibmFtZSI6Im1pbmhwbi5vcmcuZWMxQGdtYWlsLmNvbSIsInNlY3VyaXR5X3N0YW1wIjoiODIzMzcwOGUtYjFjOS00ZmQ3LTkwYmYtMzI2NTYzYmU4N2JkIiwianRpIjoiYzhhN2E0ZTE3N2QwOWMyNDY1ZWRjZjgzMWNjZjA3MGEiLCJhbXIiOlsiZXh0ZXJuYWwiXX0.p8_sAxVhy7V4uFN-OdaB4bn_xN8z7f5mrJB2s9R2LVdmKM-1k_LjGga60mguWopIcfjS5F4c5ucnvAOQHLlK4dT9IusXlAcnV6xksDFpPKlnZe1Xw2PhBaagg7gmnzQ9qugySPbRRiCGAiM6SVaxe9U8nNlscNgTLwctKi2tu92fa5VsA4um07ofK8kP2859sU9BJzlPkGaLC6HFGAnNNZd9ccqRRPmSJsfsil5DDgcLDIGTN62DuH1gWksW3B3aN4CsTeLfUuKEdApzPxqLm2lHUYZdR2lIpvrZGCIbGyqdBnTUE8Sy7nQcqQ_7FuySPFVQFQKVr1EpmimCN6LCtg';

const Test = () => {
  const {
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
  });

  console.log({
    sendMessage,
    sendJsonMessage,
    lastMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  });

  return <div>test</div>;
};

export default Test;
