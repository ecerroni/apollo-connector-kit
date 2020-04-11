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

DIRECTORY="../datacomponents/${COMPONENT}/${COMPONENT_PART}"
if [ -d "$DIRECTORY" ]; then
    echo "[$COMPONENT_PART] of '$COMPONENT' found in components"
    read -p "Press Enter To Continue to delete it or Ctrl + C to abort"
else
    echo "[$COMPONENT_PART] of '$COMPONENT' not found";
    echo "Did not remove anything...";
    exit 0;
fi
echo $(pwd)
rm -R $(dirname $(pwd))/datacomponents/${COMPONENT}/${COMPONENT_PART}

if [ ! "$(ls -A $(dirname $(pwd))/datacomponents/${COMPONENT})" ]; then
  rm -R $(dirname $(pwd))/datacomponents/${COMPONENT};
fi

echo "Component part [$COMPONENT_PART] of '$COMPONENT' successfully deleted"

########### REHYDRATE COMPONENTS INDEX ###########

cd ../../src/datacomponents

arrayOfComponentsDirs=`find . -maxdepth 2 -type d ! -name '.*' -printf '%f\n'`
footer=`echo // ${arrayOfComponentsDirs[@]}`


cat > index.js <<\EOF
import * as all from './**/**/index.js';

/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const allPaths = Object.entries(all).reduce((arr, entry) => {
  if (entry && entry[1] && entry[0]) {
    return [...arr, ...Object.keys(entry[1]).map(key => ({ [key]: `${entry[0]}/${key}` }))];
  }
  return [...arr];
}, []);
//
const allComponents = Object.values(all)
  .filter(v => !!v)
  // .map(v => Object.values(v))
  .reduce((arr, item) => {
    const alls = {};
    Object.keys(item).forEach((i) => {
      const path = `./${allPaths.filter(p => Object.keys(p)[0] === i)[0][i]}`;
      alls[i] = require(path);
    });
    return [
      ...arr,
      ({
        types: [...Object.keys(item).map(i => alls[i].default.types)],
        resolvers: [...Object.keys(item).map(i => alls[i].default.resolvers)],
      }),
    ];
  }, []);

export default {
  types: [
    ...allComponents.reduce((arr, i) => [...arr, ...i.types], []),
  ],
  resolvers: [
    ...allComponents.reduce((arr, i) => [...arr, ...i.resolvers], []),
  ],
};

// Tracked Components and Components' parts:
// eslint-disable-next-line
EOF
echo $footer >> index.js
################