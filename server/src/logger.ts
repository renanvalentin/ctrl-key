import { Logtail } from '@logtail/node';

export const logger = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN as string);
