import { Code, Equation, InlineEquation } from "../../Utilities";


function ConfidenceIntervals() {
    return (
        <div>

          <h1 id="#" >Statistics: Confidence Intervals</h1>

          <div>
            Created at <i>27th January  2019</i>
          </div>
          <hr />

          <div id="introduction">
            <h2>Introduction</h2>
            <p>A confidence interval is statement about the expected value of a measurement of some variable generally expressed in the form,</p>

            <Equation tex={String.raw`x = \bar{x} \pm \epsilon`}/>

            <p>for a specified <b>confidence level</b> <InlineEquation tex={`C`}/>. Note there are three components in a confidence interval, a <b>lower bound</b>, an <b>upper bound</b> and a <b>confidence level</b>. The first two are obvious enough. The third is a specified value which corresponds to the probability that a measurement will fall within the lower and upper bounds. The higher the confidence level (i.e. the more strict the constraint) the smaller the corresponding upper and lower bounds will be, e.g.</p>

            <p>For a confidence level of 90% I expect 90% of measurements <InlineEquation tex='x' /> to lie between <InlineEquation tex='x_1' /> and <InlineEquation tex='x_2' />.<br />
              For a confidence level of 95% I expect 95% of measurements <InlineEquation tex='x' /> to lie between <InlineEquation tex='x_3' /> and <InlineEquation tex='x_4' />.</p>
            
          </div>

          <div id="when-distribution-parameters-are-known">
            <h2>When Distribution Parameters Are Known</h2>
            <p>The simplest case of a confidence interval is when we know exactly the <b>type of distribution</b> and <b>distribution parameters</b> of the specified variable. e.g. imagine you are in the business of producing cheese wheels and the cheese regulators have required that you label your cheese wheels with the mean weight and the confidence interval at a confidence level of 90%. You know from your data that the distribution of the weights of cheese wheels follows a Gaussian/Normal distribution with a mean of 10kg and standard deviation of 0.2kg. </p>


            <p>Now there are two ways to calculate the confidence interval using the information above, the old school and the new school. The old school way is to look up <a href="https://en.wikipedia.org/wiki/Standard_normal_table#Table_examples">gaussian tables</a> to find out how many standard deviations the lower/upper bounds would be for a 90% confidence interval, about 1.644 in case you're wondering. Using this you would subtract/add that many standard deviations <InlineEquation tex={String.raw`(1.644 \(\times\) 0.2)`} /> to the mean value to get your lower/upper bounds, (9.671, 10.329) in this case. </p>

            <Equation tex={String.raw`w = 10 \pm 0.329`}/>

            <p>The slightly newer way to do this is to use statistics libraries to calculate these for you, this approach has a few advantages such as being more dynamic so you can easily use non-standard confidence levels.</p>

            <Code text={`>>> import scipy.stats

>>> stats.norm.isf((1. - 0.9)/2, 0, 1)
>>> 1.6448536269514729`} />

            <p>Here Ive used the inverse survival function of the normal distribution together with a standard (mean of 0 and standard deviation of 1) to calculate the number of standard deviations from the mean the interval should be for a 90% confidence level. You can read more about this function <a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html">here</a>. Alternatively you can use the interval function as a shortcut,</p>

            <Code text={`>>> import scipy.stats

>>> scipy.stats.norm.interval(0.9, 10, 0.2)
>>> (9.671029274609705, 10.328970725390295)`} />
            
          </div>

          <div id="when-only-the-standard-deviation-is-known">
            <h2>When Only the Standard Deviation is Known</h2>
            <p>This is a common case when making measurements with some instrumenation as is often the case in physical sciences. Your scales, geiger counter or micrometer will typically have it's measurement error printed somewhere on its label. If you are making a single measurement you can simply report your measurement +- the measurement error <InlineEquation tex={String.raw`\times`} /> the number of standard deviations for your given confidence level as your confidence interval. If you are taking multiple measurements and averaging them then you would report the mean of your measurments and use the standard error of the mean rather than the error of the measurement. The standard error of the mean is calculated with (from the central limit theorem), </p>

            <Equation tex={String.raw`\sigma(\bar{x}) = \sigma / \sqrt{N}`}/>

            <p>where <InlineEquation tex={String.raw`\sigma(\bar{x})`} /> is the standard error on the mean, <InlineEquation tex={String.raw`\sigma`} /> is your measurment error and <InlineEquation tex={`N`} /> is the number of measurements made. Let's say you measure the weight of 10 cheese wheels with a scale that has an accuracy of 0.01 kg. The average weight is found to be 9.88kg, you would then report your result as,</p>

            <Equation tex={String.raw`9.88 \pm 0.0052`}/>  

            <p>at a 90% confidence level. At first glance it would appear that the cheese company is producing cheese wheels lighter than what they are reporting! However it is important to note that the error on this measurement relates only to the 10 cheese wheels you measured and does not take into account the inherent spread of cheese wheel weights that arises from the manufactoring process. It is a statement about your ability to accurately measure the weights of the cheese you have, not about the broader population of cheese wheels.</p>

            <Code text={`import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

m_claim = 10
m_true = 9.9
confidence_level = 0.9
instrument_std = 0.01
population_std = 0.2
N = 10
np.random.seed(1)

ms_measured = np.random.normal(m_true, population_std, N)
ms_measured_mean = ms_measured.mean()
std_error_instrument = instrument_std / np.sqrt(N)
error_at_90_cl = std_error_instrument * stats.norm.isf((1. - confidence_level)/2, 0, 1)

(ms_measured_mean, error_at_90_cl)

>>> (9.8805718218387817, 0.0052014838787555759)`}/>

          </div>

          <div id="when-the-standard-deviation-is-unknown">
            <h2>When the Standard Deviation is Unknown</h2>

            <p>In order to say something about whether the cheese company is cheating its customers or not we need to estimate what the inherent spread of chesse wheel weights is and see if our previous measurement falls within the natural population spread. I will make the assumption that the population spread is much larger than our instrument error, which we have seen above is very small.</p>

            <p>To make an estimate of the population spread we can simply calculate the standard deviation of our 10 cheese samples,</p>

            <Equation tex={String.raw`s = \sqrt{\frac{1}{N-1}(x - \bar{x})^2}`}/>

            <p>Since we are estimating the standard deviation there is also some error in the estimate. We can take one of two paths from here, if <InlineEquation tex={`N`} /> is large we can simply assume that the estimate of the population standard deviation is a good estimate and use it to calculate a confidence interval. If however we are not confident to make this assumption we will have to abandon confidence intervals and switch to a T test, I'll go through both approaches and compare.</p>

            <h3>Population Standard Deviation is a Good Estimate</h3>
            <p>First the naive assumption that our estimate of the population standard deviation is a good approximation, i.e. ignore its errors. For a standard deviation of 0.251, we calculate a standard error of 0.079 and get the following confidence interval,</p>

            <Equation tex={String.raw`9.88 \pm 0.131`} />

            <p>at a 90% confidence level. This is almost a good enough result to say that the cheese company is producing cheese wheels lighter than what they report (10kg).</p>

            <Code text={`%matplotlib inline
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

m_claim = 10
m_true = 9.9
confidence_level = 0.9
population_std = 0.2
N = 10
np.random.seed(1)

ms_measured = np.random.normal(m_true, population_std, N)
ms_measured_mean = ms_measured.mean()
ms_measured_std = ms_measured.std(ddof=1)
std_error_population = ms_measured_std / np.sqrt(N)

(ms_measured_mean, ms_measured_std, std_error_population)
e = stats.norm.isf((1. - confidence_level)/2, 0, 1) * std_error_population

print('{} +- {}'.format(ms_measured_mean, e))
>>> 9.880571821838782 +- 0.13059025351290435`} />

  <p>We can also express this result as a Z test,</p>

            <Code text={`fig, ax = plt.subplots()
ms = np.linspace(9.8, 10.2)
ax.plot(ms, stats.norm.pdf(ms, m_claim, std_error_population))
ms_ = np.linspace(9.8, ms_measured_mean, 100)
ax.fill_between(ms_, 0, stats.norm.pdf(ms_, m_claim, std_error_population))
ax.vlines(ms_measured_mean, 0, ax.get_ylim()[1], linestyle='--', color='indianred')
ax.set_xlim(9.8, 10.2)

print(1. - stats.norm.sf(ms_measured_mean, m_claim, std_error_population))
>>> 0.0662570423667`} />

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/confidence_intervals/z_test.png`} />


  <p>This means there is a 6.6% chance to measure an average weight of 9.88kg or less from a random sample of 10 cheese wheels. No we can declare a significant result, that the cheese company are producing cheese wheels less than the stated weight at a 10% significance level. Note I am using a one-sided test where as confidence intervals are inherently two-sided.</p>

  <h3>Population Standard Deviation is not a Good Estimate</h3>
  <p>In this case we use a t-test of the t statistic which follows the t distribution. The t distribution is similar to the Gaussian distribution but with broader tails, this accounts for the uncertainty in the population standard deviation. The shape of the t distribution also depends on the number of measurements made, when there are few measurements the tails are very broad, when there are many measurements the tails become more narrow and begin to resemble a Gaussian distribution.</p>

  <p>The t statistic here represents the difference between our measured value for the mean weight and that which is claimed by the cheese company. T tests are an important statistical test that will be covered in its own article.</p>

            <Code text={`fig, ax = plt.subplots()
t_measured = (ms_measured_mean - m_claim) / std_error_population
ts = np.linspace(-3, 3, 100)
ax.plot(ts, stats.t.pdf(ts, N, 0, 1))
ax.vlines(t_measured, 0, ax.get_ylim()[1], linestyle='--', color='indianred')
t_ = t = np.linspace(-3, t_measured, 100)
ax.fill_between(t_, 0, stats.t.pdf(t_, N, 0, 1));
print(1. - stats.t.sf(t_measured, N, 0, 1))
>>> 0.0817121319647`}/>

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/confidence_intervals/t_test.png`} />

  <p>Note the result is still significant at a 10% significance level but it is less significant than in the case of the z test. This makes sense since we've factored in the uncertainty from our estimate of the population standard deviation.</p>

          </div>          
          
        </div>
    );
}

export default ConfidenceIntervals;
