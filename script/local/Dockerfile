FROM node:16-alpine

RUN npm install -g npm@8.19.3

# Copy startup script
COPY ./script/local/start.sh /usr/local/bin/start
RUN chmod u+x /usr/local/bin/start

USER node

WORKDIR /var/www/html

EXPOSE 3000

ENTRYPOINT [ "sh" ]
CMD ["/usr/local/bin/start"]
