FROM jekyll/jekyll:4.1.0

WORKDIR /pages

RUN chown jekyll:jekyll -R /pages

COPY . /pages/

ENTRYPOINT ["jekyll", "serve", "--host", "0.0.0.0"]