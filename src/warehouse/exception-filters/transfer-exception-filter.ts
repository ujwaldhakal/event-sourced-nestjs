import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { InsufficientQuantityForTransfer } from 'warehouse/exceptions/insufficient-quantity-for-transfer.exception';

@Catch(InsufficientQuantityForTransfer)
export class TransferExceptionFilter implements ExceptionFilter {
  private message: any;
  catch(exception: InsufficientQuantityForTransfer, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      title: 'Could not perform action',
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      detail: exception.message as string,
    });
  }
}
