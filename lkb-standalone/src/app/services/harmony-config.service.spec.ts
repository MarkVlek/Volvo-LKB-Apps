import { HarmonyConfigService } from './harmony-config.service';

/**
 * Covers where the configuration comes from. The dev defaults name a real dealer, so it matters
 * that they are reachable only when no player is present at all.
 */
describe('HarmonyConfigService — configuration source', () => {

  afterEach(() => delete (window as any).Loader);

  it('uses the dev defaults when there is no player', () => {
    delete (window as any).Loader;

    expect(new HarmonyConfigService().searchableBranchNames).toContain('Bildeve');
  });

  it('shows no inventory rather than the sample dealer when the player Loader fails', () => {
    (window as any).Loader = {
      getComponents: () => { throw new Error('Loader unavailable'); }
    };

    const service = new HarmonyConfigService();

    expect(service.dealerId).toBe('');
    expect(service.searchableBranchNames).toBe('');
  });
});
