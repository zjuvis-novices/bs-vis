kill $(ps aux | grep '[n]ginx' | awk '{print $2}')
cp ./nginx.conf /usr/local/nginx/conf/nginx.conf
nginx -t
forever start app.js
nohub node app.js > ~/log/node.log 2>&1 &
nginx