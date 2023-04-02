![Repository logo](https://storage.googleapis.com/canvas-retro-games/project/logo.png)
Basically a (very) small collection os retro arcades mad with HTML Canvas and Javascript, not too much to say about it.

# Quickstart

You can access [this link](https://storage.googleapis.com/canvas-retro-games/index.html) or clone the repository to run locally.

1. Clone to project

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

You can see all the available commands [here](#commands).

## Game screens

# Commands

### Clone the project

```bash
git clone https://github.com/cauesmelo/canvas-retro-games
```

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

You can deploy the project to a Google Cloud Bucket(link). For this, you need to have gloud CLI(https://cloud.google.com/sdk/docs/install?hl=en) with proper authentication set. You also need to configure the `GCP_BUCKET` and `GCP_PROJECT` variables at `Makefile` localized at root folder. After everything set you can deploy with the command bellow.

```bash
# Deploy to Google Cloud Bucket configured on Makefile
make deploy
```

## To do list

- Isolate draw functions into gameScreen class.
- Minify bundle size.
- Create flag to display FPS.
- Enable full screen mode.
- In TicTacToe, replace "X" and "O" sprites to native drawing methods.
- In TicTacToe, force AI to make mistakes so that the human can win sometimes.
- Create more powerful writing methods in `gameScreen`.
- Rework breakout hitbox.
- Add delay after death on Corona Invaders.
