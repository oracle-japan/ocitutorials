FROM ruby:latest

WORKDIR /pages

COPY . /pages/

COPY Gemfile Gemfile.* /pages/

RUN bundle add webrick

RUN bundle install

ENTRYPOINT ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]