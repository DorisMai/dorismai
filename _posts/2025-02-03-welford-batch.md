---
title: 'Welford''s algorithm for batch statistics updates'
date: 2025-02-03
permalink: /posts/welford-batch/
color_tag: "study-notes"
tags:
  - ML
---

Computing moving statistics (e.g. mean and variance) is useful when dealing with very large datasets. Welford's algorithm is one method for achieving this. This post derives how it works for single sample as well as batch updates. 


Define $$\bar{x}_n=\frac{1}{n}\sum^n_i x_i $$, $$M_{2,n}=\sum^n_i (x_i-\bar{x}_n)^2$$, such that the biased variance is $$\sigma_n^2=\frac{M_{2,n}}{n}$$ and the unbiased one is $$s_n^2=\frac{M_{2,n}}{(n-1)}$$.

---
# batch_size=1 case
$$\bar{x}_n=\bar{x}_{n-1}+\frac{x_n-\bar{x}_{n-1}}{n}$$
$$M_{2,n}=M_{2,n-1}+(x_n-\bar{x}_n)(x_n-\bar{x}_{n-1})$$

Define $$\delta=x_n-\bar{x}_{n-1}$$, $$M_a=(n-1)\sigma_{n-1}$$, such that $$M_{2,n}=M_a+\delta(x_n-\bar{x}_n)$$

Note that $$x_n-\bar{x}_n=\frac{nx_n-\sum_i^nx_i}{n}=\frac{(n-1)x_n-\sum_i^{n-1}x_i}{n}=(n-1)\frac{x_n-\bar{x}_{n-1}}{n}=\delta\frac{n-1}{n}$$
Therefore, $$M_{2,n}=M_a+\delta^2*\frac{n-1}{n}$$

---
# batch_size=$$b$$
Let $$\bar{x}_n$$ be the new mean to be calculated (i.e. corresponding to $$\bar{x}_n$$). Given previously calculated mean $$\bar{x}_{n'}$$ (i.e. corresponding to $$\bar{x}_{n-1}$$) and variance (from $$M_{2,n'}$$) from $$n'$$ samples, with an additional batch of size $$b$$ samples, how to update the mean and variance?
## mean
$$
\begin{align*}
\bar{x}_n &= \bar{x}_{n'}+\frac{\sum_i^b(x_i-\bar{x}_{n'})}{n} \\
&=\bar{x}_{n'}+\frac{(\bar{x}_b-\bar{x}_{n'})b}{n} \\
&= \bar{x}_{n'}+\delta\frac{b}{n}
\end{align*}
$$
where $$\bar{x}_b$$ is the batch mean, total number of samples is $$n=n'+b$$, and we re-define $$\delta=\bar{x}_b-\bar{x}_{n'}$$.
## variance
$$
\begin{align*}
	M_{2,n} = \sum^n_i (x_i-\bar{x}_n)^2 = \sum^{n'}_i (x_i-\bar{x}_n)^2 &+ \sum^b_j (x_j-\bar{x}_n)^2 \\
	\text{The first term, } \sum^{n'}_i (x_i-\bar{x}_n)^2
	&= \sum^{n'}_i (x_i-\bar{x}_{n'} + \frac{b}{n}(\bar{x}_{n'}-\bar{x}_b))^2 \\
	&= \sum^{n'}_i (x_i-\bar{x}_{n'})^2 + 2\frac{b}{n}(\bar{x}_{n'}-\bar{x}_b)\sum^{n'}_i (x_i-\bar{x}_{n'}) + \sum^{n'}_i (\frac{b}{n}(\bar{x}_{n'}-\bar{x}_b))^2 \\
	&= M_{2,n-1} + 0 + n'\frac{b^2}{n^2}(\bar{x}_{n'}-\bar{x}_b)^2 \\
	&= M_{2,n-1} + n'\frac{b^2}{n^2}\delta^2
\end{align*}
$$
$$
\begin{align*}
	\text{The second term, } \sum^b_j (x_j-\bar{x}_n)^2
	&= \sum^b_j (x_j-\bar{x}_b+\frac{n'}{n}(\bar{x}_b-\bar{x}_{n'}))^2 \\
	&= \sum^b_j (x_j-\bar{x}_b)^2 + b\frac{n'^2}{n^2}(\bar{x}_{n'}-\bar{x}_b)^2 \\
	&= M_b + b\frac{n'^2}{n^2}\delta^2\\
	\text{Putting them together, } 
	M_{2,n} &= M_{2,n'} + \sum^b_j (x_j-\bar{x}_b)^2 + \frac{n'b(n'+b)}{n^2}(\bar{x}_{n'}-\bar{x}_b)^2 \\
	&= M_a + M_b + \frac{n'b(n'+b)}{n^2}\delta^2\\
	&= M_a + M_b + \frac{n'b}{n}\delta^2
\end{align*}
$$
where in the code, we define $$M_a=M_{2,n'}$$, $$M_b = b\sigma_b^2$$ for the corresponding value of the current batch.


# References
- [Wikipedia Algorithms for calculating variance](https://en.wikipedia.org/wiki/Algorithms_for_calculating_variance)
- [Welford’s method for computing variance by Joni](https://jonisalonen.com/2013/deriving-welfords-method-for-computing-variance/)
- [Accurately computing running variance by Cook](https://www.johndcook.com/blog/standard_deviation/)
- [Stable Baselines 3 running mean/std implementation](https://github.com/DLR-RM/stable-baselines3/blob/master/stable_baselines3/common/running_mean_std.py)