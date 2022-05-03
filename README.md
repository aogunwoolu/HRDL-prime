<div id="top"></div>
<br />

<div align="center">
  <a href="https://github.com/aogunwoolu/HRDL">
    <img src="deployment\hrdlfrontend\public\HRDL_logo.png" alt="Logo" width="150" height="80">
  </a>

  <h3 align="center">HRDL</h3>

  <p align="center">
    A crypto trading bot that aims to make crypto trading easier and more accessible for the ublic using machine learning techniques
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="http://13.40.190.34/">View Demo</a>
    ·
    <a href="/issues">Report Bug</a>
    ·
    <a href="/issues">Request Feature</a>
  </p>

</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About HRDL</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About  HRDL

The continued development of the Internet to web 3.0 lead to the emergence of new concepts like the spatial web, AI, and cryptocurrencies, which has quickly become a global phenomenon in modern society. 
The anti-government nature of these currencies combined with the potential of innovation with the technology has allow for several booms market wide. This causes new crypto investors to enter, potentially unprepared for the challenges that they may face.
Therefore, with a combination of other web 3.0 technologies (i.e., Artificial Intelligence) a solution can be developed which may produce better results than trading manually. It is essential for this machine learning algorithm to produce the best possible prediction for the crypto trading pair.
This project has 2 broad aims: 
-	to discover the best timeseries predictive machine learning algorithm for use in a stochastic (having a random probability distribution or pattern that may be analysed statistically but may not be predicted precisely) environment - the crypto trading market.
-	to develop a beginner friendly web application that acts as an interface to a machine learning algorithm.  


<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [React.js](https://reactjs.org/)
* [Bootstrap](https://getbootstrap.com)
* [JQuery](https://jquery.com)
* [Django](https://www.djangoproject.com/)
* [CCXT](https://github.com/ccxt/ccxt)
* [Coinpaprika](https://api.coinpaprika.com/)
* [Django Celey](https://docs.celeryq.dev/en/stable/django/first-steps-with-django.html)
* [Django Celey Beat](https://github.com/celery/django-celery-beat)
* [Crypto Icon Api](https://github.com/TokenTax/cryptoicon-api)

### Reference
* [LSTM Prediciton](https://colab.research.google.com/github/dlmacedo/starter-academic/blob/master/content/courses/deeplearning/notebooks/pytorch/Time_Series_Prediction_with_LSTM_Using_PyTorch.ipynb)
* [Dcoker Compose](https://docs.docker.com/compose/gettingstarted/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

This aplication requires the installation of docker and docker compose to quickly and effectively get started.

- the full instructions can be found at the following web page:
  - https://docs.docker.com/compose/install/

### Installation

_Below is the step by step methodology of how to install and run the HRDL application_

1. Get a free API Key at [https://testnet.binance.vision/](https://testnet.binance.vision/)

2. navigate to the deployment/.docker folder
   ```sh
   cd deployment/.docker
   ```

3. Enter your API keys in files
    - tasks.py:
        ```sh
        api_key = '<your_api_key>'
        api_secret = '<your_api_secret>'

        t_api_key = '<your_api_key>'
        t_api_secret = '<your_api_secret>'
        ```
    - test.py:
        ```sh
        t_api_key = '<your_api_key>'
        t_api_secret = '<your_api_secret>'
        ```
   
4. start up docker containers (-d flag for running in background)
   ```sh
   docker-compose -f docker-compose.yaml up -d
   ```
   
5. Enter your API key during the login process

6. put down docker containers
	```sh
   docker-compose down --volumes
   ```
### Deployed
_HRDL has been deployed to AWS and has a DHCP allocated IP_

contact ec19110@qmul.ac.uk for access to this IP

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [x] Develop Machine learning algorithm
- [x] Develop Backend
- [x] Integrate backend with Machine learning model
- [x] Develop Frontend
- [x] Integrate backend with frontend
- [x] Write tests for frontend and backend

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

* [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
* [Malven's Grid Cheatsheet](https://grid.malven.co/)
* [Font Awesome](https://fontawesome.com)
* [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#top">back to top</a>)</p>
