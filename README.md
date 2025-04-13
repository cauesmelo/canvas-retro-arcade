<p align="center">
  <img src="https://user-images.githubusercontent.com/19245891/229670489-02d3552c-fe55-40af-b9ce-a68342bd6edd.png" alt="Project logo"/>
</p>

Basically a (very) small collection of retro arcades made with HTML Canvas and JavaScript without external libraries, not too much to say about it.

# :zap: Quickstart

You can access [this link](https://cauesmelo.github.io/canvas-retro-arcade/) or clone this repository to run locally.

1. Clone the project

```bash
git clone https://github.com/cauesmelo/canvas-retro-arcade
```

2. Open the project

```bash
cd canvas-retro-arcade
```

3. Run in development mode

```bash
make dev
```

You can see all the available commands [here](#book-commands).

# :video_game: Game screens

![breakout-small](https://user-images.githubusercontent.com/19245891/229381547-38f69c6d-9358-4297-ac0d-475f2697c7bc.png)
![corona-small](https://user-images.githubusercontent.com/19245891/229381550-dc4b28b0-0a47-473c-b2be-760567f255a1.png)
![snake-small](https://user-images.githubusercontent.com/19245891/229381551-51dc6c51-2ae4-4c79-a394-04edba430213.png)
![tictactoe-small](https://user-images.githubusercontent.com/19245891/229381552-fd6920a6-c034-4264-afe4-1c38271ca4d1.png)

# :book: Commands

### Running locally

```bash
# Run as development
make dev
```

### Linting and formating

```bash
# Run all linters
make lint

# Format all files
make format

# Run all linters and format all files
make tidy
```

### Build

```bash
# Generate build
make build
```

### Deploying

You can deploy the project to a [Google Cloud Bucket](https://cloud.google.com/storage/docs/creating-buckets). For this, you need to have the [gcloud CLI](https://cloud.google.com/sdk/docs/install) with proper authentication set. You also need to configure the `GCP_BUCKET` and `GCP_PROJECT` variables at `Makefile` localized in the root folder. After everything set you can deploy with the command bellow.

```bash
# Deploy to Google Cloud Bucket configured on Makefile
make deploy
```

# :warning: To do

- Isolate draw methods into `gameScreen` class.
- Minify bundle size.
- Create flag to display FPS.
- Enable full screen mode.
- In TicTacToe, replace `X` and `O` sprites to native drawing methods.
- In TicTacToe, force AI to make mistakes so that the human can win sometimes.
- Create more powerful writing methods in `gameScreen`.
- Rework Breakout hitbox.
- Add delay after death on Corona Invaders.
- Add support for mobile.
