#################
# Build the app #
#################
FROM docker.io/library/node:lts as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --verbose
COPY . .
RUN npm install --verbose -g @angular/cli
RUN ng build --configuration production --output-path=/dist

################
# Run in NGINX #
################
FROM docker.io/library/nginx
COPY --from=build /dist/browser /usr/share/nginx/html

#COPY default.conf.template /etc/nginx/templates/

COPY 90-envsubset-on-angular-env.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/90-envsubset-on-angular-env.sh
