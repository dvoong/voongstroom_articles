import { MathComponent } from "mathjax-react";
import { CopyBlock } from "react-code-blocks";


function InlineEquation({tex}) {
    return <MathComponent display={false} tex={tex} />;
}

function Equation({tex}) {
    return <MathComponent tex={tex} />;
}

function Code({text, language='python'}) {
    return <CopyBlock text={text} theme='dracula' language={language} />;
}

function ArimaTimeSeriesModelling() {
    return (
        <div>
          <h1>ARIMA time series modelling</h1>
          <div>
            Created at <i>27th November 2018</i>
          </div>
          <hr />
          <h2>What is ARIMA?</h2>
          <p>ARIMA (Autoregressive differencing moving average) is the name given to a family of used to predict the value of future elements in a sequence (in general a time series). In the real world they are generally used in business, e.g. a company selling cheese may want to estimate how much they will sell next summer in order to plan appropriately.</p>

          <p>To explain the theory behind how these models work it is easier to talk about the sub-families of models within the world of ARIMA. These are,</p>
          <ul>
            <li>Autoregressive models: this corresponds to the AR in ARIMA </li>
            <li>Differencing models: this corresponds to the I in ARIMA </li>
            <li>Moving Average models: this corresponds to the MA in ARIMA </li>
          </ul>

          <p>Let's look a little deeper into each of these.</p>

          <div id="autoregressive-models">
            <h3>Autoregressive models</h3>
            <ul>
              <li>Auto - <span style={{fontFamily: 'times new roman'}}><i>meaning self</i></span></li>
              <li>Regressive - <span style={{fontFamily: 'times'}}><i>meaning related to or explained by.</i></span></li>
            </ul>
            
            <p>Autoregressive models describe variables whose current value can be described by its previous value or values. Each previous value is attributed a weight which which relates to how much that previous value contributes to the current value, in general values further back in the series will contribute less than more recent values. In addition to this is a stochastic error term which corresponds to some inherent uncertainty in the process. Mathematically it is expressed as.</p>

            <MathComponent tex={String.raw`y_t = c + \sum_{i=1}^{n} \phi_i y_{t-i} + \epsilon_t`} />

            <p> where {<MathComponent display={false} tex={`y_t`} />} is our variable of interest at time {<MathComponent display={false} tex='t'/>}, {<MathComponent display={false} tex='c'/>} is a constant which is a parameter determined by fitting, {<MathComponent display={false} tex='\phi_i'/>} is the weight for the value of {<MathComponent display={false} tex='y'/>} at time {<MathComponent display={false} tex={'t - i'}/>}, {<MathComponent display={false} tex='n'/>} is the number of time steps to include (this is called the order of the model) and {<MathComponent display={false} tex='\epsilon'/>} is the stochastic error term, normally modelled as following a normal distribution with mean of 0. </p>

            <p>Programatically we can represent an autoregressive process like this,</p>

            {<CopyBlock text={`import datetime
import matplotlib.pyplot as plt, numpy as np, pandas as pd

order = 2
weights = [0.7, 0.2]
start = datetime.date(2018, 1, 1)
end = datetime.date(2018, 12, 31)
c = 1
e_mean = 0
e_std = 1
seed = 0

np.random.seed(seed)
y_values = list(np.random.normal(c + e_mean, e_std, order)) # inital y_values
dates = pd.date_range(start, end)
n = len(dates)
errors = np.random.normal(e_mean, e_std, len(dates))

for i in range(n):
    offset = i + order
    y_values.append(c + (np.array(weights) * np.array(y_values[offset-order:offset][::-1])).sum() + errors[i])

df = pd.DataFrame(y_values[order:], index=pd.Index(dates, name='date'), columns=['y'])
display(df.head())

fig, ax = plt.subplots(figsize=(15, 4))
ax.plot(df)`} language='python' theme='dracula'/>}

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/example_arima_process.png`} style={{width: '100%'}}/>
            
          </div>


          <div id="stationary-vs-non-stationary-timeseries">
            <h3>Stationary vs Non-stationary Timeseries</h3>
            <p>A stationary process is one that has a constant mean and variance as a function of time, whilst a non-stationary process does not. The previous example is an example of a stationary process, you can see the mean is fairly constant as well as the variance.</p>
            <p>If you experimented with the autoregressive model generator a little you may have noticed that sometimes the time-series may end up diverging to infinity. For example set the order to 1 and the weight to 1.01 and generate some data and you will see this divergence, this is an example of a non-stationary process.</p>
            <p>This change in behaviour occurs at a weight of one because at this point the roots of the equation are greater to or equal to 1. This is a bit of a fancy way of saying that the compound effect of the previous values are growing indefinitely leading to the exploding effect.</p>
            <p>Why is this important? According to several sources many statistical procedures assume the data to be stationary. I didn't dive deep into how these fitting algorithms work but my intuition would be that the fitting procedure assumes the variable is a random variable (i.e. stationary), hence governed by the central limit theorem and therefore more mathematically tractable when minimising its loss function.</p>
            <p>In general, non-stationarity manifests itself in the form of a trend (linear, exponential, etc) or seasonal behaviour, in the next section we'll have a look at a popular method for transforming non-stationary processes into stationary ones.</p>
          </div>

          <div id="differencing-section">
            <h3>Differencing</h3>
            <p>Differencing is a technique used to transform non-stationary time-series into stationary ones. Typically you would then model the differenced time-series, make predictions and then undo the transformation back into the original variable. To difference a time-series you simply subtract the previous observed value from the data points.</p>

            <p>Let's look at a practical example of how differencing works, first we'll start off by creating a time-series with a linearly growing trend.</p>

            {<CopyBlock text={`m = 1.2 # y grows by 20% each day
dates = pd.date_range(datetime.date(2018, 1, 1), datetime.date(2018, 12, 31))

x = np.arange(len(dates))
np.random.seed(0)
errors = np.random.normal(0, 10, len(dates))
y = m * x + errors

fig, ax = plt.subplots(figsize=(15, 5))
ax.plot(dates, y)
`} theme='dracula' language='python'/>}

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/example_linearly_growing_time_series.png`}
                 style={{width: "100%"}} />

            <p style={{marginTop: "1em"}}>apply differencing using the <code>shift</code> method gives,</p>

            {<CopyBlock text={`df['y_shift'] = df['y'].shift(1)
df['y_differenced'] = df['y'] - df['y_shift']
fig, ax = plt.subplots(figsize=(15, 4))
ax.plot(df['y_differenced'])`} theme='dracula' language='python'/>}

            <br/>
            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/difference_time_series.png`} style={{width: "100%"}} />
            <p style={{marginTop: "1em"}}>with the following dataframe,</p>
            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/difference_time_series_df.png`}
                 style={{display: "block", marginLeft: "auto", marginRight: "auto"}} />
            <p style={{marginTop: "1em"}}>as you can see the differencing appears to have done a fairly good job of removing the trend. If the data is still non-stationary after differencing, you can difference it again - this is what is called a second order difference.</p>
          </div>

          <div id="moving-average-models">
            <h3>Moving Average Model</h3>
            <p>The Moving Average Model is another time-series model similar to the autoregressive model but instead of being dependent on its previous values (minus the stochastic error term), the variable is dependent on its previous <b>error</b> terms and its mean value {<MathComponent display={false} tex='\mu'/>}.</p>

            <MathComponent tex={String.raw`y_t = \mu + \epsilon_t + \sum_{i=1}^{n} \phi_{i} \epsilon_{t-i}`} />
            
            <p>Note, the moving average model should not be confused with taking the running/rolling average of a time-series variable over a window of {<MathComponent display={false} tex='\n'/>} observations. Which annoyingly can also be refered to as the moving average.</p>
            <p>Again we'll create an example by generating some data corresponding to this model,</p>

            {<CopyBlock text={String.raw`import datetime
import matplotlib.pyplot as plt, numpy as np, pandas as pd

order = 1
weights = [0.5]
start = datetime.date(2018, 1, 1)
end = datetime.date(2018, 12, 31)
y_mean = 1
seed = 0
e_mean = 0
e_std = 1

np.random.seed(seed)
dates = pd.date_range(start, end)
n = len(dates)

errors = np.random.normal(e_mean, e_std, len(dates) + order)
y_values = []
for i in range(n):
    offset = i + order
    y = y_mean + (np.array(weights) * np.array(errors[offset - order:offset][::-1])).sum()
    y_values.append(y)

df = pd.DataFrame(y_values, index=pd.Index(dates, name='date'), columns=['y'])
display(df.head())

fig, ax = plt.subplots(figsize=(15, 4))
ax.plot(df)
`} theme='dracula' language='python'/>}

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/example_moving_average.png`} style={{width: "100%"}} />
            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/example_moving_average_dataframe.png`} style={{display: "block", marginLeft: "auto", marginRight: "auto"}} />
          </div>

          <p>One feature of Moving Average Models is that they do not exhibit non-stationary behaviour, since the time-series depends only on previous errors which are random variables, i.e. they do not have the same mechanism for recursing on itself the same way Autoregressive models do.</p>

          <div id="fitting-time-series-with-python">
            <h2>Fitting Time-series with Python</h2>
            <p>In this section I'll be fitting the generated time-series' from the previous sections, since we <i>know</i> the parameters used to generate the data we'll cross check that we can recover those parameters to establish our code is doing what we what we expect. The following python packages will be used.</p>
            
            <ul>
              <li><code>numpy</code>: a library used for manipulation of numerical arrays (i.e. the data)</li>
              <li><code>pandas</code>: a library used for representing data in dataframes (also additional data manipulation functions)</li>
              <li><code>matplotlib</code>: data visualisation library</li>
              <li><code>statsmodels</code>: a statistical package with a time-series analysis sub-package</li>
            </ul>

            <h3>Autoregressive models</h3>
            {<CopyBlock text={`import datetime
import matplotlib.pyplot as plt, numpy as np, pandas as pd, statsmodels.api as sm

order = 2
weights = [0.7, 0.2]
start = datetime.date(2018, 1, 1)
end = datetime.date(2018, 12, 31)
c = 1
e_mean = 0
e_std = 1
seed = 0

np.random.seed(seed)
y_values = list(np.random.normal(c + e_mean, y_std, order)) # inital y_values
dates = pd.date_range(start, end)
n = len(dates)
errors = np.random.normal(e_mean, e_std, len(dates))

for i in range(n):
    offset = i + order
    y_values.append(c + (np.array(weights) * np.array(y_values[offset-order:offset][::-1])).sum() + errors[i])

df = pd.DataFrame(y_values[order:], index=pd.Index(dates, name='date'), columns=['y'])

fig, ax = plt.subplots(figsize=(15, 4))
ax.plot(df, label='generated')

model = sm.tsa.ARIMA(df['y'], order=(order, 0, 0))
fit_result = model.fit()
display(pd.DataFrame(fit_result.arparams, columns=['weight'], index=[i for i in range(order)]))
ax.plot(fit_result.fittedvalues, label='fit')
df ['fitted_value'] = fit_result.fittedvalues
display(df.head())

ax.legend();`} theme='dracula' language='python'/>}

            <p>As before we generated some data, but in addition we also created an <code>ARIMA</code> object defined in the <code>statsmodels</code> package providing it with the generated data and the order of the model. The order argument to the class takes a list of three numbers corresponding to the AR, I and MA parts of the model, since we are using AR only in this example we set the others to 0. We then fit the model using the generated data with the <code>fit</code> method which returns a <code>ARIMAResults</code> (<a href="https://www.statsmodels.org/dev/generated/statsmodels.tsa.arima_model.ARIMAResults.html#statsmodels.tsa.arima_model.ARIMAResults">doc</a>) object which we will use later for making predictions.</p>

            {<CopyBlock text={`model = sm.tsa.ARIMA(df['y'], order=(order, 0, 0))
fit_result = model.fit()`} theme='dracula' language='python' />}	

            <p>We can acess the fitted parameters from the fit by looking at the <code>arparams</code> attribute of the fit result, and we can look at how the model performed on the training data by looking at the <code>fit_result.fittedvalues</code> attribute.</p>

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/ar_fit_example.png`} style={{width: "100%"}} />

            <div className="row" style={{marginTop: '1em', marginBottom: '1em'}}>
              <div className="col">
                <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/ar_fit_example_df.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
              </div>
              <div className="col" style={{display: 'flex', alignItems: 'center'}}>
                <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/ar_fit_example_weights.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />
              </div>
            </div>

            <p>The fit looks decent, we're not expecting a perfect fit since there is still the stochastic error term. And the weights look fairly close to our input weights so it seems it's working as intended. However how exactly do we define a "good" fit? Step one we need to quantify the quality of the fit and step two we need something to benchmark our model against. We also have only compared our model to training data, overfitting is a potential issue so we need to put something in place to validate our model on test data, but first things first let's evaluate our model more rigorously.</p>

            <h4>Model Evaluation</h4>
            <p>In the previous case we validated how well our model was performing by comparing the known parameters to the values we got from our fitting process. For real world scenarios we do not know these values and instead will evaluate performance of our model by fitting our model on a training set and evaluating how well the fitted model performs on a holdout test dataset. Then to quantify the model performance we can calculate the squared difference between our model's predicted value and the observed value and averaging this over all the observations in our test dataset. This quantity is called the <i>mean squared error</i> (<bf>MSE</bf>). There are alternative statistics you can use (e.g. <i>mean absolute error</i>), which one to use is generally dependent on the problem you're trying to solve but in general the <i>mean squared error</i> is a safe place to start and it's what I'll be using in the following sections.</p>

            <MathComponent tex={String.raw`mse = \frac{1}{N}\sum_{i=0}^{i=N-1}(y_t - f(\vec{x}; \vec{\phi}))^2`} />

            <p>where {<MathComponent display={false} tex={'N'} />} is the size of the test dataset, {<MathComponent display={false} tex='y_t'/>} is the variable of interest, {<MathComponent display={false} tex='f' />} is the model which takes input variables {<MathComponent display={false} tex='\vec{x}'/>} ({<MathComponent display={false} tex='y_t'/>} in the case of autoregressive models and {<MathComponent display={false} tex='\epsilon_t'/>} in the case of moving average models) and input parameters {<MathComponent display={false} tex='\vec{\phi}'/>} (the values of the weights for both autoregressive and moving average models).</p>

	    <Code text={`mse_ar = np.power(df['y'] - df['fitted_value'], 2)[order:].mean()`} />
            
            <p>Calculating the MSE for the previous example gives a value of 0.9525. Taking the square root of this which will give you an idea of the size of the error you could expect from making future predictions with your model, in a business context this can help with making decisions based on the predictions of your model. </p>


            <h4>Benchmarking</h4>
            <p>We can also evaluate how well our model is performing by comparing to other models, a good starting place is comparing to the persistency model which predicts the next value of a series as its previous value,</p>
            
            <Code text={`fig, ax = plt.subplots(figsize=(15, 4))
