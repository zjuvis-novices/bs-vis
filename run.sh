cp ./nginx.conf /usr/local/nginx/conf/nginx.conf
forever start app.js
nohub node app.js > ~/log/node.log 2>&1 &
nginx