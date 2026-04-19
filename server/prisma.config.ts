import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  migrate: {
    async resolve() {
      return {
        url: 'postgresql://postgres:1234@127.0.0.1:5433/fitprogress'
      };
    }
  }
});