# Price-Poller

Product price poller, email notifications when price is lower than latest value.
Currently only supports Finland's `Verkkokauppa.com` online store and any product from this website.
You only need product code inserted in database product_code field. You can track as many as you want. 
Product code's can be found from Verkkokauppa link and description, example: `63109`

If you want and need support for multiple online stores, you are free to contribute on this repo. 
I review and merge pull requests coming from new branches. 
 
 
### Installing

Steps to get development environment running

1. Choose your database platform. I use postgresql. See Sequelize dialects for support. 
2. Run `npm install`
3. Configure `.env` via renaming from template `.env_tpl`
4. Run `sudo node poller.js` once so that database and table is created.
5. Insert your `product_code` (one or more) to products table.
6. Run using PM2 process manager or any other `pm2 start poller.js`
7. Done!

New product as first run time, app will fill base price, product name etc automatically.  
Example product codes: 36712 and 63109


### Environment file config
* `DB_DIALECT` choose your database. Examples in template. Fill rest of the db details.
* `STORE_URL` url to web store, example url: https://www.verkkokauppa.com/fi/product/
* `EMAIL_HOST` smtp mail host server.
* `EMAIL_USER` origin from where email is sent from.
* `EMAIL_TO_ADDRESS` destination where email is going to.


## Versioning

No versioning implemented yet.


## Authors

* **Norkator** - *Initial work, code owner* - [norkator](https://github.com/norkator)


## License

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons -licene" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a><br />Licensed with <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution - NonCommercial - NoDerivatives 4.0 International - license</a>.
