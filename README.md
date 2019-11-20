# Price-Poller

Product price poller, email notifications when price is lower than latest lower value.
Currently only supports Finland's Verkkokauppa online store and one product at the time 
but any product from this website.
I am only interested in one product at the moment and made this for that use to see price changes.

If you want and need support for multiple products or website, you are free to contribute. 
I review and merge pull requests coming from new branches. 
 
 
### Installing

Steps to get development environment running

1. Choose your database platform. I use postgresql. See Sequelize dialects for support. 
2. Run `npm install`
3. Configure `.env` via renaming from template `.env_tpl`
4. Run using PM2 process manager or any other `pm2 start poller.js`
5. Done!


### Environment file config
* `DB_DIALECT` choose your database. Examples in template. Fill rest of the db details.
* `PRODUCT_CODE` target website has product codes like '36712' this is unique string in database.
* `PRODUCT_URL` url to specific product, example url: https://www.verkkokauppa.com/fi/product/36712/kjsdn/Samsung-C34J791-34-naytto
* `EMAIL_HOST` smtp mail host server.
* `EMAIL_USER` origin from where email is sent from.
* `EMAIL_TO_ADDRESS` destination where email is going to.


## Versioning

No versioning implemented yet.


## Authors

* **Norkator** - *Initial work, code owner* - [norkator](https://github.com/norkator)


## License

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons -licene" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />Licensed with <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution - NonCommercial - NoDerivatives 4.0 International - license</a>.
