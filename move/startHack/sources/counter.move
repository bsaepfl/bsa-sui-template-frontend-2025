// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

/// This example demonstrates a basic use of a shared object.
/// Rules:
/// - anyone can create and share a counter
/// - everyone can increment a counter by 1
/// - the owner of the counter can reset it to any value
module startHack::counter {

  use sui::event::{Self, emit};
  use sui::clock::{Self, Clock};
  use sui::coin::{Self, Coin};

  /// A shared counter.
  public struct Counter has key {
    id: UID,
    owner: address,
    value: u64
  }

  public struct OwnerCap has key {
    id: UID,
  }

  public struct EventIncrement has copy, drop {
    id: ID,
    value: u64,
    timestamp: u64,
  }

  /// Create and share a Counter object.
  public fun create(ctx: &mut TxContext) {
    transfer::share_object(Counter {
      id: object::new(ctx),
      owner: tx_context::sender(ctx),
      value: 0
    });

    transfer::transfer(OwnerCap {
      id: object::new(ctx)
    }, tx_context::sender(ctx));
  }

  /// Increment a counter by 1.
  public fun increment(clock: &Clock, counter: &mut Counter) {
    counter.value = counter.value + 1;

    event::emit(EventIncrement {
      id: object::id(counter),
      value: counter.value,
      timestamp: clock::timestamp_ms(clock)
    });

  }

  /// Set value (only runnable by the Counter owner)
  public fun set_value(counter: &mut Counter, value: u64, ctx: &TxContext) {
    assert!(counter.owner == tx_context::sender(ctx), 0);
    counter.value = value;
  }

  public fun freeze_counter( _: &OwnerCap, counter: Counter, ctx: &TxContext) {
    transfer::freeze_object(counter);
    
  }
  
}