ax.plot(df, label='generated')
ax.plot(df['y'].shift(1), label='persistence_model')
ax.legend()

mse_persistence = np.power(df['y'] - df['y'].shift(1), 2)[order:].mean()
df_comparison = pd.DataFrame({'ar': [mse_ar], 'persistence': [mse_persistence]})
df_comparison['improvement'] = 100 * (1 - df_comparison['ar'] / df_comparison['persistence'])
df_comparison`}/>
	    
            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/ar_persistence_model.png`} style={{width: '100%'}} />
            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/ar_benchmarking.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1em'}} />

            <p>Our autoregressive model is performing better than the persistence model as we were expecting, the plots may suggest otherwise but it's a bit of a visual illusion since the shift of one makes them appear close in the x direction but they are not necessarily so in the y direction, which is the one that counts! </p>


            <p>A quick note to mention that when calculating the MSE I removed the first few data points which was to remove any data points which were dependent on the initialised values of y.</p>

            <p>Finally on a slight side note, there is a significant amount of technical and statistical expertise required to develop complex models, and the rewards for doing might not be very dramatic. The improvement above is significant but you may want to think twice about developing multi layered recurrent neural networks when simpler models may yield almost as good results with less work and easier maintainability.</p>

            <h4>Model Validation on Test Data</h4>
            <p>So far we've been evaluating our models on training data only, the big problem with this is that we're at risk of over training. Now we'll fit our models again but only on part of the data (training dataset), then we'll make predictions for the rest of the data (test dataset) and evaluate its performance on only the latter.</p>

            <h4>Splitting Time-series Data into Train and Test Datasets</h4>
            <p>Since these time-series models depend on previous values we need to be careful that our test data does not inadvertently make it into our training data. To do this we put all data points greater than some time \(t\) into the test dataset and everything before into the training dataset.</p>

            <Code text={`import datetime
import matplotlib.pyplot as plt, numpy as np, pandas as pd, statsmodels.api as sm

order = 2
weights = [0.7, 0.2]
start = datetime.date(2018, 1, 1)
end = datetime.date(2018, 12, 31)
c = 1
e_mean = 0
e_std = 1
seed = 0
train_fraction = 0.8

np.random.seed(seed)
y_values = list(np.random.normal(c + e_mean, e_std, order)) # inital y_values
dates = pd.date_range(start, end)
n = len(dates)
n_train = int(train_fraction * n)
errors = np.random.normal(e_mean, e_std, len(dates))

for i in range(n):
    offset = i + order
    y_values.append(c + (np.array(weights) * np.array(y_values[offset-order:offset][::-1])).sum() + errors[i])

df = pd.DataFrame(y_values[order:], index=pd.Index(dates, name='date'), columns=['y'])
df_train = df[:n_train]
df_test = df[n_train:]

fig, ax = plt.subplots(figsize=(15, 4))
ax.plot(df_train, label='train')
ax.plot(df_test, label='test')
ax.legend();

df_summary = pd.DataFrame(
    [
        [df_train.index.min(), df_train.index.max(), len(df_train), df_train['y'].mean(), df_train['y'].std()],
        [df_test.index.min(), df_test.index.max(), len(df_test), df_test['y'].mean(), df_test['y'].std()],
    ],
    columns=['min', 'max', 'n', 'mean', 'std'],
    index=pd.Index(['train', 'test'], name='dataset')
)`} />

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/train_test_split.png`} style={{width: '100%'}} />
            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/train_test_split_df.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />


            <p>Now we have out data split into train and test datasets we can start making predictions on our test dataset and validating the models performance.</p>

            <Code text={`import statsmodels.api as sm

