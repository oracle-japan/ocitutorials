FROM jekyll/jekyll

WORKDIR /pages

RUN chown jekyll:jekyll -R /pages

COPY . /pages/

SHELL ["/bin/bash", "-c"]

ENTRYPOINT ["jekyll", "serve", "--host", "0.0.0.0"]