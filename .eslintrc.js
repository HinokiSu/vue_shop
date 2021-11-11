module.exports = {
  "env": [
    'eslint:recommended',
    'plugin:vue/essential'
  ],

  "extends": [
      "eslint:recommended",
      "plugin:vue/essential"
  ],

  "parserOptions": {
      "ecmaVersion": 13,
      "sourceType": "module"
  },

  "plugins": [
      "vue"
  ],

  "rules": {
    "require-atomic-updates": "off"
  },

  root: true,

  env: {
    node: true
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off'
  },

  plugins: [
    'vue'
  ]
};
