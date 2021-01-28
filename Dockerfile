FROM jekyll/jekyll

WORKDIR /pages

COPY . /pages

RUN chmod 777 /pages/*

RUN mkdir _site && mkdir .jekyll-cache

ENTRYPOINT ["jekyll", "serve", "-H", "0.0.0.0"]

EXPOSE 4000