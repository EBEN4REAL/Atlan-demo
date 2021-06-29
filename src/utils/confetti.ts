// eslint-disable

const defaultColors = ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"];

function createElements(root, elementCount, colors, width, height) {
    return Array.from({ length: elementCount }).map((_, index) => {
        const element = document.createElement("div");
        const color = colors[index % colors.length];
        element.style["background-color"] = color; // eslint-disable-line space-infix-ops
        element.style.width = width;
        element.style.height = height;
        element.style.position = "absolute";
        root.appendChild(element);
        return element;
    });
}

function randomPhysics(angle, spread, startVelocity, random) {
    const radAngle = angle * (Math.PI / 180);
    const radSpread = spread * (Math.PI / 180);
    return {
        x: 0,
        y: 0,
        wobble: random() * 10,
        velocity: startVelocity * 0.5 + random() * startVelocity,
        angle2D: -radAngle + (0.5 * radSpread - random() * radSpread),
        angle3D: -(Math.PI / 4) + random() * (Math.PI / 2),
        tiltAngle: random() * Math.PI
    };
}

function updateFetti(fetti, progress, decay) {
    /* eslint-disable no-param-reassign */
    fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
    fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
    fetti.physics.wobble += 0.1;
    fetti.physics.velocity *= decay;
    fetti.physics.y += 3;
    fetti.physics.tiltAngle += 0.1;

    const _fetti$physics = fetti.physics;
    const { x, y, tiltAngle, wobble } = _fetti$physics;

    const wobbleX = x + 10 * Math.cos(wobble);
    const wobbleY = y + 10 * Math.sin(wobble);
    const transform = `translate3d(${wobbleX}px,${wobbleY}px, 0)  rotate3d(1, 1, 1, ${tiltAngle}rad)`;

    fetti.element.style.transform = transform;
    fetti.element.style.opacity = 1 - progress;

    /* eslint-enable */
}

function animate(root, fettis, decay) {
    const totalTicks = 200;
    let tick = 0;

    function update() {
        fettis.forEach(fetti => updateFetti(fetti, tick / totalTicks, decay));

        tick += 1;
        if (tick < totalTicks) {
            requestAnimationFrame(update);
        } else {
            fettis.forEach(fetti => {
                if (fetti.element.parentNode === root) {
                    return root.removeChild(fetti.element);
                }
                return null;
            });
        }
    }

    requestAnimationFrame(update);
}

function confetti(root, _ref = {}) {
    // const _ref =
    //   arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    const _ref$angle = _ref.angle;
    const angle = _ref$angle === undefined ? 90 : _ref$angle;
    const _ref$decay = _ref.decay;
    const decay = _ref$decay === undefined ? 0.9 : _ref$decay;
    const _ref$spread = _ref.spread;
    const spread = _ref$spread === undefined ? 45 : _ref$spread;
    const _ref$startVelocity = _ref.startVelocity;
    const startVelocity =
        _ref$startVelocity === undefined ? 45 : _ref$startVelocity;
    const _ref$elementCount = _ref.elementCount;
    const elementCount = _ref$elementCount === undefined ? 50 : _ref$elementCount;
    const _ref$width = _ref.width;
    const width = _ref$width === undefined ? "10px" : _ref$width;
    const _ref$height = _ref.height;
    const height = _ref$height === undefined ? "10px" : _ref$height;
    const _ref$colors = _ref.colors;
    const colors = _ref$colors === undefined ? defaultColors : _ref$colors;
    const _ref$random = _ref.random;
    const random = _ref$random === undefined ? Math.random : _ref$random;

    const elements = createElements(root, elementCount, colors, width, height);
    const fettis = elements.map(element => ({
        element,
        physics: randomPhysics(angle, spread, startVelocity, random)
    }));

    animate(root, fettis, decay);
}

export default confetti;
