#!/bin/bash
################ INPUT VARS ##############
COMPONENT=$1
COMPONENT_PART=$2
##########################################


############# CHECKING INPUT PARAMS #####

if [ -z "$COMPONENT" ]; then
  echo 'Missing mandatory component folder name. Ex. yarn add-component-part User'
  exit 0
elif [ -z "$COMPONENT_PART" ]; then
  echo "Missing mandatory component part name. Ex. yarn add-component-part ${COMPONENT^} ${COMPONENT,,}-data"
  exit 0
fi

#########################################

echo "Deleting existing component part"

DIRECTORY="../components/${COMPONENT}/${COMPONENT_PART}"
if [ -d "$DIRECTORY" ]; then
    echo "[$COMPONENT_PART] of '$COMPONENT' found in components"
    read -p "Press Enter To Continue to delete it or Ctrl + C to abort"
else
    echo "[$COMPONENT_PART] of '$COMPONENT' not found";
    echo "Did not remove anything...";
    exit 0;
fi
echo $(pwd)
rm -R $(dirname $(pwd))/components/${COMPONENT}/${COMPONENT_PART}

if [ ! "$(ls -A $(dirname $(pwd))/components/${COMPONENT})" ]; then
  rm -R $(dirname $(pwd))/components/${COMPONENT};
fi

echo "Component part [$COMPONENT_PART] of '$COMPONENT' successfully deleted"

########### REHYDRATE COMPONENTS INDEX ###########

cd ../../

cat > index.js <<EOF
import * as all from './**/**/index.js';

const allComponents = Object.values(all)
  .filter(v => !!v)
  .map(v => Object.values(v))
  .reduce((arr, item) =>  [
    ...arr,
    ({
      types: [...item.map(i => i.index.types)],
      resolvers: [...item.map(i => i.index.resolvers)],
    })
  ], []);

export default {
  types: [
    ...allComponents.reduce((arr, i) => [...arr, ...i.types], [])
  ],
  resolvers: [
    ...allComponents.reduce((arr, i) => [...arr, ...i.resolvers], [])
  ],
};
EOF

################
