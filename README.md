# RESTful-Node
  Getting started with Node-Express-MongoDB

# clone
<pre>git clone https://github.com/VenomVendor/RESTful-Node.git</pre>

# prerequisites
 - Node https://nodejs.org/en/download/ / https://docs.npmjs.com/getting-started/installing-node
 - MongoDB https://docs.mongodb.org/manual/installation/

# {Installation}
<pre>
git clone https://github.com/VenomVendor/RESTful-Node.git
cd RESTful-Node
npm i
gulp
</pre>

# Start Mongo Server
<pre>mongod</pre>

# Import MongoDB dump
<a href="dump">Import MongoDB dump</a>

# Start Server
<pre>gulp</pre>

# Default port
<pre>3030</pre>

# Server URL
<pre>http://localhost:3030</pre>

# APIs
 - http://localhost:3030/v1/
 - http://localhost:3030/v1/demo
 - http://localhost:3030/v1/about

# Weather APIs
 - http://localhost:3030/v1/get/weather?[params]

<pre>http://localhost:3030/v1/get/weather?limit=20&offset=0&state=Vermont&temp=lte~39&windSpeed=gt~4.00000&windDir=lt~180&humidity=gte~60</pre>
 
# Weather Params
param<br>(case-sensitive) | Type | Default | Description
------ | ---- | ------- | -----------
type | string | html | `json`/`html` Output type.
limit | integer | 100 | Max results.
offset | integer | 0 | Skip first {offset} results.
callback | string/boolean/integer/json | - | callback for reference.
_id | hexa  | - | Hexa-decimal Object(_id) / id
state | string | - | State
airport | string | - | Airport Name
day | integer | - | gt~ / gte~ / lt~ / lte~ `ex: gt~4`
time | integer | - | gt~ / gte~ / lt~ / lte~ `ex: gte~4`
temp  | integer | - | gt~ / gte~ / lt~ / lte~ `ex: lt~4`
humidity | integer | - | gt~ / gte~ / lt~ / lte~ `ex: lte~4`
windSpeed | integer | - | gt~ / gte~ / lt~ / lte~ `ex: 4`
windDir | integer | - | gt~ / gte~ / lt~ / lte~ `ex: 4.0`
pressureStation | integer | - | gt~ / gte~ / lt~ / lte~ `ex: 04`
pressureSea | integer | - | gt~ / gte~ / lt~ / lte~ `ex: 40`

# User APIs
 - http://localhost:3030/v1/get/user(*)?[params]

<pre>http://localhost:3030/v1/get/users?limit=4&offset=0&gender=queen</pre>
 
# User Params
param<br>(case-sensitive) | Type | Default | Description
------ | ---- | ------- | -----------
type | string | html | `json`/`html` Output type.
limit | integer | 100 | Max results.
offset | integer | 0 | Skip first {offset} results.
callback | string/boolean/integer/json | - | callback for reference.
_id | hexa  | - | Hexa-decimal Object(_id) / id
id | integer  | - | N/A
firstName | string | - | N/A
company | string | - | N/A
email | string | - | N/A
gender | string | - | `king`/`queen`
g | string | - | `king`/`queen`

# HTML
    - http://localhost:3030/v1/(a|RANDOM|*).html

# TODO
    - Move to ES6 Promise.

# License
    Copyright© 2016 VenomVendor <info@VenomVendor.com>
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
