import { Code, Equation, InlineEquation } from '../../Utilities';

let content = (
    <div>
      <h1 className="title">Goodness of Fit</h1>
      <div>
        Published on <i>24th July  2019</i>
      </div>
      <hr />

      <div id="introduction">
        <h2>Introduction</h2>
        <p>Many statistical methods are based on assumptions of normality for a given variable, it is a very strong assumption often with its roots in the central limit theorem. This assumption can be tested with a test of <b>goodness of fit</b>. A common test is the <InlineEquation tex='\chi^2' /> test, in this article I show how it can be used to show your data is well modelled by a Normal distribution. However this test is very generic and can be used to show whether your data is consistant with <b>any</b> distribution you specify.</p>
      </div>

      <div id="goodness-of-fit">
        <h2>Goodness of Fit Test</h2>
        <p>The idea here is to first <b>bin</b> your data and then <b>fit</b> this data with a normal distribution using the least squares method. The relationship between the observed data and the modelled data have mathematical properties (the proof for this I will save for another day) that allows us to test how good of a fit we have. One of these properties is that the distribution of squared difference between the values of the model and the observed divided by the standard deviation of the sample follows a <InlineEquation tex='\chi^2' /> distribution.</p>

        <Equation tex={String.raw`\chi^2 = \sum_i^M \frac{(O_i - E_i)^2}{E_i}`} />

        <p>Where <InlineEquation tex='M' /> is the number of bins, <InlineEquation tex='O_i' /> is the observed number of entries in bin <InlineEquation tex='i' /> and <InlineEquation tex='E_i' /> is the expected number of entries in bin <InlineEquation tex='i' />. We can calculate the <InlineEquation tex='\chi^2' /> value for a given data sample for a specific binning scheme, we then use this <InlineEquation tex='\chi^2' /> to calculate the probability of measuring a <InlineEquation tex='\chi^2' /> value equal to or greater than that value through random sampling, i.e. a p-value. If this p-value is very small this can suggest that our data sample does not follow a normal distribution and that modelling it so could be a poor choice.</p>
      </div>

      <div id="example-good-model">
        <h2>Example: Good Model</h2>
        <p>I'll start off with generating some data that does actually come from a normal distribution, I'll fit to a normal distribution using the least squares method and then show the corresponding p-value for the <InlineEquation tex='\chi^2' /> value calculated is consitent with the null hypothesis - that the data sample is from a normal distribution.</p>

        <Code text={`import matplotlib.pyplot as plt
import numpy as np
import scipy.stats as stats

lb = -4.5 # lower bound	
ub = 4.5 # upper bound
M = 15 # number	of bins
mu = 0
N = 1000 # number of data points to generate
seed = 0
sigma = 1

# generate data
np.random.seed(seed)
x = np.random.normal(mu, sigma, N)

fig, ax = plt.subplots()
m, bin_edges, patches = ax.hist(x, bins=M, range=(lb, ub), alpha=0.2, label='generated data')

# calculate binning properties
bin_step = (ub - lb) / M
bin_edges = np.array([lb + i * bin_step for i in range(M + 1)])
bin_centers = np.array([(bin_edges[i] + bin_edges[i+1]) / 2 for i in range(len(bin_edges) - 1)])
bin_width = (ub - lb) / M

# parent distribution
x_parent = np.linspace(lb, ub, 100)
y_parent = N * bin_width * stats.norm.pdf(x_parent, mu, sigma)
ax.plot(x_parent, y_parent, label='parent');
ax.legend()`} />

        <p>creates the following plot,</p>
        <img src={`${process.env.PUBLIC_URL}/articles/data_science/goodness_of_fit/fig1.png`} />
        <p>The generated data looks similar to the parent distribution as you would expect. The next step is to fit a normal distribution to the binned distribution using the least squares method. Scipy has a <a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.least_squares.html" target="_t">function</a> to do this in their <code>optimize</code> module.</p>

        <p>This function takes two main arguments, first a function that calculates the residuals between the observed data and expected data, and second, an array of paramters to fit (in this case the mean and standard deviation of our normal distribution).  </p>

        <Code text={`from scipy.optimize import least_squares	

params = np.array([mu, sigma])

def f(params):
    expected = stats.norm.pdf(bin_centers, *params)
    obs = m / N / bin_width
    residual = expected - obs
    return residual

fit = least_squares(f, params)

fig, ax = plt.subplots()
m, bin_edges, patches = ax.hist(x, bins=M, range=(lb, ub), alpha=0.2)
ax.scatter(bin_centers, N * bin_width * stats.norm.pdf(bin_centers, fit.x[0], fit.x[1]), color='red');
ax.set_ylim(0)`} />

        <p>This produces the following plot,</p>

        <img src={`${process.env.PUBLIC_URL}/articles/data_science/goodness_of_fit/fig2.png`} />

        <p>We can see the fitted parameters of our model like so,</p>

        <Code text={`	print(fit.x)
	>>> array([-0.06664296,  1.00128812])`} />

        <p>Which is not too far from the true parent distribution values. Now we need to calculate the <InlineEquation tex='\chi^2' /> value from our observed data and expected data from our model. </p>

        <Code text={`observed = m
expected = N * bin_width * stats.norm.pdf(bin_centers, fit.x[0], fit.x[1])

print(np.power(observed - expected, 2) / expected)
>>> array([ 0.04766053,  0.47257847,  0.16185741,  0.20989907,  0.03807767,
    0.63980993,  1.02217608,  0.30493503,  0.01229631,  0.02379066,
    0.02118276,  3.67365815,  0.65138612,  0.2928347 ,  0.02726877])

chi2 = (np.power(observed - expected, 2) / expected).sum()
print(chi2)
>>> 7.5994116690982345`} />

        <p>We can visualise what this value looks like on the <InlineEquation tex='\chi^2' /> distribution,</p>

        <Code text={`fig, ax = plt.subplots()
x = np.linspace(0, 100)
y = stats.chi2.pdf(x, M-2)
ax.plot(x, y)
ax.set_ylim(0)
ax.vlines(chi2, *ax.get_ylim(), linestyle='--', color='red')
ax.fill_between(np.linspace(chi2, 100), 0, stats.chi2.pdf(np.linspace(chi2, 100), M-2), alpha=0.2)`} />

        <img src={`${process.env.PUBLIC_URL}/articles/data_science/goodness_of_fit/fig3.png`} />

        <p>Note that the number of degrees of freedom in this case is the number of bins minus the number of free parameters in our model, 15 - 2 = 13, in this case (our free parameters being the mean and the standard deviation).</p>

        <p>The corresponding p-value for our <InlineEquation tex='\chi^2' /> measurement is,</p>

        <Code text={`print(stats.chi2.sf(chi2, M - 2))
>>> 0.86868383902904933`}/>

        <p>Which is a pretty large p-value, this means that our generated data is likely consistent with being from a normal distribution (which actually we are sure of since we generated it ourselves).</p>
      </div>      

      <div id="example-poor-model">
        <h2>Example - Poor Model</h2>
        <p>This example tries to fit a normal distribution model to data which is sampled from a uniform distribution.</p>

        <Code text={`import matplotlib.pyplot as plt
import numpy as np
import scipy.stats as stats	

lb = -4.5
ub = 4.5
M = 15
mu = 0
N = 1000
seed = 0
sigma = 1

bin_step = (ub - lb) / M
bin_edges = np.array([lb + i * bin_step for i in range(M + 1)])
bin_centers = np.array([(bin_edges[i] + bin_edges[i+1]) / 2 for i in range(len(bin_edges) - 1)])
bin_width = (ub - lb) / M
np.random.seed(seed)
# x = np.random.normal(mu, sigma, N)
x = np.random.uniform(lb, ub, N)

fig, ax = plt.subplots()
m, bin_edges, patches = ax.hist(x, bins=M, range=(lb, ub), alpha=0.2)
x_ = np.linspace(lb, ub, 100)
y_ = N * bin_width * stats.norm.pdf(x_, mu, sigma)
ax.plot(x_, y_);`} />

        <p></p>

        <img src={`${process.env.PUBLIC_URL}/articles/data_science/goodness_of_fit/fig4.png`} />
        <p>Our best fitting model looks like this,</p>
        <img src={`${process.env.PUBLIC_URL}/articles/data_science/goodness_of_fit/fig5.png`} />
        <p>With the following parameters,</p>

        <Code text={`print(fit.x)
>>> array([-0.20080617,  3.45925079])`} />

        <p>The <InlineEquation tex='\chi^2' /> distribution looks like this,</p>
        
        <img src={`${process.env.PUBLIC_URL}/articles/data_science/goodness_of_fit/fig6.png`} />

        <p>With a <InlineEquation tex='\chi^2' /> value of,</p>

        <Code text={`chi2 = (np.power(observed - expected, 2) / expected).sum()
print(chi2)
>>> 161.41501365150958`} />

        <p>and p-value of,</p>
        <Code text={`print(stats.chi2.sf(chi2, M - 2))
>>> 1.0191180135957041e-27`} />

        <p>A very low p-value! Suggesting our model of a Normal distribution is not consistent with our data.</p>
      </div>

      <div id="example-fitting-with-a-uniform-distribution">
        <h2>Example: Fitting with a Uniform Distribution</h2>
        <p>The <InlineEquation tex='\chi^2' /> test is a very generic test which can be used to show whether any specified model is consistent with the data observed. Let's take the previous case and try and fit it with a uniform distribution, now we expect this to fit very well and hence we should see a high p-value for our <InlineEquation tex='\chi^2' /> test.</p>

        <Code text={`import matplotlib.pyplot as plt
import numpy as np
import scipy.stats as stats	

lb = -4.5
ub = 4.5
M = 15
mu = 0
N = 1000
seed = 0
sigma = 1

bin_step = (ub - lb) / M
bin_edges = np.array([lb + i * bin_step for i in range(M + 1)])
bin_centers = np.array([(bin_edges[i] + bin_edges[i+1]) / 2 for i in range(len(bin_edges) - 1)])
bin_width = (ub - lb) / M
np.random.seed(seed)
# x = np.random.normal(mu, sigma, N)
x = np.random.uniform(lb, ub, N)

fig, ax = plt.subplots()
m, bin_edges, patches = ax.hist(x, bins=M, range=(lb, ub), alpha=0.2)
x_ = np.linspace(lb, ub, 100)
y_ = N * bin_width * stats.uniform.pdf(x_, lb, ub - lb)
ax.plot(x_, y_);`} />

        <p>Note that the <code>stats.uniform.pdf(x_, lb, ub - lb)</code> function takes the upper bound - lower bound instead of just the upper bound as its second parameter, an interesting quirk of that function, see <a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.uniform.html" target="_t">here</a> for more detail. The resultant plot looks like this, </p>

        <img src={`${process.env.PUBLIC_URL}/articles/data_science/goodness_of_fit/fig7.png`} />

        <p>and our best fit model looks like this,</p>

        <Code text={`from scipy.optimize import least_squares

params = np.array([lb, ub])

def f(params):
    params = [params[0], params[1] - params[0]]
    expected = stats.uniform.pdf(bin_centers, *params)
    obs = m / N / bin_width
    residual = expected - obs
    return residual

fit = least_squares(f, params)

fig, ax = plt.subplots()
m, bin_edges, patches = ax.hist(x, bins=M, range=(lb, ub), alpha=0.2)
ax.scatter(bin_centers, N * bin_width * stats.uniform.pdf(bin_centers, fit.x[0], fit.x[1] - fit.x[0]), color='red');
ax.set_ylim(0)`} />

        <img src={`${process.env.PUBLIC_URL}/articles/data_science/goodness_of_fit/fig8.png`} />

        <p>The \(\chi^2\) distribution looks like this.</p>

        <img src={`${process.env.PUBLIC_URL}/articles/data_science/goodness_of_fit/fig9.png`} />

        <p>With a <InlineEquation tex='\chi^2' /> value of,</p>

        <Code text={`chi2 = (np.power(observed - expected, 2) / expected).sum()
print(chi2)
>>> 14.99`} />

        <p>and p-value of,</p>
        <Code text={`print(stats.chi2.sf(chi2, M - 2))
>>> 0.3079774699860125`} />

        <p>A fairly high p-value as we expected, suggesting our data is consitent with being a sample from a uniform distribution. Here we can see that our <InlineEquation tex='\chi^2' /> test can work with not just a normal distribution model.</p>
        
      </div>

      <div id="further-reading">
        <h2>Further Reading</h2>
        <ul>
          <li><a href="https://en.wikipedia.org/wiki/Goodness_of_fit">Wikipedia: Goodness of Fit</a></li>
        </ul>
      </div>
      
    </div>
);

function GoodnessOfFit() {
    return content;
}

export default GoodnessOfFit;
