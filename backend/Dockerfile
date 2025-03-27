FROM python:3.13

RUN apt-get update \
    && apt-get install -y locales \
    && apt-get install -y tmux curl wget gcc build-essential python3-dev\
        # set language
        # https://www.ibm.com/docs/en/aix/7.2?topic=globalization-supported-languages-locales
    && apt-get clean \
    && locale-gen en_US.UTF-8 \
    && localedef -f UTF-8 -i en_US en_US

ENV LANG=en_US.UTF-8

# set a custom timezone
# https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
ENV TZ=Asia/Bangkok

WORKDIR /main

COPY ./ta-lib/lib/* /usr/lib/
COPY ./ta-lib/include /usr/include/ta-lib
