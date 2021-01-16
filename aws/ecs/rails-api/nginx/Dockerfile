FROM nginx:1.16

# Delete the default welcome to nginx page.
RUN rm /usr/share/nginx/html/*

# Copy over the custom nginx and default configs.
COPY configs/nginx.conf /etc/nginx/nginx.conf
COPY configs/default.conf /etc/nginx/conf.d/default.conf

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]