model = sm.tsa.ARIMA(df_train['y'], order=(order, 0, 0))
fit_result = model.fit()
forecast = fit_result.forecast(steps=len(df_test))
df_forecast = pd.DataFrame(
    {
        'y': forecast[0],
        'error_lower': forecast[2][:, 0],
        'error_upper': forecast[2][:, 1],
    }
)
fig, ax = plt.subplots(figsize=(15, 4))
ax.plot(df_test['y'], label='generated')
ax.plot(df_test.index, df_forecast['y'], label='predicted')
ax.fill_between(df_test.index, df_forecast['error_lower'], df_forecast['error_upper'], alpha=0.1, color='orange')
ax.legend()`}/>

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/forecast_1.png`} style={{width: '100%'}} />


            <p>In the above example we can see that as time passes our model converges to a constant value, corresponding to the mean value of the time series. This is because as we go from left to right along the time axis, we are predicting further and further into the future so there is less information known about the previous values.</p>
            <p>However if we want to compare to the persistency model in the previous section we need to convert our forecast process into a form where after each day we gain another observation and  make updates to our model, i.e to make next day forecasts based on models trained on all previous obsevations.</p>
            <p>Note I've used the <code>forecast</code> method of the <code>ARIMAResults</code> class above but it also has a <code>predict</code> method which is similar but not same, you can read up on the difference between that and the <code>forecast</code> method but I think it's sufficient just to use the <code>forecast</code> method, you also get the added benefit of getting an error band for each forecast which is represented by the shaded region in the chart above.</p>


            <h4>Day Ahead Forecasting</h4>
            <Code text={`predictions = []
errors_lower = []
errors_upper = []
for date in df_test.index:
    df_train_date = df[df.index < date]
    model = sm.tsa.ARIMA(df_train_date['y'], order=(order, 0, 0))
    fit_result = model.fit()
    forecast = fit_result.forecast(steps=1)
    predictions.append(forecast[0][0])
    errors_lower.append(forecast[2][0][0])
    errors_upper.append(forecast[2][0][1])
    
df_predictions = pd.DataFrame(
    {
        'y': predictions,
        'error_lower': errors_lower,
        'error_upper': errors_upper
    }, 
    index=df_test.index
)

fig, ax = plt.subplots(figsize=(15, 4))
ax.plot(df_test['y'], label='generated')
ax.plot(df_predictions['y'], label='predicted')
ax.fill_between(df_predictions.index, df_predictions['error_lower'], df_predictions['error_upper'], color='orange', alpha=0.1)
ax.plot(df['y'].shift(1)[df.index.isin(df_test.index)], label='persistence_model')
ax.legend()

df_mse = pd.DataFrame(
    {
        'mse_ar_model': [np.power(df_test['y'] - df_predictions['y'], 2).mean()],
        'mse_persistence_model': [np.power((df_test['y'] - df['y'].shift(1)).dropna(), 2).mean()]
    }
)`} />

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/day_ahead_forecasting.png`} style={{width: '100%'}} />
            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/day_ahead_forecasting_df.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />


            <p>Reassuringly we see that when our model is applied to test data we still see a modest improvement over our benchmark model.</p>
            <h2>Model Selection (Fitting Hyperparameters)</h2>
            <p>So far we have been cheating a bit since we know the order of the autoregressive model we used to generate our data, in general you will not know which autoregressive order will best fit your data. The order of a model is an example of a hyperparameter, it is not a parameter of the model itself but a parameters of what type of model to use within a family of models such as the family of autoregressive models.</p>

            <p>One way to select the best hyperparameters is to simply explore the hyperparameters gridspace and find which parameter set yields the best MSE on your test dataset. Alternatively you calculate an Akaike Information Criteria (AIC) score for each hyperparameter set and the parameter set with the lowest score is the best. The AIC tries to score a model based on how well it fits the data with as fewest weights as possible, so it will penalise models with very large orders. Finally there is the Box-Jenkins method which involves looking at certain properties of your data to determine which order best describes your data.</p>

            <p>All the above methods are forms of regularisation, a set of techniques aimed at trying to generalise the model so that it will extrapolate well to new data.</p>
            <h3>Best MSE</h3>
            <p>Fit the data with several different orders.</p>
            <Code text={`df_mse = pd.DataFrame()

