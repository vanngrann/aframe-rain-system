# Rain System for A-Frame

## Overview

This project implements a lightweight rain and splash system for A-Frame using standard entities and a pooled splash mechanism. It is designed to avoid runtime DOM creation and deletion in order to maintain stable performance over time, even with hundreds of raindrops.

The system consists of a single A-Frame component called `rain` that manages both raindrop simulation and splash effects.

---

## Key Features

- Configurable number of raindrops  
- Adjustable fall speed, area, and spawn height  
- Reusable splash pool (no dynamic creation or removal)  
- No memory leaks from DOM churn  
- Stable performance over long sessions  
- Simple integration with A-Frame scenes  

---

## Component Usage

Add the CDN script to your file:

```html
<script src="https://cdn.jsdelivr.net/gh/vanngrann/aframe-rain-system@v1.0.0/scripts.js"></script>
```

Add the component to any entity in your scene:

```html
<a-entity rain="count: 200; speed: 10; area: 20; height: 10"></a-entity>
```

## Configuration Options

The component accepts the following schema properties:

---

### count (integer)

Number of raindrops in the scene. Higher values increase density but may impact performance.  
Default: 200  

---

### speed (number)

Fall speed of raindrops in world units per second.  
Default: 10  

---

### color (color string)

Color of both raindrops and splash effects.  
Default: #9ecfff  

---

### area (number)

Width and depth of the rain field. Raindrops spawn randomly within this square area.  
Default: 20  

---

### height (number)

Maximum spawn height for raindrops.  
Default: 10  

---

### dropSize (number)

Length of each raindrop cylinder.  
Default: 0.5  

---

### splashSize (number)

Base radius of splash ripple effect.  
Default: 0.05  

---

### splashPoolSize (integer)

Number of reusable splash entities created at initialization. Controls how many simultaneous splash effects can exist.  
Default: 30  

---

## How It Works

### Raindrop System

Each raindrop is represented by a persistent A-Frame entity. Instead of being created and destroyed, each drop is repositioned when it reaches the ground.

On each frame:

- The Y position of each drop is reduced based on delta time and speed  
- When a drop reaches `y <= 0`, it is reset to a random position above the scene  
- A splash effect is triggered at the impact position  

---

### Splash System

Splash effects are managed using a fixed-size pool of pre-created entities.

When a splash is triggered:

- The next available splash entity is selected from the pool  
- Its position is updated to the impact point  
- It is visually reset and animated (scale and fade)  
- The system cycles through the pool in a circular manner  

This avoids runtime creation and destruction of entities, which significantly reduces garbage collection overhead.

---

## Performance Considerations

This system is optimized for moderate workloads (up to a few hundred raindrops). Performance is stable because:

- No per-frame entity creation or removal  
- No repeated DOM allocation for splashes  
- Reused objects for all splash effects  
- Minimal A-Frame component overhead per entity  

---

## Recommended Settings

### Low performance devices

- count: 100 to 150  
- splashPoolSize: 15 to 20  

---

### Medium devices

- count: 200 to 300  
- splashPoolSize: 25 to 40  

---

### High performance devices

- count: 400 to 600  
- splashPoolSize: 40+  

---

## Limitations

- Uses A-Frame entity system (not GPU instanced)  
- Splash animations rely on A-Frame animation components  
- Large counts may still affect performance on mobile or VR headsets  
- No collision detection with complex geometry  

---

## Future Improvements

Potential upgrades to improve performance and realism:

- Replace raindrops with `THREE.InstancedMesh` for GPU-based rendering  
- Replace splash animations with manual tick-based interpolation  
- Add wind simulation for angled rain  
- Add wet surface or puddle accumulation system  
- Add sound effects tied to splash events  

---

## Summary

This system provides a balance between simplicity and performance. It avoids common A-Frame pitfalls such as continuous entity creation and deletion while remaining easy to configure and integrate into existing scenes.
