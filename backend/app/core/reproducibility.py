"""Reproducibility helpers.

All randomness in the experiment pipeline flows through explicit
numpy Generators created here.  No global random state is used.
"""

from __future__ import annotations

import numpy as np


def make_rng(seed: int) -> np.random.Generator:
    """Return a new, independently-seeded NumPy Generator."""
    return np.random.default_rng(seed)


def generate_sequence(
    rng: np.random.Generator,
    length: int,
    vocabulary_size: int,
    target_token: int,
    target_position: int | None = None,
) -> tuple[list[int], int]:
    """Generate a deterministic token sequence with a guaranteed target.

    Parameters
    ----------
    rng : Generator
        Seeded RNG — all randomness comes from here.
    length : int
        Total sequence length.
    vocabulary_size : int
        Tokens are drawn from ``[0, vocabulary_size)``.
    target_token : int
        The token whose recall we will later test.
    target_position : int | None
        If provided, the target is placed at this index.
        Otherwise a random position is chosen.

    Returns
    -------
    (sequence, target_position)
    """
    if vocabulary_size < 2:
        raise ValueError("vocabulary_size must be >= 2 to build target-free distractors.")

    # Draw distractors from [0, vocabulary_size) excluding target_token.
    # We sample in [0, vocabulary_size-1) then shift values >= target_token.
    raw = rng.integers(0, vocabulary_size - 1, size=length - 1).tolist()
    distractors = [value if value < target_token else value + 1 for value in raw]

    if target_position is None:
        seq = distractors + [target_token]
        permuted = rng.permutation(length)
        seq = [seq[i] for i in permuted]
        actual_target_pos = int(seq.index(target_token))
        return seq, actual_target_pos

    shuffled_distractors = [distractors[i] for i in rng.permutation(len(distractors))]
    seq = (
        shuffled_distractors[:target_position]
        + [target_token]
        + shuffled_distractors[target_position:]
    )
    return seq, target_position
