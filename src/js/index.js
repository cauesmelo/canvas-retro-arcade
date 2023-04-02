import { Engine } from './engine';

const main = () => {
  const engine = new Engine({
    canvas: document.querySelector('canvas'),
    title: document.querySelector('h2'),
  });

  engine.start();
};

main();
