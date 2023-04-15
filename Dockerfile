FROM nginx:1.19
# On openshift fails nginx: [emerg] mkdir() "/var/cache/nginx/client_temp" failed (13: Permission denied)
RUN mkdir -p /var/cache/nginx/tmp
# Allow random user access to write /var/cache/nginx
RUN chmod -R go+rwX /var/cache/nginx
# Allow random user access to write /var/run/nginx.pid
RUN touch /var/run/nginx.pid && chmod go+rw /var/run/nginx.pid
COPY dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf