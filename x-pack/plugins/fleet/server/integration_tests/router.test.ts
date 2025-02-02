/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

test.skip('requires one test', () => {});

/**
 * skipped due to all being flaky: https://github.com/elastic/kibana/issues/58954
 *
 * commented out due to hooks being called regardless of skip
 * https://github.com/facebook/jest/issues/8379

import { resolve } from 'path';
import * as kbnTestServer from '../../../../../src/test_utils/kbn_server';

function createXPackRoot(config: {} = {}) {
  return kbnTestServer.createRoot({
    plugins: {
      paths: [
        resolve(__dirname, '../../../../../x-pack/plugins/encrypted_saved_objects'),
        resolve(__dirname, '../../../../../x-pack/plugins/fleet'),
        resolve(__dirname, '../../../../../x-pack/plugins/licensing'),
      ],
    },
    migrations: { skip: true },
    xpack: config,
  });
}

describe('fleet', () => {
  describe('default. manager, EPM, and Fleet all disabled', () => {
    let root: ReturnType<typeof kbnTestServer.createRoot>;

    beforeAll(async () => {
      root = createXPackRoot();
      await root.preboot();
      await root.setup();
      await root.start();
    }, 30000);

    afterAll(async () => await root.shutdown());

    it('does not have agent policy api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/agent_policies').expect(404);
    });

    it('does not have package policies api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/package_policies').expect(404);
    });

    it('does not have EPM api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/epm/packages').expect(404);
    });

    it('does not have Fleet api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/agents/setup').expect(404);
    });
  });

  describe('manager only (no EPM, no Fleet)', () => {
    let root: ReturnType<typeof kbnTestServer.createRoot>;

    beforeAll(async () => {
      const fleetConfig = {
        enabled: true,
      };
      root = createXPackRoot({
        fleet: fleetConfig,
      });
      await root.preboot();
      await root.setup();
      await root.start();
    }, 30000);

    afterAll(async () => await root.shutdown());

    it('has agent policy api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/agent_policies').expect(200);
    });

    it('has package policies api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/package_policies').expect(200);
    });

    it('does not have EPM api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/epm/packages').expect(404);
    });

    it('does not have Fleet api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/agents/setup').expect(404);
    });
  });

  // For now, only the manager routes (/agent_policies & /package_policies) are added
  // EPM and ingest will be conditionally added when we enable these lines
  // https://github.com/jfsiii/kibana/blob/f73b54ebb7e0f6fc00efd8a6800a01eb2d9fb772/x-pack/plugins/fleet/server/plugin.ts#L84
  // adding tests to confirm the Fleet & EPM routes are never added

  describe('manager and EPM; no Fleet', () => {
    let root: ReturnType<typeof kbnTestServer.createRoot>;

    beforeAll(async () => {
      const fleetConfig = {
        enabled: true,
        epm: { enabled: true },
      };
      root = createXPackRoot({
        fleet: fleetConfig,
      });
      await root.preboot();
      await root.setup();
      await root.start();
    }, 30000);

    afterAll(async () => await root.shutdown());

    it('has agent policy api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/agent_policies').expect(200);
    });

    it('has package policies api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/package_policies').expect(200);
    });

    it('does have EPM api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/epm/packages').expect(500);
    });

    it('does not have Fleet api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/agents/setup').expect(404);
    });
  });

  describe('manager and Fleet; no EPM)', () => {
    let root: ReturnType<typeof kbnTestServer.createRoot>;

    beforeAll(async () => {
      const fleetConfig = {
        enabled: true,
        fleet: { enabled: true },
      };
      root = createXPackRoot({
        fleet: fleetConfig,
      });
      await root.preboot();
      await root.setup();
      await root.start();
    }, 30000);

    afterAll(async () => await root.shutdown());

    it('has agent policy api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/agent_policies').expect(200);
    });

    it('has package policies api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/package_policies').expect(200);
    });

    it('does not have EPM api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/epm/packages').expect(404);
    });

    it('does have Fleet api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/agents/setup').expect(200);
    });
  });

  describe('all flags enabled: manager, EPM, and Fleet)', () => {
    let root: ReturnType<typeof kbnTestServer.createRoot>;

    beforeAll(async () => {
      const fleetConfig = {
        enabled: true,
        epm: { enabled: true },
        fleet: { enabled: true },
      };
      root = createXPackRoot({
        fleet: fleetConfig,
      });
      await root.preboot();
      await root.setup();
      await root.start();
    }, 30000);

    afterAll(async () => await root.shutdown());

    it('has agent policy api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/agent_policies').expect(200);
    });

    it('has package policies api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/package_policies').expect(200);
    });

    it('does have EPM api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/epm/packages').expect(500);
    });

    it('does have Fleet api', async () => {
      await kbnTestServer.request.get(root, '/api/fleet/agents/setup').expect(200);
    });
  });
});
*/
