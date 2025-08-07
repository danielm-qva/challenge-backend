import { Inject } from '@nestjs/common';

export class RedisIndexService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: any) {}

  async getNextIndex(key: string, type: string = 'request') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    const index = await this.redisClient.incr(key);
    if (
      index >
      (type === 'request'
        ? +(process.env.NEST_LIMIT_REQUEST || 50)
        : +(process.env.NEST_LIMIT_ORDER_DAY || 1000))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      await this.redisClient.set(key, 1);
      return 1;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return index;
  }
}
