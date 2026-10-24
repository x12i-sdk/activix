import assert from 'node:assert/strict';
import { Activix, ActivixMemoryStore, activixOuterTier } from '@x12i/activix';
const store = new ActivixMemoryStore({ collections: [{ name: 'fixture-activities', primaryKey: 'activityId' }] });
const tracker = await Activix.create({ collection: 'fixture-activities', store, collectionRegistry: false, autoCost: false });
try {
  const started = await tracker.startRecord({ runContext: { sessionId: 'fixture-session' }, outer: activixOuterTier({ task: 'Review the example' }, {}) });
  assert(started.activityId.length > 0);
  await tracker.completeRecord(started.activityId, { outcome: 'reviewed' });
  const record = await tracker.getRecord(started.activityId);
  assert.equal(record.status, 'completed');
  assert.equal(record.outcome, 'reviewed');
  console.log({ activityId: started.activityId, status: record.status, outcome: record.outcome });
} finally { await store.close(); }
