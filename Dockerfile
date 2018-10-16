FROM node
RUN mkdir -p /usr/src/node
WORKDIR /usr/src/node
COPY . /usr/src/node

RUN npm install

EXPOSE 80

CMD ["npm", "publish"]