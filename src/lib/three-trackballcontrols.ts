import { Camera, EventDispatcher, Vector3, Vector2, Quaternion } from 'three';

// Original code from three/examples/js/controls/trackballcontrols.js

const STATE = {
    NONE: -1,
    ROTATE: 0,
    ZOOM: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_ZOOM_PAN: 4,
};

export class TrackballControls extends EventDispatcher {

    public enabled: boolean = true;
    public screen: { left: number; top: number; width: number; height: number } = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    };
    public rotateSpeed: number;
    public zoomSpeed: number;
    public panSpeed: number;
    public noRotate: boolean;
    public noZoom: boolean;
    public noPan: boolean;
    public noRoll: boolean;
    public staticMoving: boolean;
    public dynamicDampingFactor: number;
    public minDistance: number;
    public maxDistance: number;
    public keys: number[];

    private target: Vector3;
    private position0: Vector3;
    private target0: Vector3;
    private up0: Vector3;

    private EPS = 0.000001;

    private lastPosition = new Vector3();

    private state = STATE.NONE;
    private prevState = STATE.NONE;

    private eye = new Vector3();

    private movePrev = new Vector2();
    private moveCurr = new Vector2();

    private lastAxis = new Vector3();
    private lastAngle = 0;

    private zoomStart = new Vector2();
    private zoomEnd = new Vector2();

    private touchZoomDistanceStart = 0;
    private touchZoomDistanceEnd = 0;

    private panStart = new Vector2();
    private panEnd = new Vector2();

    private changeEvent = {
        type: 'change',
    };

    private startEvent = {
        type: 'start',
    };

    private endEvent = {
        type: 'end',
    };

    private mouseOnScreenVector = new Vector2();
    private mouseOnCircleVector = new Vector2();

    // properties of rotateCamera()
    private axis = new Vector3();
    private quaternion = new Quaternion();
    private eyeDirection = new Vector3();
    private objectUpDirection = new Vector3();
    private objectSidewaysDirection = new Vector3();
    private moveDirection = new Vector3();
    private angle: number = 0;

    // properties of panCamera()
    private mouseChange = new Vector2();
    private objectUp = new Vector3();
    private pan = new Vector3();


    constructor(private object: Camera, private domElement: HTMLElement | Document = document) {
        super();

        this.rotateSpeed = 1.0;
        this.zoomSpeed = 1.2;
        this.panSpeed = 0.3;

        this.noRotate = false;
        this.noZoom = false;
        this.noPan = false;
        this.noRoll = false;

        this.staticMoving = false;
        this.dynamicDampingFactor = 0.2;

        this.minDistance = 0;
        this.maxDistance = Infinity;

        this.keys = [65 /*A*/, 83 /*S*/, 68 /*D*/];

        this.target = new Vector3();

        // for reset
        this.target0 = this.target.clone();
        this.position0 = this.object.position.clone();
        this.up0 = this.object.up.clone();

        this.activate();

        this.handleResize();

        // force an update at start
        this.update();
    }

    public activate() {
        (this.domElement as HTMLElement).addEventListener('contextmenu', this.contextmenu.bind(this), false);
        (this.domElement as HTMLElement).addEventListener('mousedown', this.mousedown.bind(this), false);
        (this.domElement as HTMLElement).addEventListener('wheel', this.mousewheel.bind(this), false);

        (this.domElement as HTMLElement).addEventListener('touchstart', this.touchstart.bind(this), false);
        (this.domElement as HTMLElement).addEventListener('touchend', this.touchend.bind(this), false);
        (this.domElement as HTMLElement).addEventListener('touchmove', this.touchmove.bind(this), false);

        window.addEventListener('keydown', this.keydown.bind(this), false);
        window.addEventListener('keyup', this.keyup.bind(this), false);

    }

    public deactivate() {
        (this.domElement as HTMLElement).removeEventListener('contextmenu', this.contextmenu, false);
        (this.domElement as HTMLElement).removeEventListener('mousedown', this.mousedown, false);
        (this.domElement as HTMLElement).removeEventListener('wheel', this.mousewheel, false);

        (this.domElement as HTMLElement).removeEventListener('touchstart', this.touchstart, false);
        (this.domElement as HTMLElement).removeEventListener('touchend', this.touchend, false);
        (this.domElement as HTMLElement).removeEventListener('touchmove', this.touchmove, false);

        document.removeEventListener('mousemove', this.mousemove, false);
        document.removeEventListener('mouseup', this.mouseup, false);

        window.removeEventListener('keydown', this.keydown, false);
        window.removeEventListener('keyup', this.keyup, false);
    }

    public update(): void {
        this.eye.subVectors(this.object.position, this.target);

        if (!this.noRotate) {
            this.rotateCamera();
        }

        if (!this.noZoom) {
            this.zoomCamera();
        }

        if (!this.noPan) {
            this.panCamera();
        }

        this.object.position.addVectors(this.target, this.eye);

        this.checkDistances();

        this.object.lookAt(this.target);

        if (this.lastPosition.distanceToSquared(this.object.position) > this.EPS) {
            this.dispatchEvent.call(this.domElement, [this.changeEvent]);
            this.lastPosition.copy(this.object.position);
        }
    }

    public reset(): void {
        this.state = STATE.NONE;
        this.prevState = STATE.NONE;

        this.target.copy(this.target0);
        this.object.position.copy(this.position0);
        this.object.up.copy(this.up0);

        this.eye.subVectors(this.object.position, this.target);

        this.object.lookAt(this.target);

        this.dispatchEvent.call(this.domElement, [this.changeEvent]);

        this.lastPosition.copy(this.object.position);
    }

    public dispose(): void {
        this.deactivate();
    }

    public checkDistances(): void {
        if (!this.noZoom || !this.noPan) {
            if (this.eye.lengthSq() > this.maxDistance * this.maxDistance) {
                this.object.position.addVectors(this.target, this.eye.setLength(this.maxDistance));
                this.zoomStart.copy(this.zoomEnd);
            }

            if (this.eye.lengthSq() < this.minDistance * this.minDistance) {
                this.object.position.addVectors(this.target, this.eye.setLength(this.minDistance));
                this.zoomStart.copy(this.zoomEnd);
            }
        }
    }

    public zoomCamera(): void {
        let factor;

        if (this.state === STATE.TOUCH_ZOOM_PAN) {
            factor = this.touchZoomDistanceStart / this.touchZoomDistanceEnd;
            this.touchZoomDistanceStart = this.touchZoomDistanceEnd;
            this.eye.multiplyScalar(factor);

        } else {
            factor = 1.0 + (this.zoomEnd.y - this.zoomStart.y) * this.zoomSpeed;

            if (factor !== 1.0 && factor > 0.0) {
                this.eye.multiplyScalar(factor);
            }

            if (this.staticMoving) {
                this.zoomStart.copy(this.zoomEnd);

            } else {
                this.zoomStart.y += (this.zoomEnd.y - this.zoomStart.y) * this.dynamicDampingFactor;
            }
        }
    }

    public panCamera(): void {
        this.mouseChange.copy(this.panEnd).sub(this.panStart);

        if (this.mouseChange.lengthSq()) {

            this.mouseChange.multiplyScalar(this.eye.length() * this.panSpeed);

            this.pan.copy(this.eye).cross(this.object.up).setLength(this.mouseChange.x);
            this.pan.add(this.objectUp.copy(this.object.up).setLength(this.mouseChange.y));

            this.object.position.add(this.pan);
            this.target.add(this.pan);

            if (this.staticMoving) {

                this.panStart.copy(this.panEnd);

            } else {
                this.panStart.add(
                    this.mouseChange
                        .subVectors(this.panEnd, this.panStart)
                        .multiplyScalar(this.dynamicDampingFactor),
                );
            }

        }
    }

    public rotateCamera(): void {
        this.moveDirection.set(this.moveCurr.x - this.movePrev.x, this.moveCurr.y - this.movePrev.y, 0);
        this.angle = this.moveDirection.length();

        if (this.angle) {

            this.eye.copy(this.object.position).sub(this.target);

            this.eyeDirection.copy(this.eye).normalize();
            this.objectUpDirection.copy(this.object.up).normalize();
            this.objectSidewaysDirection.crossVectors(this.objectUpDirection, this.eyeDirection).normalize();

            this.objectUpDirection.setLength(this.moveCurr.y - this.movePrev.y);
            this.objectSidewaysDirection.setLength(this.moveCurr.x - this.movePrev.x);

            this.moveDirection.copy(this.objectUpDirection.add(this.objectSidewaysDirection));

            this.axis.crossVectors(this.moveDirection, this.eye).normalize();

            this.angle *= this.rotateSpeed;
            this.quaternion.setFromAxisAngle(this.axis, this.angle);

            this.eye.applyQuaternion(this.quaternion);
            this.object.up.applyQuaternion(this.quaternion);

            this.lastAxis.copy(this.axis);
            this.lastAngle = this.angle;

        } else if (!this.staticMoving && this.lastAngle) {

            this.lastAngle *= Math.sqrt(1.0 - this.dynamicDampingFactor);
            this.eye.copy(this.object.position).sub(this.target);
            this.quaternion.setFromAxisAngle(this.lastAxis, this.lastAngle);
            this.eye.applyQuaternion(this.quaternion);
            this.object.up.applyQuaternion(this.quaternion);

        }

        this.movePrev.copy(this.moveCurr);
    }

    public handleResize(): void {
        if (this.domElement instanceof Document) {
            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

        } else {
            const box = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            const d = this.domElement.ownerDocument.documentElement;
            this.screen.left = box.left + window.pageXOffset - d.clientLeft;
            this.screen.top = box.top + window.pageYOffset - d.clientTop;
            this.screen.width = box.width;
            this.screen.height = box.height;
        }
    }

    public handleEvent(event: any): void {
        throw new Error('handleEvent not implemented');
    }

    private getMouseOnScreen(pageX: number, pageY: number) {
        this.mouseOnScreenVector.set(
            (pageX - this.screen.left) / this.screen.width,
            (pageY - this.screen.top) / this.screen.height,
        );

        return this.mouseOnScreenVector;
    }

    private getMouseOnCircle(pageX: number, pageY: number) {
        this.mouseOnCircleVector.set(
            ((pageX - this.screen.width * 0.5 - this.screen.left) / (this.screen.width * 0.5)),
            ((this.screen.height + 2 * (this.screen.top - pageY)) / this.screen.width), // screen.width intentional
        );

        return this.mouseOnCircleVector;

    }

    private keydown(event: KeyboardEvent) {
        if (this.enabled === false) {
            return;
        }

        window.removeEventListener('keydown', this.keydown);

        this.prevState = this.state;

        if (this.state !== STATE.NONE) {
            return;

        } else if (event.keyCode === this.keys[STATE.ROTATE] && !this.noRotate) {
            this.state = STATE.ROTATE;

        } else if (event.keyCode === this.keys[STATE.ZOOM] && !this.noZoom) {
            this.state = STATE.ZOOM;

        } else if (event.keyCode === this.keys[STATE.PAN] && !this.noPan) {
            this.state = STATE.PAN;
        }
    }

    private keyup(event: KeyboardEvent) {
        if (this.enabled === false) {
            return;
        }

        this.state = this.prevState;

        window.addEventListener('keydown', this.keydown.bind(this), false);
    }

    private mousedown(event: MouseEvent) {

        if (this.enabled === false) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (this.state === STATE.NONE) {

            this.state = event.button;

        }

        if (this.state === STATE.ROTATE && !this.noRotate) {

            this.moveCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));
            this.movePrev.copy(this.moveCurr);

        } else if (this.state === STATE.ZOOM && !this.noZoom) {

            this.zoomStart.copy(this.getMouseOnScreen(event.pageX, event.pageY));
            this.zoomEnd.copy(this.zoomStart);

        } else if (this.state === STATE.PAN && !this.noPan) {

            this.panStart.copy(this.getMouseOnScreen(event.pageX, event.pageY));
            this.panEnd.copy(this.panStart);

        }

        document.addEventListener('mousemove', this.mousemove.bind(this), false);
        document.addEventListener('mouseup', this.mouseup.bind(this), false);

        this.dispatchEvent.call(this.domElement, [this.startEvent]);

    }

    private mousemove(event: MouseEvent) {
        if (this.enabled === false) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (this.state === STATE.ROTATE && !this.noRotate) {
            this.movePrev.copy(this.moveCurr);
            this.moveCurr.copy(this.getMouseOnCircle(event.pageX, event.pageY));

        } else if (this.state === STATE.ZOOM && !this.noZoom) {
            this.zoomEnd.copy(this.getMouseOnScreen(event.pageX, event.pageY));

        } else if (this.state === STATE.PAN && !this.noPan) {
            this.panEnd.copy(this.getMouseOnScreen(event.pageX, event.pageY));
        }
    }

    private mouseup(event: MouseEvent) {
        if (this.enabled === false) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        this.state = STATE.NONE;

        document.removeEventListener('mousemove', this.mousemove);
        document.removeEventListener('mouseup', this.mouseup);
        this.dispatchEvent.call(this.domElement, [this.endEvent]);
    }

    private mousewheel(event: WheelEvent) {

        if (this.enabled === false) {
            return;
        }

        if (this.noZoom === true) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        switch (event.deltaMode) {

            case 2:
                // Zoom in pages
                this.zoomStart.y -= event.deltaY * 0.025;
                break;

            case 1:
                // Zoom in lines
                this.zoomStart.y -= event.deltaY * 0.01;
                break;

            default:
                // undefined, 0, assume pixels
                this.zoomStart.y -= event.deltaY * 0.00025;
                break;

        }

        this.dispatchEvent.call(this.domElement, [this.startEvent]);
        this.dispatchEvent.call(this.domElement, [this.endEvent]);
    }

    private touchstart(event: TouchEvent) {
        if (this.enabled === false) {
            return;
        }

        event.preventDefault();

        switch (event.touches.length) {

            case 1:
                this.state = STATE.TOUCH_ROTATE;
                this.moveCurr.copy(this.getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                this.movePrev.copy(this.moveCurr);
                break;

            default: // 2 or more
                this.state = STATE.TOUCH_ZOOM_PAN;
                const dx = event.touches[0].pageX - event.touches[1].pageX;
                const dy = event.touches[0].pageY - event.touches[1].pageY;
                this.touchZoomDistanceEnd = this.touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

                const x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                const y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                this.panStart.copy(this.getMouseOnScreen(x, y));
                this.panEnd.copy(this.panStart);
                break;

        }

        this.dispatchEvent.call(this.domElement, [this.startEvent]);
    }

    private touchmove(event: TouchEvent) {

        if (this.enabled === false) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        switch (event.touches.length) {

            case 1:
                this.movePrev.copy(this.moveCurr);
                this.moveCurr.copy(this.getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                break;

            default: // 2 or more
                const dx = event.touches[0].pageX - event.touches[1].pageX;
                const dy = event.touches[0].pageY - event.touches[1].pageY;
                this.touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

                const x = (event.touches[0].pageX + event.touches[1].pageX) / 2;
                const y = (event.touches[0].pageY + event.touches[1].pageY) / 2;
                this.panEnd.copy(this.getMouseOnScreen(x, y));
                break;
        }
    }

    private touchend(event: TouchEvent) {

        if (this.enabled === false) {
            return;
        }

        switch (event.touches.length) {

            case 0:
                this.state = STATE.NONE;
                break;

            case 1:
                this.state = STATE.TOUCH_ROTATE;
                this.moveCurr.copy(this.getMouseOnCircle(event.touches[0].pageX, event.touches[0].pageY));
                this.movePrev.copy(this.moveCurr);
                break;

        }

        this.dispatchEvent.call(this.domElement, [this.endEvent]);

    }

    private contextmenu(event: Event) {
        if (this.enabled === false) {
            return;
        }

        event.preventDefault();
    }
}
