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

echo "Creating new component part"

DIRECTORY="../components/${COMPONENT}/${COMPONENT_PART}"
if [ -d "$DIRECTORY" ]; then
    echo "Component part [$COMPONENT_PART] of '$COMPONENT' already exist]"
    read -p "Press Enter To Continue or Ctrl + C to abort"
fi

mkdir -p ../components/${COMPONENT}/${COMPONENT_PART}

cd ../components/${COMPONENT}/${COMPONENT_PART}
#if index does exist?
cat > _input.js <<EOF
export default \`

\`;
EOF

cat > _mutation.js <<EOF
export const mutationTypes = \`
  type Mutation {

  }
\`;

export const mutationResolvers = {
  Mutation: {
    //
  },
};
EOF

cat > _query.js <<EOF
export const queryTypes = \`
  type Query {

  }
\`;

export const queryResolvers = {
  Query: {
    //
  },
};
EOF

cat > _type.js <<EOF
export const types = \`

\`;

export const typeResolvers = {
  //
};
EOF

cat > index.js <<EOF
import { typeResolvers, types } from './_type';
import { queryResolvers, queryTypes } from './_query';
import inputTypes from './_input';
import { mutationResolvers, mutationTypes } from './_mutation';

export default {
  types: \`
    \${types}
    \${queryTypes}
    \${inputTypes}
    \${mutationTypes}
  \`,
  resolvers: Object.assign(queryResolvers, mutationResolvers, typeResolvers),
};
EOF


echo "Component part [$COMPONENT_PART] of '$COMPONENT' has been created]"

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
