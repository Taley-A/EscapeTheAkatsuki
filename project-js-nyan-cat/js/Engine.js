// The engine class will only be instantiated once. It contains all the logic
// of the game relating to the interactions between the player and the
// enemy and also relating to how our enemies are created and evolve over time
class Engine {
  // The constructor has one parameter. It will refer to the DOM node that we will be adding everything to.
  // You need to provide the DOM node when you create an instance of the class
  constructor(theRoot) {
    // We need the DOM element every time we create a new enemy so we
    // store a reference to it in a property of the instance.
    this.root = theRoot;

    // create timer div
    this.timer = document.getElementById("score");
    theRoot.appendChild(this.timer);

    // this.root.appendChild(this.timer);

    //To create a timer, we need to set this objects to 0.
    this.timeCounter = 0;

    // To create a health bar system, we must set this health counter as well. And we see the collision in the
    // isPlayerDead function at the bottom.
    this.damage = document.getElementById("damage");

    this.healthCounter = 0;

    // button to become visible upon 100% damage
    this.button = document.querySelector("button");

    // grab the image of the player.

    // We create our hamburger.
    // Please refer to Player.js for more information about what happens when you create a player
    this.player = new Player(this.root);
    // Initially, we have no enemies in the game. The enemies property refers to an array
    // that contains instances of the Enemy class
    this.enemies = [];
    // We add the background image to the game
    addBackground(this.root);
    console.log(this.player);
  }

  // The gameLoop will run every few milliseconds. It does several things
  //  - Updates the enemy positions
  //  - Detects a collision between the player and any enemy
  //  - Removes enemies that are too low from the enemies array
  gameLoop = () => {
    // This code is to see how much time, in milliseconds, has elapsed since the last
    // time this method was called.
    // (new Date).getTime() evaluates to the number of milliseconds since January 1st, 1970 at midnight.
    if (this.lastFrame === undefined) {
      this.lastFrame = new Date().getTime();
    }

    let timeDiff = new Date().getTime() - this.lastFrame;

    this.lastFrame = new Date().getTime();
    // We use the number of milliseconds since the last call to gameLoop to update the enemy positions.
    // Furthermore, if any enemy is below the bottom of our game, its destroyed property will be set. (See Enemy.js)
    this.enemies.forEach((enemy) => {
      enemy.update(timeDiff);
    });

    // We remove all the destroyed enemies from the array referred to by \`this.enemies\`.
    // We use filter to accomplish this.
    // Remember: this.enemies only contains instances of the Enemy class.
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.destroyed;
    });

    // We need to perform the addition of enemies until we have enough enemies.
    while (this.enemies.length < MAX_ENEMIES) {
      // We find the next available spot and, using this spot, we create an enemy.
      // We add this enemy to the enemies array
      const spot = nextEnemySpot(this.enemies);
      this.enemies.push(new Enemy(this.root, spot));
    }

    // change the color of the Player as it takes 25%, 50%, 75% damage.
    const narutoImg = document.getElementById("narutoImg");

    // We check if the player is dead. If he is, we alert the user
    // and return from the method (Why is the return statement important?)
    this.isPlayerDead();
    if (this.healthCounter > 99) {
      narutoImg.src = "images/naruto100.png";
      this.button.style.visibility = "visible";
      clearTimeout(narutoGame);
    }

    if (this.healthCounter > 74) {
      narutoImg.src = "images/naruto75.png";
    } else if (this.healthCounter > 49) {
      narutoImg.src = "images/naruto50.png";
    } else if (this.healthCounter > 24) {
      narutoImg.src = "images/naruto25.png";
    }

    //Create a timer that acts as the score. Basically, every second you survive counts as a point.
    //  e.g. Your score is 25 seconds! Congratulations.
    this.timeCounter++;
    if (this.timeCounter % 50 === 0) {
      seconds++;
      this.timer.innerText = `Score: ${seconds}`;
      console.log(seconds);
    }

    // this.counter++;
    // if (this.counter >= 5950) {
    //   window.alert("Time's up!");
    //   clearTimeout(this.nartuoGame);
    // }

    // If the player is not dead, then we put a setTimeout to run the gameLoop in 20 milliseconds
    let narutoGame = setTimeout(this.gameLoop, 20);
  };

  // This method is not implemented correctly, which is why
  // the burger never dies. In your exercises you will fix this method.

  isPlayerDead = () => {
    let naruto = this.player;
    let kunai;
    for (let i = 0; i < this.enemies.length; i++) {
      kunai = this.enemies[i];

      if (
        naruto.x < kunai.x + ENEMY_WIDTH &&
        naruto.x + PLAYER_WIDTH > kunai.x &&
        GAME_HEIGHT - PLAYER_HEIGHT - 10 < kunai.y + ENEMY_HEIGHT
      ) {
        console.log(naruto);
        this.healthCounter++;
        this.damage.innerText = `Damage: ${this.healthCounter}%`;
      }
    }
  };
}
