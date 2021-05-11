FROM node

COPY package.json .

RUN npm install --legacy-peer-deps
RUN npm install -g serve 

COPY public public
COPY src src

RUN npm run build
CMD ["serve", "-s", "build", "-l", "3000"]

