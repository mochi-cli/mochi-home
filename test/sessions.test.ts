import assert from 'node:assert/strict';
import test, { describe } from 'node:test';
import { refusalFor } from '../src/lib/service/tokens.ts';

/**
 * Being signed out, and being told why.
 *
 * The session cap evicts the least recently used machine rather than refusing
 * the new one — somebody standing at a new laptop cannot fix a refusal from
 * there. That trade is only acceptable if the evicted machine can say what
 * happened. "Sign in again" is true of every case and useful in none: it
 * reads as the product breaking rather than as the fourth machine doing
 * exactly what it was told to do.
 *
 * These pin the three answers apart. The mapping is the whole feature; the
 * eviction itself is one SQL statement.
 */

describe('what a machine is told when its token stops working', () => {
  test('a token nobody has ever seen gets the plain answer', () => {
    assert.equal(refusalFor(null).code, 'unknown_token');
  });

  test('an eviction says the machine was signed out on purpose', () => {
    const refusal = refusalFor('signed_in_elsewhere');
    assert.equal(refusal.code, 'signed_in_elsewhere');
    // And that signing in here is the fix, rather than leaving somebody to
    // wonder whether it will just happen again.
    assert.match(refusal.message, /sign in again here/);
  });

  test('a remote sign-out says where it came from', () => {
    const refusal = refusalFor('signed_out_remotely');
    assert.equal(refusal.code, 'signed_out_remotely');
    assert.match(refusal.message, /profile on another machine/);
  });

  test('a reason this build has never heard of falls back, it does not throw', () => {
    // Reasons are written by a newer deploy and read by an older one. An
    // unknown string has to become the plain answer, not a crash in the path
    // that tells somebody why they were signed out.
    assert.equal(refusalFor('teleported').code, 'unknown_token');
  });

  test('the three cases do not share a code', () => {
    // The app switches on the code; three different situations arriving under
    // one of them is how "you were signed out on purpose" becomes "something
    // went wrong".
    const codes = new Set(
      [null, 'signed_in_elsewhere', 'signed_out_remotely'].map((reason) => refusalFor(reason).code)
    );
    assert.equal(codes.size, 3);
  });

  test('every message says what to do, not just what happened', () => {
    // A refusal a person cannot act on is a refusal that generates a support
    // email. The eviction message in particular has to say that signing in
    // here works and costs the oldest machine instead.
    for (const reason of [null, 'signed_in_elsewhere', 'signed_out_remotely']) {
      assert.match(refusalFor(reason).message, /sign(ed)? (in|out)/i, `reason: ${reason}`);
    }
  });
});
