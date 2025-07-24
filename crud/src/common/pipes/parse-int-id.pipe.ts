import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { log } from 'console';

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    //log('ParseIntIdPipe executado');
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }
    // throw new Error("Method not implemented.");

    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('ParseIntIdPipe espera um string numérica');
    }

    if (parsedValue < 0) {
      throw new BadRequestException('ParseIntIdPipe espera um numero maior 0');
    }

    return parsedValue;
  }
}
