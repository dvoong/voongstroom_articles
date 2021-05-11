import { Code, Equation, InlineEquation } from "../../Utilities";


let content = (
    <div>

      <h1 className="title">F tests: Comparing the variances of multiple samples</h1>

      <div>
        Published on <i>30th July 2019</i>
      </div>
      <hr/>


<div id="introduction">
  <h2>Introduction</h2>
  <p>Checking whether the variance of two populations is the same is a common task especially when performing analysis of variance (ANOVA). To do this we can use an <InlineEquation tex={String.raw`F`} /> test which looks at the ratio of the estimated variance for the two populations.</p>

  <Equation tex={String.raw`F = \frac{\hat{V_1}}{\hat{V_2}}`} />

  <p>where <InlineEquation tex={String.raw`F`} /> is our test statistic, <InlineEquation tex={String.raw`\hat{V_1}`} /> is the estimated variance of the first data sample and <InlineEquation tex={String.raw`\hat{V_2}`} /> is the estimated variance of the second sample. In the case where the population mean is unknown the unbias estimator (known as the Bessel corrected estimator) for the variance of a data sample is given by,</p>

  <Equation tex={String.raw`\hat{V}(x) = \frac{1}{N-1}\sum(x_i-\hat{x})^2`} />

  <p>The ratio of variances can be expressed as a ratio of variables following a <InlineEquation tex={String.raw`\chi^2`} /> distribution with degrees of freedom <InlineEquation tex={String.raw`f_1 = N_1 - 1`} /> and <InlineEquation tex={String.raw`f_2 = N_2 - 1`} />. The resulting probability density function is given by,</p>

  <Equation tex={String.raw`P(F) = \frac{\Gamma((f_1 + f_2)/2)}{\Gamma(f_1/2)\Gamma(f_2/2)}\sqrt{f^{f_1}_{1} f^{f_2}_{2}}\frac{F^{(f_1/2) - 1}}{(f_2 + f_1F)^{(f_1 + f_2)/2}}`} />

  <p>Where <InlineEquation tex={String.raw`Gamma`} /> is the Gamma <a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.gamma.html">probability density function</a>. A pretty intimidating equation but as with other tests our aim is to calculate our statistic and then calculate the probability to measure a statistic equal or more extreme from our probability distribution.</p>

  <p>Which way round the ratio is formed is not important but the convention is to put the larger variance on top</p>

</div>

<div id="example">
  <h2>Example</h2>
  <p>First we need to generate two sets of data, from two different populations.</p>
<Code text={`import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from scipy import stats

mean_1 = 0
mean_2 = 0
sigma_1 = 2
sigma_2 = 2
N_1 = 100
N_2 = 50
seed_1 = 0
seed_2 = 1

np.random.seed(seed_1)
x_1 = np.random.normal(mean_1, sigma_1, N_1)
np.random.seed(seed_2)
x_2 = np.random.normal(mean_2, sigma_2, N_2)`} />

  <p>We can plot the distribution, which looks like this.</p>

<Code text={`lb = -4
ub = 4
n_bins = 10

fig, ax = plt.subplots(figsize=(15, 5))
ax.hist(x_1, range=(lb, ub), bins=n_bins, alpha=0.5)
ax.hist(x_2, range=(lb, ub), bins=n_bins, alpha=0.5);`} />

    <img src={`${process.env.PUBLIC_URL}/articles/data_science/f_tests_how_to_compare_the_variances_of_multple_samples/fig1.png`} style={{width: '100%', marginLeft: 'auto', marginRight: 'auto', maxWidth: '500px', display: 'block'}} />    

  <p>With variances,</p>

<Code text={`var_1 = x_1.var(ddof=1)
var_2 = x_2.var(ddof=1)

print('var_1: {}\nvar_2: {}'.format(var_1, var_2))
>>> var_1: 4.1043499766259846
var_2: 3.837156643376621`} />

  <p>The order in which you calculate the ratio of variances will not have any effect on the resultant p-value of the test as long as you maintain the same order for the degrees of freedom. However it is convention to have the higher variance as the numerator so that the <InlineEquation tex={String.raw`F`} /> statistic is greater or equal to 1.</p>

<Code text={`if var_1 > var_2:
  f = var_1 / var_2
  N_num = N_1
  N_denom = N_2
else:
  f = var_2 / var_1
  N_num = N_2
  N_denom = N_1
print('F: {}'.format(f))
>>> F: 1.0696331575909392`} />

  <p>We then calculate the corresponding p-value,</p>

<Code text={`p_value = stats.f.sf(f, N_num - 1, N_denom - 1)
print('p-value: {}'.format(p_value))
>>> p-value: 0.40415070060225367`} />

  <p>Suggesting the hypothesis that both variances from both populations are the same (which is true for give specified parameters above). The corresponding probability distribution looks like,</p>

<Code text={`x = np.linspace(0.01, 10, 100)
y = stats.f.pdf(x, N_num - 1, N_denom - 1)
fig, ax = plt.subplots(figsize=(15, 5))
ax.plot(x, y)
ax.vlines(f, ax.get_ylim()[0], ax.get_ylim()[1], color='red', linestyle='--')
x = np.linspace(f, 10, 100)
y = stats.f.pdf(x, N_num - 1, N_denom - 1)
ax.fill_between(x, y)
ax.set_xlim(0, 10);`} />

    <img src={`${process.env.PUBLIC_URL}/articles/data_science/f_tests_how_to_compare_the_variances_of_multple_samples/fig2.png`} style={{width: '100%', marginLeft: 'auto', marginRight: 'auto', maxWidth: '500px', display: 'block'}} />

  <p>Try changing <code>sigma_2</code> in the code above to see how the value of the F-test varies when the variances are not equal, you should find that the p-value are in general much smaller than above.</p>
</div>

<div id="further-reading">
  <h2>Further Reading</h2>
  <ul>
    <li><a href="https://en.wikipedia.org/wiki/F-test">Wikipedia: F-test</a></li>
  </ul>
</div>
      
      
    </div>
);

function FTestsComparingTheVariancesOfMultipleSamples() {
    return content;
}

export default FTestsComparingTheVariancesOfMultipleSamples;
