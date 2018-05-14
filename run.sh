mkdir /etc/nginx/sites-enabled
cp ./nginx.conf /etc/nginx/sites-enabled/default.conf
forever start app.js
nohub node app.js > ~/log/node.log 2>&1 &
nginx