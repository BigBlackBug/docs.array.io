FROM debian
#RUN apt-get install git
COPY . /tech-disquss
#RUN git clone https://git.kryptonhub.com/tapok_satan/tech-disquss
WORKDIR /tech-disquss
RUN ./mdbook build
ENTRYPOINT ./mdbook serve -p 3000 -i 0.0.0.0
