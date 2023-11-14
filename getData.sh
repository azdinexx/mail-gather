

#!/bin/bash

count=0
while [ $count -lt 10 ]; do
  echo "The count is: $count"
  count=$((count + 1))
done