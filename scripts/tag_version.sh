#! /bin/bash
sed -i -e "s|ATLAN_FRONTEND_VERSION|$ATLAN_FRONTEND_VERSION|g" ./package.json
