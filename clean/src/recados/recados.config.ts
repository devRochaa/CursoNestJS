import { registerAs } from '@nestjs/config';

export default registerAs('recados', () => ({
  teste1: 'teste1',
  teste2: 'teste2',
}));
