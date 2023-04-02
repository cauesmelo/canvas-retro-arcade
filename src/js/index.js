import { Engine } from './engine';

const main = () => {
  const engine = new Engine({
    canvas: document.querySelector('canvas'),
  });

  engine.start();
};

main();
