import { Injectable } from '@nestjs/common';

@Injectable()
export class RecadosUtils {
  inverteString(str: string): string {
    //daniel -> leinad
    console.log('não é mock');
    return str.split('').reverse().join('');
  }
}

@Injectable()
export class RecadosUtilsMock {
  inverteString() {
    return 'Estou no mock';
  }
}
