import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import { setConfig } from '../../utils/config';
import { TypeScriptFile } from '../files';
import { generateLegacyTypes } from '../types';

vi.mock('node:fs');

describe('generateLegacyTypes', () => {
  it('writes to filesystem', async () => {
    setConfig({
      client: {
        name: 'legacy/fetch',
      },
      configFile: '',
      debug: false,
      dryRun: false,
      experimental_parser: false,
      exportCore: true,
      input: '',
      name: 'AppClient',
      output: {
        path: '',
      },
      plugins: [],
      schemas: {},
      services: {},
      types: {
        enums: 'javascript',
      },
      useOptions: true,
    });

    const client: Parameters<typeof generateLegacyTypes>[0]['client'] = {
      models: [
        {
          $refs: [],
          base: 'User',
          description: null,
          enum: [],
          enums: [],
          export: 'interface',
          imports: [],
          in: '',
          isDefinition: true,
          isNullable: false,
          isReadOnly: false,
          isRequired: false,
          link: null,
          meta: {
            $ref: '#/components/schemas/User',
            name: 'User',
          },
          name: 'User',
          properties: [],
          template: null,
          type: 'User',
        },
      ],
      server: 'http://localhost:8080',
      services: [],
      types: {},
      version: 'v1',
    };

    const files = {
      types: new TypeScriptFile({
        dir: '/',
        name: 'types.ts',
      }),
    };

    await generateLegacyTypes({
      client,
      files,
    });

    files.types.write();

    expect(writeFileSync).toHaveBeenCalledWith(
      path.resolve('/types.gen.ts'),
      expect.anything(),
    );
  });
});
