import { loadEnvConfig } from '@next/env';

if (process.env.NEXT_RUNTIME !== 'edge') {
    const projectDir = process.env.ROOT_DIR || process.cwd();
    loadEnvConfig(projectDir);
}