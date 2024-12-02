export default function (plop) {
  // Component generator
  plop.setGenerator('component', {
    description: 'Create a new React component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name:',
      },
      {
        type: 'list',
        name: 'type',
        message: 'Component type:',
        choices: ['feature', 'ui', 'layout'],
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{type}}/{{pascalCase name}}/{{pascalCase name}}.tsx',
        templateFile: 'templates/Component.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{type}}/{{pascalCase name}}/{{pascalCase name}}.test.tsx',
        templateFile: 'templates/Component.test.tsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{type}}/{{pascalCase name}}/index.ts',
        template: "export { {{pascalCase name}} } from './{{pascalCase name}}';\n",
      },
    ],
  });
};