orders = (1, 2, 3)
for order in orders:
    predictions = []
    errors_lower = []
    errors_upper = []
    for date in df_test.index:
        df_train_date = df[df.index < date]
        model = sm.tsa.ARIMA(df_train_date['y'], order=(order, 0, 0))
        fit_result = model.fit()
        forecast = fit_result.forecast(steps=1)
        predictions.append(forecast[0][0])
        errors_lower.append(forecast[2][0][0])
        errors_upper.append(forecast[2][0][1])

    df_mse['mse_order_{}'.format(order)] = [np.power(df_test['y'] - predictions, 2).mean()]`} />


            <p>Which gives the following results,</p>
            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/best_mse_parameters.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1em'}} />
            <p>Confirming the model with order 2 gives the best results.</p>
            <h3>Akaike Information Criteria (AIC)</h3>
            <p>The <code>ARIMAResults</code> class already has an AIC attribute included. The code below calcuates the average AIC score for models with different orders.</p>

            <Code text={`df_aic = pd.DataFrame()

orders = (1, 2, 3)
for order in orders:
    aic = []
    for date in df_test.index:
        df_train_date = df[df.index < date]
        model = sm.tsa.ARIMA(df_train_date['y'], order=(order, 0, 0))
        fit_result = model.fit()
        aic.append(fit_result.aic)

    df_aic['aic_order_{}'.format(order)] = [np.mean(aic)]`} />

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/aic_comparison.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} />


            <h3>Box-Jenkins Method</h3>
            <p>This method was devised by the statisticians George Box and Gwilym Jenkins to identify the order of the ARIMA model which best fits a given time-series. The first step is to establish that your time-series is stationary. If it is not stationary then you will need to transform your data so that it is, we already saw you can do this with differencing but there are other techniques such as trend removal, or taking the logarithm of your time-seris to diminish any trend. But first to test whether your time-series is stationary we can use the Dickey-Fuller test.</p>

            <p>First generate your data as usual</p>

            <Code text={`import datetime
