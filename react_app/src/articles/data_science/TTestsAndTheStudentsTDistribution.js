import { Code, Equation, InlineEquation } from "../../Utilities";


let content = (
    <div>

<h1 class="title">T tests and the Students T distribution</h1>

<div>
  Published on <i>1st August 2019</i>
</div>
<hr />

<div id="introduction">
  <h2>Introduction</h2>
  <p>T tests are commonly used in the gaming industry when performing AB tests on a product. They are a powerful tool for making data driven decisions and extracting business insight from your data. It is named after the chemist William Gosset who wrote about t testing under his pen name "Student".</p>

  <p>T tests are generally used when you cannot use a z-test because the standard deviation of the variable is unknown and is instead estimated from a data sample. This most commonly occurs when you have calculated the mean of some data sample.</p>
</div>

<div id="single-sample-tests">
  <h2>Single sample test</h2>
  <p>Imagine you have some data <InlineEquation tex={`x`} /> drawn from a population with mean <InlineEquation tex={`\mu`} /> and standard deviation <InlineEquation tex={`\sigma`} />. From this you calculate the mean <InlineEquation tex={`\bar{x}`} /> and standard deviation <InlineEquation tex={`s`} />, <b>note</b> <InlineEquation tex={`\bar{x}`} /> and <InlineEquation tex={`s`} /> are estimates of the population parameters <InlineEquation tex={`\mu`} /> and <InlineEquation tex={`\sigma`} />. You want to know whether the value you calculated is consistent with your null hypothesis, e.g. that the population mean is 0.5. Provided your data sample is large enough you can apply Central Limit theorem and make the statement that the variable <InlineEquation tex={`\bar{x}`} /> follows a Normal distribution with mean <InlineEquation tex={`\mu`} /> and standard deviation of <InlineEquation tex={`\sigma/\sqrt{N}`} />.</p>

  <p>From here you would create your test statistic,</p>

  <Equation tex={String.raw`z = \frac{\bar{x} - 0.5}{\sigma / \sqrt{N}} `} />

  <p>And calculate a p-value from the integration tables for a Standard Normal distribution. Here's how that process might look in code.</p>

<Code text={`import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

lb = 0
ub = 1
N = 10
seed = 0

mu = (lb + ub) / 2
sigma = (ub - lb) / np.sqrt(12)
np.random.seed(seed)

x = np.random.uniform(lb, ub, N)
x_bar = x.mean()
s = x.std(ddof=1)
z = (x_bar - 0.5) / (sigma / np.sqrt(N))

fig, ax = plt.subplots(figsize=(15, 5))
x_norm = np.linspace(-4, 4, 100)
y_norm = stats.norm.pdf(x_norm, 0, 1)
ax.plot(x_norm, y_norm, label="Normal distribution")
y_lower, y_upper = ax.get_ylim()

# doing a two sided test
ax.vlines(z, y_lower, y_upper, linestyle='--', color='red', label='z');
ax.vlines(-1 * z, y_lower, y_upper, linestyle='--', color='red');
x_fill_left = np.linspace(-4, -1 * abs(z), 100)
x_fill_right = np.linspace(abs(z), 4, 100)
ax.fill_between(x_fill_left, stats.norm.pdf(x_fill_left, 0, 1))
ax.fill_between(x_fill_right, stats.norm.pdf(x_fill_right, 0, 1), color='#1f77b4')
p_value = 2 * stats.norm.sf(abs(z), 0, 1)
ax.legend()
print('z: {}'.format(z))
print('p_value: {}'.format(p_value))

>>> z: 1.2681560953981774
>>> p_value: 0.20474221240318824`} />

    <img src={`${process.env.PUBLIC_URL}/articles/data_science/t_tests_and_the_students_t_distribution/fig4.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '700px', paddingBottom: '1em'}} />

  <p>In the case of t tests we do not know what the value of <InlineEquation tex={`\sigma`} /> is and the best we can do is use the estimate <InlineEquation tex={`s`} /> instead, we would create the following statistic (where we have substituted <InlineEquation tex={`\sigma`} /> with <InlineEquation tex={`s`} />).</p>

  <Equation tex={String.raw`t = \frac{\bar{x} - 0.5}{s / \sqrt{N}}`} />

  <p>Instead of using the <b>Standard Normal</b> distribution to calculate the p-value we now use the <b>t</b> distribution with mean of 0 and <InlineEquation tex={`N - 1`} /> degrees of freedom.</p>
  <p>Our code would now look something like this.</p>

<Code text={`import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

lb = 0
ub = 1
N = 10
seed = 0

mu = (lb + ub) / 2
sigma = (ub - lb) / np.sqrt(12)
np.random.seed(seed)

x = np.random.uniform(lb, ub, N)
x_bar = x.mean()
s = x.std(ddof=1)
t = (x_bar - 0.5) / (s / np.sqrt(N))

fig, ax = plt.subplots(figsize=(15, 5))
x_t = np.linspace(-4, 4, 100)
y_t = stats.t.pdf(x_norm, N-1, 0)
ax.plot(x_t, y_t, label="T distribution")
y_lower, y_upper = ax.get_ylim()

# doing a two sided test
ax.vlines(t, y_lower, y_upper, linestyle='--', color='#1f77b4', label='t');
ax.vlines(-1 * t, y_lower, y_upper, linestyle='--', color='#1f77b4');
x_fill_left = np.linspace(-4, -1 * abs(t), 100)
x_fill_right = np.linspace(abs(t), 4, 100)
ax.fill_between(x_fill_left, stats.t.pdf(x_fill_left, N-1, 0))
ax.fill_between(x_fill_right, stats.t.pdf(x_fill_right, N-1, 0), color='#1f77b4')
p_value = 2 * stats.t.sf(abs(t), N-1, 0)
ax.legend()

print('sigma: {}'.format(sigma))
print('s: {}'.format(s))
print('t: {}'.format(t))
print('p_value: {}'.format(p_value))

>>> sigma: 0.2886751345948129
>>> s: 0.19445361253714097
>>> t: 1.8826347669749688
>>> p_value: 0.0924168341419907`} />

  <img src={`${process.env.PUBLIC_URL}/articles/data_science/t_tests_and_the_students_t_distribution/fig5.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', maxWidth: '700px', paddingBottom: '1em'}} />

  <p>In the above example the p-value for the t-test is smaller than for the z-test. In general this is not the case as the t distribution is broader in the tails as we shall see later. However in the above case the estimated standard deviation is under the true standard deviation leading to the lower p-value. However in general the estimated standard deviation should have an equal probability of being over or under estimated (since it is an unbiased estimator).</p>

</div>

<div id="two-sample-tests">
  <h2>Two sample tests</h2>
  <p>Single sample tests are used when you a priori know the value you want to test against. For example if you wanted to test where a coin was fair you would test that the ratio of heads to tails is consistent with the value 0.5. In two sample tests you are often more concerned with which group performs better. For example in a medical drug trial you might have two groups, control and test, and you would want to see which group performs better out of the two. To do this you would start with the hypothesis that both groups will perform the same and then show whether your data is consistent or inconsistent with that hypothesis.</p>

  <p>There are two main cases of two sample t tests to consider,</p>

  <div id="the-population-variances-of-the-two-samples-are-the-same">
    <h3>The population variances of the two samples are the same</h3>
    <p>In the case of the medical drug trial, this is like saying "even though we may expect some improvement in the test group we do not expect the variance to change", i.e. we expect only the mean to change. In this case our statistic becomes,</p>

    <Equation tex={String.raw`t = \frac{\overline{x_1} - \overline{x_2}}{\sqrt{(\frac{1}{N_1} + \frac{1}{N_2})\frac{(N_1 - 1)s_1^2 + (N_2 - 1)s_2^2}{N_1 + N_2 - 2}}}`} />

    <p>Where the denominator, called the standard error of the difference between means is analagous to the standard error of the mean and is a pooled error from both samples. The degrees of freedom in this case is,</p>

    <Equation tex={String.raw`dof = N_1 + N_2 - 2`} />

    <p>Next as before we'll write some code to generate data and calculate p-values, however at this point I'll introduce the <code>ttest_ind</code> function from the <code>scipy.stats</code> package which contains much of this logic.</p>

<Code text={`import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

mu_1 = 1
sigma_1 = 1
N_1 = 100

mu_2 = 1.3
sigma_2 = 1
N_2 = 100

seed = 0
np.random.seed(seed)

x_1 = np.random.normal(mu_1, sigma_1, N_1)
x_2 = np.random.normal(mu_2, sigma_2, N_2)

result_1 = stats.ttest_ind(x_1, x_2)
# equivalent to doing
result_2 = stats.ttest_ind_from_stats(x_1.mean(), x_1.std(ddof=1), len(x_1), x_2.mean(), x_2.std(ddof=1), len(x_2))

print(result_1)
print(result_2)

>>> Ttest_indResult(statistic=-2.2194989160441483, pvalue=0.027587765912706015)
>>> Ttest_indResult(statistic=-2.2194989160441483, pvalue=0.027587765912706015)`} />

    <p>The <code>stats.ttest_ind</code> returns results for a two-sided t test by default. For a single sided test simply divide the p-value by two.</p>
  </div>

  <div id="the-population-variances-of-the-two-samples-are-not-the-same">
    <h2>The population variances of the two samples are not the same</h2>
    <p>In this case our test statistic is given by,</p>

    <Equation tex={String.raw`t = \frac{\overline{x_1} - \overline{x_2}}{\sqrt{\frac{s_1^2}{N_1} + \frac{s_2^2}{N_2}}}`} />

    <p>and the corresponding degree of freedoms is given by,</p>

    <Equation tex={String.raw`dof = \frac{\left(\frac{s_1^2}{N_1} + \frac{s_2^2}{N_2}\right)^2}{\frac{(s_1^2/N_1)^2}{N_1 - 1} + \frac{(s_2^2/N_2)^2}{N_2 - 1}} `} />
  </div>

  <p>Implementing this is our code is relatively easy, we just need to add the <code>equal_var=False</code> flag to our <code>ttest_ind</code>.</p>

<Code text={`import numpy as np
from scipy import stats

mu_1 = 1
sigma_1 = 1
N_1 = 100

mu_2 = 1.3
sigma_2 = 1
N_2 = 100

seed = 0
np.random.seed(seed)

x_1 = np.random.normal(mu_1, sigma_1, N_1)
x_2 = np.random.normal(mu_2, sigma_2, N_2)

result_1 = stats.ttest_ind(x_1, x_2, equal_var=False)
result_2 = stats.ttest_ind_from_stats(x_1.mean(), x_1.std(ddof=1), len(x_1), x_2.mean(), x_2.std(ddof=1), len(x_2), equal_var=False)

print(result_1)
print(result_2)

>>> Ttest_indResult(statistic=-2.2194989160441483, pvalue=0.02758855064414296)
>>> Ttest_indResult(statistic=-2.2194989160441483, pvalue=0.027588550644142947)`} />
  
</div>
  

<div id="further-reading">
  <h2>Further Reading</h2>
  <ul>
    <li><a href="https://en.wikipedia.org/wiki/Student%27s_t-test">Wikipedia: t tests</a></li>
    <li><a href="https://en.wikipedia.org/wiki/Student%27s_t-distribution">Wikipedia: Student's t distribution</a></li>
  </ul>
</div>

    </div>
);

function TTestsAndTheStudentsTDistribution() {
    return content;
}

export default TTestsAndTheStudentsTDistribution;
