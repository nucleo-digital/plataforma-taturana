# Container para rodar o sistema similar ao que temos em produção (versões similares)
# e também para fazer deploys
FROM ubuntu:14.04
MAINTAINER Felipe Prenholato <felipeprenholato+plataforma-taturana@gmail.com>
ENV _HOME=/home/dev
RUN sed -i -e "s/.*trusty-security/# &/" /etc/apt/sources.list
RUN apt-get -y -qq --force-yes update
RUN apt-get -y -qq --force-yes install \
		vim git openssh-server sudo curl mongodb-clients \
		nodejs npm
RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN locale-gen en_US.UTF-8 pt_BR.UTF-8
RUN echo "export LANG=en_US.UTF-8\nexport LC_ALL=en_US.UTF-8" > /etc/default/locale
RUN update-rc.d ssh defaults  && /etc/init.d/ssh start
RUN useradd -d ${_HOME} -u 1000 -m -s /bin/bash -G sudo dev \
    && passwd -d dev \
	&& mkdir ${_HOME}/.ssh
RUN echo "dev ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers
COPY taturana_key.pub ${_HOME}/.ssh/authorized_keys
RUN chmod 700 ${_HOME}/.ssh/ \
	&& chmod 600 ${_HOME}/.ssh/authorized_keys \
	&& chown -R dev:dev ${_HOME}

