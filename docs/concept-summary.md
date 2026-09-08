# Memory Lab: In-Context Learning with Recurrent Memory

## Concept and central claim

Memory Lab is an educational experiment about **In-Context Learning with Recurrent Memory**. Its central claim is narrow: a fixed-shape recurrent state can keep processing a token sequence of arbitrary duration without allocating a new permanent memory location for every token. That constant-size property does not guarantee faithful recall. In this toy experiment, collisions and interference can make earlier information harder to recover.

## Learning objective

The learner follows a token into fixed memory, plays the resulting trace, compares ground truth with a backend prediction, and changes capacity or interference. The goal is to distinguish constant memory footprint from unlimited information retention.

## Why it matters

Sequence systems must balance retaining history with finite computational resources. A recurrent mechanism compresses past information into state rather than retaining every earlier token directly. That makes the design question concrete: what survives repeated updates, and under which conditions can a specific item be retrieved?

## Toy memory mechanism and failure

The backend generates a deterministic sequence from a seed and writes each token into one of a fixed number of scalar slots. Later tokens can write to the same slot, producing explicit collision and superposition. An interference parameter adds controlled noise. At a query position, the engine reports ground truth, a predicted token, confidence, collisions, utilization, and target signal. The frontend animates this returned trace; it does not simulate results in the browser.

The **break the memory** preset makes the contrast easy to inspect: a long sequence, four slots, and interference create many later updates to finite state. The evidence shown is a chain from target write to later updates, collision statistics, changed target signal, and the actual decoded result. A failed run demonstrates this toy mechanism under that configuration, not a universal law about all recurrent models.

## BDH and BDH-CQ connection

The toy is not BDH, BDH-CQ, a language model, or a benchmark reproduction. It is conceptually related because it exposes a common pressure: information is updated in state rather than retained as a full explicit token history. The primary BDH paper describes a more sophisticated learned, scale-free, locally interacting neuron-particle architecture with inference-time memory through synaptic plasticity. BDH-CQ describes inputs updating recurrent memory before iterative latent computation answers a query. Those mechanisms are substantially beyond scalar-slot hashing.

## Evidence, limitations, and reproducibility

Research statements are labelled primary-source context; displayed experiment values are labelled toy-experiment evidence; explanatory connections are interpretations. Primary sources are BDH (arXiv:2509.26507), BDH-CQ (arXiv:2608.09888), Titans (arXiv:2501.00663), and Griffin (arXiv:2402.19427). The same seed and displayed configuration reproduce an experiment. This transparent model is intentionally simplified, not trained, and does not establish performance claims about BDH or recurrent architectures generally.
