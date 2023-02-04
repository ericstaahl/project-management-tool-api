import { server } from '../server';

interface DecodedJwt {
  user: {
    user_id: number;
    username: string;
  };
  iat: number;
  exp: number;
}

function getUserFromJwt(jwt: string): DecodedJwt | null {
  return server.jwt.decode(jwt);
}

export default getUserFromJwt;
