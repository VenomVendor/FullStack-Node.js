
# Start Mongo Server
<pre>mongod</pre>

# Import MongoDB dump
<pre>
mongoimport --drop --type csv --headerline weather_data.csv -d fullstack_demo -c weather
mongoimport --drop --type csv --headerline user_data.csv -d fullstack_demo -c users
</pre>

# Import Error
 > Failed: error connecting to db server: no reachable servers
<pre>
mongoimport --drop --host=127.0.0.1 --type csv --headerline weather_data.csv -d fullstack -c weather
mongoimport --drop --host=127.0.0.1 --type csv --headerline user_data.csv -d fullstack -c users
</pre>

# Insert Title
<pre>
mongo
> use fullstack
> db.weather.insert({title: 'Weather Data'})
> db.users.insert({title: 'User Data'})
</pre>
