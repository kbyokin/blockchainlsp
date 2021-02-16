docker stop $(docker ps -aq)

sleep 2

docker rm -f $(docker ps -aq)

sleep 2

rm -rf channel-artifacts/*
