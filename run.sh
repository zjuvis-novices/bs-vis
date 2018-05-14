kill $(ps aux | grep '[n]ginx' | awk '{print $2}')
cp ./nginx.conf /usr/local/nginx/conf/nginx.conf
nginx -t
forever stop app.js
forever start app.js
nginx