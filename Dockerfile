FROM jekyll/jekyll

WORKDIR /pages

COPY . /pages

RUN mkdir _site && mkdir .jekyll-cache

ENTRYPOINT ["jekyll", "serve", "-H", "0.0.0.0"]

EXPOSE 4000