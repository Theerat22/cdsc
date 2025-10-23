// utils/db.ts
import mysql, { Pool } from 'mysql2/promise';

let cachedPool: Pool;

export function getMysqlPool(): Pool {
  if (!process.env.MYSQL_URI) {
    throw new Error('MYSQL_URI is not defined in environment variables');
  }

  if (cachedPool) {
    return cachedPool;
  }

  if (process.env.NODE_ENV === 'development') {
    const globalWithPool = global as typeof global & {
      mysqlPool: Pool;
    };

    if (!globalWithPool.mysqlPool) {
      globalWithPool.mysqlPool = mysql.createPool({ uri: process.env.MYSQL_URI });
    }
    cachedPool = globalWithPool.mysqlPool;
  } else {
    cachedPool = mysql.createPool({ uri: process.env.MYSQL_URI });
  }

  return cachedPool;
}

export const mysqlPool = getMysqlPool();