import matplotlib.pyplot as plt, numpy as np, pandas as pd, statsmodels.api as sm

order = 2
weights = [0.7, 0.2]
start = datetime.date(2018, 1, 1)
end = datetime.date(2018, 12, 31)
c = 1
e_mean = 0
e_std = 1
seed = 0

np.random.seed(seed)
y_values = list(np.random.normal(c + e_mean, e_std, order)) # inital y_values
dates = pd.date_range(start, end)
errors = np.random.normal(e_mean, e_std, len(dates))

for i in range(n):
    offset = i + order
    y_values.append(c + (np.array(weights) * np.array(y_values[offset-order:offset][::-1])).sum() + errors[i])

df = pd.DataFrame(y_values[order:], index=pd.Index(dates, name='date'), columns=['y'])
df.head()`} />


            <h4>Stationarity Test</h4>
            <p>We can use the <code>adfuller</code> (<a href="https://www.statsmodels.org/dev/generated/statsmodels.tsa.stattools.adfuller.html">docs</a>) function in the <code>statsmodels</code> package to do the statistical test.</p>

            <Code text={`result = sm.tsa.stattools.adfuller(df['y'])
df_result = pd.DataFrame([result[:4]], columns=['adf', 'p_value', 'used_lag', 'n'])
for key, val in result[4].items():
    df_result[key] = val
    df_result`}/>


            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/dickey_fuller.png`} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginBottom: '1em'}} />

            <p>The important thing here to look at is the p-value, loosely you can interpret this as the probablity that your time-series is <b>non</b>-stationary. Since the p-value is very small in this case we can conculde with high confidence that this time-series is stationary (which is should be, since we generated it from a stationary model).</p>
            

            <h4>Autocorrelation plots and Partial Autocorrelation plots</h4>

            <p>The next thing to do in the Box-Jenkins method is to plot the autocorrelation of your time-series, this will help to identify whether there is any seasonality in your time-series and also what is the best order for the ARIMA model. Again there are some useful functions to do this.</p>

            <Code text={`fig, ax = plt.subplots(figsize=(15, 4))
sm.tsa.graphics.plot_acf(df['y'], lags=25, ax=ax);`}/>

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/acf.png`} style={{width: '100%', marginBottom: '1em'}} />


            <p>Where <code>acf</code> stands for autocorrelation function. From here you can refer to a <a href="https://en.wikipedia.org/wiki/Box%E2%80%93Jenkins_method#Autocorrelation_and_partial_autocorrelation_plots">list of rules</a> to help identify what kind of model our data corresponds to. In this case we have an exponentially decaying correlation function which implies an autoregressive model</p>

            <p>Continuing with this exapmle, the next step is to identify what order our autoregressive model should take. To do this we plot the partial autocorrelation function.</p>

            <Code text={`fig, ax = plt.subplots(figsize=(15, 4))
