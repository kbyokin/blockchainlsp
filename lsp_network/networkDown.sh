docker rm -f $(docker ps -aq)

rm -rf channel-artifacts/*
rm lsp.tar.gz