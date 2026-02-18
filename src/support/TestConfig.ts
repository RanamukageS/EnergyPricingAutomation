import path from 'path';

export const TestConfig = {
  downloadDir: path.resolve(process.cwd(), 'downloads'),
} as const;
