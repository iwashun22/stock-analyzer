FROM node:23.6-slim

RUN apt-get update \ 
    && apt-get install -y locales tmux curl \
        # set language
        # https://www.ibm.com/docs/en/aix/7.2?topic=globalization-supported-languages-locales
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && locale-gen en_US.UTF-8 \
    && localedef -f UTF-8 -i en_US en_US

ENV LANG=en_US.UTF-8

# set a custom timezone
# https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
ENV TZ=Asia/Bangkok

WORKDIR /app
EXPOSE 8000
