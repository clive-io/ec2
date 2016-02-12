sudo yum update
ssh-keygen
echo "Now, scp ~/.ssh/id_rsa.pub and paste this public key into GitHub."
read -p "Press enter to continue."


# INSTALL git
sudo yum -y install git
git config --global --edit


# INSTALL numpy
# https://stackoverflow.com/questions/18732250/installing-numpy-on-amazon-ec2
sudo yum -y install gcc-c++ python27-devel atlas-sse3-devel lapack-devel
wget https://pypi.python.org/packages/source/v/virtualenv/virtualenv-1.11.2.tar.gz
tar xzf virtualenv-1.11.2.tar.gz
python27 virtualenv-1.11.2/virtualenv.py sk-learn
. sk-learn/bin/activate
pip install numpy


# INSTALL Twisted and TEST python server
sudo pip install twisted
mkdir tf
git clone git@github.com:cchan/tensorflow-aws tf
echo "About to test Python server. Here is your current AWS IPv4 address:"
wget -qO- http://instance-data/latest/meta-data/public-ipv4
sudo python tf/server-test.py


# INSTALL and TEST tensorflow
sudo pip install --upgrade https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.6.0-cp27-none-linux_x86_64.whl
echo "Testing TensorFlow..."
python tf/tf-test.py
read -p "That should've printed 'Hello, TensorFlow!' and '42'."


# INSTALL nodejs
sudo yum -y install gcc-c++ make openssl-devel git
git clone git://github.com/joyent/node.git
cd node
git tag -l
git checkout v0.12.7
./configure
make && sudo make install
cd ..


# INSTALL npm
git clone https://github.com/isaacs/npm.git
cd npm
echo "Now, add ':/usr/local/bin' to the line 'Defaults secure_path = ..."
read -p "Ready?"
sudo nano /etc/sudoers
sudo make install
cd ..


# TEST node server
cd tf
npm install
echo "About to test Node server. Here is your current AWS IPv4 address:"
wget -qO- http://instance-data/latest/meta-data/public-ipv4
sudo node server-test.js


read -p "DONE with aws-setup! Press enter to end."