sm.tsa.graphics.plot_pacf(df['y'], lags=25, ax=ax);`} />

            <img src={`${process.env.PUBLIC_URL}/articles/data_science/arima_time_series_modelling/pacf.png`} style={{width: '100%', marginBottom: '1em'}} />

            <p>The blue area corresponds to how significant the result is, points outside of it are considered significant whilst those inside are not. From this plot we see the last significant point is where the lag is equal to 2, therefore the order of our autoregressive model should be 2.</p>
          </div>


          <div id="summary">
            <h2>Summary</h2>
            <p>Above I've run through some of the typical workflows you might go through when developing a forecasting project. I've used only generated data because I've found it makes it easier to verify the code and models are doing as intended. In the real world you won't be using generated data so you'll have to make sure you have some good techniques to evaluate the performance of your models.</p>
            <p>I've also focused mainly on autoregressive sub-family in the examples above, but it shouldn't be too much work to take the above examples and extrapolate them to moving average models and combinations of the two.</p>

            <p>There are also many other variants of ARIMA models, you have SARIMA for looking at seasonal models, ARIMAX where you can include exogenous variables to your model (e.g. if you're forecasting weather temperature time-series you may also want to include air pressure time-series data as an additional feature), VARIMA which is the multivariate version of ARIMA (instead of predicting one variable you're predicting several variables simaltaneously) and FARIMA where the F stands for <i>fractional</i> which is useful for modelling time-series' with long memory. You can find functions for some of these models in the <code>statsmodels</code> package also.</p>

            <p>Finally there are other methods of time-series forecasting, you have machine learning approaches as well as approaches using Recurrent Neural Networks (RNN) which has shown good results for sequential data. I plan to write another tutorial using some of these methods soon.</p>
          </div>          
          
        </div>

    );
}

export default ArimaTimeSeriesModelling;
