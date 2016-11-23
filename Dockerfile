# Container para rodar o sistema similar ao que temos em produção (versões similares)
# e também para fazer deploys
FROM ubuntu:14.04
MAINTAINER Felipe Prenholato <felipeprenholato+plataforma-taturana@gmail.com>
ENV _HOME=/home/dev
RUN apt-get -y -qq --force-yes update
RUN apt-get -y -qq --force-yes install \
		vim git openssh-server sudo curl mongodb-clients \
		nodejs npm
RUN update-rc.d ssh defaults  && /etc/init.d/ssh start
RUN useradd -d ${_HOME} -u 1000 -m -s /bin/bash dev \
    && passwd -d dev
	&& mkdir ${_HOME}/.ssh
COPY ${ssh_key} ${_HOME}/.ssh/authorized_keys \
	&& chmod 700 ${_HOME}/.ssh/
	&& chmod 600 ${_HOME}/.ssh/authorized_keys
	&& chown -R dev:dev ${_HOME}
EXPOSE 22

