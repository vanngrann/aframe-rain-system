AFRAME.registerComponent('rain', {
  schema: { //all properties that can be adjusted
    count: {type: 'int', default: 200},
    speed: {type: 'number', default: 10}, // units per second
    color: {type: 'color', default: '#9ecfff'},
    area: {type: 'number', default: 20},
    height: {type: 'number', default: 10},
    dropSize: {type: 'number', default: 0.5},
    splashSize: {type: 'number', default: 0.05},
    splashPoolSize: {type: 'int', default: 30}
  },

  init: function () {
    this.drops = [];
    this.splashes = [];
    this.splashIndex = 0;

    const scene = this.el;

    
    // create raindrops
    
    for (let i = 0; i < this.data.count; i++) {
      const drop = document.createElement('a-entity');

      drop.setAttribute('geometry', {
        primitive: 'cylinder',
        radius: 0.01,
        height: this.data.dropSize
      });

      drop.setAttribute('material', {
        color: this.data.color,
        opacity: 0.7,
        transparent: true
      });

      this.resetDrop(drop);

      scene.appendChild(drop);
      this.drops.push(drop);
    }


    // create splash pool
   
    for (let i = 0; i < this.data.splashPoolSize; i++) {
      const splash = document.createElement('a-entity');

      splash.setAttribute('geometry', {
        primitive: 'ring',
        radiusInner: this.data.splashSize * 0.4,
        radiusOuter: this.data.splashSize
      });

      splash.setAttribute('material', {
        color: this.data.color,
        opacity: 0,
        transparent: true
      });

      splash.setAttribute('rotation', '-90 0 0');

      splash.object3D.visible = false;

      scene.appendChild(splash);
      this.splashes.push(splash);
    }
  },

  tick: function (time, deltaTime) {
    const dt = deltaTime / 1000;

    for (let i = 0; i < this.drops.length; i++) {
      const drop = this.drops[i];
      const pos = drop.object3D.position;

      pos.y -= this.data.speed * dt;

      if (pos.y <= 0) {
        this.spawnSplash(pos.x, pos.z);
        this.resetDrop(drop);
      }
    }
  },

  resetDrop: function (drop) {
    const d = this.data;

    drop.object3D.position.set(
      (Math.random() - 0.5) * d.area,
      Math.random() * d.height + 5,
      (Math.random() - 0.5) * d.area
    );
  },


  // actual splash effect

  spawnSplash: function (x, z) {
    const splash = this.splashes[this.splashIndex];
    this.splashIndex = (this.splashIndex + 1) % this.splashes.length;

    splash.object3D.position.set(x, 0.01, z);
    splash.object3D.visible = true;

    // reset (don't delete splash but reuse)
    splash.removeAttribute('animation__scale');
    splash.removeAttribute('animation__fade');

    splash.setAttribute('material', 'opacity', 0.6);
    splash.setAttribute('scale', '1 1 1');

    // expand
    splash.setAttribute('animation__scale', {
      property: 'scale',
      to: '2 2 2',
      dur: 250,
      easing: 'easeOutQuad'
    });

    // fade
    splash.setAttribute('animation__fade', {
      property: 'material.opacity',
      to: 0,
      dur: 250
    });
  }
});