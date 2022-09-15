FROM jekyll/jekyll

WORKDIR /pages

RUN chown jekyll:jekyll -R /pages

COPY . /pages/

ENTRYPOINT ["jekyll", "serve", "--host", "0.0.0.0"]