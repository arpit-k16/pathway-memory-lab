"""Tests for RecurrentMemoryEngine — core invariants and behavior."""

import numpy as np

from app.core.memory import RecurrentMemoryEngine, token_signature


class TestEngineInit:
    def test_state_size_matches_slots(self):
        engine = RecurrentMemoryEngine(memory_slots=8)
        assert len(engine.get_state()) == 8

    def test_initial_state_is_zero(self):
        engine = RecurrentMemoryEngine(memory_slots=4)
        assert engine.get_state() == [0.0, 0.0, 0.0, 0.0]

    def test_trace_starts_empty(self):
        engine = RecurrentMemoryEngine(memory_slots=4)
        assert engine.get_trace() == []


class TestReset:
    def test_reset_clears_state(self):
        engine = RecurrentMemoryEngine(memory_slots=4)
        engine.process([0, 1, 2, 3])
        engine.reset()
        assert engine.get_state() == [0.0, 0.0, 0.0, 0.0]
        assert engine.get_trace() == []
        assert engine.total_collisions == 0


class TestProcess:
    def test_process_produces_trace(self):
        engine = RecurrentMemoryEngine(memory_slots=4)
        engine.process([5, 10, 15, 20])
        assert len(engine.get_trace()) == 4

    def test_state_fixed_size_after_long_sequence(self):
        """KEY INVARIANT: len(final_state) == memory_slots for any sequence."""
        for k in [2, 4, 8, 16, 64]:
            engine = RecurrentMemoryEngine(memory_slots=k)
            engine.process(list(range(200)))  # sequence >> memory
            assert len(engine.get_state()) == k

    def test_sequence_longer_than_memory(self):
        engine = RecurrentMemoryEngine(memory_slots=4)
        engine.process(list(range(100)))
        assert len(engine.get_state()) == 4
        assert len(engine.get_trace()) == 100


class TestCollisions:
    def test_collision_detected_on_same_slot(self):
        """Tokens 0 and 4 both map to slot 0 when K=4."""
        engine = RecurrentMemoryEngine(memory_slots=4)
        engine.step(0, 0)
        item = engine.step(4, 1)
        assert item["collision"] is True

    def test_no_collision_on_first_write(self):
        engine = RecurrentMemoryEngine(memory_slots=8)
        item = engine.step(3, 0)
        assert item["collision"] is False

    def test_collision_count_accumulates(self):
        engine = RecurrentMemoryEngine(memory_slots=2)
        # tokens 0,2,4 all map to slot 0
        engine.process([0, 2, 4])
        assert engine.total_collisions == 2


class TestQuery:
    def test_single_write_high_confidence(self):
        """A token alone in its slot should have confidence ~1.0."""
        engine = RecurrentMemoryEngine(memory_slots=100, vocabulary_size=100)
        engine.step(7, 0)
        result = engine.query(7)
        assert result["recovered"] is True
        assert result["confidence"] > 0.9

    def test_many_collisions_degrade_confidence(self):
        """Many tokens in the same slot should reduce target confidence."""
        engine = RecurrentMemoryEngine(memory_slots=4, vocabulary_size=100)
        # Tokens 0,4,8,12,16,20,24,28 all map to slot 0 (since token % 4 == 0)
        for i in range(0, 40, 4):
            engine.step(i, i // 4)
        result = engine.query(0)
        # With 10 tokens superposed, confidence should be well below 1.0
        assert result["confidence"] < 0.5
        assert result["recovered"] is False

    def test_successful_recall_case(self):
        """With K >= vocab, each token gets its own slot → recall works."""
        engine = RecurrentMemoryEngine(memory_slots=50, vocabulary_size=50)
        engine.process(list(range(50)))
        result = engine.query(7)
        assert result["recovered"] is True

    def test_degraded_recall_case(self):
        """With very few slots and many tokens, recall degrades."""
        engine = RecurrentMemoryEngine(memory_slots=2, vocabulary_size=100)
        engine.process(list(range(100)))
        # Token 0 shares slot 0 with tokens 2,4,6,...,98 (50 tokens)
        result = engine.query(0)
        assert result["confidence"] < 0.5

    def test_query_position_uses_trace_snapshot(self):
        engine = RecurrentMemoryEngine(memory_slots=4, vocabulary_size=20)
        engine.process([1, 5, 9, 13])  # all map to slot 1
        early = engine.query(1, query_position=0)
        late = engine.query(1, query_position=3)
        assert early["slot_write_count"] == 1
        assert late["slot_write_count"] == 4
        assert early["query_position"] == 0
        assert late["query_position"] == 3


class TestTokenSignature:
    def test_distinct_tokens_distinct_signatures(self):
        sigs = [token_signature(t) for t in range(100)]
        # All should be unique (within float precision)
        assert len(set(sigs)) == 100

    def test_signatures_are_positive(self):
        for t in range(1000):
            assert token_signature(t) > 0
