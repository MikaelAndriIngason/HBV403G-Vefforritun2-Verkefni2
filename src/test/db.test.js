import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import dotenv from 'dotenv';
import {
  createEvent,
  createSchema,
  dropSchema,
  end,
  register,
  updateEvent,
  listNEvents,
  deleteEvent,
  getNumberOfEvents
} from '../lib/db';

dotenv.config({ path: './.env.test' });

describe('db', () => {
  beforeAll(async () => {
    await dropSchema();
    await createSchema();
  });

  afterAll(async () => {
    await end();
  });

  it('creates a valid event and returns it', async () => {
    const name = 'test';

    const result = await createEvent({
      name,
      slug: name,
    });
    expect(result.name).toBe(name);
    expect(result.slug).toBe(name);
    expect(result.id).toBeGreaterThan(0);

    // ARRANGE => setja upp test gögn
    // ACT => Acta á test gögnin
    // ASSERT => Staðfestum að það sem við gerðum gerðist rétt
  });

  it('does not create an invalid event', async () => {
    const result = await createEvent({});
    expect(result).toBe(null);
  });

  it('does not allow creating two events with the same name', async () => {
    const event = {
      name: 'foo',
      slug: 'foo',
    };
    const result = await createEvent(event);
    const sameName = await createEvent(event);
    expect(result).toBeDefined();
    expect(sameName).toBeNull();
  });

  it('creates and updates an event', async () => {
    const result = await createEvent({
      name: 'one',
      slug: 'one',
      description: 'd',
    });

    const updated = await updateEvent(result.id, { name: 'two', slug: 'two' });
    expect(updated.id).toEqual(result.id);
    expect(updated.name).toBe('two');
    expect(updated.slug).toBe('two');
    expect(result.description).toBe('d');
    expect(updated.description).toBe(null);
  });

  it('allows registering to events', async () => {
    const event = await createEvent({ name: 'e', slug: 'e' });
    const registration = await register({ name: 'r', event: event.id });

    expect(registration.name).toEqual('r');
  });

  it('does not allow registering to non existant event', async () => {
    const registration = await register({ name: 'r', event: 0 });

    expect(registration).toBeNull();
  });

  it('does not allow registering to non existant event', async () => {
    const registration = await register({ event: 0 });

    expect(registration).toBeNull();
  });

  it ('Returns up to 10 rows of events', async () => {
    const n = await listNEvents(0);
    expect(n.length).toBe(4);
  });

  it ('getNumberOfEvents', async () => {
    expect(await getNumberOfEvents()).toBe(4);
  })

  it ('deleteEvent', async () => {
    await deleteEvent('two');
    expect(await getNumberOfEvents()).toBe(3);
  })
});


