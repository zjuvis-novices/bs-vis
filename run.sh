cp ./nginx.conf /etc/nginx/sites-enabled/default
forever start app.js
nohub node app.js > ~/log/node.log 2>&1 &
nginx