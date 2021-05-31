import { Connection, QueryRunner } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

@Injectable()
export class QueryRunnerFactory {
  constructor(private readonly connection: Connection) {}

  async create() {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    return queryRunner;
  }

  /**
   * Wraps given function execution (and all operations made there) in a transaction.
   * All database operations must be executed using provided entity manager.
   */
  async transaction<T>(
    runInTransaction: (queryRunner: QueryRunner) => Promise<T>,
    isolation?: IsolationLevel,
  ): Promise<T> {
    const queryRunner = await this.create();

    try {
      if (isolation) {
        await queryRunner.startTransaction(isolation);
      } else {
        await queryRunner.startTransaction();
      }
      const result = await runInTransaction(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      try {
        // we throw original error even if rollback thrown an error
        await queryRunner.rollbackTransaction();
      } catch (rollbackError) {}
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
