FROM node:13.7-alpine as build

ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

# Add `node_modules/.bin` to $PATH
ENV PATH $INSTALL_PATH/node_modules/.bin:$PATH

# Install and cache app dependencies
COPY package.json $INSTALL_PATH/package.json
RUN yarn install
RUN yarn global add react-scripts@3.3.0

# Build
COPY . /app
RUN npm run build

# Production environment
FROM nginx:1.16.0-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]