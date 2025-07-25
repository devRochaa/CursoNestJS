import { Injectable } from '@nestjs/common';

@Injectable()
export class RecadosUtils {
  inverteString(str: string): string {
    //daniel -> leinad
    return str.split('').reverse().join('');
  }
}
